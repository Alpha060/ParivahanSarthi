import React, { useState } from 'react';
import { 
  FileCheck, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Calendar,
  CreditCard
} from 'lucide-react';
import { QUICK_SERVICES } from '../../data/mockData';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
  onProceedToApply: (serviceId: string) => void;
  onTrackNewApplication?: (appId: string) => void;
  onBookSlotForNewApp?: (appId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  serviceId,
  onTrackNewApplication,
  onBookSlotForNewApp
}) => {
  const { darkMode, currentState } = useApp();
  const [isApplying, setIsApplying] = useState(false);
  const [applicantName, setApplicantName] = useState('Krishna Mahto');
  const [mobile, setMobile] = useState('9876543210');
  const [vehicleClass, setVehicleClass] = useState('LMV (Light Motor Vehicle)');
  const [selectedRto, setSelectedRto] = useState('JH-01');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !serviceId) return null;

  const service = QUICK_SERVICES.find(s => s.id === serviceId) || QUICK_SERVICES[0];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.submitApplication({
        type: service.title,
        subType: service.subtitle,
        vehicleClass,
        applicantName,
        mobile,
        state: currentState.split(',')[1]?.trim() || 'Jharkhand',
        rtoCode: selectedRto,
        rtoName: `District Transport Office (${selectedRto})`
      });

      if (res.success && res.application) {
        setSubmittedApp(res.application);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMessage(res.error || 'Application submission failed.');
      }
    } catch (err) {
      setErrorMessage('Could not connect to Sarathi National Register API server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    setSubmittedApp(null);
    setIsApplying(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className={`rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${
          darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-150 bg-slate-50/70'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: service.bgCircleColor }}
            >
              <FileCheck className="w-6 h-6" style={{ color: service.iconColor }} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {service.category}
              </span>
              <h3 className="text-base font-extrabold leading-tight">
                {service.title}
              </h3>
            </div>
          </div>
          <button 
            onClick={handleCloseAll}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {submittedApp ? (
            /* Success View */
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-in zoom-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Application Submitted Successfully!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Registered in Sarathi National Register (Prisma Database).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">Application Number:</span>
                  <span className="font-extrabold text-[#0056D2] dark:text-blue-400 text-sm">{submittedApp.applicationId}</span>
                </div>
                <div className="flex justify-between border-b dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold">{submittedApp.type}</span>
                </div>
                <div className="flex justify-between border-b dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold">{submittedApp.applicantName}</span>
                </div>
                <div className="flex justify-between border-b dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">Vehicle Category:</span>
                  <span className="font-bold">{submittedApp.vehicleClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned RTO:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{submittedApp.rtoName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleCloseAll();
                    if (onTrackNewApplication) onTrackNewApplication(submittedApp.applicationId);
                  }}
                  className="bg-[#0056D2] hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Track 9-Step Status</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleCloseAll();
                    if (onBookSlotForNewApp) onBookSlotForNewApp(submittedApp.applicationId);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Driving Test Slot</span>
                </button>
              </div>
            </div>
          ) : isApplying ? (
            /* Live Application Form View */
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b dark:border-slate-700">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Online e-Application (Form 2 / Form 4)
                </span>
                <button 
                  type="button" 
                  onClick={() => setIsApplying(false)}
                  className="text-xs text-slate-500 hover:underline cursor-pointer"
                >
                  Back to Details
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Applicant Full Name (As in Aadhaar)
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number (e-KYC OTP linked)
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border-r border-slate-200 dark:border-slate-600 flex items-center gap-1 select-none">
                      <span className="text-sm">🇮🇳</span> +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="w-full px-3 py-2 bg-transparent text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Class
                  </label>
                  <select
                    value={vehicleClass}
                    onChange={(e) => setVehicleClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option>LMV (Light Motor Vehicle / Car)</option>
                    <option>MCWG (Motorcycle With Gear)</option>
                    <option>MCWOG (Motorcycle Without Gear)</option>
                    <option>BOTH (MCWG + LMV)</option>
                    <option>TRANS (Commercial Transport)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jurisdictional RTO
                  </label>
                  <select
                    value={selectedRto}
                    onChange={(e) => setSelectedRto(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value="JH-01">Ranchi DTO (JH-01)</option>
                    <option value="JH-05">Jamshedpur DTO (JH-05)</option>
                    <option value="JH-10">Dhanbad DTO (JH-10)</option>
                    <option value="DL-01">Delhi Mall Road (DL-01)</option>
                    <option value="MH-01">Mumbai Central (MH-01)</option>
                    <option value="KA-01">Bengaluru Koramangala (KA-01)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <p>✓ Aadhaar e-KYC authentication will be simulated.</p>
                <p>✓ Digital Acknowledgement receipt & Sarathi ID will be generated immediately.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
              >
                <span>{isSubmitting ? 'Registering with National Database...' : 'Submit Application to Sarathi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Information View */
            <>
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 rounded-2xl">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Eligibility & Prerequisites</span>
                </h4>
                <div className="space-y-2">
                  {service.eligibility.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Mandatory Documents Required</span>
                </h4>
                <div className="space-y-2">
                  {service.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 text-[#0056D2] dark:text-blue-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fee & Time */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Government Prescribed Fee</p>
                  <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">₹{service.fee}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Processing Time</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">3 - 7 Working Days</p>
                </div>
              </div>

              {/* CTA */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsApplying(true)}
                  className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-blue-500/20 active:scale-98 transition cursor-pointer"
                >
                  <span>Apply Now Online (Contactless)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
