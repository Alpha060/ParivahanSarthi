import React, { useState } from 'react';
import { 
  QrCode, 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OneQrJanSevaModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  applicantName?: string;
  serviceName?: string;
  rtoCode?: string;
}

export const OneQrJanSevaModal: React.FC<OneQrJanSevaModalProps> = ({
  isOpen,
  onClose,
  applicationId = 'DRAFT-JH01-8921',
  applicantName = 'Krishna Mahto',
  serviceName = 'Learner Licence (LL)',
  rtoCode = 'JH-01'
}) => {
  const { darkMode } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      } max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-black">One-QR Assisted Pass</h3>
                <span className="text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                  Jan Seva Kendra
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-Scan Handover for CSC / RTO Counter Desks
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Pass Card */}
        <div className="my-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 via-blue-500/5 to-emerald-500/5 border-2 border-dashed border-amber-300 dark:border-amber-700 text-center space-y-3">
          
          {/* Top Token */}
          <div className="inline-flex items-center space-x-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-mono font-black">
            <span>Pass ID:</span>
            <span>{applicationId}</span>
          </div>

          {/* QR Code Representation */}
          <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border shadow-md flex flex-col items-center justify-center">
            {/* SVG Vector QR Code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
              {/* Simple stylized SVG QR code grid */}
              <rect x="0" y="0" width="30" height="30" fill="currentColor" rx="4" />
              <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
              <rect x="10" y="10" width="10" height="10" fill="currentColor" rx="1" />

              <rect x="70" y="0" width="30" height="30" fill="currentColor" rx="4" />
              <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
              <rect x="80" y="10" width="10" height="10" fill="currentColor" rx="1" />

              <rect x="0" y="70" width="30" height="30" fill="currentColor" rx="4" />
              <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
              <rect x="10" y="80" width="10" height="10" fill="currentColor" rx="1" />

              {/* Data Blocks */}
              <rect x="38" y="5" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="52" y="15" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="38" y="25" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="5" y="38" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="18" y="48" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="38" y="38" width="24" height="24" fill="#0056D2" rx="4" />
              <rect x="70" y="38" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="85" y="48" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="38" y="70" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="52" y="80" width="8" height="8" fill="currentColor" rx="1" />
              <rect x="70" y="70" width="15" height="15" fill="currentColor" rx="2" />
            </svg>
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">{applicantName}</h4>
            <p className="text-xs text-slate-500">{serviceName} • RTO {rtoCode}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 text-left space-y-1">
            <div className="font-bold text-blue-700 dark:text-blue-300">How to use this Pass:</div>
            <div>1. Show this QR code to any Jan Seva Kendra or RTO desk operator.</div>
            <div>2. Operator scans with their webcam/scanner to load your draft in 2 seconds.</div>
            <div>3. Zero re-typing, zero paperwork, 100% data privacy.</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyToken}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
          >
            {copied ? '✓ Token Copied!' : 'Copy Token ID'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass Slip</span>
          </button>
        </div>

        <div className="mt-3 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Valid at 4,50,000+ Common Service Centres (CSC) across India</span>
        </div>

      </div>
    </div>
  );
};
