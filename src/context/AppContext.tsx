import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS, LanguageCode, Translations } from '../data/translations';

export type UserRole = 
  | 'CITIZEN'
  | 'DRIVING_SCHOOL'
  | 'MEDICAL_DOCTOR'
  | 'COUNTER_OPERATOR'
  | 'MLO_OFFICER'
  | 'ADTT_INSPECTOR'
  | 'DISPATCH_NODAL'
  | 'ENFORCEMENT_OFFICER'
  | 'RTO_DIRECTOR'
  | 'SUPER_ADMIN'
  | 'OFFICIAL'
  | 'ADMIN'
  | string;

export interface AuthUser {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  state?: string;
  email?: string;
  designation?: string;
  rtoCode?: string;
  rtoName?: string;
  employeeCode?: string;
  staffId?: string;
  nmcRegNo?: string;
  dtsCode?: string;
  counterNo?: string;
  badgeNo?: string;
  isDigiLockerVerified?: boolean;
  digiLockerData?: any;
}

interface AppContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
  currentState: string;
  setCurrentState: (state: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isDetectingLocation: boolean;
  detectLiveLocation: () => Promise<void>;
  locationAccuracy: 'gps' | 'ip' | 'manual';
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (userData: AuthUser) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(1);
  const [currentState, setCurrentState] = useState<string>('Ranchi, Jharkhand');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationAccuracy, setLocationAccuracy] = useState<'gps' | 'ip' | 'manual'>('manual');
  
  // Auth State
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('sarathi_local_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: AuthUser) => {
    setUser(userData);
    try {
      localStorage.setItem('sarathi_local_user', JSON.stringify(userData));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('sarathi_local_user');
    } catch {}
  };

  const isLoggedIn = !!user;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Real-time Geolocation Detection
  const detectLiveLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // High accuracy reverse geocode
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`, {
                headers: { 'Accept-Language': 'en' }
              });
              const data = await res.json();
              if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.district || data.address.state_district || 'Detected City';
                const state = data.address.state || 'India';
                setCurrentState(`${city}, ${state}`);
                setLocationAccuracy('gps');
                setIsDetectingLocation(false);
                return;
              }
            } catch (err) {
              // Fallback to coordinates
            }
            // Approximate State Coordinates in India
            const approxState = getApproxState(latitude, longitude);
            setCurrentState(approxState);
            setLocationAccuracy('gps');
            setIsDetectingLocation(false);
          },
          async () => {
            // If GPS denied/unavailable, fallback to IP Geolocation
            await fallbackIpGeo();
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      } else {
        await fallbackIpGeo();
      }
    } catch (err) {
      setIsDetectingLocation(false);
    }
  }, []);

  const fallbackIpGeo = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data && data.city && data.region) {
        setCurrentState(`${data.city}, ${data.region}`);
        setLocationAccuracy('ip');
      }
    } catch (err) {
      // Keep default
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Helper function for coordinate bounding fallback
  const getApproxState = (lat: number, lon: number): string => {
    if (lat >= 22.0 && lat <= 25.5 && lon >= 83.0 && lon <= 88.0) return 'Ranchi, Jharkhand';
    if (lat >= 28.3 && lat <= 28.9 && lon >= 76.8 && lon <= 77.4) return 'New Delhi, Delhi';
    if (lat >= 18.8 && lat <= 19.3 && lon >= 72.7 && lon <= 73.1) return 'Mumbai, Maharashtra';
    if (lat >= 12.8 && lat <= 13.2 && lon >= 77.4 && lon <= 77.8) return 'Bengaluru, Karnataka';
    if (lat >= 22.4 && lat <= 22.8 && lon >= 88.2 && lon <= 88.5) return 'Kolkata, West Bengal';
    if (lat >= 17.2 && lat <= 17.6 && lon >= 78.3 && lon <= 78.6) return 'Hyderabad, Telangana';
    if (lat >= 12.9 && lat <= 13.2 && lon >= 80.1 && lon <= 80.4) return 'Chennai, Tamil Nadu';
    if (lat >= 25.4 && lat <= 25.8 && lon >= 85.0 && lon <= 85.3) return 'Patna, Bihar';
    if (lat >= 26.7 && lat <= 27.0 && lon >= 80.8 && lon <= 81.1) return 'Lucknow, Uttar Pradesh';
    if (lat >= 26.8 && lat <= 27.1 && lon >= 75.6 && lon <= 76.0) return 'Jaipur, Rajasthan';
    if (lat >= 22.9 && lat <= 23.2 && lon >= 72.4 && lon <= 72.8) return 'Ahmedabad, Gujarat';
    return 'Ranchi, Jharkhand';
  };

  useEffect(() => {
    // Automatically attempt background detection on mount
    detectLiveLocation();
  }, [detectLiveLocation]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }, [fontScale]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const contextValue = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
      darkMode,
      setDarkMode,
      fontScale,
      setFontScale,
      currentState,
      setCurrentState,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      isDetectingLocation,
      detectLiveLocation,
      locationAccuracy,
      user,
      isLoggedIn,
      login,
      logout
    }),
    [
      language,
      t,
      darkMode,
      fontScale,
      currentState,
      isMobileMenuOpen,
      isDetectingLocation,
      detectLiveLocation,
      locationAccuracy,
      user,
      isLoggedIn
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
