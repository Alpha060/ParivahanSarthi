import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ShieldCheck,
  RotateCw,
  FileText,
  CreditCard,
  Building2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { MOCK_APPLICATIONS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { printOfficialSlip } from '../utils/printDocument';
import { DigitalLicenceCard } from '../components/DigitalLicenceCard';

export const ApplicationsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, t, user, isLoggedIn } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-progress' | 'draft-unpaid' | 'approved' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<any[]>(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDlCertificate, setSelectedDlCertificate] = useState<any>(null);
  const [showDlModal, setShowDlModal] = useState(false);
  const [payingAppId, setPayingAppId] = useState<string | null>(null);
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [isLoggedIn]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await api.getApplications();
      if (res.success && res.applications && res.applications.length > 0) {
        setApplications(res.applications);
      }
    } catch (err) {
      // Keep mock fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCertificate = async (app: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.getCertificate(app.applicationId || app.id);
      if (res.success && res.certificate) {
        setSelectedDlCertificate(res.certificate);
        setShowDlModal(true);
      } else {
        setSelectedDlCertificate({
          licenceNumber: `JH-01-2024-${(app.applicationId || '9283719').slice(-7)}`,
          holderName: app.applicantName || 'Krishna Mahto',
          vehicleClasses: ['LMV', 'MCWG'],
          issueDate: new Date().toISOString(),
          validUntil: '21-Aug-2044 (20 Years)',
          rtoName: app.rtoName || 'Ranchi RTO (JH-01)'
        });
        setShowDlModal(true);
      }
    } catch (err) {
      setSelectedDlCertificate({
        licenceNumber: `JH-01-2024-${(app.applicationId || '9283719').slice(-7)}`,
        holderName: app.applicantName || 'Krishna Mahto',
        vehicleClasses: ['LMV', 'MCWG'],
        issueDate: new Date().toISOString(),
        validUntil: '21-Aug-2044 (20 Years)',
        rtoName: app.rtoName || 'Ranchi RTO (JH-01)'
      });
      setShowDlModal(true);
    }
  };

  const handlePayStatutoryFee = async (app: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const appId = app.applicationId || app.id;
    setPayingAppId(appId);
    try {
      const res = await api.settleApplicationPayment(appId, 'BHIM / UPI');
      if (res.success) {
        setActionNotification(`Payment of ₹${app.feeAmount || 500} Reconciled! Application ${appId} is now transmitted to RTO Scrutiny.`);
        // Optimistically update
        setApplications(prev => prev.map(a => {
          if ((a.applicationId || a.id) === appId) {
            return {
              ...a,
              paymentStatus: 'PAID',
              status: 'in-progress',
              statusLabel: 'In Progress (Submitted to RTO)',
              statusColor: '#137333',
              currentStepName: 'Application Submitted Online (Scrutiny Queue)'
            };
          }
          return a;
        }));
        await fetchApplications();
      }
    } catch (err) {
      alert('Failed to process statutory payment.');
    } finally {
      setPayingAppId(null);
      setTimeout(() => setActionNotification(null), 5000);
    }
  };

  const getNormalizedStatus = (app: any) => {
    if (app.paymentStatus === 'PENDING' || app.status === 'DRAFT_PAYMENT_PENDING') {
      return 'draft-unpaid';
    }
    const s = (app.status || '').toLowerCase().replace(/_/g, '-');
    if (s.includes('approve') || s.includes('complete')) return 'approved';
    if (s.includes('upcom') || s.includes('schedule')) return 'upcoming';
    return 'in-progress';
  };

  const filteredApps = applications.filter((app) => {
    const normStatus = getNormalizedStatus(app);
    const matchesFilter = activeFilter === 'all' ? true : normStatus === activeFilter;

    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      (app.applicationId || app.id || '').toLowerCase().includes(query) ||
      (app.type || '').toLowerCase().includes(query) ||
      (app.applicantName || '').toLowerCase().includes(query) ||
      (app.rtoName || '').toLowerCase().includes(query);

    return matchesFilter && matchesQuery;
  });

  const inProgressCount = applications.filter(a => getNormalizedStatus(a) === 'in-progress').length;
  const unpaidDraftCount = applications.filter(a => getNormalizedStatus(a) === 'draft-unpaid').length;
  const approvedCount = applications.filter(a => getNormalizedStatus(a) === 'approved').length;
  const upcomingCount = applications.filter(a => getNormalizedStatus(a) === 'upcoming').length;

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">My Applications Dashboard</span>
        </div>

        {/* Action Notification Banner */}
        {actionNotification && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionNotification}</span>
          </div>
        )}

        {/* Dashboard Header Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-gradient-to-r from-[#0B2545] to-[#0056D2] text-white border-blue-900'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-300/30 text-blue-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <FolderKanban className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/30 text-blue-200 text-[10px] font-black uppercase tracking-wider">
                  Citizen Registry Dossier
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  DigiLocker Synced
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                My Transport Services & Filings
              </h1>
              <p className="text-xs text-blue-100/80 dark:text-slate-300 mt-0.5">
                Real-time statutory tracking, fee settlement & digital certificate downloads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={fetchApplications}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Dossier</span>
            </button>
            <Link
              to="/services"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Application</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={`p-3 sm:p-4 rounded-2xl border shadow-sm ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {[
                { id: 'all', label: `All (${applications.length})` },
                { id: 'in-progress', label: `In Scrutiny (${inProgressCount})` },
                ...(unpaidDraftCount > 0 ? [{ id: 'draft-unpaid', label: `Draft / Unpaid (${unpaidDraftCount})` }] : []),
                { id: 'approved', label: `Approved (${approvedCount})` },
                { id: 'upcoming', label: `Scheduled (${upcomingCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeFilter === tab.id
                      ? 'bg-[#0056D2] text-white shadow-xs'
                      : tab.id === 'draft-unpaid'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, name or RTO..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Applications List Grid */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No applications match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try changing search query or tab filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredApps.map((app) => {
              const displayAppId = app.applicationId || app.id;
              const normStatus = getNormalizedStatus(app);
              const isUnpaidDraft = normStatus === 'draft-unpaid';
              const isApproved = normStatus === 'approved';
              const isUpcoming = normStatus === 'upcoming';
              const isInProgress = normStatus === 'in-progress';

              return (
                <div
                  key={displayAppId}
                  className={`rounded-2xl sm:rounded-3xl p-5 border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
                  } ${isUnpaidDraft ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/20' : ''}`}
                >
                  <div className="space-y-3">
                    {/* Status badge and ID */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isUnpaidDraft ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300' :
                        isApproved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        isUpcoming ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {isUnpaidDraft ? 'PAYMENT PENDING (DRAFT)' : (app.statusLabel || (isApproved ? 'Approved' : isUpcoming ? 'Upcoming Test' : 'In Progress'))}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {isUnpaidDraft ? `Fee Due: ₹${app.feeAmount || 500}` : isApproved ? 'DigiLocker Synced' : isUpcoming ? 'Slot Reserved' : `Step ${app.stepNumber || 6} of 9`}
                      </span>
                    </div>

                    {/* Title and details */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-[#0056D2] transition font-mono">
                        {displayAppId}
                      </h3>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                        {app.type || 'Driving Licence'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Applicant: <strong>{app.applicantName || 'Krishna Mahto'}</strong>
                      </p>
                    </div>

                    {/* RTO and date metadata */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1 text-xs border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-500" /> RTO Office:
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{app.rtoName || 'Ranchi RTO (JH-01)'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-500" /> Record Date:
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{app.submittedDate || app.approvedDate || '14 May 2024'}</span>
                      </div>
                    </div>

                    {/* Unpaid Warning Banner */}
                    {isUnpaidDraft && (
                      <div className="p-2.5 bg-amber-100/70 dark:bg-amber-950/60 rounded-xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">
                          Held in draft. <strong>Not visible to RTO officers</strong> until statutory fee is paid.
                        </span>
                      </div>
                    )}

                    {/* Progress Bar for In Progress */}
                    {isInProgress && (
                      <div className="pt-1">
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#137333] h-full rounded-full w-[66.6%]" />
                        </div>
                        <p className="text-[10px] text-right text-slate-400 mt-1">Current: {app.currentStep || 'RTO Scrutiny Queue'}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-slate-150 dark:border-slate-700 mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/status?appId=${displayAppId}`)}
                      className="text-xs font-bold text-[#0056D2] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Track Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {isUnpaidDraft ? (
                      <button
                        type="button"
                        disabled={payingAppId === displayAppId}
                        onClick={(e) => handlePayStatutoryFee(app, e)}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer transition active:scale-95"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>{payingAppId === displayAppId ? 'Reconciling...' : `Pay ₹${app.feeAmount || 500} & Submit`}</span>
                      </button>
                    ) : isApproved ? (
                      <button
                        type="button"
                        onClick={(e) => handleDownloadCertificate(app, e)}
                        className="bg-[#0056D2] hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download DL</span>
                      </button>
                    ) : isUpcoming ? (
                      <button
                        type="button"
                        onClick={() => navigate('/appointments')}
                        className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>View Pass</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => printOfficialSlip({
                          title: 'Sarathi Application Acknowledgement Receipt',
                          subtitle: 'Ministry of Road Transport & Highways - Form 2 / Form 4',
                          documentType: 'Official Application Slip',
                          referenceNumber: displayAppId,
                          applicantName: app.applicantName || 'Krishna Mahto',
                          serviceName: app.type,
                          rtoName: app.rtoName,
                          details: [
                            { label: 'Sarathi Application Number', value: displayAppId },
                            { label: 'Applicant Name', value: app.applicantName || 'Krishna Mahto' },
                            { label: 'Service Category', value: app.type || 'Driving Licence (LMV)' },
                            { label: 'Vehicle Class', value: app.vehicleClass || 'LMV' },
                            { label: 'Assigned RTO Jurisdiction', value: app.rtoName || 'Ranchi RTO (JH-01)' },
                            { label: 'Submission Timestamp', value: app.submittedDate || '14 May 2024' },
                            { label: 'Current Processing Milestone', value: app.currentStep || 'Step 6: RTO Verification' }
                          ],
                          highlightBox: {
                            label: 'Application Status',
                            value: 'IN PROGRESS - SCRUTINY ACTIVE'
                          }
                        })}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Slip</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Digital Smart Card Modal */}
      {selectedDlCertificate && (
        <DigitalLicenceCard
          isOpen={showDlModal}
          onClose={() => setShowDlModal(false)}
          dlData={selectedDlCertificate}
        />
      )}
    </div>
  );
};
