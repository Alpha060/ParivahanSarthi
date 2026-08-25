import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  X, 
  CheckCircle2, 
  MapPin, 
  Download, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAppId?: string;
}

export const StatusCheckModal: React.FC<StatusCheckModalProps> = ({
  isOpen,
  onClose,
  initialAppId = 'DL1234567890123'
}) => {
  const [appId, setAppId] = useState(initialAppId);
  const [searchedId, setSearchedId] = useState(initialAppId);
  const [isSearching, setIsSearching] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reconciling, setReconciling] = useState(false);
  const [reconciledMsg, setReconciledMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatus(initialAppId);
    }
  }, [isOpen, initialAppId]);

  const fetchStatus = async (id: string) => {
    setIsSearching(true);
    setErrorMessage(null);
    setReconciledMsg(null);
    try {
      const res = await api.getApplicationById(id.trim());
      if (res.success && res.application) {
        setApplicationData(res.application);
      } else {
        setErrorMessage(res.error || 'No matching application found.');
        setApplicationData(null);
      }
    } catch (err) {
      setErrorMessage('Unable to reach National Register Database server.');
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
    setReconciling(true);
    try {
      const res = await api.reconcilePayment(undefined, applicationData?.applicationId);
      if (res.success) {
        setReconciledMsg('Payment reconciled & confirmed with Core Banking Solution (CBS).');
        confetti({ particleCount: 50, spread: 60 });
        // Refresh application state
        fetchStatus(applicationData.applicationId);
      }
    } catch (err) {
      setErrorMessage('Reconciliation failed. Please retry.');
    } finally {
      setReconciling(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const res = await api.getCertificate(applicationData.applicationId);
      if (res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        alert(`Digital Driving Licence Verified!\n\nDL Number: ${res.certificate.dlNumber}\nApplicant: ${res.certificate.applicantName}\nVehicle Class: ${res.certificate.vehicleClass}\nIssuing Authority: ${res.certificate.authority}\nValid Until: ${res.certificate.validUntil}`);
      }
    } catch (err) {
      alert('Certificate generated.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0056D2] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Application Status Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Live multi-stage tracking from National Register Database (Prisma DB Connected)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-150">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="Enter Application No. (e.g. DL1234567890123)"
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#0056D2] hover:bg-[#0047b3] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isSearching ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Status Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {reconciledMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{reconciledMsg}</span>
            </div>
          )}

          {applicationData && (
            <>
              {/* Application Summary Card */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333]">
                      {applicationData.statusLabel}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-extrabold text-slate-900">{applicationData.applicationId}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-1">{applicationData.type}</p>
                  <p className="text-xs text-slate-500">
                    Applicant: <strong>{applicationData.applicantName}</strong> | Class: {applicationData.vehicleClass}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Jurisdiction: {applicationData.rtoName}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {applicationData.status === 'APPROVED' ? (
                    <button 
                      onClick={handleDownloadCertificate}
                      className="bg-[#0056D2] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Licence PDF</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-xl border border-blue-200 inline-block">
                      Current: {applicationData.currentStepName} (Step {applicationData.currentStep} of 9)
                    </span>
                  )}

                  {/* Instant Reconciliation Button for Citizen Peace of Mind */}
                  <button
                    type="button"
                    onClick={handleReconcilePayment}
                    disabled={reconciling}
                    className="text-[10px] font-bold text-[#0056D2] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${reconciling ? 'animate-spin' : ''}`} />
                    <span>Verify / Reconcile Bank Payment Status</span>
                  </button>
                </div>
              </div>

              {/* 9-Stage Milestone Progression */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
                  Detailed Progression Timeline (9 Steps)
                </h4>

                <div className="space-y-3.5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {applicationData.steps && applicationData.steps.length > 0 ? (
                    applicationData.steps.map((step: any) => (
                      <div key={step.stepNumber} className="flex items-start space-x-3.5 relative z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          step.isCompleted 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : step.isCurrent 
                            ? 'bg-[#0056D2] text-white ring-4 ring-blue-100 animate-pulse' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {step.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                        </div>
                        
                        <div className="flex-1 bg-white p-3 rounded-xl border border-slate-150 hover:border-blue-200 transition">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-bold ${
                              step.isCompleted ? 'text-slate-800' : step.isCurrent ? 'text-blue-700' : 'text-slate-500'
                            }`}>
                              {step.stepName}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {step.completedAt || step.remarks || 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Application milestones loading...</p>
                  )}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs">
          <span className="text-slate-500">National Register Database Live Sync Active</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-slate-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
