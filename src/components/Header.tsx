import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  ChevronDown, 
  Check, 
  Globe, 
  Moon, 
  Sun, 
  Menu, 
  LogOut, 
  FolderKanban, 
  Calendar, 
  Search, 
  ShieldCheck,
  Building2,
  Bell,
  Car,
  Award,
  Crown,
  Users,
  Stethoscope,
  Scale,
  GraduationCap,
  UserCheck,
  ShieldAlert,
  BadgeCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../data/translations';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenHome?: () => void;
}

const LANGUAGES: { code: LanguageCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' }
];

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenHome }) => {
  const navigate = useNavigate();
  const { 
    language, 
    setLanguage, 
    t, 
    darkMode, 
    setDarkMode, 
    fontScale, 
    setFontScale,
    setIsMobileMenuOpen,
    user,
    isLoggedIn,
    logout
  } = useApp();
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <header className={`border-b sticky top-0 z-50 shadow-xs transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Brand Identity */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Clickable Brand Logo & Title */}
            <button
              type="button"
              onClick={onOpenHome}
              className="flex items-center space-x-2 sm:space-x-3 text-left cursor-pointer group focus:outline-hidden"
              aria-label="Go to Home"
            >
              <div className="w-7 h-9 sm:w-11 sm:h-14 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img 
                  src="/assets/emblem.png" 
                  alt="National Emblem of India" 
                  className={`w-full h-full object-contain ${darkMode ? 'filter invert brightness-200' : ''}`}
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <span className={`text-[15px] sm:text-[20px] font-black tracking-tight uppercase leading-none font-sans ${
                    darkMode ? 'text-blue-400' : 'text-[#0B2545]'
                  }`}>
                    PARIVAHAN
                  </span>
                  <span className="text-[15px] sm:text-[20px] font-black tracking-tight text-[#0056D2] uppercase leading-none font-sans">
                    SARATHI
                  </span>
                </div>
                <div className="mt-0.5">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-tight">
                    {t.govIndia}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-500 font-normal leading-tight hidden lg:block">
                    {t.morth}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Right Utility Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector Dropdown (Desktop Only, Mobile has it in Drawer) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer shadow-2xs ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                aria-label="Select Language"
              >
                <span>{currentLangObj.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setIsLangOpen(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> Select Language / भाषा
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 transition-colors cursor-pointer ${
                            language === lang.code ? 'text-blue-600 font-bold bg-blue-50/60 dark:bg-slate-700' : ''
                          }`}
                        >
                          <span>{lang.name}</span>
                          {language === lang.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Accessibility Font Resizer (A- / A / A+) - Desktop only */}
            <div className={`hidden lg:flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-md border ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'
            }`}>
              <button 
                onClick={() => setFontScale(Math.max(0.9, fontScale - 0.05))}
                className={`px-1.5 py-0.5 rounded hover:bg-white dark:hover:bg-slate-700 hover:text-blue-700 transition cursor-pointer ${fontScale < 1 ? 'text-blue-600 font-bold' : ''}`}
                title="Decrease font size"
              >
                A-
              </button>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <button 
                onClick={() => setFontScale(1)}
                className={`px-1.5 py-0.5 rounded hover:bg-white dark:hover:bg-slate-700 hover:text-blue-700 transition cursor-pointer ${fontScale === 1 ? 'text-blue-600 font-bold' : ''}`}
                title="Reset default font size"
              >
                A
              </button>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <button 
                onClick={() => setFontScale(Math.min(1.15, fontScale + 0.05))}
                className={`px-1.5 py-0.5 rounded hover:bg-white dark:hover:bg-slate-700 hover:text-blue-700 transition cursor-pointer ${fontScale > 1 ? 'text-blue-600 font-bold' : ''}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Dark / Light Toggle Switch - Desktop only (Mobile has it in Drawer) */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`hidden sm:flex relative w-12 h-7 items-center rounded-full p-1 cursor-pointer transition-all duration-300 focus:outline-hidden border ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Theme"}
            >
              <div 
                className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                  darkMode ? 'translate-x-5 bg-blue-600 text-white' : 'translate-x-0 bg-white text-amber-500 border border-slate-200'
                }`}
              >
                {darkMode ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-amber-500 fill-amber-400" />}
              </div>
            </button>

            {/* Auth: Citizen Profile Dropdown OR Login Button */}
            {isLoggedIn && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border transition-all cursor-pointer shadow-xs ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white' 
                      : 'bg-blue-50/80 border-blue-200 hover:bg-blue-100/80 text-slate-800'
                  }`}
                  aria-label="User profile options"
                >
                  <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-black shadow-xs ${
                    user.role === 'ADMIN'
                      ? 'bg-gradient-to-tr from-purple-700 to-amber-500 text-white font-black'
                      : user.role === 'MEDICAL_DOCTOR'
                      ? 'bg-teal-600 text-white font-black'
                      : user.role === 'DRIVING_SCHOOL'
                      ? 'bg-emerald-600 text-white font-black'
                      : user.role === 'COUNTER_OPERATOR'
                      ? 'bg-blue-600 text-white font-black'
                      : user.role === 'ENFORCEMENT_OFFICER'
                      ? 'bg-rose-600 text-white font-black'
                      : user.role === 'OFFICIAL' 
                      ? 'bg-amber-500 text-slate-950 font-black' 
                      : 'bg-[#0056D2]'
                  }`}>
                    {user.role === 'ADMIN' ? <Crown className="w-3.5 h-3.5 text-amber-300" /> 
                      : user.role === 'MEDICAL_DOCTOR' ? <Stethoscope className="w-3.5 h-3.5 text-white" />
                      : user.role === 'DRIVING_SCHOOL' ? <GraduationCap className="w-3.5 h-3.5 text-white" />
                      : user.role === 'COUNTER_OPERATOR' ? <UserCheck className="w-3.5 h-3.5 text-white" />
                      : user.role === 'ENFORCEMENT_OFFICER' ? <ShieldAlert className="w-3.5 h-3.5 text-white" />
                      : user.role === 'OFFICIAL' ? <ShieldCheck className="w-3.5 h-3.5 text-slate-950" /> 
                      : <User className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold leading-tight flex items-center gap-1">
                      <span>{user.name}</span>
                      {user.role === 'ADMIN' ? (
                        <Crown className="w-3 h-3 text-amber-500" />
                      ) : (
                        <ShieldCheck className={`w-3 h-3 ${user.role === 'OFFICIAL' ? 'text-amber-500' : 'text-emerald-500'}`} />
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-none">
                      {user.designation || (user.role === 'ADMIN' ? 'Director General (Super Admin)' : user.role === 'OFFICIAL' ? 'RTO Licensing Officer' : (user.role || 'Citizen'))}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="px-3 py-2 border-b dark:border-slate-700 mb-1">
                      <p className="text-xs font-extrabold">{user.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.mobile}</p>
                      <span className={`inline-flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-black'
                          : user.role === 'MEDICAL_DOCTOR'
                          ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-black'
                          : user.role === 'DRIVING_SCHOOL'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black'
                          : user.role === 'COUNTER_OPERATOR'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black'
                          : user.role === 'ENFORCEMENT_OFFICER'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-black'
                          : user.role === 'OFFICIAL' 
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' 
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {user.role === 'ADMIN' ? <><Crown className="w-3 h-3 text-amber-500" /><span>MoRTH Super Admin</span></> 
                          : user.role === 'MEDICAL_DOCTOR' ? <><Stethoscope className="w-3 h-3 text-teal-600" /><span>Medical Doctor</span></>
                          : user.role === 'DRIVING_SCHOOL' ? <><GraduationCap className="w-3 h-3 text-emerald-600" /><span>Driving School</span></>
                          : user.role === 'COUNTER_OPERATOR' ? <><UserCheck className="w-3 h-3 text-blue-600" /><span>Counter Clerk</span></>
                          : user.role === 'ENFORCEMENT_OFFICER' ? <><ShieldAlert className="w-3 h-3 text-rose-600" /><span>Enforcement Squad</span></>
                          : user.role === 'OFFICIAL' ? <><ShieldCheck className="w-3 h-3 text-amber-600" /><span>Authorized RTO Officer</span></> 
                          : <><BadgeCheck className="w-3 h-3 text-emerald-600" /><span>Verified Citizen</span></>}
                      </span>
                    </div>

                    {user.role === 'ADMIN' ? (
                      <>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/admin-dashboard');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 hover:bg-purple-100 text-left transition cursor-pointer mb-1 border border-purple-200/60 dark:border-purple-800"
                        >
                          <Crown className="w-4 h-4 text-amber-500" />
                          <span>Directorate Admin Hub</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/admin/officers');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>Officer Registry & Commission</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-scrutiny');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <FolderKanban className="w-4 h-4 text-amber-600" />
                          <span>National Scrutiny Queue</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-adtt');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Car className="w-4 h-4 text-emerald-600" />
                          <span>ADTT Skill Track Hub</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-dl-dispatch');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-blue-600" />
                          <span>Smart Card DL Dispatch</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-notifications');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Bell className="w-4 h-4 text-purple-600" />
                          <span>Gazette & Circular Publisher</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/rto-directory');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-slate-500" />
                          <span>All-India RTO Directory</span>
                        </button>
                      </>
                    ) : user.role === 'MEDICAL_DOCTOR' ? (
                      <>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/doctor-portal');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 hover:bg-teal-100 text-left transition cursor-pointer mb-1 border border-teal-200/60 dark:border-teal-800"
                        >
                          <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>Form 1A Medical Fitness Desk</span>
                        </button>
                      </>
                    ) : user.role === 'DRIVING_SCHOOL' ? (
                      <>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/dts-portal');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 text-left transition cursor-pointer mb-1 border border-emerald-200/60 dark:border-emerald-800"
                        >
                          <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>DTS Trainee Roster & Form 5B</span>
                        </button>
                      </>
                    ) : user.role === 'COUNTER_OPERATOR' ? (
                      <>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/counter-desk');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 hover:bg-blue-100 text-left transition cursor-pointer mb-1 border border-blue-200/60 dark:border-blue-800"
                        >
                          <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Counter Biometric & Token Desk</span>
                        </button>
                      </>
                    ) : user.role === 'ENFORCEMENT_OFFICER' ? (
                      <>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/enforcement-portal');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 hover:bg-rose-100 text-left transition cursor-pointer mb-1 border border-rose-200/60 dark:border-rose-800"
                        >
                          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span>e-Challan Vigilance Console</span>
                        </button>
                      </>
                    ) : user.role === 'OFFICIAL' ? (
                      <>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-dashboard');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-left transition cursor-pointer mb-1 border border-amber-200/60 dark:border-amber-800"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>MLO Command Workdesk</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-scrutiny');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <FolderKanban className="w-4 h-4 text-amber-600" />
                          <span>Scrutiny Queue</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-adtt');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Car className="w-4 h-4 text-emerald-600" />
                          <span>ADTT Skill Track</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-dl-dispatch');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-blue-600" />
                          <span>Smart Card DL Dispatch</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/officer-notifications');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Bell className="w-4 h-4 text-purple-600" />
                          <span>Gazette & Notice Manager</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/rto-directory');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-slate-500" />
                          <span>Jurisdictional RTOs</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/applications');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <FolderKanban className="w-4 h-4 text-blue-600" />
                          <span>My Applications</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/appointments');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>My Appointments</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/status');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-amber-600" />
                          <span>Track Status</span>
                        </button>
                      </>
                    )}

                    <div className="border-t dark:border-slate-700 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 sm:space-x-2 bg-[#0056D2] hover:bg-[#0047b3] text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-blue-500/20 active:scale-97 transition-all cursor-pointer"
              >
                <User className="w-4 h-4 fill-white/20" />
                <span className="hidden sm:inline">{t.loginSignUp}</span>
                <span className="sm:hidden text-xs font-bold">Login</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
