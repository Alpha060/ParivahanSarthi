import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Download, 
  Calendar, 
  Plus,
  CheckCircle2,
  Lock,
  Search,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { api } from '../services/api';
import { MOCK_APPLICATIONS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

interface MyApplicationsProps {
  onOpenDetails: (appId: string) => void;
  onOpenNewApplication: () => void;
  onOpenAppointment: () => void;
  onViewAllApplications?: () => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({
  onOpenDetails,
  onOpenNewApplication,
  onOpenAppointment,
  onViewAllApplications
}) => {
  const { t, darkMode, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>(MOCK_APPLICATIONS);
  const [quickTrackQuery, setQuickTrackQuery] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchApplications();
    }
  }, [isLoggedIn]);

  const fetchApplications = async () => {
    try {
      const res = await api.getApplications();
      if (res.success && res.applications && res.applications.length > 0) {
        setApplications(res.applications);
      }
    } catch (err) {
      // Keep mock default
    }
  };

  const handleDownload = async (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.getCertificate(appId);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setDownloadSuccess(appId);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackQuery.trim()) {
      onOpenDetails(quickTrackQuery.trim());
    }
  };

  const scrollByDirection = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const shift = carouselRef.current.clientWidth * 0.78;
    carouselRef.current.scrollBy({ left: dir === 'left' ? -shift : shift, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const index = Math.round(scrollLeft / (clientWidth * 0.75));
    setActiveDot(Math.min(3, Math.max(0, index)));
  };

  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const shift = carouselRef.current.clientWidth * 0.78 * index;
    carouselRef.current.scrollTo({ left: shift, behavior: 'smooth' });
    setActiveDot(index);
  };

  return (
    <section className={`py-4 sm:py-6 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Navy Container */}
        <div className="bg-[#0A2540] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {!isLoggedIn ? (
            /* Logged Out / Guest State: Citizen Sign-In & Quick Track Hub */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-10 relative py-2">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-2 text-blue-300">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Citizen Single Sign-On (SSO)
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    Access Your Driving Licences & Applications
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-200/90 mt-2 leading-relaxed max-w-xl">
                    Sign in with your registered mobile or Aadhaar number to view your private application dossiers, test appointment tokens, and download cryptographically signed smart card licences.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="bg-[#0056D2] hover:bg-blue-600 active:scale-98 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-lg transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Citizen Login with OTP</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenNewApplication}
                    className="bg-white/10 hover:bg-white/20 active:scale-98 text-white border border-white/20 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    <span>Apply for New Service</span>
                  </button>
                </div>

                <div className="flex items-center space-x-4 pt-2 text-[11px] text-blue-200/80">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Aadhaar e-KYC
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    DigiLocker Synced
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    256-Bit Encrypted
                  </span>
                </div>
              </div>

              {/* Fast Track by Application ID Card */}
              <div className="lg:col-span-5 bg-[#123153] border border-blue-400/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    Track Without Login
                  </h3>
                  <p className="text-xs text-blue-200/80 mt-0.5">
                    Instantly check 9-step progress with your Application Number
                  </p>
                </div>

                <form onSubmit={handleQuickTrack} className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-blue-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={quickTrackQuery}
                      onChange={(e) => setQuickTrackQuery(e.target.value)}
                      placeholder="e.g. DL1234567890123 or LL4567891234567"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0A2540] text-white placeholder-blue-300/50 rounded-xl border border-blue-400/40 text-xs font-mono font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-400 active:scale-98 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition cursor-pointer"
                  >
                    <span>Check Application Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-2 border-t border-blue-400/20 text-[10px] text-blue-200/70 flex items-center justify-between">
                  <span>Demo ID: DL1234567890123</span>
                  <button
                    type="button"
                    onClick={() => setQuickTrackQuery('DL1234567890123')}
                    className="text-blue-300 underline font-bold cursor-pointer hover:text-white"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Logged In State: Active Applications Carousel */
            <>
              {/* Header Row */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 z-10 relative">
                <div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                    {t.myApplications}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-blue-200/70 hidden sm:block mt-0.5">
                    Track your active driving licence and permit applications in real-time
                  </p>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onViewAllApplications) {
                        onViewAllApplications();
                      } else {
                        onOpenDetails(applications[0]?.applicationId || 'DL1234567890123');
                      }
                    }}
                    className="text-xs sm:text-sm font-semibold text-blue-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>{t.viewAllApplications}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Carousel Viewport */}
              <div className="relative">
                
                {/* Desktop Left Carousel Arrow */}
                <button
                  type="button"
                  onClick={() => scrollByDirection('left')}
                  disabled={activeDot === 0}
                  className={`hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-slate-800 shadow-xl items-center justify-center z-20 transition-all cursor-pointer ${
                    activeDot === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                  }`}
                  aria-label="Previous Application"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Desktop Right Carousel Arrow */}
                <button
                  type="button"
                  onClick={() => scrollByDirection('right')}
                  disabled={activeDot >= 3}
                  className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-slate-800 shadow-xl items-center justify-center z-20 transition-all cursor-pointer ${
                    activeDot >= 3 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                  }`}
                  aria-label="Next Application"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Application Cards Container */}
                <div 
                  ref={carouselRef}
                  onScroll={handleScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-2 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 z-10 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  
                  {/* Dynamic Real Applications from Database / API */}
                  {applications.slice(0, 3).map((app) => {
                    const appId = app.applicationId || app.id || 'DL1234567890123';
                    const statusStr = (app.status || '').toLowerCase().replace(/_/g, '-');
                    const isApproved = statusStr.includes('approve') || statusStr.includes('complete');
                    const isUpcoming = statusStr.includes('upcom') || statusStr.includes('schedule');
                    const stepNum = app.stepNumber || app.currentStep || 6;
                    const formattedDate = app.submittedDate || app.approvedDate || (app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '14 May 2024');

                    if (isApproved) {
                      return (
                        <div 
                          key={appId}
                          onClick={() => onOpenDetails(appId)}
                          className="w-[76vw] max-w-[280px] md:w-auto flex-shrink-0 snap-start bg-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                        >
                          <div className="space-y-2.5 sm:space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="bg-[#E6F4EA] text-[#137333] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                {t.approved}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-bold">DigiLocker</span>
                            </div>

                            <div>
                              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-700 transition font-mono">
                                {appId}
                              </h3>
                              <p className="text-xs font-semibold text-slate-600">
                                {app.type || 'Renewal of DL'}
                              </p>
                              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                                Approved on {formattedDate}
                              </p>
                            </div>

                            <div className="pt-1">
                              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>{t.readyForDownload}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2.5 sm:pt-3 border-t border-slate-100 mt-2">
                            <button
                              type="button"
                              onClick={(e) => handleDownload(appId, e)}
                              className="text-xs font-bold text-[#0056D2] hover:text-[#0047b3] flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{downloadSuccess === appId ? 'Downloaded!' : t.downloadLicence}</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    if (isUpcoming) {
                      return (
                        <div 
                          key={appId}
                          onClick={onOpenAppointment}
                          className="w-[76vw] max-w-[280px] md:w-auto flex-shrink-0 snap-start bg-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                        >
                          <div className="space-y-2.5 sm:space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="bg-[#E8F0FE] text-[#1A73E8] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                {t.upcoming}
                              </span>
                              <span className="text-[10px] text-blue-600 font-bold">Track Slot</span>
                            </div>

                            <div>
                              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-700 transition font-mono">
                                {appId}
                              </h3>
                              <p className="text-xs font-semibold text-slate-600">
                                {app.type || 'Learner Licence (LMV)'}
                              </p>
                              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                                Test: 20 May, 10:30 AM
                              </p>
                            </div>

                            <div className="pt-1">
                              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-[#0056D2]" />
                                <span>ADTT Track Test Slot</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2.5 sm:pt-3 border-t border-slate-100 mt-2">
                            <span className="text-xs font-bold text-[#0056D2] group-hover:text-[#0047b3] flex items-center gap-1">
                              <span>View Appointment</span>
                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Default: In Progress
                    return (
                      <div 
                        key={appId}
                        onClick={() => onOpenDetails(appId)}
                        className="w-[76vw] max-w-[280px] md:w-auto flex-shrink-0 snap-start bg-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                      >
                        <div className="space-y-2.5 sm:space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="bg-[#E6F4EA] text-[#137333] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              {t.inProgress}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Step {stepNum}/9</span>
                          </div>

                          <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-700 transition font-mono">
                              {appId}
                            </h3>
                            <p className="text-xs font-semibold text-slate-600">
                              {app.type || 'Driving Licence (LMV)'}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                              Submitted on {formattedDate}
                            </p>
                          </div>

                          <div className="pt-1">
                            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#0056D2]" />
                              <span>{app.currentStepName || 'RTO Verification'}</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-[#137333] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, Math.max(15, (stepNum / 9) * 100))}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-right text-slate-500 mt-1 font-medium">
                              Step {stepNum} of 9
                            </p>
                          </div>
                        </div>

                        <div className="pt-2.5 sm:pt-3 border-t border-slate-100 mt-2">
                          <span className="text-xs font-bold text-[#0056D2] group-hover:text-[#0047b3] flex items-center gap-1">
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Card 4: New Application CTA */}
                  <div 
                    onClick={onOpenNewApplication}
                    className="w-[76vw] max-w-[280px] md:w-auto flex-shrink-0 snap-start bg-[#123153] hover:bg-[#163b65] border border-blue-400/20 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col items-center justify-center text-center space-y-3 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1E4976] group-hover:bg-[#0056D2] text-white flex items-center justify-center shadow-md transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {t.newApplication}
                      </h3>
                      <p className="text-xs text-blue-200/80">
                        Apply for a new service
                      </p>
                    </div>

                    <button
                      type="button"
                      className="bg-white hover:bg-slate-100 text-[#0A2540] px-4 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-md group-hover:shadow-lg transition cursor-pointer"
                    >
                      <span>{t.applyNow}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0056D2]" />
                    </button>
                  </div>

                </div>

                {/* Mobile Pagination Dot Indicator and Touch Controls */}
                <div className="md:hidden flex items-center justify-between pt-3 px-1">
                  {/* Pagination Dots */}
                  <div className="flex items-center space-x-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToCard(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          activeDot === idx ? 'w-5 bg-blue-400' : 'w-1.5 bg-blue-900/80 hover:bg-blue-600'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Arrow navigation buttons */}
                  <div className="flex items-center space-x-1.5 text-white">
                    <button
                      type="button"
                      onClick={() => scrollByDirection('left')}
                      disabled={activeDot === 0}
                      className={`w-7 h-7 rounded-full bg-blue-950/80 border border-blue-400/30 flex items-center justify-center text-blue-200 ${
                        activeDot === 0 ? 'opacity-40' : 'hover:bg-blue-900 active:scale-95'
                      }`}
                      aria-label="Previous card"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollByDirection('right')}
                      disabled={activeDot >= 3}
                      className={`w-7 h-7 rounded-full bg-blue-950/80 border border-blue-400/30 flex items-center justify-center text-blue-200 ${
                        activeDot >= 3 ? 'opacity-40' : 'hover:bg-blue-900 active:scale-95'
                      }`}
                      aria-label="Next card"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>

      </div>
    </section>
  );
};
