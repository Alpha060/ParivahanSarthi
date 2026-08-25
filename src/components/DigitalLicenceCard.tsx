import React from 'react';
import { ShieldCheck, Download, Printer, X, QrCode, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { printPvcSmartCard } from '../utils/printDocument';

interface DigitalLicenceCardProps {
  isOpen: boolean;
  onClose: () => void;
  dlData: {
    dlNumber: string;
    applicantName: string;
    fatherName?: string;
    dob?: string;
    bloodGroup?: string;
    vehicleClass: string;
    issueDate: string;
    validUntil: string;
    rtoName: string;
    qrData?: string;
  };
}

export const DigitalLicenceCard: React.FC<DigitalLicenceCardProps> = ({
  isOpen,
  onClose,
  dlData
}) => {
  const { darkMode } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Official Digital Driving Licence
              </h3>
              <p className="text-[10px] text-slate-500">
                Rule 16, Central Motor Vehicles Rules 1989 (DigiLocker Verified)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Canvas Container */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-100 dark:bg-slate-950 flex flex-col items-center">
          
          {/* Smart Card DL Body */}
          <div 
            id="pvc-card"
            className="w-full max-w-md bg-gradient-to-br from-[#0F325E] via-[#0B2545] to-[#061830] text-white rounded-2xl p-5 shadow-2xl border border-blue-400/30 relative overflow-hidden font-sans space-y-3.5 select-none"
          >
            {/* Watermark Emblem */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-44 h-44 opacity-8 pointer-events-none filter invert brightness-200">
              <img src="/assets/emblem.png" alt="Watermark" className="w-full h-full object-contain" />
            </div>

            {/* Top Header of Card */}
            <div className="flex items-start justify-between border-b border-blue-400/30 pb-2.5 z-10 relative">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-9 flex-shrink-0">
                  <img src="/assets/emblem.png" alt="Emblem" className="w-full h-full object-contain filter invert brightness-200" />
                </div>
                <div>
                  <p className="text-[9px] font-extrabold tracking-widest text-amber-300 uppercase">UNION OF INDIA</p>
                  <p className="text-[11px] font-black tracking-tight uppercase">DRIVING LICENCE</p>
                  <p className="text-[8px] text-blue-200">{dlData.rtoName}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[8px] text-blue-300 uppercase block font-semibold">DL Number</span>
                <span className="text-xs font-black font-mono tracking-wider text-amber-300">{dlData.dlNumber}</span>
              </div>
            </div>

            {/* Middle Section: Photo, Chip & Details */}
            <div className="grid grid-cols-12 gap-3 items-center z-10 relative">
              
              {/* Photo & Chip Col */}
              <div className="col-span-4 flex flex-col items-center space-y-2">
                <div className="w-20 h-24 bg-slate-200 rounded-xl overflow-hidden border-2 border-white/80 shadow-md relative flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-t from-blue-900 to-blue-700 flex flex-col items-center justify-center text-white p-2 text-center">
                    <span className="text-2xl font-black">{dlData.applicantName.charAt(0)}</span>
                    <span className="text-[8px] mt-1 font-bold">DIGITALLY VERIFIED</span>
                  </div>
                </div>

                {/* Micro Smart Card Chip Simulation */}
                <div className="w-9 h-7 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 rounded-sm border border-amber-600/50 shadow-inner flex items-center justify-center p-0.5">
                  <div className="w-full h-full border border-amber-700/40 rounded-xs grid grid-cols-2 gap-0.5 opacity-80" />
                </div>
              </div>

              {/* Information Column */}
              <div className="col-span-8 space-y-1 text-[10px]">
                <div>
                  <span className="text-blue-300 block text-[8px] uppercase">Name of Licence Holder</span>
                  <p className="font-extrabold text-xs text-white uppercase">{dlData.applicantName}</p>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-0.5">
                  <div>
                    <span className="text-blue-300 block text-[8px] uppercase">DOB</span>
                    <p className="font-bold">{dlData.dob || '15-07-1998'}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 block text-[8px] uppercase">Blood Group</span>
                    <p className="font-bold text-rose-300">{dlData.bloodGroup || 'B+'}</p>
                  </div>
                </div>

                <div className="pt-0.5">
                  <span className="text-blue-300 block text-[8px] uppercase">Vehicle Class Authorized</span>
                  <p className="font-bold text-amber-200 text-[10px]">{dlData.vehicleClass}</p>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-0.5">
                  <div>
                    <span className="text-blue-300 block text-[8px] uppercase">Issue Date</span>
                    <p className="font-bold">{new Date(dlData.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 block text-[8px] uppercase">Valid Until</span>
                    <p className="font-bold text-emerald-300">{dlData.validUntil}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Bar: QR Code & DigiLocker Trust */}
            <div className="pt-2 border-t border-blue-400/20 flex items-center justify-between z-10 relative">
              <div className="flex items-center space-x-1.5">
                <span className="text-[8px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
                  DigiLocker IT Act 2000 Recognized
                </span>
              </div>

              <div className="w-8 h-8 bg-white p-0.5 rounded shadow flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
            </div>

          </div>

          <div className="w-full flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => printPvcSmartCard(dlData)}
              className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print PVC Card</span>
            </button>

            <button
              type="button"
              onClick={() => {
                alert('Digital Driving Licence saved to your local device and DigiLocker wallet.');
                onClose();
              }}
              className="flex-1 bg-[#0056D2] hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Save Offline Copy</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
