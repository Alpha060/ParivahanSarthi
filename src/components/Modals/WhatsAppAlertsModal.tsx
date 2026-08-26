import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  CheckCheck, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  ArrowRight,
  Truck,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WhatsAppAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  applicantName: string;
  mobile: string;
}

export const WhatsAppAlertsModal: React.FC<WhatsAppAlertsModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  applicantName,
  mobile
}) => {
  const { darkMode } = useApp();
  const [isOptedIn, setIsOptedIn] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(mobile || '9876543210');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      } max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-black">WhatsApp Live Radar</h3>
                <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                  Official MoRTH
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct SMS & WhatsApp updates with zero spam
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

        {/* WhatsApp Simulated Phone Preview */}
        <div className="my-4 p-4 rounded-2xl bg-[#EFEAE2] dark:bg-slate-950 border border-slate-300 dark:border-slate-800 shadow-inner">
          <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-slate-300 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              PS
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                <span>Parivahan Sarthi</span>
                <span className="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px]">✓</span>
              </div>
              <div className="text-[10px] text-slate-500">Official Government Transport Bot</div>
            </div>
          </div>

          {/* Chat Bubbles */}
          <div className="space-y-2.5 text-xs">
            <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 dark:border-slate-700 max-w-[90%] space-y-1.5">
              <p className="font-semibold">
                Namaste {applicantName || 'Citizen'} ji! 🙏
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Aapki application <span className="font-bold text-blue-600 dark:text-blue-400">#{applicationId}</span> RTO scrutiny mein pass ho gayi hai.
              </p>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-[11px] space-y-0.5">
                <div className="font-bold text-blue-700 dark:text-blue-300">📦 India Post Dispatch:</div>
                <div className="text-slate-600 dark:text-slate-400">Tracking: <span className="font-mono font-bold">EK849201938IN</span></div>
                <div className="text-slate-600 dark:text-slate-400">Expected: Within 48 hours</div>
              </div>
              <div className="flex items-center justify-end space-x-1 text-[10px] text-slate-400">
                <span>10:42 AM</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Form to Toggle / Update Mobile */}
        <form onSubmit={handleSave} className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Enable Real-Time Alerts</div>
              <div className="text-[11px] text-slate-500">Receive RTO approvals & postal dispatches</div>
            </div>
            <input
              type="checkbox"
              checked={isOptedIn}
              onChange={(e) => setIsOptedIn(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered WhatsApp Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                className="w-full pl-11 pr-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center border border-emerald-200">
              ✓ WhatsApp Alert Preferences Saved!
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>Confirm & Enable Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-3 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted with UIDAI & DigiLocker Consent Framework</span>
        </div>

      </div>
    </div>
  );
};
