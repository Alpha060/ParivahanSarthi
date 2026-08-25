import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Layers, Search, Calendar, Headphones } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHome?: () => void;
  onOpenService: (id: string) => void;
  onOpenServicesCatalog?: () => void;
  onOpenStatus: () => void;
  onOpenAppointment: () => void;
  onOpenSupport: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenHome,
  onOpenService,
  onOpenServicesCatalog,
  onOpenStatus,
  onOpenAppointment,
  onOpenSupport
}) => {
  const { t, darkMode } = useApp();
  const location = useLocation();
  const path = location.pathname;

  // Auto detect active tab from current route
  const isHome = path === '/';
  const isServices = path.startsWith('/services') || path.startsWith('/apply');
  const isStatus = path.startsWith('/status') || path.startsWith('/applications') || path.startsWith('/my-applications');
  const isAppointment = path.startsWith('/appointments');
  const isSupport = path.startsWith('/grievance') || path.startsWith('/notices') || path.startsWith('/rto-directory');

  const navItems = [
    {
      id: 'home',
      label: t.home,
      icon: Home,
      isActive: isHome,
      onClick: () => {
        setActiveTab('Home');
        if (onOpenHome) onOpenHome();
      }
    },
    {
      id: 'services',
      label: t.services,
      icon: Layers,
      isActive: isServices,
      onClick: () => {
        if (onOpenServicesCatalog) {
          onOpenServicesCatalog();
        } else {
          onOpenService('services');
        }
      }
    },
    {
      id: 'status',
      label: t.checkStatus,
      icon: Search,
      isActive: isStatus,
      onClick: onOpenStatus
    },
    {
      id: 'appointment',
      label: t.appointments,
      icon: Calendar,
      isActive: isAppointment,
      onClick: onOpenAppointment
    },
    {
      id: 'support',
      label: t.helpSupport.split(' ')[0],
      icon: Headphones,
      isActive: isSupport,
      onClick: onOpenSupport
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 select-none">
      <nav 
        aria-label="Mobile Navigation Bar"
        className={`border-t backdrop-blur-md transition-colors duration-200 shadow-lg ${
          darkMode 
            ? 'bg-slate-900/95 border-slate-800 text-slate-300' 
            : 'bg-white/95 border-slate-200 text-slate-700'
        }`}
      >
        <div className="grid grid-cols-5 h-16 items-center px-1 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-90 cursor-pointer ${
                  active 
                    ? 'text-[#0056D2] dark:text-blue-400 font-extrabold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${
                  active ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0056D2] dark:text-blue-400' : ''
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight leading-none mt-0.5 truncate max-w-[64px]">
                  {item.label}
                </span>
                {active && (
                  <span className="w-1 h-1 rounded-full bg-[#0056D2] dark:bg-blue-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
