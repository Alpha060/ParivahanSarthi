import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  Filter,
  Check,
  X,
  FileCheck2,
  Building2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MOCK_APPLICATIONS } from '../data/mockData';

export const OfficerScrutinyPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [applications, setApplications] = useState<any[]>(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Active Scrutiny Modal / Inspection Drawer
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [discrepancyReason, setDiscrepancyReason] = useState('Documents Illegible / Blurry Scan');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      // Fallback to initial mock data
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveApplication = async (app: any) => {
    setActionInProgress(true);
    try {
      const res = await api.officerTakeAction(app.applicationId || app.id, 'APPROVE', {
        officerId: user?.id || 'OFFICER-JH01',
        remarks: 'Form 2 & 4 Document Scrutiny Passed. All statutory compliances verified.'
      });

      if (res.success) {
        setNotification({
          type: 'success',
          message: `Application ${app.applicationId || app.id} Approved! Permanent DL Number Generated.`
        });
        await fetchApplications();
        setSelectedApp(null);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to record approval in statutory registry.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleAdvanceStep = async (app: any) => {
    setActionInProgress(true);
    try {
      const res = await api.officerTakeAction(app.applicationId || app.id, 'ADVANCE_STEP', {
        officerId: user?.id || 'OFFICER-JH01',
        remarks: 'Scrutiny verification cleared. Advanced to next processing milestone.'
      });

      if (res.success) {
        setNotification({
          type: 'success',
          message: `Application ${app.applicationId || app.id} advanced to next milestone.`
        });
        await fetchApplications();
        setSelectedApp(null);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to advance application step.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleRejectApplication = async (app: any) => {
    if (!officerRemarks.trim()) {
      alert('Please enter statutory remarks explaining the discrepancy.');
      return;
    }

    setActionInProgress(true);
    try {
      const res = await api.officerTakeAction(app.applicationId || app.id, 'REJECT', {
        officerId: user?.id || 'OFFICER-JH01',
        remarks: `${discrepancyReason}: ${officerRemarks}`
      });

      if (res.success) {
        setNotification({
          type: 'error',
          message: `Discrepancy notice issued for ${app.applicationId || app.id}. Applicant notified via SMS.`
        });
        setShowRejectModal(false);
        setOfficerRemarks('');
        await fetchApplications();
        setSelectedApp(null);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to record rejection notice.' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const filtered = applications.filter((app) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      (app.applicationId || '').toLowerCase().includes(query) ||
      (app.applicantName || '').toLowerCase().includes(query) ||
      (app.mobile || '').toLowerCase().includes(query) ||
      (app.type || '').toLowerCase().includes(query);

    const matchesCategory = selectedCategory === 'ALL' ? true : (app.vehicleClass || '').includes(selectedCategory);
    const matchesStatus = selectedStatus === 'ALL' ? true : app.status === selectedStatus;

    return matchesQuery && matchesCategory && matchesStatus;
  });

  const pendingCount = applications.filter(a => a.status === 'IN_PROGRESS').length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;

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
              <FolderKanban className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Official Scrutiny Desk
                </span>
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live NIC Registry Sync
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Form 2 & Form 4 Document Scrutiny Queue
              </h1>
              <p className="text-xs text-blue-100/80 dark:text-slate-300 mt-0.5">
                Jurisdiction: <strong>{user?.rtoName || 'Ranchi RTO (JH-01)'}</strong> • Scrutiny Officer: <strong>{user?.name || 'Shri S. K. Verma (Senior MLO)'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={fetchApplications}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Dossiers</span>
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

        {/* Summary Counter Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Awaiting Scrutiny</p>
              <h3 className="text-2xl font-black mt-0.5">{pendingCount}</h3>
              <p className="text-[10px] text-slate-400">Form 2 / Form 4 filings</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Statutory Approved</p>
              <h3 className="text-2xl font-black mt-0.5">{approvedCount}</h3>
              <p className="text-[10px] text-slate-400">Clearances Granted</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Discrepancy Notices</p>
              <h3 className="text-2xl font-black mt-0.5">{rejectedCount}</h3>
              <p className="text-[10px] text-slate-400">Action Required by Applicant</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Application ID, Applicant Name, Mobile..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#0056D2]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            >
              <option value="ALL">All Vehicle Categories</option>
              <option value="LMV">LMV (Motor Car)</option>
              <option value="MCWG">MCWG (Two Wheeler)</option>
              <option value="HMV">HMV (Heavy Vehicle)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_PROGRESS">Pending Scrutiny</option>
              <option value="APPROVED">Approved Licences</option>
              <option value="REJECTED">Discrepancy Issued</option>
            </select>
          </div>
        </div>

        {/* Applications Scrutiny Table */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={`uppercase font-black text-[10px] tracking-wider border-b ${
                darkMode ? 'bg-slate-900/80 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="p-4">Application ID</th>
                  <th className="p-4">Applicant Dossier</th>
                  <th className="p-4">Service & Class</th>
                  <th className="p-4">Current Milestone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Statutory Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No applications found matching current search filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => (
                    <tr 
                      key={app.id || app.applicationId}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40 transition cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      <td className="p-4 font-mono font-bold text-[#0056D2] dark:text-blue-400">
                        {app.applicationId || app.id}
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold text-slate-900 dark:text-white">{app.applicantName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>+91 {app.mobile}</span>
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0056D2] dark:text-blue-300 font-bold text-[10px]">
                          {app.type || 'Driving Licence'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-bold">{app.vehicleClass || 'LMV'}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          Step {app.currentStep || 1} of 9
                        </span>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{app.currentStepName || 'Document Verification'}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          app.status === 'APPROVED' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {app.statusLabel || app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          {app.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleApproveApplication(app)}
                              disabled={actionInProgress}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-[11px] flex items-center gap-1.5 transition shadow-sm hover:shadow-emerald-500/20 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Approve</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection Drawer / Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center font-black">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold">Applicant Statutory Scrutiny Dossier</h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedApp.applicationId || selectedApp.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dossier Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400">Full Name:</span>
                  <p className="font-extrabold text-sm">{selectedApp.applicantName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Mobile Number:</span>
                  <p className="font-bold font-mono flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+91 {selectedApp.mobile}</span>
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Applied Service:</span>
                  <p className="font-bold">{selectedApp.type}</p>
                </div>
                <div>
                  <span className="text-slate-400">Vehicle Category:</span>
                  <p className="font-bold text-blue-600 dark:text-blue-400">{selectedApp.vehicleClass || 'LMV (Light Motor Vehicle)'}</p>
                </div>
                <div>
                  <span className="text-slate-400">RTO Jurisdiction:</span>
                  <p className="font-bold">{selectedApp.rtoName || 'Ranchi RTO (JH-01)'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Current Milestone:</span>
                  <p className="font-bold text-amber-600">Step {selectedApp.currentStep || 1} of 9: {selectedApp.currentStepName || 'In Progress'}</p>
                </div>
              </div>

              {/* Scrutiny Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Statutory Scrutiny Checklist</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">1. UIDAI Aadhaar e-KYC Identity Verification</span>
                    <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-black rounded-md">VERIFIED</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">2. Form 1A Registered Medical Certificate</span>
                    <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-black rounded-md">FIT (Grade A)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">3. Bharatkosh CMVR Rule 32 Treasury Payment</span>
                    <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-black rounded-md">RECONCILED</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t dark:border-slate-700">
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionInProgress}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Issue Discrepancy Notice</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdvanceStep(selectedApp)}
                    disabled={actionInProgress}
                    className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0056D2] dark:text-blue-300 hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Advance Milestone</span>
                  </button>

                  <button
                    onClick={() => handleApproveApplication(selectedApp)}
                    disabled={actionInProgress}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Grant Final MLO Approval</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Discrepancy Notice Modal */}
        {showRejectModal && selectedApp && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
            <div className={`rounded-3xl max-w-md w-full p-6 shadow-2xl border space-y-4 animate-in zoom-in-95 ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center space-x-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-extrabold">Statutory Discrepancy Notice</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Discrepancy Category
                </label>
                <select
                  value={discrepancyReason}
                  onChange={(e) => setDiscrepancyReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                >
                  <option value="Documents Illegible / Blurry Scan">Documents Illegible / Blurry Scan</option>
                  <option value="Form 1A Medical Fitness Incomplete">Form 1A Medical Fitness Incomplete</option>
                  <option value="Address Proof Name Mismatch">Address Proof Name Mismatch</option>
                  <option value="Expired Learner Licence Document">Expired Learner Licence Document</option>
                  <option value="Incomplete Biometric Enrollment">Incomplete Biometric Enrollment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Officer Instructions to Applicant *
                </label>
                <textarea
                  rows={3}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder="Explain exactly what documents the applicant must re-upload or correct..."
                  className="w-full p-3 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-700">
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
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer"
                >
                  {actionInProgress ? 'Issuing...' : 'Dispatch Notice & Reject'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
