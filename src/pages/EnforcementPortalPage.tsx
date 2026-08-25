import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  FileText, 
  Printer, 
  Lock, 
  Car, 
  User, 
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChallanRecord {
  challanNumber: string;
  dlNumber: string;
  holderName: string;
  vehicleNo: string;
  offense: string;
  section: string;
  fineAmount: number;
  issuedAt: string;
  status: 'PENDING_PAYMENT' | 'PAID';
}

export const EnforcementPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [searchQuery, setSearchQuery] = useState('JH-01-2024-0001849');
  const [scannedDl, setScannedDl] = useState<any>({
    dlNumber: 'JH-01-2024-0001849',
    holderName: 'Krishna Mahto',
    fatherName: 'Late Shri Ramesh Mahto',
    dob: '15/08/1995',
    bloodGroup: 'O+',
    vehicleClasses: ['LMV (Light Motor Vehicle)', 'MCWG (Motorcycle with Gear)'],
    validUntil: '14/08/2044',
    status: 'ACTIVE',
    rtoName: 'Ranchi Regional Transport Office (JH-01)',
    mobile: '9876543210',
    pendingChallans: 0
  });

  const [selectedOffense, setSelectedOffense] = useState('SECTION_183');
  const [isIssuingChallan, setIsIssuingChallan] = useState(false);
  const [issuedChallans, setIssuedChallans] = useState<ChallanRecord[]>([
    {
      challanNumber: 'CH-JH-2026-004819',
      dlNumber: 'JH-01-2024-0001849',
      holderName: 'Krishna Mahto',
      vehicleNo: 'JH01-BW-8492',
      offense: 'Exceeding Prescribed Speed Limit (Overspeeding)',
      section: 'Section 183 MV Act',
      fineAmount: 2000,
      issuedAt: '24 Aug 2026, 03:30 PM',
      status: 'PENDING_PAYMENT'
    }
  ]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const offenseMap: Record<string, { name: string; section: string; fine: number; suspension: boolean }> = {
    'SECTION_185': {
      name: 'Driving under the influence of Alcohol / Narcotics (Drunk Driving)',
      section: 'Section 185 MV Act 1988',
      fine: 10000,
      suspension: true
    },
    'SECTION_183': {
      name: 'Exceeding Prescribed Speed Limit (Overspeeding)',
      section: 'Section 183 MV Act 1988',
      fine: 2000,
      suspension: false
    },
    'SECTION_194D': {
      name: 'Riding without Protective Headgear / Seatbelt Violation',
      section: 'Section 194D MV Act 1988',
      fine: 1000,
      suspension: false
    },
    'SECTION_180': {
      name: 'Driving without valid authorization / Unauthorized vehicle',
      section: 'Section 180 MV Act 1988',
      fine: 5000,
      suspension: true
    }
  };

  const handleSearchLicence = () => {
    if (searchQuery.toLowerCase().includes('rohit')) {
      setScannedDl({
        dlNumber: 'JH-01-2023-0009412',
        holderName: 'Rohit Verma',
        fatherName: 'Shri K. L. Verma',
        dob: '22/04/1988',
        bloodGroup: 'B+',
        vehicleClasses: ['HMV (Heavy Commercial Transport)', 'LMV'],
        validUntil: '21/04/2028',
        status: 'ACTIVE',
        rtoName: 'Ranchi RTO (JH-01)',
        mobile: '9877665544',
        pendingChallans: 1
      });
    } else {
      setScannedDl({
        dlNumber: 'JH-01-2024-0001849',
        holderName: 'Krishna Mahto',
        fatherName: 'Late Shri Ramesh Mahto',
        dob: '15/08/1995',
        bloodGroup: 'O+',
        vehicleClasses: ['LMV (Light Motor Vehicle)', 'MCWG'],
        validUntil: '14/08/2044',
        status: 'ACTIVE',
        rtoName: 'Ranchi Regional Transport Office (JH-01)',
        mobile: '9876543210',
        pendingChallans: 0
      });
    }
  };

  const handleIssueChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedDl) return;

    setIsIssuingChallan(true);
    await new Promise((r) => setTimeout(r, 600));

    const offenseInfo = offenseMap[selectedOffense];
    const challanNo = `CH-JH-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newChallan: ChallanRecord = {
      challanNumber: challanNo,
      dlNumber: scannedDl.dlNumber,
      holderName: scannedDl.holderName,
      vehicleNo: 'JH01-BW-8492',
      offense: offenseInfo.name,
      section: offenseInfo.section,
      fineAmount: offenseInfo.fine,
      issuedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING_PAYMENT'
    };

    setIssuedChallans([newChallan, ...issuedChallans]);
    setIsIssuingChallan(false);

    setNotification({
      type: 'success',
      message: `e-Challan ${challanNo} (₹${offenseInfo.fine}) issued and synced with National mParivahan Database!`
    });
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Enforcement Header Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-[#3B0000] via-[#5B1010] to-[#0056D2] text-white border-rose-900'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-400/20 border border-rose-300/40 text-rose-200 flex items-center justify-center flex-shrink-0 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider">
                  Transport Enforcement Wing
                </span>
                <span className="text-xs text-rose-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  e-Challan & MV Act Sec 19 Vigilance
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Transport Enforcement & e-Challan Console
              </h1>
              <p className="text-xs text-rose-100/80 dark:text-slate-300 mt-0.5">
                Officer In-Charge: <strong>{user?.name || 'Inspector Vikram Singh'}</strong> • Badge: <strong>{user?.badgeNo || 'ENFORCE-JH01-8492'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Link
              to="/login"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <span>Switch Persona</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className="p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-2 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Search / Scan Bar */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="relative w-full sm:max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter DL Number (JH-01-2024...), Mobile, or Vehicle Reg..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono"
            />
          </div>

          <button
            onClick={handleSearchLicence}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify Licence in Registry</span>
          </button>
        </div>

        {/* Main Workdesk Grid: Licence Card (Left) + e-Challan Issuance (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Scanned Licence Dossier (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {scannedDl && (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-5 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between pb-4 border-b dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">National Registry Match</span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{scannedDl.holderName}</h3>
                    <p className="text-xs text-slate-400 font-mono">{scannedDl.dlNumber}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                    STATUS: {scannedDl.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Father / Guardian</span>
                    <strong className="text-slate-800 dark:text-slate-200">{scannedDl.fatherName}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">DOB & Blood Group</span>
                    <strong className="text-slate-800 dark:text-slate-200">{scannedDl.dob} • {scannedDl.bloodGroup}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 col-span-2">
                    <span className="text-slate-400 block text-[10px]">Authorized Vehicle Categories</span>
                    <strong className="text-blue-600 dark:text-blue-400">{scannedDl.vehicleClasses.join(', ')}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Validity Non-Transport</span>
                    <strong className="text-slate-800 dark:text-slate-200">{scannedDl.validUntil}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Registered Contact</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">+91 {scannedDl.mobile}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: e-Challan Issuance Desk (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-5 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="pb-3 border-b dark:border-slate-700">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-rose-600" />
                  <span>Issue Statutory e-Challan</span>
                </h3>
                <p className="text-xs text-slate-400">Motor Vehicles (Amendment) Act 2019 Tariff Slabs</p>
              </div>

              <form onSubmit={handleIssueChallan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Traffic Offense Code
                  </label>
                  <select
                    value={selectedOffense}
                    onChange={(e) => setSelectedOffense(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="SECTION_183">Section 183: Overspeeding (Fine: ₹2,000)</option>
                    <option value="SECTION_185">Section 185: Drunk Driving / Narcotics (Fine: ₹10,000 + Suspension)</option>
                    <option value="SECTION_194D">Section 194D: No Helmet / Seatbelt (Fine: ₹1,000)</option>
                    <option value="SECTION_180">Section 180: Driving without valid DL (Fine: ₹5,000)</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Statutory Fine Amount:</span>
                    <strong className="text-rose-700 dark:text-rose-300 text-base font-mono font-black">
                      ₹{offenseMap[selectedOffense].fine}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Legal Provision:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{offenseMap[selectedOffense].section}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isIssuingChallan}
                  className="w-full py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  <span>{isIssuingChallan ? 'Issuing e-Challan...' : 'Generate Instant e-Challan & Sync'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Issued Challans Table */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="p-5 border-b dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Recent Enforcement e-Challans Issued ({issuedChallans.length})
            </h3>
            <span className="text-xs text-emerald-600 font-bold">mParivahan Gateway Linked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={`uppercase font-black text-[10px] tracking-wider border-b ${
                darkMode ? 'bg-slate-900/80 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="p-4">Challan Number</th>
                  <th className="p-4">Offender Name & DL</th>
                  <th className="p-4">Statutory Offense</th>
                  <th className="p-4">Fine Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                {issuedChallans.map((ch) => (
                  <tr key={ch.challanNumber} className="hover:bg-rose-50/20 dark:hover:bg-slate-700/40">
                    <td className="p-4 font-mono font-bold text-rose-700 dark:text-rose-400">{ch.challanNumber}</td>
                    <td className="p-4">
                      <strong className="text-slate-900 dark:text-white block">{ch.holderName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{ch.dlNumber}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{ch.offense}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ch.section}</span>
                    </td>
                    <td className="p-4 font-mono font-black text-rose-600 text-sm">₹{ch.fineAmount}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                        {ch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
