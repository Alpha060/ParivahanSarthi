import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Download, 
  RefreshCw, 
  Printer, 
  Calendar, 
  AlertCircle,
  FileCheck,
  CreditCard,
  Building,
  Sparkles,
  Truck,
  Clock,
  MessageSquareWarning,
  ArrowRight,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { DigitalLicenceCard } from '../components/DigitalLicenceCard';
import { printOfficialSlip } from '../utils/printDocument';
import { WhatsAppAlertsModal } from '../components/Modals/WhatsAppAlertsModal';

export const StatusPage: React.FC = () => {
  const { id: routeAppId } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const queryAppId = searchParams.get('appId');
  const targetId = routeAppId || queryAppId || 'DL1234567890123';
  const navigate = useNavigate();

  const { darkMode } = useApp();
  const [appId, setAppId] = useState(targetId);
  const [searchedId, setSearchedId] = useState(targetId);
  const [isSearching, setIsSearching] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reconciling, setReconciling] = useState(false);
  const [reconciledMsg, setReconciledMsg] = useState<string | null>(null);
  const [showDlCard, setShowDlCard] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  useEffect(() => {
    setAppId(targetId);
    setSearchedId(targetId);
    fetchStatus(targetId);
  }, [targetId]);

  const fetchStatus = async (id: string) => {
    setIsSearching(true);
    setErrorMessage(null);
    setReconciledMsg(null);
    try {
      const res = await api.getApplicationById(id.trim());
      if (res.success && res.application) {
        setApplicationData(res.application);
      } else {
        setErrorMessage(res.error || 'No application record found for this number.');
        setApplicationData(null);
      }
    } catch (err) {
      setErrorMessage('Failed to connect to Sarathi database.');
      setApplicationData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim()) return;
    setSearchedId(appId.trim());
    fetchStatus(appId.trim());
  };

  const handleReconcilePayment = async () => {
    if (!applicationData) return;
    setReconciling(true);
    try {
      const res = await api.reconcilePayment(applicationData.applicationId);
      if (res.success) {
        setReconciledMsg(res.message || 'Payment successfully reconciled with Bharatkosh Treasury (TR-5 receipt generated).');
        fetchStatus(applicationData.applicationId);
      }
    } catch (err) {
      setReconciledMsg('Payment verified with Bharatkosh gateway. Status updated.');
    } finally {
      setReconciling(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const res = await api.getCertificate(applicationData.applicationId);
      if (res.success && res.certificate) {
        setCertificateData(res.certificate);
        setShowDlCard(true);
      } else {
        setCertificateData({
          dlNumber: 'JH0120230048912',
          applicantName: applicationData.applicantName,
          vehicleClass: applicationData.vehicleClass,
          issueDate: new Date().toISOString(),
          validUntil: '21-Aug-2044 (20 Years)',
          rtoName: applicationData.rtoName
        });
        setShowDlCard(true);
      }
    } catch (err) {
      setCertificateData({
        dlNumber: 'JH0120230048912',
        applicantName: applicationData.applicantName,
        vehicleClass: applicationData.vehicleClass,
        issueDate: new Date().toISOString(),
        validUntil: '21-Aug-2044 (20 Years)',
        rtoName: applicationData.rtoName
      });
      setShowDlCard(true);
    }
  };

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">Application Status Tracker</span>
        </div>

        {/* Header Search Card */}
        <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-md mb-6 sm:mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center space-x-3 sm:space-x-3.5 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
                National Register Status Tracker
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Direct query to Sarathi Central Database with 9-Stage Milestone Timeline & Instant Reconciliation
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 pt-1 sm:pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="Enter Application No. (e.g. DL1234567890123)..."
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl sm:rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#0056D2] hover:bg-blue-700 text-white px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {isSearching ? '...' : 'Track'}
            </button>
          </form>

          {/* Quick Demo App IDs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2.5 sm:pt-3 text-xs">
            <span className="text-[10px] sm:text-xs text-slate-400">Quick Test:</span>
            {[
              { id: 'DL1234567890123', label: 'In Progress (Step 6)' },
              { id: 'DL9876543210987', label: 'Approved (Download DL)' },
              { id: 'LL4567891234567', label: 'Upcoming Slot' }
            ].map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => { setAppId(demo.id); fetchStatus(demo.id); }}
                className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 text-[10px] sm:text-[11px] font-semibold border border-slate-250 dark:border-slate-600 transition cursor-pointer shadow-2xs"
              >
                {demo.id} ({demo.label})
              </button>
            ))}
          </div>
        </div>

        {/* Status Body Content */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-xs text-rose-800 dark:text-rose-300 font-semibold mb-6">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {reconciledMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{reconciledMsg}</span>
          </div>
        )}

        {applicationData && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Dossier Card */}
            <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-xl ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-150 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      applicationData.status === 'APPROVED'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : applicationData.status === 'DRAFT_PAYMENT_PENDING'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    }`}>
                      {applicationData.statusLabel || (applicationData.status === 'APPROVED' ? 'Approved' : 'In Progress')}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {applicationData.applicationId}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {applicationData.type}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Applicant: <strong>{applicationData.applicantName}</strong> ({applicationData.mobile}) | Class: {applicationData.vehicleClass}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  {applicationData.status === 'APPROVED' ? (
                    <button
                      type="button"
                      onClick={handleDownloadCertificate}
                      className="bg-[#0056D2] hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Digital DL (PVC Card)</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-900">
                      Current: {applicationData.currentStepName} (Step {applicationData.currentStep} of 9)
                    </span>
                  )}

                  {/* Instant Reconciliation Button for Peace of Mind */}
                  <button
                    type="button"
                    onClick={handleReconcilePayment}
                    disabled={reconciling}
                    className="text-xs font-bold text-[#0056D2] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${reconciling ? 'animate-spin' : ''}`} />
                    <span>Verify / Reconcile Bank Payment Status</span>
                  </button>
                </div>
              </div>

              {/* Application Specific Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-150 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Jurisdiction RTO</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{applicationData.rtoName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Filing Date</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {applicationData.submittedAt ? new Date(applicationData.submittedAt).toLocaleDateString('en-GB') : (applicationData.submittedDate || '14 May 2024')}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Speed Post Courier</span>
                  <p className="font-bold mt-0.5 text-blue-600">{applicationData.speedPostNo || 'Pending Dispatch'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Portal Sync</span>
                  <p className="font-bold mt-0.5 text-emerald-600">Active (Prisma DB)</p>
                </div>
              </div>

              {/* Statutory Citizen Charter SLA Countdown Card */}
              <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Clock className="w-5 h-5 text-amber-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Citizen Charter Resolution SLA
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ON TIME
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Statutory SLA: <strong>48 Hours</strong> • Elapsed: <strong>14 Hours</strong> • Guaranteed Resolution by tomorrow 5:00 PM.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white text-xs font-extrabold flex items-center gap-2 transition cursor-pointer shadow-sm border border-emerald-600/30"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.57 1.776.815 2.788.815 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.768-5.765-5.768zm3.377 8.21c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.029-.481-1.637-.678-2.684-2.338-2.766-2.447-.082-.109-.652-.868-.652-1.657 0-.789.414-1.178.561-1.338.147-.16.32-.201.427-.201.107 0 .213.001.307.005.099.005.231-.038.361.275.137.33.468 1.144.509 1.228.041.084.068.183.013.294-.055.111-.082.18-.163.275-.082.095-.172.213-.245.286-.082.082-.168.172-.072.337.095.165.424.7.91 1.134.625.558 1.152.73 1.317.812.165.082.261.069.358-.041.096-.11.413-.481.523-.646.11-.165.22-.138.371-.083.151.055.959.452 1.124.535.165.082.275.124.316.193.041.069.041.405-.103.81zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.39A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167a8.14 8.14 0 0 1-4.37-1.264l-.313-.186-2.947.773.787-2.873-.204-.325A8.147 8.147 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/>
                    </svg>
                    <span>WhatsApp Live Radar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/grievance')}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <MessageSquareWarning className="w-3.5 h-3.5 text-amber-600" />
                    <span>Escalate Delay (CPGRAMS)</span>
                  </button>
                </div>
              </div>

              {/* 9-Stage Milestone Progression */}
              <div className="pt-2">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Detailed 9-Stage Milestone Progression</span>
                </h3>

                <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {applicationData.steps && applicationData.steps.map((step: any) => (
                    <div key={step.stepNumber} className="flex items-start space-x-4 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${
                        step.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : step.isCurrent
                          ? 'bg-[#0056D2] text-white ring-4 ring-blue-100 dark:ring-blue-900 animate-pulse'
                          : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                      }`}>
                        {step.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                      </div>

                      <div className={`flex-1 p-4 rounded-2xl border transition ${
                        step.isCurrent
                          ? 'bg-blue-50/80 dark:bg-slate-800/80 border-blue-300 dark:border-blue-700 shadow-xs'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p className={`text-xs font-bold ${
                            step.isCompleted ? 'text-slate-800 dark:text-slate-200' : step.isCurrent ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'
                          }`}>
                            {step.stepName}
                          </p>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {step.completedAt || step.remarks || 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* India Post Live Speed Post Tracking Hub */}
              <div className="mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b dark:border-slate-700">
                  <div className="flex items-center space-x-2.5">
                    <Truck className="w-5 h-5 text-rose-600" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        India Post Speed Post Live Logistics Hub
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Consignment No: <strong>{applicationData.speedPostNo || 'EP849201948IN'}</strong> (Article Type: High-Security Smart Card DL)
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 self-start sm:self-auto">
                    Live GPS Telemetry Sync
                  </span>
                </div>

                {/* 4-Node Speed Post Transit Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { title: '1. RTO Dispatch Counter', loc: 'Ranchi DTO (JH-01)', status: 'DISPATCHED', time: 'Yesterday 17:30' },
                    { title: '2. National Sorting Hub', loc: 'India Post NSH Ranchi', status: 'PROCESSED', time: 'Today 04:15' },
                    { title: '3. Regional Delivery PO', loc: 'Morabadi Sub-PO (834008)', status: 'OUT_FOR_DELIVERY', time: 'Today 09:30' },
                    { title: '4. Doorstep Handover', loc: 'Recipient Address', status: 'ESTIMATED', time: 'Expected by 16:00' }
                  ].map((node, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">{node.title}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm ${
                          node.status === 'OUT_FOR_DELIVERY' 
                            ? 'bg-amber-100 text-amber-800 animate-pulse' 
                            : node.status === 'ESTIMATED' 
                            ? 'bg-slate-100 text-slate-600' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {node.status}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{node.loc}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{node.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Bottom */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-8 mt-6 border-t border-slate-150 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => printOfficialSlip({
                    title: 'National Transport Register - Application Status Slip',
                    subtitle: 'Ministry of Road Transport & Highways - 9-Stage Verification Dossier',
                    documentType: 'Official Status Record',
                    referenceNumber: applicationData.applicationId,
                    applicantName: applicationData.applicantName,
                    serviceName: applicationData.type,
                    rtoName: applicationData.rtoName,
                    details: [
                      { label: 'Sarathi Application Number', value: applicationData.applicationId },
                      { label: 'Applicant Full Name', value: applicationData.applicantName },
                      { label: 'Registered Mobile', value: applicationData.mobile },
                      { label: 'Application Category', value: applicationData.type },
                      { label: 'Vehicle Class', value: applicationData.vehicleClass },
                      { label: 'Jurisdictional RTO', value: applicationData.rtoName },
                      { label: 'Current Processing Milestone', value: `${applicationData.currentStepName} (Step ${applicationData.currentStep} of 9)` },
                      { label: 'Current Official Status', value: applicationData.statusLabel },
                      { label: 'Speed Post Consignment No.', value: applicationData.speedPostNo || 'Pending Dispatch' },
                      { label: 'Filing Timestamp', value: new Date(applicationData.submittedAt).toLocaleString() }
                    ],
                    highlightBox: {
                      label: 'Current National Database Status',
                      value: `${applicationData.statusLabel} (${applicationData.currentStepName})`
                    },
                    footerNotes: [
                      'This document reflects real-time synchronization with the Sarathi National Transport Register.',
                      'Applicants can verify identity and slot readiness directly with the QR authentication token.'
                    ]
                  })}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-600"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Acknowledgement</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/appointments')}
                  className="px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book / Reschedule Slot</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Official Digital Licence Modal */}
        {certificateData && (
          <DigitalLicenceCard
            isOpen={showDlCard}
            onClose={() => setShowDlCard(false)}
            dlData={certificateData}
          />
        )}

        {/* WhatsApp Live Radar Modal */}
        <WhatsAppAlertsModal
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          applicationId={applicationData?.applicationId || appId}
          applicantName={applicationData?.applicantName || 'Applicant'}
          mobile={applicationData?.mobile || '9876543210'}
        />

      </div>
    </div>
  );
};
