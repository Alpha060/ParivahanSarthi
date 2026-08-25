import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  CreditCard, 
  Car, 
  RotateCw, 
  Edit3, 
  FileText, 
  Globe, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Search,
  CheckCircle2,
  FileCheck2,
  BookOpen,
  X,
  Sparkles
} from 'lucide-react';
import { QUICK_SERVICES } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const ServicesCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', label: 'All Services (20)' },
    { id: 'Licence Services', label: 'Licence & Permits' },
    { id: 'Updates & KYC', label: 'Update & Extract' },
    { id: 'Payments & Status', label: 'Fees & Status' },
    { id: 'Tests & Appointments', label: 'Tests & Booking' }
  ];

  const allServices = [
    // 1. Apply for Learner Licence
    {
      id: 'll-new',
      title: 'Apply for Learner Licence',
      subtitle: 'Online Application with Aadhaar e-KYC',
      bgCircleColor: '#F3E8FF',
      iconColor: '#7E22CE',
      category: 'Licence Services',
      description: 'Apply online for a new Learner Licence with instant digital document verification.',
      fee: 350,
      customRoute: '/apply/ll-new'
    },
    // 2. Apply for Driving Licence
    {
      id: 'dl-new',
      title: 'Apply for Driving Licence',
      subtitle: 'Permanent DL after 30 days of LL',
      bgCircleColor: '#E0F2FE',
      iconColor: '#0284C7',
      category: 'Licence Services',
      description: 'Schedule track test or submit DTS Form 5B for permanent Driving Licence issuance.',
      fee: 1000,
      customRoute: '/apply/dl-new'
    },
    // 3. Apply for DL Renewal
    {
      id: 'dl-renew',
      title: 'Apply for DL Renewal',
      subtitle: 'Contactless Renewal with Form 1A',
      bgCircleColor: '#DCFCE7',
      iconColor: '#16A34A',
      category: 'Licence Services',
      description: 'Renew your expired DL with integrated Form 1A Tele-Doctor digital certification.',
      fee: 450,
      customRoute: '/apply/dl-renew'
    },
    // 4. Apply for Duplicate DL
    {
      id: 'dl-replace',
      title: 'Apply for Duplicate DL',
      subtitle: 'Lost, stolen or damaged Smart Card',
      bgCircleColor: '#FEE2E2',
      iconColor: '#DC2626',
      category: 'Licence Services',
      description: 'Order a replacement PVC chip DL card with registered police NCR synchronization.',
      fee: 400,
      customRoute: '/apply/dl-replace'
    },
    // 5. Apply for Change of Address
    {
      id: 'dl-update',
      title: 'Apply for Change of Address',
      subtitle: 'Instant DigiLocker Address Sync',
      bgCircleColor: '#FFEDD5',
      iconColor: '#EA580C',
      category: 'Updates & KYC',
      description: 'Update residential address across National Transport Register using DigiLocker e-KYC.',
      fee: 500,
      customRoute: '/apply/dl-update'
    },
    // 6. International Driving Permit (IDP)
    {
      id: 'dl-idp',
      title: 'Apply for International Driving Permit (IDP)',
      subtitle: '1-Year Global Driving Authorization',
      bgCircleColor: '#CCFBF1',
      iconColor: '#0D9488',
      category: 'Licence Services',
      description: 'Obtain an official 1949 Geneva Convention IDP for driving in 150+ countries.',
      fee: 1000,
      customRoute: '/apply/dl-idp'
    },
    // 7. DL Extract
    {
      id: 'dl-extract',
      title: 'DL Extract (Form 9B)',
      subtitle: 'Official Driving Record Certificate',
      bgCircleColor: '#E0E7FF',
      iconColor: '#4F46E5',
      category: 'Updates & KYC',
      description: 'Certified extract of driving history, endorsements, and validity for embassies and claims.',
      fee: 200,
      customRoute: '/apply/dl-extract'
    },
    // 8. Fee Payments
    {
      id: 'fee-payment',
      title: 'Fee Payments (CMVR Rule 32)',
      subtitle: 'Bharatkosh National Treasury Gateway',
      bgCircleColor: '#FEF08A',
      iconColor: '#CA8A04',
      category: 'Payments & Status',
      description: 'Calculate statutory CMVR Rule 32 fees and reconcile payments with instant Form TR-5 receipts.',
      fee: 0,
      customRoute: '/fees'
    },
    // 9. Print Application Forms
    {
      id: 'print-forms',
      title: 'Print Application Forms & Slips',
      subtitle: 'Form 2, Form 4 & Digital Dossier',
      bgCircleColor: '#F1F5F9',
      iconColor: '#475569',
      category: 'Payments & Status',
      description: 'Download and print statutory Form 2, Form TR-5, and Speed Post acknowledgement slips.',
      fee: 0,
      customRoute: '/status'
    },
    // 10. Mobile Number Update
    {
      id: 'mobile-update',
      title: 'Mobile Number & Aadhaar Link',
      subtitle: 'OTP Authentication Update',
      bgCircleColor: '#E0F2FE',
      iconColor: '#0284C7',
      category: 'Updates & KYC',
      description: 'Link your active mobile number to your DL dossier for instant SMS status dispatches.',
      fee: 0,
      customRoute: '/apply/dl-update'
    },
    // 11. Service Withdraw
    {
      id: 'service-withdraw',
      title: 'Service Withdraw & Revocation',
      subtitle: 'Cancel or Recall Active Filing',
      bgCircleColor: '#FEE2E2',
      iconColor: '#EF4444',
      category: 'Updates & KYC',
      description: 'Cancel a mistakenly submitted application before MLO scrutiny approval.',
      fee: 0,
      customRoute: '/applications'
    },
    // 12. DL Services (Replace / Biometric Re-issue)
    {
      id: 'dl-services-others',
      title: 'DL Services (Replacement / Re-issue)',
      subtitle: 'Smart Card Chip Reprogramming',
      bgCircleColor: '#F3E8FF',
      iconColor: '#9333EA',
      category: 'Licence Services',
      description: 'Comprehensive driving licence endorsement and biometric re-enrolment services.',
      fee: 400,
      customRoute: '/apply/dl-replace'
    },
    // 13. Add Class of Vehicles
    {
      id: 'dl-add-class',
      title: 'Add Class of Vehicles (COV)',
      subtitle: 'Endorse MCWG, LMV or Transport',
      bgCircleColor: '#FFE4E6',
      iconColor: '#E11D48',
      category: 'Licence Services',
      description: 'Add a 2-wheeler, 4-wheeler, or heavy transport authorization to your existing DL card.',
      fee: 800,
      customRoute: '/apply/dl-add-class'
    },
    // 14. Appointments
    {
      id: 'appointments-slot',
      title: 'RTO Appointments & Slot Booking',
      subtitle: 'Reserve Test Track & Biometric Slot',
      bgCircleColor: '#DBEAFE',
      iconColor: '#2563EB',
      category: 'Tests & Appointments',
      description: 'Book computerized ADTT test tracks, document scrutiny, and biometric appointments.',
      fee: 0,
      customRoute: '/appointments'
    },
    // 15. Tutorial for LL Test
    {
      id: 'll-tutorial',
      title: 'Tutorial for LL Test (Road Safety)',
      subtitle: 'Official MoRTH Video Guide & Signage',
      bgCircleColor: '#FEF3C7',
      iconColor: '#D97706',
      category: 'Tests & Appointments',
      description: 'Mandatory road safety orientation, cautionary signs handbook, and lane discipline module.',
      fee: 0,
      customRoute: '/mock-test'
    },
    // 16. Complete your Pending Application
    {
      id: 'resume-application',
      title: 'Complete Pending Application',
      subtitle: 'Resume Incomplete Filing Dossier',
      bgCircleColor: '#DCFCE7',
      iconColor: '#059669',
      category: 'Payments & Status',
      description: 'Upload pending documents, verify payment UTR, or complete Aadhaar OTP e-sign.',
      fee: 0,
      customRoute: '/applications'
    },
    // 17. Check Payment Status
    {
      id: 'check-payment',
      title: 'Check Bharatkosh Payment Status',
      subtitle: 'Instant Bank UTR Reconciliation',
      bgCircleColor: '#FEF08A',
      iconColor: '#CA8A04',
      category: 'Payments & Status',
      description: 'Verify payment status with Core Banking Solutions (CBS) and download Form TR-5.',
      fee: 0,
      customRoute: '/status'
    },
    // 18. Upload Document
    {
      id: 'upload-document',
      title: 'Upload Document & AI Pre-Inspector',
      subtitle: 'OCR Clarity & Auto-Compressor',
      bgCircleColor: '#E0F2FE',
      iconColor: '#0284C7',
      category: 'Updates & KYC',
      description: 'Upload Aadhaar, age proofs, and Form 1A with instant AI legibility checks.',
      fee: 0,
      customRoute: '/apply/dl-new'
    },
    // 19. Online LLTest (STALL AI)
    {
      id: 'online-stall-test',
      title: 'Online LL Test (STALL AI Simulator)',
      subtitle: 'Screen Test Aid for Learner Licence',
      bgCircleColor: '#FCE7F3',
      iconColor: '#DB2777',
      category: 'Tests & Appointments',
      description: 'Computerized interactive learner licence exam simulator with instant bilingual scoring.',
      fee: 0,
      customRoute: '/mock-test'
    },
    // 20. Find Doctor
    {
      id: 'find-doctor-form1a',
      title: 'Find Form 1A Certified Doctor',
      subtitle: 'NMC Registered Tele-Medical Desk',
      bgCircleColor: '#CCFBF1',
      iconColor: '#0D9488',
      category: 'Tests & Appointments',
      description: 'Book NMC-registered medical practitioners for mandatory Form 1A fitness examination.',
      fee: 0,
      customRoute: '/apply/dl-renew'
    }
  ];

  const filteredServices = allServices.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = s.title.toLowerCase().includes(q) ||
                          s.subtitle.toLowerCase().includes(q) ||
                          s.description.toLowerCase().includes(q) ||
                          s.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen py-4 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-3 sm:mb-5">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">Services Catalog</span>
        </div>

        {/* Compact Header & Search Banner */}
        <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-md mb-4 sm:mb-6 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight leading-snug">
                  Citizen Services Catalog
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Select a contactless service to start your e-application
                </p>
              </div>
            </div>

            <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-blue-200 dark:border-slate-700 self-start sm:self-auto">
              {filteredServices.length} Services Available
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative mt-3 sm:mt-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. Learner, Renewal, Mock Test, Address)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Category Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pt-3 mt-1 pb-1 [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0056D2] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid (2-column on mobile, 3-column on desktop) */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">No matching services found</h3>
            <p className="text-xs text-slate-500 mt-0.5">Try searching with a different term or resetting the category filter.</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 text-xs text-[#0056D2] font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {filteredServices.map((service) => {
              const targetRoute = (service as any).customRoute || `/apply/${service.id}`;
              const isMock = service.id === 'mock_test' || service.id === 'll_test';
              
              return (
                <div
                  key={service.id}
                  onClick={() => navigate(targetRoute)}
                  className={`rounded-2xl p-3 sm:p-5 border shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                    darkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500/50' : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Icon & Category Pill */}
                    <div className="flex items-center justify-between gap-1">
                      <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-xs flex-shrink-0"
                        style={{ backgroundColor: service.bgCircleColor }}
                      >
                        <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: service.iconColor }} />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider bg-blue-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-blue-100 dark:border-slate-700 truncate max-w-[80px] sm:max-w-none">
                        {service.category.replace(' Services', '')}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#0056D2] transition-colors leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                        {service.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed hidden sm:block">
                        {service.description}
                      </p>
                    </div>

                    {/* Compact Fee & Mode Tag */}
                    <div className="flex items-center justify-between py-1 px-2 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-900/80 text-[10px] sm:text-[11px] border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400 hidden xs:inline">Fee:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {service.fee === 0 ? 'Free' : `₹${service.fee}`}
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        {isMock ? 'Mock Exam' : 'e-KYC'}
                      </span>
                    </div>
                  </div>

                  {/* Compact CTA Footer */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 mt-2 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold text-[#0056D2] group-hover:underline truncate">
                      {isMock ? 'Practice' : 'Apply Now'}
                    </span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center group-hover:bg-[#0056D2] group-hover:text-white transition flex-shrink-0">
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
