import React from 'react';
import { 
  ArrowRight, 
  CreditCard, 
  Compass, 
  RotateCw, 
  Edit3, 
  Car, 
  FileText, 
  Globe 
} from 'lucide-react';
import { QUICK_SERVICES } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface QuickServicesProps {
  onSelectService: (serviceId: string) => void;
  onViewAllServices: () => void;
}

export const QuickServices: React.FC<QuickServicesProps> = ({
  onSelectService,
  onViewAllServices
}) => {
  const { t, darkMode } = useApp();

  const renderIcon = (id: string, color: string) => {
    switch (id) {
      case 'll-new':
        return <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#7E22CE]" />;
      case 'dl-new':
        return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#0284C7]" />;
      case 'dl-renew':
        return <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 text-[#16A34A]" strokeWidth={2.3} />;
      case 'dl-update':
        return <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#EA580C]" strokeWidth={2.3} />;
      case 'dl-add-class':
        return <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#E11D48]" strokeWidth={2.3} />;
      case 'dl-replace':
        return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#9333EA]" strokeWidth={2.3} />;
      case 'dl-idp':
        return <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-[#0D9488]" strokeWidth={2.3} />;
      default:
        return <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
    }
  };

  return (
    <section className={`pt-0 pb-6 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900' : 'bg-[#F4F7FB]'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Unified Overlapping Card Container */}
        <div className={`-mt-4 sm:-mt-8 lg:-mt-10 relative z-20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border shadow-md transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-800/95 border-slate-700 text-white shadow-black/40' 
            : 'bg-white border-slate-200/90 text-slate-800 shadow-xl shadow-slate-900/4'
        }`}>
          
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <h2 className={`text-base sm:text-2xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {t.whatDoYouNeed}
              </h2>
              <div className="w-10 sm:w-12 h-1 bg-[#0056D2] rounded-full mt-1.5 sm:mt-2" />
            </div>

            <button
              type="button"
              onClick={onViewAllServices}
              className="flex items-center space-x-1 sm:space-x-1.5 text-xs sm:text-sm font-bold text-[#0056D2] hover:text-[#0047b3] group transition cursor-pointer"
            >
              <span>{t.viewAllServices}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 7 Services Grid Row */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
            {QUICK_SERVICES.map((service) => (
              <div
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 flex flex-col items-center text-center justify-between border transition-all duration-200 cursor-pointer group hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-900 hover:border-blue-500/50' 
                    : 'bg-[#FAFCFF] hover:bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5'
                }`}
              >
                
                {/* Icon Container */}
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1.5 sm:mb-3 transition-transform duration-300 group-hover:scale-105 shadow-2xs"
                  style={{ backgroundColor: service.bgCircleColor }}
                >
                  {renderIcon(service.id, service.iconColor)}
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-0.5 sm:space-y-1 mb-1.5 sm:mb-4">
                  <h3 className={`text-[11px] sm:text-xs lg:text-sm font-bold group-hover:text-[#0056D2] transition-colors leading-tight line-clamp-2 ${
                    darkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    {service.title}
                  </h3>
                  <p className="hidden sm:block text-[10px] lg:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {service.subtitle}
                  </p>
                </div>

                {/* Action Circle Button (Desktop only for compact touch cards on mobile) */}
                <div className={`hidden sm:flex w-6 h-6 lg:w-7 lg:h-7 rounded-full border group-hover:bg-[#0056D2] group-hover:border-[#0056D2] items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-2xs ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <ArrowRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
