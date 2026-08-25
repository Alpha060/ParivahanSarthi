import React from 'react';
import { 
  X, 
  Home, 
  Layers, 
  MapPin, 
  Calculator, 
  Search, 
  Calendar, 
  HelpCircle, 
  User, 
  Globe, 
  Sun, 
  Moon,
  PhoneCall,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../data/translations';

interface MobileDrawerProps {
  onOpenHome?: () => void;
  onOpenLogin: () => void;
  onOpenStateSelector: () => void;
  onOpenService: (id: string) => void;
  onOpenServicesCatalog?: () => void;
  onOpenStatus: () => void;
  onOpenAppointment: () => void;
  onOpenFee: () => void;
  onOpenRto: () => void;
  onOpenSupport: () => void;
  onOpenMockTest?: () => void;
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

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  onOpenHome,
  onOpenLogin,
  onOpenStateSelector,
  onOpenService,
  onOpenServicesCatalog,
  onOpenStatus,
  onOpenAppointment,
  onOpenFee,
  onOpenRto,
  onOpenSupport,
  onOpenMockTest
}) => {
  const { 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    language, 
    setLanguage, 
    t, 
    darkMode, 
    setDarkMode,
    fontScale,
    setFontScale,
    currentState,
    user,
    isLoggedIn,
    logout
  } = useApp();

  if (!isMobileMenuOpen) return null;

  const handleAction = (cb: () => void) => {
    setIsMobileMenuOpen(false);
    cb();
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className={`relative w-[85%] max-w-sm h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250 ${
        darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
      }`}>
        
        {/* Drawer Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-150 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-10 flex-shrink-0">
              <img 
                src="/assets/emblem.png" 
                alt="Emblem" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-base font-extrabold tracking-tight ${darkMode ? 'text-blue-400' : 'text-[#0B2545]'}`}>PARIVAHAN</span>
                <span className="text-base font-extrabold text-[#0056D2]">SARATHI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Govt. of India</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Quick Login OR User Profile Card */}
          <div className="space-y-2.5">
            {isLoggedIn && user ? (
              <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                user.role === 'OFFICIAL'
                  ? darkMode ? 'bg-amber-950/30 border-amber-800/60' : 'bg-amber-50/80 border-amber-200'
                  : darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shadow-xs flex-shrink-0 ${
                    user.role === 'OFFICIAL' ? 'bg-amber-500 text-slate-950' : 'bg-[#0056D2] text-white'
                  }`}>
                    {user.role === 'OFFICIAL' ? 'OFF' : (user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1">
                      <span>{user.name}</span>
                      <ShieldCheck className={`w-3.5 h-3.5 flex-shrink-0 ${user.role === 'OFFICIAL' ? 'text-amber-500' : 'text-emerald-500'}`} />
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {user.role === 'OFFICIAL' ? (user.employeeCode || 'GOV-JH-8492') : user.mobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t dark:border-slate-700">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'OFFICIAL' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {user.role === 'OFFICIAL' ? 'RTO Licensing Officer' : (user.role || 'Citizen')}
                  </span>
                  <button
                    onClick={() => handleAction(logout)}
                    className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleAction(onOpenLogin)}
                className="w-full bg-[#0056D2] text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-between shadow-md active:scale-98 transition cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{t.loginSignUp}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Detected State Switcher */}
            <button
              onClick={() => handleAction(onOpenStateSelector)}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{t.detectedLocation}</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{currentState}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#0056D2]">{t.changeState}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">Navigation Services</p>
            
            {/* Home Navigation */}
            <button
              onClick={() => handleAction(() => {
                if (onOpenHome) onOpenHome();
              })}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                darkMode ? 'hover:bg-slate-800 text-blue-400' : 'hover:bg-slate-100 text-blue-600'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="font-bold">{t.home}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
            </button>

            <button
              onClick={() => handleAction(() => {
                if (onOpenServicesCatalog) {
                  onOpenServicesCatalog();
                } else {
                  onOpenService('services');
                }
              })}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{t.services}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleAction(onOpenStatus)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Search className="w-4 h-4 text-blue-600" />
                <span>{t.checkStatus}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleAction(onOpenAppointment)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{t.appointments}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleAction(onOpenFee)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>{t.feeCalculator}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleAction(onOpenRto)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{t.rtoFinder}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleAction(() => {
                if (onOpenMockTest) onOpenMockTest();
              })}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">LL Mock Test Practice</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
            </button>

            <button
              onClick={() => handleAction(onOpenSupport)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>{t.helpSupport}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Language Selection Grid */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Select Language / भाषा
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                    language === lang.code
                      ? 'bg-blue-50 border-[#0056D2] text-[#0056D2] font-bold'
                      : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility & Theme Controls */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Theme Mode:</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold cursor-pointer"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-2.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Text Size (A- / A+):</span>
              <div className="flex items-center space-x-2 text-xs font-bold">
                <button onClick={() => setFontScale(Math.max(0.9, fontScale - 0.05))} className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200">A-</button>
                <button onClick={() => setFontScale(1)} className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200">A</button>
                <button onClick={() => setFontScale(Math.min(1.15, fontScale + 0.05))} className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200">A+</button>
              </div>
            </div>
          </div>

          {/* Quick Helpline Hotline */}
          <a
            href="tel:18001800151"
            className="w-full p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center space-x-2 text-xs font-bold"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Toll-Free Helpline: 1800-1800-151</span>
          </a>

        </div>

      </div>

    </div>
  );
};
