import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  ArrowRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const RtoDirectoryPage: React.FC = () => {
  const { darkMode } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [rtosList, setRtosList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchRtos();
  }, []);

  const fetchRtos = async (query = '', state = '') => {
    setIsLoading(true);
    try {
      const res = await api.searchRtos(query, state);
      if (res.success && res.rtos) {
        setRtosList(res.rtos);
      }
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    fetchRtos(val, selectedState);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`min-h-screen py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">National RTO Directory & Helpline</span>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  Pan-India Regional Transport Office (RTO) Directory
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Search 1,400+ jurisdictional RTO and DTO offices, official contact numbers, office hours, and track locations.
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
              Database Records: <strong>{rtosList.length} Verified RTOs</strong>
            </div>
          </div>

          {/* Search & State Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-150 dark:border-slate-700">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by City, District, Address or Code (e.g. Ranchi, JH-01, Mumbai, DL-01)..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 shadow-2xs"
              />
            </div>

            <div>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); fetchRtos(searchQuery, e.target.value); }}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 shadow-2xs"
              >
                <option value="">All States & UTs</option>
                <option value="Jharkhand">Jharkhand (JH)</option>
                <option value="Delhi">Delhi (DL)</option>
                <option value="Maharashtra">Maharashtra (MH)</option>
                <option value="Karnataka">Karnataka (KA)</option>
                <option value="Bihar">Bihar (BR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Grid Cards */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading verified RTO records...</div>
        ) : rtosList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rtosList.map((rto) => (
              <div 
                key={rto.code}
                className={`rounded-3xl p-6 border shadow-md hover:shadow-xl transition-all duration-300 space-y-4 ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-[#0056D2] text-white rounded-xl text-xs font-extrabold shadow-xs">
                      {rto.code}
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                        {rto.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rto.city}, {rto.state}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(rto.code)}
                    className="text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode === rto.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === rto.code ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{rto.address}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <strong>{rto.phone}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{rto.workingHours}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Automated Track: <strong className="text-emerald-600">Operational</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate('/appointments')}
                    className="text-xs font-bold text-[#0056D2] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Book Test at this RTO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No RTO center found matching "{searchQuery}".
          </div>
        )}

      </div>
    </div>
  );
};
