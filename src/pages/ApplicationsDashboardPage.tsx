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
  Building2
} from 'lucide-react';
import { api } from '../services/api';
import { MOCK_APPLICATIONS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { printOfficialSlip } from '../utils/printDocument';
import { DigitalLicenceCard } from '../components/DigitalLicenceCard';

export const ApplicationsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, t, user, isLoggedIn } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-progress' | 'approved' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<any[]>(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDlCertificate, setSelectedDlCertificate] = useState<any>(null);
  const [showDlModal, setShowDlModal] = useState(false);

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

  const getNormalizedStatus = (status?: string) => {
    const s = (status || '').toLowerCase().replace(/_/g, '-');
    if (s.includes('approve') || s.includes('complete')) return 'approved';
    if (s.includes('upcom') || s.includes('schedule')) return 'upcoming';
    return 'in-progress';
  };

  const filteredApps = applications.filter((app) => {
    const normStatus = getNormalizedStatus(app.status);
    const matchesFilter = activeFilter === 'all' ? true : normStatus === activeFilter;

    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      (app.applicationId || app.id || '').toLowerCase().includes(query) ||
      (app.type || '').toLowerCase().includes(query) ||
      (app.applicantName || '').toLowerCase().includes(query) ||
      (app.rtoName || '').toLowerCase().includes(query);

    return matchesFilter && matchesQuery;
  });

  const inProgressCount = applications.filter(a => getNormalizedStatus(a.status) === 'in-progress').length;
  const approvedCount = applications.filter(a => getNormalizedStatus(a.status) === 'approved').length;
  const upcomingCount = applications.filter(a => getNormalizedStatus(a.status) === 'upcoming').length;

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">My Applications Dashboard</span>
        </div>

        {/* Guest / Logged-Out Advisory Banner */}
        {!isLoggedIn && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-[#0056D2] dark:text-blue-400 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white">Public Portal Preview Mode</strong>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                  Sign in with your registered mobile or Aadhaar number to view your private application dossiers and sync with DigiLocker.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="bg-[#0056D2] hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer flex-shrink-0"
            >
              <span>Citizen Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Header Summary Card */}
        <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-md mb-6 sm:mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5 sm:space-x-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
                <FolderKanban className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
                  Citizen Applications Central Repository
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time record of all your submitted e-forms, RTO approvals, driving skill slot passes, and digital licences.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/services')}
              className="bg-[#0056D2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-98 transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for New Service</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-150 dark:border-slate-700 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Filings</span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{applications.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900">
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">In Progress</span>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">{inProgressCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Approved DLs</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{approvedCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900">
              <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">Test Appointments</span>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">{upcomingCount}</p>
            </div>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-150 dark:border-slate-700">
            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {[
                { id: 'all', label: `All (${applications.length})` },
                { id: 'in-progress', label: `In Progress (${inProgressCount})` },
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
              const normStatus = getNormalizedStatus(app.status);
              const isApproved = normStatus === 'approved';
              const isUpcoming = normStatus === 'upcoming';
              const isInProgress = normStatus === 'in-progress';

              return (
                <div
                  key={displayAppId}
                  className={`rounded-2xl sm:rounded-3xl p-5 border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Status badge and ID */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isApproved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        isUpcoming ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {app.statusLabel || (isApproved ? 'Approved' : isUpcoming ? 'Upcoming Test' : 'In Progress')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {isApproved ? 'DigiLocker Synced' : isUpcoming ? 'Slot Reserved' : `Step ${app.stepNumber || 6} of 9`}
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

                    {/* Progress Bar for In Progress */}
                    {isInProgress && (
                      <div className="pt-1">
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#137333] h-full rounded-full w-[66.6%]" />
                        </div>
                        <p className="text-[10px] text-right text-slate-400 mt-1">Current: {app.currentStep || 'RTO Scrutiny'}</p>
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

                    {isApproved ? (
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
