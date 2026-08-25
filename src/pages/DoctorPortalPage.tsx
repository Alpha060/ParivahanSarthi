import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Eye, 
  Activity, 
  CheckCircle2, 
  Search, 
  FileCheck, 
  ShieldCheck, 
  Download, 
  Printer, 
  AlertCircle,
  User,
  Heart,
  FileText,
  Award,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_APPLICATIONS } from '../data/mockData';

interface MedicalCandidate {
  id: string;
  applicationId: string;
  name: string;
  age: number;
  gender: string;
  mobile: string;
  vehicleCategory: string;
  purpose: string;
  status: 'PENDING_EXAM' | 'CERTIFIED' | 'REJECTED';
  examinedAt?: string;
  certNumber?: string;
  vision: {
    distantRight: string;
    distantLeft: string;
    nearRight: string;
    nearLeft: string;
    colorBlindness: 'NORMAL' | 'DEFICIENT';
    nightBlindness: 'ABSENT' | 'PRESENT';
  };
  general: {
    bloodPressure: string;
    hearing: 'NORMAL' | 'IMPAIRED';
    epilepsy: 'NO' | 'YES';
    fitForDriving: boolean;
  };
}

const INITIAL_CANDIDATES: MedicalCandidate[] = [
  {
    id: 'MED-001',
    applicationId: 'DL1234567890123',
    name: 'Krishna Mahto',
    age: 45,
    gender: 'Male',
    mobile: '9876543210',
    vehicleCategory: 'LMV (Light Motor Vehicle) & MCWG',
    purpose: 'Driving Licence Renewal (Age 40+ Statutory Rule)',
    status: 'PENDING_EXAM',
    vision: {
      distantRight: '6/6',
      distantLeft: '6/6',
      nearRight: 'N.6',
      nearLeft: 'N.6',
      colorBlindness: 'NORMAL',
      nightBlindness: 'ABSENT'
    },
    general: {
      bloodPressure: '120/80',
      hearing: 'NORMAL',
      epilepsy: 'NO',
      fitForDriving: true
    }
  },
  {
    id: 'MED-002',
    applicationId: 'LL4567891234567',
    name: 'Rohit Verma',
    age: 38,
    gender: 'Male',
    mobile: '9877665544',
    vehicleCategory: 'HMV (Heavy Commercial Transport)',
    purpose: 'Commercial Transport Vehicle Driver Endorsement',
    status: 'PENDING_EXAM',
    vision: {
      distantRight: '6/6',
      distantLeft: '6/9',
      nearRight: 'N.6',
      nearLeft: 'N.6',
      colorBlindness: 'NORMAL',
      nightBlindness: 'ABSENT'
    },
    general: {
      bloodPressure: '124/82',
      hearing: 'NORMAL',
      epilepsy: 'NO',
      fitForDriving: true
    }
  },
  {
    id: 'MED-003',
    applicationId: 'DL9876543210987',
    name: 'Ananya Sharma',
    age: 52,
    gender: 'Female',
    mobile: '9811223344',
    vehicleCategory: 'LMV (Private Car)',
    purpose: 'Mandatory 5-Year Senior Medical Renewal',
    status: 'CERTIFIED',
    examinedAt: '24 Aug 2026, 11:30 AM',
    certNumber: 'FORM1A-JH-2026-004819',
    vision: {
      distantRight: '6/6 (with glasses)',
      distantLeft: '6/6 (with glasses)',
      nearRight: 'N.6',
      nearLeft: 'N.6',
      colorBlindness: 'NORMAL',
      nightBlindness: 'ABSENT'
    },
    general: {
      bloodPressure: '118/76',
      hearing: 'NORMAL',
      epilepsy: 'NO',
      fitForDriving: true
    }
  }
];

export const DoctorPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [candidates, setCandidates] = useState<MedicalCandidate[]>(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<MedicalCandidate>(INITIAL_CANDIDATES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Diagnostic Form inputs
  const [distantRight, setDistantRight] = useState('6/6');
  const [distantLeft, setDistantLeft] = useState('6/6');
  const [nearRight, setNearRight] = useState('N.6');
  const [nearLeft, setNearLeft] = useState('N.6');
  const [colorBlindness, setColorBlindness] = useState<'NORMAL' | 'DEFICIENT'>('NORMAL');
  const [nightBlindness, setNightBlindness] = useState<'ABSENT' | 'PRESENT'>('ABSENT');
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [hearing, setHearing] = useState<'NORMAL' | 'IMPAIRED'>('NORMAL');
  const [fitForDriving, setFitForDriving] = useState(true);

  const handleSelectCandidate = (cand: MedicalCandidate) => {
    setSelectedCandidate(cand);
    setDistantRight(cand.vision.distantRight);
    setDistantLeft(cand.vision.distantLeft);
    setNearRight(cand.vision.nearRight);
    setNearLeft(cand.vision.nearLeft);
    setColorBlindness(cand.vision.colorBlindness);
    setNightBlindness(cand.vision.nightBlindness);
    setBloodPressure(cand.general.bloodPressure);
    setHearing(cand.general.hearing);
    setFitForDriving(cand.general.fitForDriving);
  };

  const handleSignForm1A = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    setIsSigning(true);
    await new Promise((r) => setTimeout(r, 600));

    const certNo = `FORM1A-JH-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedList = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return {
          ...c,
          status: 'CERTIFIED' as const,
          examinedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          certNumber: certNo,
          vision: {
            distantRight,
            distantLeft,
            nearRight,
            nearLeft,
            colorBlindness,
            nightBlindness
          },
          general: {
            bloodPressure,
            hearing,
            epilepsy: 'NO' as const,
            fitForDriving
          }
        };
      }
      return c;
    });

    setCandidates(updatedList);
    setSelectedCandidate(updatedList.find(c => c.id === selectedCandidate.id)!);
    setIsSigning(false);

    setNotification({
      type: 'success',
      message: `Form 1A Medical Fitness Certificate ${certNo} digitally signed for ${selectedCandidate.name}!`
    });
    setTimeout(() => setNotification(null), 4500);
  };

  const filteredCandidates = candidates.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.applicationId.toLowerCase().includes(q) || c.mobile.includes(q);
  });

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Doctor Header Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-[#003B46] via-[#07575B] to-[#0056D2] text-white border-teal-900'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-300/20 border border-teal-300/40 text-teal-200 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-teal-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  MoRTH Medical Council Portal
                </span>
                <span className="text-xs text-teal-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CMVR Form 1A Authorized
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Registered Medical Practitioner Form 1A Desk
              </h1>
              <p className="text-xs text-teal-100/80 dark:text-slate-300 mt-0.5">
                Medical Examiner: <strong>{user?.name || 'Dr. Anjali Mehta, MBBS, MS'}</strong> • Reg No: <strong>{user?.nmcRegNo || 'NMC-MCI/2014/84920 (State Medical Council)'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Link
              to="/login"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <span>Switch Persona</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Alert Notification */}
        {notification && (
          <div className="p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-2 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Awaiting Examination</p>
              <h3 className="text-2xl font-black mt-0.5">{candidates.filter(c => c.status === 'PENDING_EXAM').length}</h3>
              <p className="text-[10px] text-slate-400">Age 40+ & Commercial Drivers</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Form 1A Certificates Issued</p>
              <h3 className="text-2xl font-black mt-0.5">{candidates.filter(c => c.status === 'CERTIFIED').length}</h3>
              <p className="text-[10px] text-slate-400">Cryptographically Signed</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">NMC Medical Grid</p>
              <h3 className="text-2xl font-black mt-0.5 text-teal-600">Active Sync</h3>
              <p className="text-[10px] text-slate-400">Sec 8(3) Motor Vehicles Act</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 text-teal-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Workdesk Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Candidate Queue (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-5 rounded-3xl border shadow-md space-y-3 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b dark:border-slate-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Medical Examinees ({filteredCandidates.length})
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold">
                  Live Queue
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, mobile, app ID..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredCandidates.map((cand) => {
                  const isSelected = selectedCandidate?.id === cand.id;
                  return (
                    <div
                      key={cand.id}
                      onClick={() => handleSelectCandidate(cand)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        isSelected 
                          ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 ring-2 ring-teal-200 dark:ring-teal-900' 
                          : darkMode ? 'bg-slate-900/60 border-slate-700 hover:bg-slate-750' : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400">
                          {cand.applicationId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          cand.status === 'CERTIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cand.status === 'CERTIFIED' ? 'FORM 1A SIGNED' : 'PENDING EXAM'}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                        {cand.name} ({cand.age} yrs • {cand.gender})
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {cand.purpose}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic & Digital Signature Console (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedCandidate && (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                {/* Candidate Overview Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-slate-700">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 flex items-center justify-center font-black">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Applicant Dossier</span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedCandidate.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        App ID: {selectedCandidate.applicationId} • Mobile: +91 {selectedCandidate.mobile}
                      </p>
                    </div>
                  </div>

                  {selectedCandidate.status === 'CERTIFIED' && (
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs">
                      <p className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Form 1A Certificate Issued</span>
                      </p>
                      <p className="font-mono text-[10px] mt-0.5">{selectedCandidate.certNumber}</p>
                    </div>
                  )}
                </div>

                {/* Form 1A Diagnostic Form */}
                <form onSubmit={handleSignForm1A} className="space-y-6">
                  
                  {/* Section 1: Vision Diagnostics */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      <Eye className="w-4 h-4" />
                      <span>1. Visual Acuity & Ophthalmic Diagnostics</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Distant Vision (Right)</label>
                        <select
                          value={distantRight}
                          onChange={(e) => setDistantRight(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                        >
                          <option value="6/6">6/6 (Normal)</option>
                          <option value="6/6 (with glasses)">6/6 (with glasses)</option>
                          <option value="6/9">6/9</option>
                          <option value="6/12">6/12</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Distant Vision (Left)</label>
                        <select
                          value={distantLeft}
                          onChange={(e) => setDistantLeft(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                        >
                          <option value="6/6">6/6 (Normal)</option>
                          <option value="6/6 (with glasses)">6/6 (with glasses)</option>
                          <option value="6/9">6/9</option>
                          <option value="6/12">6/12</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Ishihara Color Test</label>
                        <select
                          value={colorBlindness}
                          onChange={(e) => setColorBlindness(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                        >
                          <option value="NORMAL">Normal (No Defect)</option>
                          <option value="DEFICIENT">Red-Green Deficient</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Night Blindness</label>
                        <select
                          value={nightBlindness}
                          onChange={(e) => setNightBlindness(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                        >
                          <option value="ABSENT">Absent (Clear)</option>
                          <option value="PRESENT">Present (Defect)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: General Physical Fitness */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      <Heart className="w-4 h-4" />
                      <span>2. General Physical & Cardio-Auditory Fitness</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Blood Pressure (mmHg)</label>
                        <input
                          type="text"
                          value={bloodPressure}
                          onChange={(e) => setBloodPressure(e.target.value)}
                          placeholder="120/80"
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Hearing Acuity</label>
                        <select
                          value={hearing}
                          onChange={(e) => setHearing(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                        >
                          <option value="NORMAL">Normal (Hear voice at 6m)</option>
                          <option value="IMPAIRED">Impaired</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Final Medical Clearance</label>
                        <select
                          value={fitForDriving ? 'FIT' : 'UNFIT'}
                          onChange={(e) => setFitForDriving(e.target.value === 'FIT')}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold"
                        >
                          <option value="FIT">FIT TO DRIVE</option>
                          <option value="UNFIT">UNFIT TO DRIVE</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Certification & Sign CTA */}
                  <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                        Statutory Medical Declaration (Rule 5(1) CMVR 1989)
                      </p>
                      <p className="text-xs text-teal-900 dark:text-teal-100 font-semibold mt-0.5">
                        I certify that I have personally examined the applicant and found them fit to hold a driving licence.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSigning}
                      className="px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer flex-shrink-0"
                    >
                      <Lock className="w-4 h-4 text-teal-200" />
                      <span>{isSigning ? 'Signing Certificate...' : 'Cryptographically Sign Form 1A'}</span>
                    </button>
                  </div>

                </form>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
