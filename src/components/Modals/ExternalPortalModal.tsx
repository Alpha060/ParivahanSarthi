import React from 'react';
import { ShieldAlert, ExternalLink, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ExternalPortalInfo {
  name: string;
  urlPlaceholder: string;
  category: string;
  description: string;
  internalRoute?: string;
  internalRouteLabel?: string;
}

interface ExternalPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  portal: ExternalPortalInfo | null;
  darkMode?: boolean;
}

export const ExternalPortalModal: React.FC<ExternalPortalModalProps> = ({
  isOpen,
  onClose,
  portal,
  darkMode = false
}) => {
  const navigate = useNavigate();

  if (!isOpen || !portal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                External Link Placeholder
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                {portal.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Target National Gateway:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{portal.category}</span>
            </div>
            <div className="text-blue-600 dark:text-blue-300 font-semibold truncate flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{portal.urlPlaceholder}</span>
            </div>
          </div>

          <p className="leading-relaxed">
            {portal.description}
          </p>

          <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Sandbox Isolation:</strong> Live external internet connections to production government servers are isolated in this deployment. All features, workflows, and database actions are handled directly within this portal.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
          {portal.internalRoute && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(portal.internalRoute!);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0056D2] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>{portal.internalRouteLabel || 'Open Internal Equivalent Feature'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
