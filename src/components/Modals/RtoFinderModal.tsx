import React, { useState, useEffect } from 'react';
import { MapPin, Search, Phone, Clock, Copy, Check, X } from 'lucide-react';
import { api } from '../../services/api';

interface RtoFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const RtoFinderModal: React.FC<RtoFinderModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [rtosList, setRtosList] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRtos(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const fetchRtos = async (q: string) => {
    setIsLoading(true);
    try {
      const res = await api.searchRtos(q);
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
    fetchRtos(val);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0056D2] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                National RTO Directory & Helpline
              </h3>
              <p className="text-xs text-slate-500">
                Regional Transport Offices from Prisma Database
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
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by City, State, or RTO Code (e.g. Ranchi, JH-01, Mumbai, DL-01)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition shadow-2xs"
              autoFocus
            />
          </div>
        </div>

        {/* RTO Cards List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {isLoading ? (
            <p className="text-xs text-slate-400 text-center py-6">Searching RTO directory...</p>
          ) : rtosList.length > 0 ? (
            rtosList.map((rto) => (
              <div 
                key={rto.code}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 bg-blue-100 text-[#0056D2] rounded-lg text-xs font-extrabold">
                      {rto.code}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rto.name}</h4>
                      <p className="text-[11px] text-slate-500">{rto.city}, {rto.state}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(rto.code)}
                    className="text-[11px] text-slate-500 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode === rto.code ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === rto.code ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50/70 p-3 rounded-xl">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{rto.address}</span>
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {rto.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      {rto.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No RTO found matching "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs text-slate-500">
          <span>Found {rtosList.length} verified Regional Transport Offices</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-slate-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
