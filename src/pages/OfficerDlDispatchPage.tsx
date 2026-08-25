import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Award, 
  Truck, 
  Printer, 
  CheckCircle2, 
  Search, 
  QrCode, 
  CreditCard, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Package,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  FileText,
  Zap,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MOCK_APPLICATIONS } from '../data/mockData';
import { DigitalLicenceCard } from '../components/DigitalLicenceCard';

export const OfficerDlDispatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [applications, setApplications] = useState<any[]>(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppForCard, setSelectedAppForCard] = useState<any>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await api.getApplications();
      if (res.success && res.applications && res.applications.length > 0) {
        setApplications(res.applications);
      }
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatchSpeedPost = (app: any) => {
    const trackingNo = `EP${Math.floor(100000000 + Math.random() * 900000000)}IN`;
    setApplications(prev => prev.map(a => {
      if ((a.applicationId || a.id) === (app.applicationId || app.id)) {
        return {
          ...a,
          speedPostNo: trackingNo,
          currentStep: 9,
          currentStepName: 'DL Smart Card Dispatched via Speed Post',
          status: 'APPROVED',
          statusLabel: 'Dispatched via Speed Post'
        };
      }
      return a;
    }));

    setNotification({
      type: 'success',
      message: `Speed Post Article ${trackingNo} assigned to ${app.applicantName}. Handed over to Postal Desk.`
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePrintManifest = () => {
    window.print();
  };

  const filtered = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      (app.applicationId || '').toLowerCase().includes(q) ||
      (app.applicantName || '').toLowerCase().includes(q) ||
      (app.mobile || '').toLowerCase().includes(q) ||
      (app.speedPostNo || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Header Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-[#0B2545] to-[#0056D2] text-white border-blue-900'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  National Smart Card Printing Desk
                </span>
                <span className="text-xs text-blue-200 font-semibold">
                  India Post Logistics Integrated
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Smart Card DL & Speed Post Dispatch Desk
              </h1>
              <p className="text-xs text-blue-100/80 dark:text-slate-300 mt-0.5">
                RTO Facility: <strong>Ranchi Regional Transport Office (JH-01)</strong> • Dispatch Officer: <strong>{user?.name || 'Shri S. K. Verma (Senior MLO)'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handlePrintManifest}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Postal Manifest</span>
            </button>
            <Link
              to="/officer-dashboard"
              className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Command Center</span>
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

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Smart Cards Authorized</p>
              <h3 className="text-2xl font-black mt-0.5">{applications.length}</h3>
              <p className="text-[10px] text-slate-400">CMVR Form 7 Standard</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#0056D2] dark:text-blue-400 flex items-center justify-center shadow-xs">
              <CreditCard className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Speed Post Dispatched</p>
              <h3 className="text-2xl font-black mt-0.5">{applications.filter(a => a.speedPostNo).length || 2}</h3>
              <p className="text-[10px] text-slate-400">Postal Barcodes Linked</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Package className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Crypto-Chip Encoded</p>
              <h3 className="text-2xl font-black mt-0.5">100%</h3>
              <p className="text-[10px] text-slate-400">64KB Microchip Standard</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Search Desk */}
        <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Licence No, Applicant Name, Speed Post Barcode..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#0056D2]"
            />
          </div>

          <button
            onClick={fetchApplications}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-200 transition cursor-pointer"
            title="Refresh Records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Dispatch Table */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={`uppercase font-black text-[10px] tracking-wider border-b ${
                darkMode ? 'bg-slate-900/80 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="p-4">Permanent DL Number</th>
                  <th className="p-4">Cardholder Name</th>
                  <th className="p-4">Vehicle Category</th>
                  <th className="p-4">Speed Post Barcode</th>
                  <th className="p-4">Dispatch Status</th>
                  <th className="p-4 text-right">Logistics Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                {filtered.map((app, idx) => {
                  const dlNum = `JH-01-2024-000${idx + 1}849`;
                  const speedPost = app.speedPostNo || (idx === 0 ? 'EP928374619IN' : null);

                  return (
                    <tr key={app.id || app.applicationId} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40 transition">
                      <td className="p-4 font-mono font-extrabold text-[#0056D2] dark:text-blue-400">
                        {dlNum}
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold text-slate-900 dark:text-white">{app.applicantName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>+91 {app.mobile}</span>
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0056D2] dark:text-blue-300 font-bold text-[10px]">
                          {app.vehicleClass || 'LMV (Motor Car)'}
                        </span>
                      </td>
                      <td className="p-4">
                        {speedPost ? (
                          <div className="flex items-center space-x-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{speedPost}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pending Courier Manifest</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          speedPost 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {speedPost ? 'DISPATCHED' : 'READY TO PRINT'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedAppForCard({
                                ...app,
                                dlNumber: dlNum,
                                speedPostNo: speedPost
                              });
                              setShowCardModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0056D2] dark:text-blue-300 font-bold text-[11px] flex items-center gap-1 hover:bg-blue-100 transition cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Preview Card</span>
                          </button>

                          {!speedPost && (
                            <button
                              onClick={() => handleDispatchSpeedPost(app)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Digital Smart Card Preview Modal */}
        {showCardModal && selectedAppForCard && (
          <DigitalLicenceCard
            isOpen={showCardModal}
            onClose={() => setShowCardModal(false)}
            dlData={{
              dlNumber: selectedAppForCard.dlNumber || 'JH-01-2024-0001849',
              applicantName: selectedAppForCard.applicantName,
              fatherName: 'Late Shri Ramesh Mahto',
              dob: '15/08/1995',
              bloodGroup: 'O+',
              vehicleClass: selectedAppForCard.vehicleClass || 'LMV (Motor Car), MCWG',
              issueDate: new Date().toLocaleDateString('en-GB'),
              validUntil: '14/08/2044',
              rtoName: 'Ranchi DTO (JH-01)'
            }}
          />
        )}

      </div>
    </div>
  );
};
