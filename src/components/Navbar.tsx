import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Layers, 
  MapPin, 
  Calculator, 
  Search, 
  Calendar, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  FileCheck,
  RotateCcw,
  CreditCard,
  Truck,
  Car,
  FileText,
  PhoneCall,
  MessageSquareWarning,
  BookOpen,
  ShieldCheck,
  Award,
  Users,
  Bell,
  Crown,
  Stethoscope,
  Scale,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHome?: () => void;
  onOpenService: (serviceId: string) => void;
  onOpenRto: () => void;
  onOpenFee: () => void;
  onOpenStatus: () => void;
  onOpenAppointment: () => void;
  onOpenSupport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenHome,
  onOpenService,
  onOpenRto,
  onOpenFee,
  onOpenStatus,
  onOpenAppointment,
  onOpenSupport
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { t, darkMode, user } = useApp();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // MEDICAL DOCTOR NAVBAR
  if (user?.role === 'MEDICAL_DOCTOR') {
    return (
      <nav className={`border-b hidden md:block shadow-2xs relative z-30 transition-colors duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gradient-to-r from-slate-950 via-[#073B4C] to-[#06D6A0]/20 text-white border-teal-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
            <button
              type="button"
              onClick={() => navigate('/doctor-portal')}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-bold text-teal-400 border-b-2 border-teal-400 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>Form 1A Medical Fitness Desk</span>
            </button>
            <button
              type="button"
              onClick={onOpenSupport}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border-b-2 border-transparent cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>NMC Statutory Guidelines</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // DRIVING TRAINING SCHOOL (DTS) NAVBAR
  if (user?.role === 'DRIVING_SCHOOL') {
    return (
      <nav className={`border-b hidden md:block shadow-2xs relative z-30 transition-colors duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gradient-to-r from-slate-950 via-[#1B3B2B] to-[#2D5A43] text-white border-emerald-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
            <button
              type="button"
              onClick={() => navigate('/dts-portal')}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-bold text-emerald-400 border-b-2 border-emerald-400 cursor-pointer"
            >
              <Car className="w-4 h-4 text-emerald-400" />
              <span>DTS Trainee Roster & Form 5B Desk</span>
            </button>
            <button
              type="button"
              onClick={onOpenSupport}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border-b-2 border-transparent cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>CMVR Rule 31B Accreditation Manual</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // COUNTER BIOMETRIC & TOKEN CLERK NAVBAR
  if (user?.role === 'COUNTER_OPERATOR') {
    return (
      <nav className={`border-b hidden md:block shadow-2xs relative z-30 transition-colors duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gradient-to-r from-slate-950 via-[#0B2545] to-[#133E7C] text-white border-blue-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
            <button
              type="button"
              onClick={() => navigate('/counter-desk')}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-bold text-blue-400 border-b-2 border-blue-400 cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Counter Biometric & Token Desk</span>
            </button>
            <button
              type="button"
              onClick={onOpenRto}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border-b-2 border-transparent cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>District Counters</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // ENFORCEMENT FLYING SQUAD NAVBAR
  if (user?.role === 'ENFORCEMENT_OFFICER') {
    return (
      <nav className={`border-b hidden md:block shadow-2xs relative z-30 transition-colors duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gradient-to-r from-slate-950 via-[#3B0000] to-[#5B1010] text-white border-rose-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
            <button
              type="button"
              onClick={() => navigate('/enforcement-portal')}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-bold text-rose-400 border-b-2 border-rose-400 cursor-pointer"
            >
              <Scale className="w-4 h-4 text-rose-400" />
              <span>Enforcement & e-Challan Vigilance</span>
            </button>
            <button
              type="button"
              onClick={onOpenSupport}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border-b-2 border-transparent cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>MV Act 1988 Statutory Tariffs</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // SUPER ADMIN NAVBAR
  if (user?.role === 'ADMIN') {
    const isAdminHome = path === '/admin-dashboard' || path === '/admin/dashboard';
    const isOfficers = path.startsWith('/admin/officers') || path.startsWith('/admin-officers');
    const isScrutiny = path.startsWith('/officer-scrutiny') || path.startsWith('/officer/scrutiny');
    const isAdtt = path.startsWith('/officer-adtt') || path.startsWith('/officer/adtt');
    const isDispatch = path.startsWith('/officer-dl-dispatch') || path.startsWith('/officer/dl-dispatch');
    const isNotices = path.startsWith('/officer-notifications') || path.startsWith('/officer/notifications');

    return (
      <nav className={`border-b hidden md:block shadow-2xs relative z-30 transition-colors duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gradient-to-r from-slate-950 via-slate-900 to-[#1A0B2E] text-white border-purple-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isAdminHome
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-purple-200 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Crown className={`w-4 h-4 ${isAdminHome ? 'text-amber-400' : 'text-amber-300'}`} />
              <span>Directorate Hub</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/officers')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isOfficers
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Users className={`w-4 h-4 ${isOfficers ? 'text-amber-400' : 'text-purple-400'}`} />
              <span>Officer Management</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/officer-scrutiny')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isScrutiny
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <FileText className={`w-4 h-4 ${isScrutiny ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Scrutiny Queue</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/officer-adtt')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isAdtt
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Car className={`w-4 h-4 ${isAdtt ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>ADTT Skill Track</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/officer-dl-dispatch')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isDispatch
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Award className={`w-4 h-4 ${isDispatch ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>DL Dispatch</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/officer-notifications')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isNotices
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Bell className={`w-4 h-4 ${isNotices ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Public Notices</span>
            </button>

            <button
              type="button"
              onClick={onOpenRto}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border-b-2 border-transparent cursor-pointer transition"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>RTO Directory</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  if (user?.role === 'OFFICIAL') {
    const isWorkdesk = path === '/officer' || path === '/officer-dashboard';
    const isScrutiny = path.startsWith('/officer-scrutiny') || path.startsWith('/officer/scrutiny');
    const isAdtt = path.startsWith('/officer-adtt') || path.startsWith('/officer/adtt');
    const isDispatch = path.startsWith('/officer-dl-dispatch') || path.startsWith('/officer/dl-dispatch');
    const isNotices = path.startsWith('/officer-notifications') || path.startsWith('/officer/notifications');

    return (
      <nav className={`border-b hidden md:block shadow-2xs relative z-30 transition-colors duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
            <button
              type="button"
              onClick={() => navigate('/officer-dashboard')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isWorkdesk
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isWorkdesk ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Officer Workdesk</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/officer-scrutiny')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isScrutiny
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <FileText className={`w-4 h-4 ${isScrutiny ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Scrutiny Queue</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/officer-adtt')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isAdtt
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Car className={`w-4 h-4 ${isAdtt ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>ADTT Skill Track</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/officer-dl-dispatch')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isDispatch
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Award className={`w-4 h-4 ${isDispatch ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>DL Dispatch</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/officer-notifications')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm transition cursor-pointer ${
                isNotices
                  ? 'font-bold text-amber-400 border-b-2 border-amber-400'
                  : 'font-semibold text-slate-300 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Bell className={`w-4 h-4 ${isNotices ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Public Notices</span>
            </button>

            <button
              type="button"
              onClick={onOpenRto}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border-b-2 border-transparent cursor-pointer transition"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>RTO Directory</span>
            </button>

            <button
              type="button"
              onClick={onOpenSupport}
              className="flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border-b-2 border-transparent cursor-pointer transition"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Helpdesk</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`border-b hidden md:block shadow-2xs relative z-30 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-6 lg:space-x-8">
          
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('Home');
              if (onOpenHome) onOpenHome();
            }}
            className={`flex items-center space-x-2 py-3.5 px-2 text-xs sm:text-sm font-semibold relative transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'Home' 
                ? 'text-[#0056D2]' 
                : darkMode ? 'text-slate-300 hover:text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === 'Home' ? 'text-[#0056D2]' : 'text-slate-500'}`} />
            <span>{t.home}</span>
            {activeTab === 'Home' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0056D2] rounded-t-md" />
            )}
          </button>

          {/* 2. Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className={`flex items-center space-x-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isServicesOpen ? 'text-[#0056D2]' : darkMode ? 'text-slate-300 hover:text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
              }`}
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>{t.services}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-[#0056D2]' : ''}`} />
            </button>

            {/* Government Portal Dropdown Menu */}
            {isServicesOpen && (
              <div className="absolute left-0 top-full pt-1 z-50">
                <div className={`w-[480px] rounded-lg shadow-xl border p-3 grid grid-cols-2 gap-2 text-left animate-in fade-in zoom-in-95 duration-100 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  
                  {/* Group 1: Driving Licence Services */}
                  <div>
                    <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-700 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Licence Services
                      </span>
                    </div>
                    
                    <button
                      onClick={() => { onOpenService('ll-new'); setIsServicesOpen(false); }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                        <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                          Learner Licence (LL)
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                      onClick={() => { onOpenService('dl-new'); setIsServicesOpen(false); }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                        <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                          Driving Licence (DL)
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                      onClick={() => { onOpenService('dl-renew'); setIsServicesOpen(false); }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2">
                        <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                        <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                          DL Renewal Online
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>

                  {/* Group 2: Endorsement & Permits */}
                  <div>
                    <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-700 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Endorsement & Duplicate
                      </span>
                    </div>

                    <button
                      onClick={() => { onOpenService('dl-update'); setIsServicesOpen(false); }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                        <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                          Change Name / Address
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                      onClick={() => { onOpenService('dl-replace'); setIsServicesOpen(false); }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                        <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                          Duplicate Licence Card
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                      onClick={() => { onOpenService('dl-idp'); setIsServicesOpen(false); }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                        <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                          International Permit (IDP)
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* 3. RTO Finder */}
          <button
            type="button"
            onClick={onOpenRto}
            className={`flex items-center space-x-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              darkMode ? 'text-slate-300 hover:text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
            }`}
          >
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>{t.rtoFinder}</span>
          </button>

          {/* 4. Fee Calculator */}
          <button
            type="button"
            onClick={onOpenFee}
            className={`flex items-center space-x-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              darkMode ? 'text-slate-300 hover:text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
            }`}
          >
            <Calculator className="w-4 h-4 text-slate-500" />
            <span>{t.feeCalculator}</span>
          </button>

          {/* 5. Check Status */}
          <button
            type="button"
            onClick={onOpenStatus}
            className={`flex items-center space-x-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              darkMode ? 'text-slate-300 hover:text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
            }`}
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>{t.checkStatus}</span>
          </button>

          {/* 6. Appointments */}
          <button
            type="button"
            onClick={onOpenAppointment}
            className={`flex items-center space-x-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              darkMode ? 'text-slate-300 hover:text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
            }`}
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{t.appointments}</span>
          </button>

          {/* 7. Help & Support Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsHelpOpen(true)}
            onMouseLeave={() => setIsHelpOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className={`flex items-center space-x-1.5 py-3.5 px-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isHelpOpen ? 'text-[#0056D2]' : darkMode ? 'text-slate-300 hover:text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>{t.helpSupport}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isHelpOpen ? 'rotate-180 text-[#0056D2]' : ''}`} />
            </button>

            {isHelpOpen && (
              <div className="absolute right-0 top-full pt-1 z-50">
                <div className={`w-56 rounded-lg shadow-xl border p-1.5 text-left animate-in fade-in zoom-in-95 duration-100 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <button
                    onClick={() => { onOpenSupport(); setIsHelpOpen(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                  >
                    <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                    <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                      Helpline: 1800-1800-151
                    </span>
                  </button>

                  <button
                    onClick={() => { onOpenSupport(); setIsHelpOpen(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                  >
                    <MessageSquareWarning className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                    <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                      Raise Grievance
                    </span>
                  </button>

                  <button
                    onClick={() => { onOpenSupport(); setIsHelpOpen(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition cursor-pointer group"
                  >
                    <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#0056D2]" />
                    <span className="text-xs font-semibold group-hover:text-[#0056D2]">
                      User Manual & FAQs
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
