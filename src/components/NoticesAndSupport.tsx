import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageSquareWarning, 
  BookOpen, 
  Smartphone,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NOTICES } from '../data/mockData';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { ExternalPortalModal, ExternalPortalInfo } from './Modals/ExternalPortalModal';

interface NoticesAndSupportProps {
  onOpenSupport: () => void;
}

export const NoticesAndSupport: React.FC<NoticesAndSupportProps> = ({
  onOpenSupport
}) => {
  const navigate = useNavigate();
  const { t, darkMode } = useApp();
  const [notices, setNotices] = useState<any[]>(NOTICES);
  const [activePortalModal, setActivePortalModal] = useState<ExternalPortalInfo | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.getNotices();
      if (res.success && res.notices && res.notices.length > 0) {
        setNotices(res.notices.slice(0, 3));
      }
    } catch (err) {
      // Fallback
    }
  };

  const handleOpenAppPlaceholder = (platform: 'android' | 'ios') => {
    setActivePortalModal({
      name: `mParivahan NextGen Mobile App (${platform === 'android' ? 'Google Play' : 'Apple App Store'})`,
      urlPlaceholder: platform === 'android' ? 'sandbox://play.google.com/store/apps/details?id=com.nic.mparivahan' : 'sandbox://apps.apple.com/in/app/mparivahan/id1184638706',
      category: 'Mobile Digital Document Repository & e-KYC',
      description: 'Official Government of India mobile application for virtual Driving Licence and Registration Certificate storage. Direct APK downloading from commercial app stores is simulated in this sandbox environment.',
      internalRoute: '/status',
      internalRouteLabel: 'View Digital PVC Smart Card'
    });
  };

  return (
    <>
      <section className={`py-4 sm:py-8 transition-colors duration-200 ${
        darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* 3-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
            
            {/* Column 1: Important Notices (5 Cols) */}
            <div className={`lg:col-span-5 rounded-2xl p-3.5 sm:p-6 border flex flex-col justify-between transition-all ${
              darkMode 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
            }`}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {t.importantNotices}
                  </h3>
                  <Link 
                    to="/notices"
                    className="text-xs text-[#0056D2] dark:text-blue-400 font-semibold hover:underline flex items-center"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {notices.map((notice) => (
                    <div 
                      key={notice.id}
                      onClick={() => navigate('/notices')}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer group ${
                        darkMode 
                          ? 'bg-slate-900/50 border-slate-700/60 hover:bg-slate-900 hover:border-slate-600' 
                          : 'bg-slate-50/70 border-slate-200/70 hover:bg-white hover:border-blue-200 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          notice.category === 'ADVISORY' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : notice.category === 'UPDATE'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}>
                          {notice.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {notice.date}
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold leading-snug group-hover:text-[#0056D2] dark:group-hover:text-blue-400 transition-colors line-clamp-1 ${
                        darkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {notice.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Updated daily by MoRTH</span>
                <Link to="/notices" className="font-semibold text-[#0056D2] dark:text-blue-400 hover:underline">
                  Official Gazette →
                </Link>
              </div>
            </div>

            {/* Column 2: Citizen Helpdesk & Support (3 Cols) */}
            <div className={`lg:col-span-3 rounded-2xl p-3.5 sm:p-6 border flex flex-col justify-between transition-all ${
              darkMode 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
            }`}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-[#0056D2] dark:text-blue-400">
                    <MessageSquareWarning className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {t.needHelp || 'Need Assistance?'}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                      Toll-Free & Grievance Redressal
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
                    National Helpline
                  </span>
                  <p className="text-base sm:text-lg font-black text-[#0056D2] dark:text-blue-400">
                    1800-1800-151
                  </p>
                  <span className="text-[10px] text-slate-400 block">
                    06:00 AM - 10:00 PM (All 7 Days)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={onOpenSupport}
                    className="w-full bg-[#0056D2] hover:bg-blue-700 active:scale-98 text-white py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Open Helpdesk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to="/grievance"
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border text-center transition block ${
                      darkMode 
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-700' 
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    File Grievance (CPGRAMS)
                  </Link>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3 text-[11px] text-slate-400">
                <span>helpdesk-sarathi@gov.in</span>
              </div>
            </div>

            {/* Column 3: mParivahan App Card (4 Cols) */}
            <div className="lg:col-span-4 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-[#0B2545] via-[#0A3060] to-[#0056D2] text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
              
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                    <Smartphone className="w-4 h-4 text-blue-200" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
                      mParivahan NextGen App
                    </h3>
                    <p className="text-[10px] text-blue-200/80">
                      Available for Android & iOS
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[9px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-mono">
                        4.8 / 5.0 (10M+ Downloads)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 py-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-blue-100">Valid digital DL & RC legally accepted nationwide</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-[11px] text-blue-100">Direct contactless renewals & virtual verification</span>
                  </div>
                </div>

                {/* Official Store Download Actions: Google Play & Apple App Store Placeholders */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Google Play Store Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenAppPlaceholder('android')}
                    className="bg-[#06182a] hover:bg-[#0d2a4a] border border-blue-400/30 hover:border-blue-400/60 text-white px-2.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm group min-h-[42px] cursor-pointer"
                    aria-label="Download on Google Play"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186A2.22 2.22 0 0 1 3 20.613V3.387c0-.6.223-1.164.609-1.573z" fill="#00D3FF" />
                      <path d="M17.18 8.613L4.85 1.5A2.247 2.247 0 0 0 3.61 1.814l10.183 10.186 3.387-3.387z" fill="#00F076" />
                      <path d="M17.18 15.387l-3.387-3.387L3.61 22.186c.362.247.794.354 1.24.1l12.33-7.113c.64-.37.99-.95.99-1.393a1.44 1.44 0 0 0-.99-.393z" fill="#FF3A44" />
                      <path d="M21.5 12c0-.58-.33-1.11-.86-1.42l-3.46-1.97-3.39 3.39 3.39 3.39 3.46-1.97c.53-.31.86-.84.86-1.42z" fill="#FFC400" />
                    </svg>
                    <div className="text-left leading-none whitespace-nowrap">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-blue-200/80 font-medium block mb-0.5">GET IT ON</span>
                      <span className="text-[11px] sm:text-xs font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors block">Google Play</span>
                    </div>
                  </button>

                  {/* Apple App Store Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenAppPlaceholder('ios')}
                    className="bg-[#06182a] hover:bg-[#0d2a4a] border border-blue-400/30 hover:border-blue-400/60 text-white px-2.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm group min-h-[42px] cursor-pointer"
                    aria-label="Download on Apple App Store"
                  >
                    <svg className="w-5 h-5 flex-shrink-0 fill-white group-hover:fill-blue-200 transition-colors" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.06 1.71-.93 2.73 1.01.08 2.03-.49 2.65-1.23z" />
                    </svg>
                    <div className="text-left leading-none whitespace-nowrap">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-blue-200/80 font-medium block mb-0.5">DOWNLOAD ON</span>
                      <span className="text-[11px] sm:text-xs font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors block">App Store</span>
                    </div>
                  </button>
                </div>

              </div>

              <div className="pt-3 border-t border-blue-400/20 mt-3 flex items-center justify-between text-[11px] text-blue-300 z-10 relative">
                <span>NextGen e-Governance App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* External App Store Placeholder Modal */}
      <ExternalPortalModal
        isOpen={Boolean(activePortalModal)}
        onClose={() => setActivePortalModal(null)}
        portal={activePortalModal}
        darkMode={darkMode}
      />
    </>
  );
};
