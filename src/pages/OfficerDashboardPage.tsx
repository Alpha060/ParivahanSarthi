import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  FileText, 
  Award, 
  Car, 
  Users, 
  Printer, 
  Send, 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  AlertCircle,
  Building2,
  Calendar,
  Phone,
  ArrowRight,
  SlidersHorizontal,
  Volume2,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MOCK_APPLICATIONS } from '../data/mockData';
import { DigitalLicenceCard } from '../components/DigitalLicenceCard';

export const OfficerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user, isLoggedIn } = useApp();

  const [activeTab, setActiveTab] = useState<'scrutiny' | 'driving-test' | 'tokens' | 'dispatch'>('scrutiny');
  const [applications, setApplications] = useState<any[]>(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  
  // Officer Action State
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [testScore, setTestScore] = useState('Grade A (95% - Track Clear)');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Counter Calling Queue
  const [currentToken, setCurrentToken] = useState<string>('TKN-104');
  const [callingState, setCallingState] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await api.getApplications();
      if (res.success && res.applications && res.applications.length > 0) {
        setApplications(res.applications);
      }
    } catch (err) {
      // fallback to mock
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveApplication = async (app: any) => {
    setActionInProgress(true);
    const appId = app.applicationId || app.id;
    try {
      // Optimistically update application status immediately
      setApplications(prev => prev.map(a => {
        if ((a.applicationId || a.id) === appId) {
          return {
            ...a,
            status: 'APPROVED',
            currentStep: 9,
            currentStepName: 'Driving Licence Issued & Dispatched',
            dlNumber: a.dlNumber || `JH01 2026${Math.floor(1000000 + Math.random() * 9000000)}`
          };
        }
        return a;
      }));

      setNotification({
        type: 'success',
        message: `Application ${appId} Approved! Driving Licence generated and dispatched to Smart Card Queue.`
      });

      await api.officerTakeAction(appId, 'APPROVE', {
        remarks: 'Approved by Senior Licensing Officer (JH-01). High security DL authorized.',
        officerId: user?.id || 'OFFICER-JH01'
      });

      setSelectedApp(null);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to process statutory approval.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleAdvanceStep = async (app: any) => {
    setActionInProgress(true);
    const appId = app.applicationId || app.id;
    try {
      setApplications(prev => prev.map(a => {
        if ((a.applicationId || a.id) === appId) {
          const nextStep = Math.min(9, (a.currentStep || 1) + 1);
          return {
            ...a,
            currentStep: nextStep,
            status: nextStep >= 8 ? 'APPROVED' : a.status
          };
        }
        return a;
      }));

      setNotification({
        type: 'success',
        message: `Application ${appId} advanced to next statutory milestone.`
      });

      await api.officerTakeAction(appId, 'ADVANCE_STEP', {
        remarks: officerRemarks || 'Document Scrutiny Verified. Biometrics cleared.',
        officerId: user?.id || 'OFFICER-JH01'
      });

      setSelectedApp(null);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to advance application step.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDrivingTestPass = async (app: any) => {
    setActionInProgress(true);
    const appId = app.applicationId || app.id;
    try {
      setApplications(prev => prev.map(a => {
        if ((a.applicationId || a.id) === appId) {
          return {
            ...a,
            status: 'APPROVED',
            currentStep: 8,
            currentStepName: 'DL Printing & Dispatch Queue',
            testScore: testScore
          };
        }
        return a;
      }));

      setNotification({
        type: 'success',
        message: `Candidate ${app.applicantName} marked PASSED (${testScore}). Form 7B endorsed!`
      });

      await api.officerTakeAction(appId, 'TEST_PASS', {
        testGrade: testScore,
        remarks: `ADTT Automated Driving Test passed successfully with ${testScore}.`,
        officerId: user?.id || 'OFFICER-JH01'
      });

      setSelectedApp(null);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to record test clearance.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleRejectApplication = async (app: any) => {
    if (!officerRemarks.trim()) {
      alert('Please enter statutory reason for discrepancy/rejection.');
      return;
    }

    setActionInProgress(true);
    try {
      const res = await api.officerTakeAction(app.applicationId || app.id, 'REJECT', {
        remarks: officerRemarks,
        officerId: user?.id || 'OFFICER-JH01'
      });

      if (res.success) {
        setNotification({
          type: 'error',
          message: `Application ${app.applicationId || app.id} marked with Discrepancy. Notice issued.`
        });
        setShowRejectModal(false);
        setOfficerRemarks('');
        await fetchApplications();
        setSelectedApp(null);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to record rejection.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCallNextToken = () => {
    setCallingState(true);
    const nextNum = Math.floor(100 + Math.random() * 899);
    setCurrentToken(`TKN-${nextNum}`);
    setTimeout(() => {
      setCallingState(false);
    }, 1500);
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      (app.applicationId || app.id || '').toLowerCase().includes(query) ||
      (app.applicantName || '').toLowerCase().includes(query) ||
      (app.mobile || '').toLowerCase().includes(query);

    const matchesClass = filterClass === 'all' ? true : (app.vehicleClass || '').toLowerCase().includes(filterClass.toLowerCase());
    return matchesQuery && matchesClass;
  });

  const pendingScrutiny = filteredApplications.filter(a => 
    a.status !== 'APPROVED' && 
    a.status !== 'REJECTED' && 
    a.status !== 'DRAFT_PAYMENT_PENDING' && 
    a.paymentStatus !== 'PENDING'
  );
  const approvedList = filteredApplications.filter(a => a.status === 'APPROVED');
  const drivingTestQueue = filteredApplications.filter(a => 
    a.status !== 'DRAFT_PAYMENT_PENDING' && 
    a.paymentStatus !== 'PENDING' && 
    ((a.currentStep >= 5 && a.currentStep <= 7) || a.status === 'UPCOMING')
  );

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Officer Identity & Jurisdiction Banner */}
        <div className={`rounded-3xl p-5 sm:p-7 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-gradient-to-r from-[#0B2545] to-[#0056D2] text-white border-blue-900'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Official MLO Console
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  NIC HSM Connected
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                RTO Officer Command & Scrutiny Portal
              </h1>
              <p className="text-xs text-blue-100/80 dark:text-slate-300 mt-0.5">
                Jurisdiction: <strong>{user?.rtoName || 'Ranchi Regional Transport Office (JH-01)'}</strong> • Licensing Officer: <strong>{user?.name || 'Shri S. K. Verma (Senior MLO)'}</strong> ({user?.employeeCode || 'GOV-JH-8492'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={fetchApplications}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync Records</span>
            </button>
            <Link
              to="/applications"
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Citizen View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Alert Notification */}
        {notification && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-2 shadow-md ${
            notification.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-800 dark:text-rose-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Live Counter & Queue Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/officer-scrutiny"
            className={`p-4 sm:p-5 rounded-2xl border shadow-sm transition hover:shadow-md hover:border-amber-400 group cursor-pointer block ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-bold tracking-wider">Awaiting Scrutiny</span>
              <FileText className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingScrutiny.length}</p>
              <span className="text-[10px] font-bold text-amber-600 group-hover:underline">Open Queue →</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Form 2 & Form 4 filings</span>
          </Link>

          <Link
            to="/officer-adtt"
            className={`p-4 sm:p-5 rounded-2xl border shadow-sm transition hover:shadow-md hover:border-blue-400 group cursor-pointer block ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-bold tracking-wider">Test Track Slots</span>
              <Car className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{drivingTestQueue.length}</p>
              <span className="text-[10px] font-bold text-blue-600 group-hover:underline">Open Track →</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">ADTT Automated Skill Track</span>
          </Link>

          <Link
            to="/officer-dl-dispatch"
            className={`p-4 sm:p-5 rounded-2xl border shadow-sm transition hover:shadow-md hover:border-emerald-400 group cursor-pointer block ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-bold tracking-wider">Approved Licences</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{approvedList.length}</p>
              <span className="text-[10px] font-bold text-emerald-600 group-hover:underline">Open Dispatch →</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Smart Card DLs Authorized</span>
          </Link>

          <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-bold tracking-wider">Calling Token Counter</span>
              <Volume2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{currentToken}</p>
              <button
                onClick={handleCallNextToken}
                disabled={callingState}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase hover:bg-indigo-100 transition cursor-pointer"
              >
                {callingState ? 'Calling...' : 'Call Next'}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Counter 01 (Biometric Desk)</span>
          </div>
        </div>

        {/* Main Workdesk Area */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          
          {/* Navigation Module Tabs */}
          <div className="flex items-center space-x-2 p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => { setActiveTab('scrutiny'); setSelectedApp(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer flex-shrink-0 ${
                activeTab === 'scrutiny'
                  ? 'bg-[#0056D2] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Document Scrutiny ({pendingScrutiny.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('driving-test'); setSelectedApp(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer flex-shrink-0 ${
                activeTab === 'driving-test'
                  ? 'bg-[#0056D2] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>ADTT Driving Test Track ({drivingTestQueue.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('dispatch'); setSelectedApp(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer flex-shrink-0 ${
                activeTab === 'dispatch'
                  ? 'bg-[#0056D2] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Smart Card DL Dispatch ({approvedList.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('tokens'); setSelectedApp(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer flex-shrink-0 ${
                activeTab === 'tokens'
                  ? 'bg-[#0056D2] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Physical Counter Tokens</span>
            </button>
          </div>

          {/* Search & Class Filter Bar */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by App ID, Name, Mobile..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:outline-hidden focus:border-[#0056D2]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"
              >
                <option value="all">All Vehicle Categories</option>
                <option value="LMV">LMV (Car / Light Motor)</option>
                <option value="MCWG">MCWG (Motorcycle with Gear)</option>
                <option value="TRANS">Commercial Transport</option>
              </select>
            </div>
          </div>

          {/* TAB 1: Document Scrutiny Queue */}
          {activeTab === 'scrutiny' && (
            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3 px-3">Application Number</th>
                      <th className="pb-3 px-3">Applicant Dossier</th>
                      <th className="pb-3 px-3">Service & Class</th>
                      <th className="pb-3 px-3">Current Step</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Officer Statutory Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {pendingScrutiny.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                          <p className="font-bold text-sm">No Pending Scrutiny Filings</p>
                          <p className="text-xs">All submitted applications in Ranchi RTO have been verified.</p>
                        </td>
                      </tr>
                    ) : (
                      pendingScrutiny.map((app) => (
                        <tr key={app.id || app.applicationId} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/30 transition">
                          <td className="py-4 px-3 font-mono font-bold text-[#0056D2] dark:text-blue-400">
                            {app.applicationId || app.id}
                            <span className="block text-[10px] font-sans text-slate-400 font-normal">
                              {new Date(app.submittedAt || Date.now()).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <strong className="text-slate-900 dark:text-white block font-bold">{app.applicantName || 'Citizen Applicant'}</strong>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {app.mobile || '9876543210'}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{app.type || 'Driving Licence'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold inline-block mt-0.5">
                              {app.vehicleClass || 'LMV'}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-bold text-amber-600 dark:text-amber-400 block">Step {app.currentStep || 3} of 9</span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                              {app.currentStepName || 'Document Scrutiny'}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              {app.status || 'IN_PROGRESS'}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleAdvanceStep(app)}
                                disabled={actionInProgress}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0056D2] dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
                              >
                                Advance Step
                              </button>
                              <button
                                onClick={() => handleApproveApplication(app)}
                                disabled={actionInProgress}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black transition shadow-sm hover:shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Approve DL</span>
                              </button>
                              <button
                                onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                                title="Raise Discrepancy / Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADTT Driving Skill Test Clearance */}
          {activeTab === 'driving-test' && (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Car className="w-6 h-6 text-[#0056D2] flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Automated Driving Test Track (ADTT) Integration</strong>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                      Ranchi Track 01 (Parallel Park, Gradient Start, 8-Figure Track Sensors Online)
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  Sensor Array Live
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drivingTestQueue.map((candidate) => (
                  <div 
                    key={candidate.id || candidate.applicationId}
                    className={`p-5 rounded-2xl border shadow-sm transition space-y-4 ${
                      darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Application Number</span>
                        <h4 className="font-mono font-bold text-sm text-[#0056D2] dark:text-blue-400">
                          {candidate.applicationId || candidate.id}
                        </h4>
                        <strong className="text-slate-900 dark:text-white text-base block mt-1">
                          {candidate.applicantName || 'Citizen Driver'}
                        </strong>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-[#0056D2]">
                        {candidate.vehicleClass || 'LMV'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-200 dark:border-slate-700 py-3">
                      <div>
                        <span className="text-slate-400">Mobile:</span>
                        <p className="font-bold">{candidate.mobile || '9876543210'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Test Category:</span>
                        <p className="font-bold">Form 7B Skill Eval</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Sensor Evaluation Score / Grade
                      </label>
                      <select 
                        value={testScore}
                        onChange={(e) => setTestScore(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                      >
                        <option value="Grade A (95% - Track Clear)">Grade A (95% - Reverse S + Gradient Cleared)</option>
                        <option value="Grade B (84% - Single Marker Touch)">Grade B (84% - Satisfactory Control)</option>
                        <option value="Grade C (72% - Minor Stalling)">Grade C (72% - Pass with Caution)</option>
                        <option value="Failed (Sensor Curb Violation)">Failed (Sensor Curb Violation)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleDrivingTestPass(candidate)}
                        disabled={actionInProgress}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Clear Test & Issue DL</span>
                      </button>
                      <button
                        onClick={() => { setSelectedApp(candidate); setShowRejectModal(true); }}
                        className="px-4 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer transition"
                      >
                        Fail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Smart Card DL Dispatch */}
          {activeTab === 'dispatch' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3 px-3">DL Number</th>
                      <th className="pb-3 px-3">Licence Holder</th>
                      <th className="pb-3 px-3">Vehicle Classes</th>
                      <th className="pb-3 px-3">Approval Date</th>
                      <th className="pb-3 px-3">India Post Tracking</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {approvedList.map((app) => (
                      <tr key={app.id || app.applicationId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="py-4 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {`JH-01-2024-${(app.applicationId || '9283719').slice(-7)}`}
                        </td>
                        <td className="py-4 px-3">
                          <strong className="text-slate-900 dark:text-white">{app.applicantName || 'Krishna Mahto'}</strong>
                          <span className="text-[10px] text-slate-400 block">{app.rtoName || 'Ranchi RTO (JH-01)'}</span>
                        </td>
                        <td className="py-4 px-3 font-bold text-slate-700 dark:text-slate-300">
                          {app.vehicleClass || 'LMV, MCWG'}
                        </td>
                        <td className="py-4 px-3 text-slate-500">
                          {new Date(app.approvedAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-3 font-mono text-[11px] text-blue-600 font-bold">
                          {`EP${Math.floor(100000000 + Math.random() * 900000000)}IN`}
                        </td>
                        <td className="py-4 px-3 text-right">
                          <Link
                            to={`/status?appId=${app.applicationId || app.id}`}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0056D2] font-bold text-xs hover:bg-blue-100 transition inline-flex items-center gap-1"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Physical Token Caller Desk */}
          {activeTab === 'tokens' && (
            <div className="p-6 text-center space-y-6">
              <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  Live Public Display Board
                </span>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold">Now Calling at Counter 01</span>
                  <h2 className="text-5xl font-black text-amber-400 font-mono tracking-widest mt-2 animate-pulse">
                    {currentToken}
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Citizen Biometrics & Physical Document Scrutiny Desk
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleCallNextToken}
                    disabled={callingState}
                    className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{callingState ? 'Announcing Token...' : 'Call Next Token'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Discrepancy / Rejection Modal */}
        {showRejectModal && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-700">
                <div className="flex items-center space-x-2 text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Issue Discrepancy / Rejection Notice
                  </h3>
                </div>
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Application: <strong>{selectedApp.applicationId || selectedApp.id}</strong> ({selectedApp.applicantName})
                </p>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Statutory Reason / Discrepancy Details *
                </label>
                <textarea
                  rows={4}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder="e.g., Medical Certificate (Form 1A) signature missing or ADTT Sensor boundary violated on gradient track..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectApplication(selectedApp)}
                  disabled={actionInProgress}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {actionInProgress ? 'Recording...' : 'Confirm Notice'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
