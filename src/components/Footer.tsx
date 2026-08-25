import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  ArrowUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExternalPortalModal, ExternalPortalInfo } from './Modals/ExternalPortalModal';

export const Footer: React.FC = () => {
  const { t, darkMode } = useApp();
  const [activePortalModal, setActivePortalModal] = useState<ExternalPortalInfo | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPlaceholder = (portal: ExternalPortalInfo) => {
    setActivePortalModal(portal);
  };

  return (
    <>
      <footer className="bg-[#0B1E36] text-white pt-10 pb-28 md:pt-14 md:pb-12 border-t border-blue-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Section */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-7 sm:gap-8 pb-8 sm:pb-12 border-b border-blue-900/40">
            
            {/* Col 1 & 2: Branding & Identity */}
            <div className="col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-12 sm:w-10 sm:h-13 flex-shrink-0">
                  <img 
                    src="/assets/emblem.png" 
                    alt="Emblem" 
                    className="w-full h-full object-contain filter invert brightness-200" 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-xl font-extrabold tracking-tight uppercase">PARIVAHAN</span>
                    <span className="text-lg sm:text-xl font-extrabold tracking-tight text-blue-400 uppercase">SARATHI</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-blue-200/80 font-medium">
                    {t.govIndia}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal">
                    {t.morth}
                  </p>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-sm">
                An initiative under the Digital India flagship program by the Ministry of Road Transport and Highways to facilitate seamless, contactless driving licence and vehicle services across all 36 States & UTs.
              </p>

              <div className="flex items-center space-x-2.5 pt-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-blue-300">Powered by:</span>
                <span className="text-[11px] sm:text-xs font-extrabold bg-blue-900/60 border border-blue-400/20 px-2.5 py-0.5 rounded-full text-blue-200">
                  National Informatics Centre (NIC)
                </span>
              </div>
            </div>

            {/* Col 3: Quick Services Links */}
            <div className="col-span-1 space-y-2.5 sm:space-y-3">
              <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-300">
                Licence Services
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-slate-300">
                <li><Link to="/apply/ll-new" className="hover:text-white transition block">Learner Licence</Link></li>
                <li><Link to="/apply/dl-new" className="hover:text-white transition block">New Driving Licence</Link></li>
                <li><Link to="/apply/dl-renew" className="hover:text-white transition block">Licence Renewal</Link></li>
                <li><Link to="/apply/dl-replace" className="hover:text-white transition block">Duplicate DL</Link></li>
                <li><Link to="/apply/dl-idp" className="hover:text-white transition block">IDP Permit</Link></li>
                <li><Link to="/mock-test" className="hover:text-white transition text-amber-300 font-bold block">LL Mock Test</Link></li>
                <li><Link to="/services" className="hover:text-white transition font-bold text-blue-300 block">All Services →</Link></li>
              </ul>
            </div>

            {/* Col 4: Important Portals (Placeholders) */}
            <div className="col-span-1 space-y-2.5 sm:space-y-3">
              <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-300">
                Important Portals
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenPlaceholder({
                      name: 'Vahan 4.0 National Vehicle Registry',
                      urlPlaceholder: 'sandbox://vahan.parivahan.gov.in',
                      category: 'Vehicle Registration & RC Services',
                      description: 'Vahan 4.0 is the centralized national portal for Motor Vehicle Registration, Fitness Certificates, and Road Tax payments across India.'
                    })}
                    className="hover:text-white flex items-center gap-1 text-left cursor-pointer transition text-[11px] sm:text-xs"
                  >
                    <span>Vahan Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenPlaceholder({
                      name: 'National e-Challan & Traffic Vigilance',
                      urlPlaceholder: 'sandbox://echallan.parivahan.gov.in',
                      category: 'Traffic Enforcement & Penalty Gateway',
                      description: 'Integrated platform for traffic enforcement officers to issue electronic challans and citizens to pay statutory MV Act penalties.',
                      internalRoute: '/enforcement-portal',
                      internalRouteLabel: 'Open Police Enforcement Portal'
                    })}
                    className="hover:text-white flex items-center gap-1 text-left cursor-pointer transition text-[11px] sm:text-xs"
                  >
                    <span>e-Challan</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenPlaceholder({
                      name: 'DigiLocker National Identity Cloud',
                      urlPlaceholder: 'sandbox://digilocker.gov.in/api/v2',
                      category: 'Paperless e-KYC & Document Repository',
                      description: 'MeitY flagship digital document wallet allowing instant cryptographic verification of Driving Licences and Registration Certificates.'
                    })}
                    className="hover:text-white flex items-center gap-1 text-left cursor-pointer transition text-[11px] sm:text-xs"
                  >
                    <span>DigiLocker</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenPlaceholder({
                      name: 'Ministry of Road Transport & Highways (MoRTH)',
                      urlPlaceholder: 'sandbox://morth.nic.in/gazettes',
                      category: 'Government Directorate & Central Gazette',
                      description: 'Central Ministry responsible for formulating national road safety policies, Central Motor Vehicle Rules (CMVR 1989), and national transport notifications.',
                      internalRoute: '/notices',
                      internalRouteLabel: 'View National Gazettes & Notices'
                    })}
                    className="hover:text-white flex items-center gap-1 text-left cursor-pointer transition text-[11px] sm:text-xs"
                  >
                    <span>MoRTH Official</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </li>
                <li>
                  <Link to="/notices" className="hover:text-white transition font-semibold text-blue-300 block">
                    Public Notices & Updates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 5: Contact & Toll Free */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-2.5 sm:space-y-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-blue-900/40">
              <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-300">
                Citizen Helpdesk
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-slate-300">
                <div className="flex flex-wrap sm:flex-col items-baseline sm:items-start gap-x-2 gap-y-0.5">
                  <span className="text-slate-400">Toll Free:</span>
                  <span className="text-sm sm:text-base font-extrabold text-blue-400">1800-1800-151</span>
                </div>
                <p className="text-[10px] text-slate-400">06:00 AM to 10:00 PM (All 7 Days)</p>
                <div className="pt-0.5">
                  <span className="text-slate-400 block text-[10px]">Support Email:</span>
                  <span className="text-blue-300 font-semibold text-[11px] sm:text-xs">helpdesk-sarathi@gov.in</span>
                </div>
                <p className="pt-1">
                  <Link to="/grievance" className="text-amber-300 hover:text-white font-bold inline-flex items-center gap-1">
                    <span>Raise Grievance (CPGRAMS) →</span>
                  </Link>
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Strip */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-400 text-center sm:text-left">
            <div>
              <p>© {new Date().getFullYear()} Ministry of Road Transport and Highways. All Rights Reserved.</p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Designed & Developed by National Informatics Centre (NIC) for Government of India.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px]">
              <Link to="/terms" className="hover:text-white transition">Citizen Charter</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <span>•</span>
              <Link to="/accessibility" className="hover:text-white transition">Accessibility</Link>
              <span>•</span>
              <button
                onClick={scrollToTop}
                className="p-1.5 sm:p-2 bg-blue-900/60 hover:bg-blue-800 rounded-full text-white transition cursor-pointer"
                aria-label="Back to top"
              >
                <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* External Portal Placeholder Modal */}
      <ExternalPortalModal
        isOpen={Boolean(activePortalModal)}
        onClose={() => setActivePortalModal(null)}
        portal={activePortalModal}
        darkMode={darkMode}
      />
    </>
  );
};
