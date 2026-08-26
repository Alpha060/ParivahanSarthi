import React, { useState, useEffect, useRef } from 'react';
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
  const { t } = useApp();
  const location = useLocation();
  const path = location.pathname;

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Smooth Scroll-to-Hide / Scroll-to-Show Detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Keep visible near top of page
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling down -> smoothly slide navbar down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up -> smoothly slide navbar up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      label: t.helpSupport ? t.helpSupport.split(' ')[0] : 'Help',
      icon: Headphones,
      isActive: isSupport,
      onClick: onOpenSupport
    }
  ];

  return (
    <div 
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 select-none transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
    >
      <nav 
        aria-label="Mobile Navigation Bar"
        className="rounded-t-2xl border-t border-blue-500/30 backdrop-blur-2xl transition-all duration-200 shadow-[0_-10px_35px_rgba(0,0,0,0.6)] bg-[#0B2545]/98 text-white relative overflow-hidden"
      >
        {/* Subtle Top Ambient Gold/Blue Edge Glow */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="grid grid-cols-5 h-16 items-center px-1.5 max-w-lg mx-auto">
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
                    ? 'text-amber-300 font-black' 
                    : 'text-slate-300/80 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white scale-105 shadow-[0_2px_10px_rgba(37,99,235,0.4)] border border-blue-400/40' 
                    : 'hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] tracking-tight leading-none mt-1 truncate max-w-[64px]">
                  {item.label}
                </span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shadow-[0_0_6px_#fbbf24]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
