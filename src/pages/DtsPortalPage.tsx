import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Search, 
  UserPlus, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  Download, 
  Calendar, 
  User, 
  Sparkles, 
  ArrowRight,
  Gauge,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface StudentTrainee {
  id: string;
  applicationId: string;
  name: string;
  mobile: string;
  vehicleClass: string;
  enrolledDate: string;
  theoryHours: number;      // Mandatory: 8 hrs
  practicalHours: number;   // Mandatory: 21 hrs
  status: 'IN_TRAINING' | 'CERTIFIED' | 'COMPLETED';
  certNumber?: string;
  issuedAt?: string;
}

const INITIAL_STUDENTS: StudentTrainee[] = [
  {
    id: 'STU-001',
    applicationId: 'DL1234567890123',
    name: 'Krishna Mahto',
    mobile: '9876543210',
    vehicleClass: 'LMV (Light Motor Vehicle - Car)',
    enrolledDate: '01 Aug 2026',
    theoryHours: 8,
    practicalHours: 21,
    status: 'COMPLETED'
  },
  {
    id: 'STU-002',
    applicationId: 'LL4567891234567',
    name: 'Rohit Verma',
    mobile: '9877665544',
    vehicleClass: 'LMV & MCWG',
    enrolledDate: '10 Aug 2026',
    theoryHours: 6,
    practicalHours: 14,
    status: 'IN_TRAINING'
  },
  {
    id: 'STU-003',
    applicationId: 'DL9876543210987',
    name: 'Ananya Sharma',
    mobile: '9811223344',
    vehicleClass: 'LMV (Motor Car)',
    enrolledDate: '15 Jul 2026',
    theoryHours: 8,
    practicalHours: 21,
    status: 'CERTIFIED',
    certNumber: 'FORM5B-JH01-2026-003912',
    issuedAt: '22 Aug 2026, 04:15 PM'
  }
];

export const DtsPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [students, setStudents] = useState<StudentTrainee[]>(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<StudentTrainee>(INITIAL_STUDENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleIssueForm5B = async (student: StudentTrainee) => {
    setIsIssuing(true);
    await new Promise((r) => setTimeout(r, 600));

    const certNo = `FORM5B-JH01-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const updated = students.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          status: 'CERTIFIED' as const,
          certNumber: certNo,
          issuedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
      }
      return s;
    });

    setStudents(updated);
    setSelectedStudent(updated.find(s => s.id === student.id)!);
    setIsIssuing(false);

    setNotification({
      type: 'success',
      message: `Form 5B Driving Skill Certificate ${certNo} issued! Student is granted RTO Test Exemption.`
    });
    setTimeout(() => setNotification(null), 4500);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.mobile.includes(searchQuery)
  );

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* DTS Header Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-[#1B3B2B] via-[#2D5A43] to-[#0056D2] text-white border-emerald-900'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Accredited Driver Training Centre (ADTC)
                </span>
                <span className="text-xs text-emerald-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CMVR Rule 31B Accredited
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Accredited Driving Training School (DTS) Portal
              </h1>
              <p className="text-xs text-emerald-100/80 dark:text-slate-300 mt-0.5">
                Institute: <strong>{user?.name || 'Maruti Suzuki Driving Training Centre (Ranchi)'}</strong> • Code: <strong>{user?.dtsCode || 'ADTC-JH01-2022-048'}</strong>
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

        {/* Rule 31B Statutory Alert */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-3">
          <Award className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong>Statutory Exemption Provision (CMVR Rule 31B):</strong> Candidates who successfully complete the 29-hour curriculum and receive a digital <strong>Form 5B Driving Skill Certificate</strong> from this accredited centre are <strong>exempted from the physical driving test</strong> at the RTO.
          </p>
        </div>

        {/* Global Alert Notification */}
        {notification && (
          <div className="p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-2 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Enrolled Students</p>
              <h3 className="text-2xl font-black mt-0.5">{students.length}</h3>
              <p className="text-[10px] text-slate-400">Active Curriculum</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Form 5B Certificates Issued</p>
              <h3 className="text-2xl font-black mt-0.5">{students.filter(s => s.status === 'CERTIFIED').length}</h3>
              <p className="text-[10px] text-slate-400">RTO Test Exempted</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Simulator Grid</p>
              <h3 className="text-2xl font-black mt-0.5 text-purple-600">4 Bays Active</h3>
              <p className="text-[10px] text-slate-400">MoRTH Telemetry Connected</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 text-purple-600 flex items-center justify-center">
              <Gauge className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Workdesk Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Student Roster (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-5 rounded-3xl border shadow-md space-y-3 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b dark:border-slate-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Enrolled Trainees ({filteredStudents.length})
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  Active Batch
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student, mobile, app ID..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredStudents.map((stu) => {
                  const isSelected = selectedStudent?.id === stu.id;
                  const totalHrs = stu.theoryHours + stu.practicalHours;
                  const isCompleted = totalHrs >= 29;

                  return (
                    <div
                      key={stu.id}
                      onClick={() => setSelectedStudent(stu)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900' 
                          : darkMode ? 'bg-slate-900/60 border-slate-700 hover:bg-slate-750' : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {stu.applicationId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          stu.status === 'CERTIFIED' 
                            ? 'bg-blue-100 text-blue-800' 
                            : isCompleted 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {stu.status === 'CERTIFIED' ? 'FORM 5B ISSUED' : isCompleted ? '29 HRS COMPLETED' : `${totalHrs}/29 HRS`}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                        {stu.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {stu.vehicleClass} • +91 {stu.mobile}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Training Progress & Certification Console (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedStudent && (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                {/* Student Overview Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-slate-700">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center font-black">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Student Trainee Record</span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        App ID: {selectedStudent.applicationId} • Enrolled: {selectedStudent.enrolledDate}
                      </p>
                    </div>
                  </div>

                  {selectedStudent.status === 'CERTIFIED' && (
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs">
                      <p className="font-bold flex items-center gap-1">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Form 5B Certificate Issued</span>
                      </p>
                      <p className="font-mono text-[10px] mt-0.5">{selectedStudent.certNumber}</p>
                    </div>
                  )}
                </div>

                {/* 29-Hour Statutory Curriculum Tracker */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Statutory 29-Hour Training Progress Tracker (CMVR Rule 31B)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Theory & Simulation */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200">1. Theory & Motion Simulator</span>
                        <strong className="text-emerald-600 font-mono">{selectedStudent.theoryHours} / 8 Hours</strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${(selectedStudent.theoryHours / 8) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">Road Safety Rules, Mechanical Diagnostics & Night Simulation</p>
                    </div>

                    {/* Dual-Control Practical Driving */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200">2. Practical Dual-Control Driving</span>
                        <strong className="text-emerald-600 font-mono">{selectedStudent.practicalHours} / 21 Hours</strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${(selectedStudent.practicalHours / 21) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">City Traffic, Parallel Parking, Hill Climbing & Reversing</p>
                    </div>
                  </div>
                </div>

                {/* Form 5B Issuance Card */}
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      CMVR Form 5B Driving Skill Certificate Desk
                    </span>
                    <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-100 mt-0.5">
                      Total Curriculum: {selectedStudent.theoryHours + selectedStudent.practicalHours}/29 Hours (100% Completed)
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                      Authorizing this certificate will sync with Sarathi and grant test exemption for {selectedStudent.name}.
                    </p>
                  </div>

                  {selectedStudent.status !== 'CERTIFIED' ? (
                    <button
                      onClick={() => handleIssueForm5B(selectedStudent)}
                      disabled={isIssuing || (selectedStudent.theoryHours + selectedStudent.practicalHours < 29)}
                      className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer flex-shrink-0 disabled:opacity-50"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isIssuing ? 'Generating Form 5B...' : 'Issue Form 5B Certificate'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Form 5B Synced to NIC</span>
                      </span>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
