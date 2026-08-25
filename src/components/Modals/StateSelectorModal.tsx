import React, { useState } from 'react';
import { Search, MapPin, Check, X } from 'lucide-react';
import { INDIAN_STATES } from '../../data/mockData';

interface StateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: string;
  onSelectState: (stateName: string) => void;
}

export const StateSelectorModal: React.FC<StateSelectorModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onSelectState
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredStates = INDIAN_STATES.filter(st => 
    st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0056D2]" />
              <span>Select Your State / UT</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your residing state to access state-specific transport services & guidelines
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search State or Union Territory (e.g. Jharkhand, Delhi, Maharashtra)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white focus:outline-hidden focus:bg-white dark:focus:bg-slate-800 focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition"
              autoFocus
            />
          </div>
        </div>

        {/* States Grid List */}
        <div className="p-3.5 sm:p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 bg-slate-50/40 dark:bg-slate-950">
          {filteredStates.map((state) => {
            const isSelected = currentState.toLowerCase().includes(state.name.toLowerCase());
            return (
              <button
                key={state.code}
                onClick={() => {
                  onSelectState(`${state.name} (${state.code})`);
                  onClose();
                }}
                className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0056D2] bg-blue-50/80 dark:bg-blue-950/80 text-[#0056D2] dark:text-blue-300 font-bold shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-200 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    {state.code}
                  </span>
                  <span className="text-xs">{state.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#0056D2]" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Total States & UTs configured: 36</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
