import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Printer, 
  FileText, 
  Car, 
  Sparkles, 
  Info, 
  Layers,
  HelpCircle,
  Clock,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { printOfficialSlip } from '../utils/printDocument';

interface FeeServiceConfig {
  id: string;
  name: string;
  formType: string;
  baseFee: number;
  hasTestFee: boolean;
  testFee: number;
  hasSmartCard: boolean;
  smartCardFee: number;
  ruleRef: string;
  appRoute: string;
}

const STATUTORY_SERVICES: FeeServiceConfig[] = [
  {
    id: 'new_ll',
    name: 'Issue of New Learner Licence (LL)',
    formType: 'Form 2',
    baseFee: 150,
    hasTestFee: true,
    testFee: 50,
    hasSmartCard: false,
    smartCardFee: 0,
    ruleRef: 'CMVR 1989, Rule 32 Serial No. 1',
    appRoute: '/apply/new-learner-license'
  },
  {
    id: 'new_dl',
    name: 'Issue of Permanent Driving Licence (DL)',
    formType: 'Form 4',
    baseFee: 200,
    hasTestFee: true,
    testFee: 300,
    hasSmartCard: true,
    smartCardFee: 200,
    ruleRef: 'CMVR 1989, Rule 32 Serial No. 4 & 5',
    appRoute: '/apply/new-driving-license'
  },
  {
    id: 'renew_dl',
    name: 'Renewal of Driving Licence',
    formType: 'Form 9',
    baseFee: 200,
    hasTestFee: false,
    testFee: 0,
    hasSmartCard: true,
    smartCardFee: 200,
    ruleRef: 'CMVR 1989, Rule 32 Serial No. 6',
    appRoute: '/apply/renew-license'
  },
  {
    id: 'add_cov',
    name: 'Addition of Another Vehicle Class (COV)',
    formType: 'Form 8',
    baseFee: 500,
    hasTestFee: true,
    testFee: 300,
    hasSmartCard: true,
    smartCardFee: 200,
    ruleRef: 'CMVR 1989, Rule 32 Serial No. 7',
    appRoute: '/apply/new-driving-license'
  },
  {
    id: 'duplicate_dl',
    name: 'Issue of Duplicate Driving Licence',
    formType: 'Form LLD',
    baseFee: 200,
    hasTestFee: false,
    testFee: 0,
    hasSmartCard: true,
    smartCardFee: 200,
    ruleRef: 'CMVR 1989, Rule 32 Serial No. 8',
    appRoute: '/apply/duplicate-license'
  },
  {
    id: 'idp',
    name: 'International Driving Permit (IDP)',
    formType: 'Form 4A',
    baseFee: 1000,
    hasTestFee: false,
    testFee: 0,
    hasSmartCard: false,
    smartCardFee: 0,
    ruleRef: 'CMVR 1989, Rule 32 Serial No. 12',
    appRoute: '/apply/international-permit'
  },
  {
    id: 'address_change',
    name: 'Change of Address in Driving Licence',
    formType: 'Form 11',
    baseFee: 200,
    hasTestFee: false,
    testFee: 0,
    hasSmartCard: true,
    smartCardFee: 200,
    ruleRef: 'CMVR 1989, Rule 32 Serial No. 10',
    appRoute: '/apply/renew-license'
  }
];

export const FeeCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, currentState } = useApp();

  const [selectedServiceId, setSelectedServiceId] = useState('new_dl');
  const [vehicleCategory, setVehicleCategory] = useState<'single' | 'both' | 'heavy'>('single');
  const [includeSmartCard, setIncludeSmartCard] = useState(true);
  const [includePostal, setIncludePostal] = useState(true);
  const [lateMonths, setLateMonths] = useState(0);

  const activeService = useMemo(() => {
    return STATUTORY_SERVICES.find(s => s.id === selectedServiceId) || STATUTORY_SERVICES[1];
  }, [selectedServiceId]);

  // Dynamic CMVR Rule 32 Calculation Engine
  const calculation = useMemo(() => {
    let multiplier = 1;
    if (vehicleCategory === 'both') multiplier = 2;
    if (vehicleCategory === 'heavy') multiplier = 1.5;

    const baseFee = Math.round(activeService.baseFee * (selectedServiceId === 'new_ll' || selectedServiceId === 'new_dl' ? multiplier : 1));
    const testFee = activeService.hasTestFee ? Math.round(activeService.testFee * (vehicleCategory === 'both' ? 2 : 1)) : 0;
    const smartCardFee = (activeService.hasSmartCard && includeSmartCard) ? activeService.smartCardFee : 0;
    const postalFee = includePostal ? 50 : 0;
    const lateFee = lateMonths > 0 ? lateMonths * 100 : 0;

    const total = baseFee + testFee + smartCardFee + postalFee + lateFee;

    return {
      baseFee,
      testFee,
      smartCardFee,
      postalFee,
      lateFee,
      total,
      multiplier
    };
  }, [activeService, vehicleCategory, includeSmartCard, includePostal, lateMonths, selectedServiceId]);

  const handlePrintSlip = () => {
    printOfficialSlip({
      title: 'Ministry of Road Transport & Highways',
      subtitle: 'Government of India • Statutory CMVR Rule 32 Tariff Schedule',
      documentType: `OFFICIAL STATUTORY TARIFF ASSESSMENT SLIP`,
      referenceNumber: `FEE-EST-${Date.now().toString().slice(-8)}`,
      applicantName: 'Citizen Estimator',
      serviceName: `${activeService.name} (${activeService.formType})`,
      rtoName: `${currentState} Transport Directorate`,
      details: [
        { label: 'Selected Service', value: `${activeService.name} (${activeService.formType})` },
        { label: 'Vehicle Category Multiplier', value: vehicleCategory === 'both' ? 'Dual Category (2W + 4W)' : vehicleCategory === 'heavy' ? 'Commercial / Heavy Vehicle' : 'Single Category (LMV / MCWG)' },
        { label: 'Application & Scrutiny Fee', value: `INR ${calculation.baseFee}` },
        { label: 'Driving Skill Test (ADTT) Fee', value: `INR ${calculation.testFee}` },
        { label: 'Smart Card Polycarbonate Issuance (Rule 16)', value: `INR ${calculation.smartCardFee}` },
        { label: 'Speed Post Doorstep Logistics', value: `INR ${calculation.postalFee}` },
        ...(calculation.lateFee > 0 ? [{ label: 'Late Renewal Surcharge', value: `INR ${calculation.lateFee}` }] : []),
        { label: 'Total Statutory Payable', value: `INR ${calculation.total}` },
        { label: 'Statutory Rule Reference', value: activeService.ruleRef }
      ],
      highlightBox: {
        label: 'Statutory Assessment Total',
        value: `INR ${calculation.total} (Exact MoRTH Tariff)`
      },
      footerNotes: [
        'This calculation is strictly governed under Central Motor Vehicles Rules (CMVR) 1989 Rule 32.',
        'No additional cash or facilitation fee is payable at any RTO counter.',
        'Official receipt will be generated upon final application submission and electronic payment.'
      ]
    });
  };

  return (
    <div className={`min-h-screen py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">Statutory Fee Calculator</span>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-[#0056D2] dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0056D2] dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
                  MoRTH Statutory Tariff Engine
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  State: <strong>{currentState}</strong>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">
                National Statutory Driving Licence Fee Calculator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Accurate, transparent fee calculation computed strictly under <strong>CMVR 1989, Rule 32</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrintSlip}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer self-start md:self-auto border border-slate-200 dark:border-slate-600 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>Print Official Tariff Slip</span>
          </button>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Parameters (7 Cols) */}
          <div className={`lg:col-span-7 rounded-3xl p-6 sm:p-7 border shadow-xl space-y-6 ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
          }`}>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0056D2]" />
              <span>Step 1: Select Service & Parameters</span>
            </h2>

            {/* 1. Service Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Statutory Driving Licence Service
              </label>
              <div className="space-y-2">
                {STATUTORY_SERVICES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                      selectedServiceId === s.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0056D2] text-[#0056D2] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{s.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                          {s.formType}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{s.ruleRef}</span>
                    </div>
                    <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                      Base: ₹{s.baseFee}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Vehicle Class Multiplier */}
            {(selectedServiceId === 'new_ll' || selectedServiceId === 'new_dl' || selectedServiceId === 'add_cov') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Vehicle Class (Class of Vehicle - COV)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'single', label: 'Single Class', sub: 'MCWG or LMV', badge: '1x Fee' },
                    { id: 'both', label: 'Dual Class', sub: '2-Wheeler + Car', badge: '2x Base' },
                    { id: 'heavy', label: 'Commercial/Heavy', sub: 'HGMV / Transport', badge: '1.5x Fee' }
                  ].map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleCategory(v.id as any)}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        vehicleCategory === v.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0056D2] text-[#0056D2] shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-extrabold text-slate-900 dark:text-white">{v.label}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{v.sub}</span>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[9px] font-bold text-slate-600 dark:text-slate-300">
                        {v.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Statutory Add-ons */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Statutory Options & Logistics
              </span>

              {activeService.hasSmartCard && (
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={includeSmartCard}
                      onChange={(e) => setIncludeSmartCard(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <div>
                      <span>PVC Polycarbonate Smart Card (Rule 16)</span>
                      <span className="block text-[10px] text-slate-400 font-normal">High-security tamper-evident chip format</span>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">+₹200</span>
                </label>
              )}

              <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includePostal}
                    onChange={(e) => setIncludePostal(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <div>
                    <span>Speed Post Doorstep Delivery (India Post)</span>
                    <span className="block text-[10px] text-slate-400 font-normal">Secure postal dispatch with SMS tracking</span>
                  </div>
                </div>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">+₹50</span>
              </label>
            </div>

            {/* 4. Late Penalty Slider for Renewal */}
            {selectedServiceId === 'renew_dl' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Expired Beyond Grace Period (30 Days)
                  </label>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {lateMonths} Months Late (+₹{lateMonths * 100})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={lateMonths}
                  onChange={(e) => setLateMonths(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  CMVR statutory late fee: ₹100 per additional month expired.
                </span>
              </div>
            )}

          </div>

          {/* Right Column: Live Statutory Assessment Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className={`rounded-3xl p-6 sm:p-7 border shadow-xl space-y-5 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
            }`}>
              <div className="flex items-center justify-between border-b dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0056D2] dark:text-blue-400">
                    Statutory Assessment
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    Itemized MoRTH Breakdown
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                  CMVR 1989
                </span>
              </div>

              {/* Itemized Lines */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Application & Scrutiny Fee ({activeService.formType}):
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₹{calculation.baseFee}</span>
                </div>

                {calculation.testFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Automated Driving Test (ADTT):
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹{calculation.testFee}</span>
                  </div>
                )}

                {calculation.smartCardFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Polycarbonate Smart Card (Rule 16):
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹{calculation.smartCardFee}</span>
                  </div>
                )}

                {calculation.postalFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Speed Post Logistics Dispatch:
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹{calculation.postalFee}</span>
                  </div>
                )}

                {calculation.lateFee > 0 && (
                  <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
                    <span>Late Renewal Surcharge:</span>
                    <span className="font-mono font-bold">₹{calculation.lateFee}</span>
                  </div>
                )}
              </div>

              {/* Total Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    Total Estimated Statutory Fee
                  </span>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                    ₹{calculation.total}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">No hidden charges</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">100% Treasury Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(activeService.appRoute)}
                  className="w-full bg-[#0056D2] hover:bg-blue-700 active:scale-98 text-white py-3.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>Apply Now with this Calculated Fee</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print Tariff Assessment</span>
                </button>
              </div>

              {/* Statutory Note */}
              <div className="flex items-start gap-2 text-[11px] text-slate-400 dark:text-slate-400 pt-2 border-t dark:border-slate-700">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Note: Payment is executed securely during online application submission. If preferred, payment can be deferred and completed later from the citizen portal.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
