import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Eye, 
  Headphones, 
  Smartphone 
} from 'lucide-react';
import { TRUST_POINTS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const TrustBar: React.FC = () => {
  const { t, darkMode } = useApp();

  const renderIcon = (id: string) => {
    switch (id) {
      case 'tp-1':
        return <ShieldCheck className="w-5 h-5 text-[#0056D2]" />;
      case 'tp-2':
        return <Zap className="w-5 h-5 text-[#0056D2]" />;
      case 'tp-3':
        return <Eye className="w-5 h-5 text-[#0056D2]" />;
      case 'tp-4':
        return <Headphones className="w-5 h-5 text-[#0056D2]" />;
      case 'tp-5':
        return <Smartphone className="w-5 h-5 text-[#0056D2]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#0056D2]" />;
    }
  };

  const getTranslatedTitle = (id: string, fallback: string) => {
    switch (id) {
      case 'tp-1':
        return t.secureVerified;
      case 'tp-2':
        return t.fastEasy;
      case 'tp-3':
        return t.transparent;
      case 'tp-4':
        return t.reliableServices;
      case 'tp-5':
        return t.anywhereAccess;
      default:
        return fallback;
    }
  };

  return (
    <section className={`py-4 sm:py-6 border-t border-b transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* 5 Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-6">
          {TRUST_POINTS.map((item) => (
            <div 
              key={item.id}
              className={`p-2 sm:p-3 rounded-xl flex items-center space-x-2.5 sm:space-x-3 transition-colors ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0 shadow-2xs">
                {renderIcon(item.id)}
              </div>

              <div>
                <h4 className={`text-[11px] sm:text-xs font-bold leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {getTranslatedTitle(item.id, item.title)}
                </h4>
                <p className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
