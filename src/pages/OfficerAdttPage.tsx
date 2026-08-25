import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Play, 
  Clock, 
  Video, 
  Activity, 
  Award, 
  ArrowRight,
  User,
  Phone,
  Sparkles,
  Gauge,
  Zap,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MOCK_APPLICATIONS } from '../data/mockData';

export const OfficerAdttPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [applications, setApplications] = useState<any[]>(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  
  // Track Live Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTrack, setActiveTrack] = useState<'PARKING' | 'S_BEND' | 'EIGHT' | 'GRADIENT'>('PARKING');
  const [trackScore, setTrackScore] = useState(96);
  const [faultCount, setFaultCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(48); // seconds
  const [actionInProgress, setActionInProgress] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await api.getApplications();
      if (res.success && res.applications && res.applications.length > 0) {
        setApplications(res.applications);
        if (!selectedCandidate) {
          setSelectedCandidate(res.applications[0]);
        }
      } else {
        setSelectedCandidate(MOCK_APPLICATIONS[0]);
      }
    } catch (err) {
      setSelectedCandidate(MOCK_APPLICATIONS[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateTrack = () => {
    setIsSimulating(true);
    setElapsedTime(15);
    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= 65) {
          clearInterval(interval);
          setIsSimulating(false);
          return 65;
        }
        return prev + 5;
      });
    }, 300);
  };

  const handleClearTestPass = async (candidate: any) => {
    if (!candidate) return;
    setActionInProgress(true);
    try {
      const res = await api.officerTakeAction(candidate.applicationId || candidate.id, 'TEST_PASS', {
        officerId: user?.id || 'OFFICER-JH01',
        remarks: `ADTT Skill Track Passed with Grade A (${trackScore}%). All sensor arrays cleared.`
      });

      if (res.success) {
        setNotification({
          type: 'success',
          message: `Candidate ${candidate.applicantName} CLEARED ADTT Track! Form 7B Skill Certificate Issued.`
        });
        await fetchCandidates();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to record track clearance in registry.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleRecordTestFail = async (candidate: any) => {
    if (!candidate) return;
    setActionInProgress(true);
    try {
      const res = await api.officerTakeAction(candidate.applicationId || candidate.id, 'REJECT', {
        officerId: user?.id || 'OFFICER-JH01',
        remarks: `ADTT Test Track Failed: Kerb boundary collision on Gradient track. Retest mandatory.`
      });

      if (res.success) {
        setNotification({
          type: 'error',
          message: `Test Failure recorded for ${candidate.applicantName}. 7-day retest cooling period assigned.`
        });
        await fetchCandidates();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to record test result.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-[#0B2545] to-[#0056D2] text-white border-blue-900'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Automated Test Track Desk
                </span>
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  12 Sensor Arrays Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                ADTT Automated Skill Test & Clearance Desk
              </h1>
              <p className="text-xs text-blue-100/80 dark:text-slate-300 mt-0.5">
                RTO Track Location: <strong>Ranchi Testing Track 01 (JH-01)</strong> • Track Inspector: <strong>{user?.name || 'Shri S. K. Verma (Senior MLO)'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={fetchCandidates}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Slot Queue</span>
            </button>
            <Link
              to="/officer-dashboard"
              className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-2 shadow-md ${
            notification.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-800 dark:text-rose-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Main Workdesk Grid: Candidates Queue (Left) + Live Track Telemetry (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Scheduled Candidates (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-5 rounded-3xl border shadow-md space-y-3 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b dark:border-slate-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Today's Track Candidates ({applications.length})
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                  Slot: 10:30 AM
                </span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {applications.map((cand) => {
                  const isSelected = selectedCandidate?.applicationId === cand.applicationId || selectedCandidate?.id === cand.id;
                  return (
                    <div
                      key={cand.id || cand.applicationId}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-950/70 border-[#0056D2] ring-2 ring-blue-200 dark:ring-blue-900' 
                          : darkMode ? 'bg-slate-900/60 border-slate-700 hover:bg-slate-750' : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-[#0056D2] dark:text-blue-400">
                          {cand.applicationId || cand.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          cand.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cand.status === 'APPROVED' ? 'PASSED' : 'ON TRACK'}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                        {cand.applicantName}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Vehicle: <strong>{cand.vehicleClass || 'LMV (Car)'}</strong> • Mobile: +91 {cand.mobile}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sensor Telemetry & Action Panel (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedCandidate ? (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                {/* Active Candidate Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-slate-700">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-black">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Active Test Taker</span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedCandidate.applicantName}</h3>
                      <p className="text-xs text-slate-400 font-mono">App ID: {selectedCandidate.applicationId || selectedCandidate.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSimulateTrack}
                      disabled={isSimulating}
                      className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0056D2] dark:text-blue-300 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSimulating ? 'Sensors Live...' : 'Simulate Run'}</span>
                    </button>
                  </div>
                </div>

                {/* 4 Sensor Array Sub-tracks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'PARKING', name: '1. Parallel Parking', score: '100%', status: 'CLEARED' },
                    { id: 'S_BEND', name: '2. Reverse "S" Bend', score: '95%', status: 'CLEARED' },
                    { id: 'EIGHT', name: '3. 8-Formation', score: '98%', status: 'CLEARED' },
                    { id: 'GRADIENT', name: '4. Gradient Up-Hill', score: '92%', status: 'CLEARED' }
                  ].map((tr) => (
                    <button
                      key={tr.id}
                      onClick={() => setActiveTrack(tr.id as any)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        activeTrack === tr.id 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <p className="text-[10px] font-bold opacity-80">{tr.name}</p>
                      <p className="text-sm font-black mt-0.5">{tr.score}</p>
                      <span className={`inline-block mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        activeTrack === tr.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {tr.status}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Live Camera & Telemetry Visualizer */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-6 text-white aspect-video flex flex-col justify-between shadow-2xl border border-slate-800">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-mono font-bold">CAM-04: OVERHEAD ADTT TRACK</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Timer: 00:{elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime}s / 120s</span>
                    </div>
                  </div>

                  {/* Telemetry Center Graphic */}
                  <div className="text-center space-y-2 z-10">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-pulse">
                      <Gauge className="w-8 h-8 text-emerald-300" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
                      Optical Kerb Sensors: ZERO VIOLATIONS
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Lateral Gap: 28.4 cm • Rollback: 0.0 cm • Speed: 8.2 km/h
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
                    <span>CCTV AI ID: MLO-RNC-01</span>
                    <span className="text-emerald-400 font-bold">GRADE A CLEARANCE PASS</span>
                  </div>
                </div>

                {/* Statutory Verdict Desk */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Evaluated Statutory Score
                    </span>
                    <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                      Score: {trackScore}/100 (Grade A Pass)
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                      Compliant with Central Motor Vehicles Rules (CMVR) Form 7B Automated Testing Norms.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRecordTestFail(selectedCandidate)}
                      disabled={actionInProgress}
                      className="px-4 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 hover:bg-rose-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Record Fail</span>
                    </button>

                    <button
                      onClick={() => handleClearTestPass(selectedCandidate)}
                      disabled={actionInProgress}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pass & Authorize Form 7B</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className={`p-12 text-center rounded-3xl border ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <Car className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-50" />
                <h3 className="text-base font-bold">Select a Candidate from the Queue</h3>
                <p className="text-xs text-slate-400 mt-1">Select an applicant from the left to review telemetry and issue skill clearance.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
