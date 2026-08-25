import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CalendarCheck, 
  Calculator, 
  MapPin, 
  Search, 
  Calendar, 
  IndianRupee, 
  HelpCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface UtilityCardsProps {
  onCheckStatus: (appId: string) => void;
  onBookAppointment: () => void;
  onCalculateFee: () => void;
  onFindRto: (query: string) => void;
}

export const UtilityCards: React.FC<UtilityCardsProps> = ({
  onCheckStatus,
  onBookAppointment,
  onCalculateFee,
  onFindRto
}) => {
  const { t, darkMode } = useApp();
  const [statusAppId, setStatusAppId] = useState('');
  const [rtoQuery, setRtoQuery] = useState('');
  const [showHelperModal, setShowHelperModal] = useState(false);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (statusAppId.trim()) {
      onCheckStatus(statusAppId.trim());
    } else {
      onCheckStatus('DL1234567890123');
    }
  };

  const handleRtoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindRto(rtoQuery.trim());
  };

  return (
    <section className={`py-4 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Title (Mobile & Desktop) */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-2xl font-extrabold tracking-tight">
              Essential Utilities & Quick Access
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Statutory verification, slot booking, official fee reckoning, and RTO locator
            </p>
          </div>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          
          {/* Card 1: Check Status */}
          <div className={`rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between border transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50' 
              : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-200'
          }`}>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center sm:items-start justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0056D2] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0056D2]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider bg-blue-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-blue-100 dark:border-slate-800 sm:hidden">
                  Live Track
                </span>
              </div>

              <div>
                <h3 className={`text-xs sm:text-base font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'} line-clamp-1`}>
                  {t.checkStatus}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Track 9-stage progress
                </p>
              </div>

              {/* Desktop Search Form */}
              <form onSubmit={handleStatusSubmit} className="hidden sm:block space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="text"
                    value={statusAppId}
                    onChange={(e) => setStatusAppId(e.target.value)}
                    placeholder="Application No."
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden transition shadow-2xs ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-[#0056D2]' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-[#0056D2]'
                    }`}
                  />
                  {statusAppId === '' && (
                    <button
                      type="button"
                      onClick={() => setStatusAppId('DL1234567890123')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded font-medium cursor-pointer"
                    >
                      Fill
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <span>Track Status</span>
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Mobile 1-Tap CTA / Desktop Link */}
            <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-2 sm:mt-3">
              <button
                type="button"
                onClick={() => onCheckStatus(statusAppId || 'DL1234567890123')}
                className="w-full sm:w-auto text-[10px] sm:text-xs font-bold text-[#0056D2] hover:underline flex items-center justify-between sm:justify-start gap-1 cursor-pointer bg-blue-50 dark:bg-blue-950/60 sm:bg-transparent py-1.5 sm:py-0 px-2 sm:px-0 rounded-lg"
              >
                <span>Track Application</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Book an Appointment */}
          <div className={`rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between border transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50' 
              : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-200'
          }`}>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center sm:items-start justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0056D2] flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0056D2]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider bg-blue-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-blue-100 dark:border-slate-800 sm:hidden">
                  RTO Slots
                </span>
              </div>

              <div>
                <h3 className={`text-xs sm:text-base font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'} line-clamp-1`}>
                  {t.appointments}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Book or reschedule test
                </p>
              </div>

              <div className="hidden sm:block pt-1">
                <button
                  type="button"
                  onClick={onBookAppointment}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-xs ${
                    darkMode 
                      ? 'bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/60' 
                      : 'bg-[#EBF4FF] hover:bg-[#E0EEFF] text-[#0056D2] border border-blue-200/80'
                  }`}
                >
                  <span>Book Slot</span>
                  <Calendar className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-2 sm:mt-3">
              <button
                type="button"
                onClick={onBookAppointment}
                className="w-full sm:w-auto text-[10px] sm:text-xs font-bold text-[#0056D2] hover:underline flex items-center justify-between sm:justify-start gap-1 cursor-pointer bg-blue-50 dark:bg-blue-950/60 sm:bg-transparent py-1.5 sm:py-0 px-2 sm:px-0 rounded-lg"
              >
                <span>Reserve Slot</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Fee Calculator */}
          <div className={`rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between border transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50' 
              : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-200'
          }`}>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center sm:items-start justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-slate-800 sm:hidden">
                  Rule 32
                </span>
              </div>

              <div>
                <h3 className={`text-xs sm:text-base font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'} line-clamp-1`}>
                  {t.feeCalculator}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  CMVR 32 statutory rates
                </p>
              </div>

              <div className="hidden sm:block pt-1">
                <button
                  type="button"
                  onClick={onCalculateFee}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-xs ${
                    darkMode 
                      ? 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80'
                  }`}
                >
                  <span>Calculate Fee</span>
                  <IndianRupee className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-2 sm:mt-3">
              <button
                type="button"
                onClick={onCalculateFee}
                className="w-full sm:w-auto text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center justify-between sm:justify-start gap-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 sm:bg-transparent py-1.5 sm:py-0 px-2 sm:px-0 rounded-lg"
              >
                <span>View Tariff</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 4: Find RTO */}
          <div className={`rounded-2xl p-3.5 sm:p-6 flex flex-col justify-between border transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50' 
              : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-200'
          }`}>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center sm:items-start justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0056D2] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0056D2]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider bg-blue-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-blue-100 dark:border-slate-800 sm:hidden">
                  1,400+ RTOs
                </span>
              </div>

              <div>
                <h3 className={`text-xs sm:text-base font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'} line-clamp-1`}>
                  {t.rtoFinder}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  1,400+ RTO offices
                </p>
              </div>

              {/* Desktop RTO Search Form */}
              <form onSubmit={handleRtoSubmit} className="hidden sm:block space-y-2 pt-1">
                <input
                  type="text"
                  value={rtoQuery}
                  onChange={(e) => setRtoQuery(e.target.value)}
                  placeholder="City or RTO Code"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden transition shadow-2xs ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-[#0056D2]' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-[#0056D2]'
                  }`}
                />

                <button
                  type="submit"
                  className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <span>Locate RTO</span>
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-2 sm:mt-3">
              <button
                type="button"
                onClick={() => onFindRto(rtoQuery.trim())}
                className="w-full sm:w-auto text-[10px] sm:text-xs font-bold text-[#0056D2] hover:underline flex items-center justify-between sm:justify-start gap-1 cursor-pointer bg-blue-50 dark:bg-blue-950/60 sm:bg-transparent py-1.5 sm:py-0 px-2 sm:px-0 rounded-lg"
              >
                <span>Find Office</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Quick Helper Modal for Application No */}
        {showHelperModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 ${
              darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base">
                  <HelpCircle className="w-5 h-5" />
                  <span>How to find Application No.?</span>
                </div>
                <button onClick={() => setShowHelperModal(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5">
                <p>1. <strong>SMS Notification</strong>: Check the SMS received on your registered mobile number from sender <strong>VAHAN/SARATHI</strong> at the time of submission.</p>
                <p>2. <strong>Acknowledgement Slip</strong>: Look at the top right header of the printed or PDF acknowledgement form.</p>
                <p>3. <strong>Find by Mobile / DOB</strong>: You can also retrieve your application number from the "Find Application" tab in the login area.</p>
              </div>

              <button 
                onClick={() => {
                  setStatusAppId('DL1234567890123');
                  setShowHelperModal(false);
                }}
                className="w-full bg-[#0056D2] text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer hover:bg-blue-700"
              >
                Use Demo Application (DL1234567890123)
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
