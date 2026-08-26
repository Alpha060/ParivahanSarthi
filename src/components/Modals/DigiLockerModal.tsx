import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileCheck2, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  RefreshCw,
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';

export interface DigiLockerFetchedData {
  applicantName: string;
  fatherName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  bloodGroup: string;
  aadhaarNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  documents: {
    name: string;
    issuer: string;
    docType: string;
    verifiedOn: string;
    status: 'VERIFIED';
    uri: string;
  }[];
}

interface DigiLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: DigiLockerFetchedData) => void;
  darkMode?: boolean;
}

export const DigiLockerModal: React.FC<DigiLockerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  darkMode = false
}) => {
  const [step, setStep] = useState<'auth' | 'consent' | 'fetching' | 'success'>('auth');
  const [aadhaarOrMobile, setAadhaarOrMobile] = useState('9821-4456-7890');
  const [securityPin, setSecurityPin] = useState('123456');
  const [consentGiven, setConsentGiven] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthorize = () => {
    if (securityPin.length < 6) {
      setErrorMsg('Please enter your 6-digit DigiLocker Security PIN.');
      return;
    }
    setErrorMsg(null);
    setStep('fetching');

    setTimeout(() => {
      setStep('success');
    }, 1200);
  };

  const handleFinalImport = () => {
    const verifiedData: DigiLockerFetchedData = {
      applicantName: 'Krishna Mahto',
      fatherName: 'Late Shri Ramesh Mahto',
      dob: '1998-07-15',
      gender: 'Male',
      mobile: '9876543210',
      email: 'krishna.mahto@citizen.in',
      bloodGroup: 'B+',
      aadhaarNumber: 'XXXX-XXXX-8921',
      address: 'H.No 42, Kanke Road, Near CMPDI',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834008',
      documents: [
        {
          name: 'Aadhaar Card (e-KYC)',
          issuer: 'Unique Identification Authority of India (UIDAI)',
          docType: 'Proof of Identity & Address',
          verifiedOn: 'Today',
          status: 'VERIFIED',
          uri: 'digilocker://uidai.gov.in/aadhaar/8921'
        },
        {
          name: 'Class 10 Matriculation Marksheet',
          issuer: 'Central Board of Secondary Education (CBSE)',
          docType: 'Proof of Age / Date of Birth',
          verifiedOn: 'Today',
          status: 'VERIFIED',
          uri: 'digilocker://cbse.gov.in/marksheet/10th/2014'
        },
        {
          name: 'Form 1 Medical Self-Declaration',
          issuer: 'Ministry of Road Transport & Highways',
          docType: 'Physical Fitness Declaration',
          verifiedOn: 'Today',
          status: 'VERIFIED',
          uri: 'digilocker://parivahan.gov.in/form1'
        }
      ]
    };

    onSuccess(verifiedData);
    setStep('auth');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* DigiLocker Official Brand Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-blue-600 dark:text-blue-400">
                  DigiLocker
                </span>
                <span className="text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded uppercase">
                  Sandbox Gateway
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                National Document Repository • Digital India
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Authentication & PIN */}
        {step === 'auth' && (
          <div className="py-4 space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-blue-900 dark:text-blue-200">
                1-Click Contactless Document Pull
              </p>
              <p className="text-[11px] leading-relaxed">
                Connect your DigiLocker account to automatically verify your identity and import statutory documents (Aadhaar e-KYC, Age Proof & Address Proof).
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Aadhaar Number / Registered Mobile
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={aadhaarOrMobile}
                    onChange={(e) => setAadhaarOrMobile(e.target.value)}
                    placeholder="9821-4456-7890 or Mobile"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  6-Digit DigiLocker Security PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="•••••• (Default: 123456)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold tracking-widest focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Demo PIN pre-filled: <strong>123456</strong>
                </span>
              </div>

              {/* Statutory Consent Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  I hereby authorize <strong>Ministry of Road Transport & Highways (MoRTH)</strong> to access my DigiLocker digital repository for driving licence e-KYC verification.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!consentGiven}
                onClick={handleAuthorize}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <span>Authorize & Pull Documents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Fetching Documents Animation */}
        {step === 'fetching' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto animate-spin">
              <RefreshCw className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Connecting to DigiLocker Cloud...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fetching cryptographically signed Aadhaar, 10th Certificate & Address records.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Success & Document Verification Manifest */}
        {step === 'success' && (
          <div className="py-4 space-y-4 text-xs animate-in zoom-in-95 duration-200">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
                  DigiLocker Verification Successful
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  3 Official Documents Ready for Instant Auto-Attach.
                </p>
              </div>
            </div>

            {/* List of Verified Documents */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Fetched Verified Digital Documents:
              </p>

              {[
                { name: 'Aadhaar e-KYC Card', type: 'Proof of Identity & Address', issuer: 'UIDAI', id: 'AADHAAR-8921' },
                { name: 'Class 10 Secondary Marksheet', type: 'Proof of Date of Birth (Age 18+ Verified)', issuer: 'CBSE Board', id: 'CBSE-10-8492' },
                { name: 'Form 1 Medical Self-Declaration', type: 'Statutory Physical Fitness', issuer: 'MoRTH Portal', id: 'FORM1-APPROVED' }
              ].map((doc, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{doc.name}</p>
                      <p className="text-[10px] text-slate-500">{doc.type} • {doc.issuer}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleFinalImport}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Verified Details & Documents</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
