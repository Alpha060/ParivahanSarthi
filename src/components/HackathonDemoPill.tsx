import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  FileCheck2, 
  Calendar, 
  Calculator, 
  MapPin, 
  Headphones, 
  Award,
  Zap,
  X,
  FileText,
  ShieldCheck,
  Car,
  Bell,
  Crown,
  Stethoscope,
  BookOpen,
  Users,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export const HackathonDemoPill: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-collapse when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (isDismissed) return null;

  const demoScenarios = [
    {
      icon: Sparkles,
      title: '🎤 Bhasha Sahayak Voice AI & Page Walkthrough',
      route: '/services',
      badge: 'Voice AI'
    },
    {
      icon: Award,
      title: '🎧 Audio LL Mock Exam & 3D ADTT Track Guide',
      route: '/mock-test',
      badge: 'Bilingual Audio'
    },
    {
      icon: FileText,
      title: '📸 AI Document Doctor & Jan Seva QR Pass',
      route: '/apply/ll-new',
      badge: '0-KB Tension'
    },
    {
      icon: FileCheck2,
      title: '📦 Live Journey, WhatsApp Radar & Speed Post',
      route: '/status?appId=DL1234567890123',
      badge: 'Step 6 Live'
    },
    {
      icon: CheckCircle2,
      title: '🪪 Approved DL with Digital PVC Card & QR',
      route: '/status?appId=DL9876543210987',
      badge: 'Approved DL'
    },
    {
      icon: Calendar,
      title: '📅 Automated RTO Track Slot Booking',
      route: '/appointments',
      badge: 'Live Token #042'
    },
    {
      icon: Calculator,
      title: '💰 CMVR Rule 32 Transparent Fee Engine',
      route: '/fees',
      badge: 'Statutory'
    },
    {
      icon: MapPin,
      title: '📍 36 States/UTs National RTO Locator',
      route: '/rto-directory',
      badge: 'Verified'
    },
    {
      icon: Headphones,
      title: '⚖️ CPGRAMS Nodal Grievance Redressal',
      route: '/grievance',
      badge: 'Helpdesk'
    },
    {
      icon: ShieldCheck,
      title: '9. RTO Officer Command & Overview',
      route: '/officer-dashboard',
      badge: 'Command Center'
    },
    {
      icon: FileText,
      title: '10. Form 2 & 4 Scrutiny Queue',
      route: '/officer-scrutiny',
      badge: 'Scrutiny Desk'
    },
    {
      icon: Car,
      title: '11. ADTT Sensor Skill Track Clearance',
      route: '/officer-adtt',
      badge: 'Sensor Track'
    },
    {
      icon: Award,
      title: '12. Smart Card DL & Speed Post Dispatch',
      route: '/officer-dl-dispatch',
      badge: 'Dispatch Desk'
    },
    {
      icon: Bell,
      title: '13. MoRTH Gazette & Notice Publisher',
      route: '/officer-notifications',
      badge: 'Publish Desk'
    },
    {
      icon: Crown,
      title: '14. Super Admin Directorate & Officers',
      route: '/admin-dashboard',
      badge: 'Director General'
    },
    {
      icon: Stethoscope,
      title: '15. Registered Doctor Form 1A Medical Desk',
      route: '/doctor-portal',
      badge: 'Medical Doctor'
    },
    {
      icon: BookOpen,
      title: '16. Accredited Driving Training School (DTS)',
      route: '/dts-portal',
      badge: 'DTS Form 5B'
    },
    {
      icon: Users,
      title: '17. RTO Counter Biometrics & Token Caller',
      route: '/counter-desk',
      badge: 'Counter 01'
    },
    {
      icon: AlertTriangle,
      title: '18. Transport Enforcement & e-Challan',
      route: '/enforcement-portal',
      badge: 'Flying Squad'
    }
  ];

  return (
    <div ref={containerRef} className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 max-w-[calc(100vw-24px)]">
      {isOpen ? (
        <div className="bg-[#0B2545] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-blue-400/40 w-[calc(100vw-24px)] max-w-sm sm:w-96 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-blue-800">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Evaluation Shortcuts
                </h4>
                <p className="text-[10px] text-blue-200">1-Click Test Scenarios for Evaluators</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-blue-800 text-slate-300 flex items-center justify-center transition cursor-pointer"
                title="Minimize"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="w-6 h-6 rounded-full hover:bg-blue-800 text-slate-300 flex items-center justify-center transition cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="py-2 space-y-1.5 max-h-64 overflow-y-auto pr-1 text-xs">
            {demoScenarios.map((demo, idx) => {
              const IconComponent = demo.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    navigate(demo.route);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-blue-900/80 transition flex items-center justify-between border border-transparent hover:border-blue-400/30 cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 min-w-0 pr-2">
                    <IconComponent className="w-3.5 h-3.5 text-blue-300 group-hover:text-amber-300 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white truncate">
                      {demo.title}
                    </span>
                  </div>
                  <span className="text-[9px] font-extrabold bg-blue-950 border border-blue-400/40 text-amber-300 px-2 py-0.5 rounded-full flex-shrink-0">
                    {demo.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-blue-800 text-[10px] text-blue-300 text-center">
            Built with React, Express, Prisma ORM, Neon PostgreSQL & Multi-Language Localization
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#0056D2] to-[#003882] hover:from-blue-700 hover:to-blue-900 text-white px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full shadow-2xl border border-amber-400/80 sm:border-2 flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-black transition cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-current animate-bounce" />
          <span className="text-amber-200 hidden xs:inline">Quick Demo</span>
          <span className="text-amber-200 xs:hidden">Demo</span>
          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200" />
        </button>
      )}
    </div>
  );
};
