import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Printer,
  CreditCard,
  Building,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { printOfficialSlip } from '../utils/printDocument';

export const FeeCalculatorPage: React.FC = () => {
  const { darkMode } = useApp();

  const [serviceType, setServiceType] = useState('new_dl');
  const [vehicleCategory, setVehicleCategory] = useState('lmv');
  const [includeSmartCard, setIncludeSmartCard] = useState(true);
  const [includePostal, setIncludePostal] = useState(true);
  const [lateMonths, setLateMonths] = useState(0);

  const [breakdown, setBreakdown] = useState<any>({
    baseFee: 200,
    testFee: 300,
    smartCardFee: 200,
    postalFee: 50,
    lateFee: 0,
    totalAmount: 750,
    statutoryRule: 'Central Motor Vehicles Rules (CMVR) 1989, Rule 32'
  });

  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState('UPI');

  useEffect(() => {
    calculateLive();
  }, [serviceType, vehicleCategory, includeSmartCard, includePostal, lateMonths]);

  const calculateLive = async () => {
    try {
      const res = await api.calculateFee({
        serviceType,
        vehicleCategory,
        includeSmartCard,
        includePostal,
        lateMonths
      });
      if (res.success && res.breakdown) {
        setBreakdown(res.breakdown);
      }
    } catch (err) {
      // Fallback
    }
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const res = await api.initiatePayment({
        applicationId: 'DL1234567890123',
        applicantName: 'Krishna Mahto',
        amount: breakdown.totalAmount,
        breakdown,
        paymentMode: selectedGateway
      });

      if (res.success && res.payment) {
        setPaymentSuccess(res.payment);
      }
    } catch (err) {
      alert('Payment processing failed.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">Statutory Fee Calculator & Payment</span>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                National Statutory Fee Calculator & e-Payment
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Central Motor Vehicles Rules (CMVR) 1989, Rule 32 Official Fee Assessment & Instant Reconciliation Engine.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          
          {paymentSuccess ? (
            /* Official Executive Payment Receipt */
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Executive Cryptographic Verification Seal */}
              <div className="relative inline-flex items-center justify-center mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 p-0.5 shadow-xl shadow-emerald-500/20">
                  <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center border border-emerald-400/30">
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest shadow-md">
                  TREASURY RECONCILED
                </span>
              </div>

              <div>
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Bharatkosh National Treasury • Form TR-5 Receipt
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Payment Reconciled & Statutory Receipt Issued
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Reconciled with RBI Central Banking Gateway and synced with Sarathi National Database.
                </p>
              </div>

              {/* Receipt Slip */}
              <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Transaction Reference</span>
                    <p className="text-lg font-black text-[#0056D2] dark:text-blue-400">{paymentSuccess.transactionId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Amount Paid</span>
                    <p className="text-lg font-black text-emerald-600">₹{paymentSuccess.amount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400">Application Number:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{paymentSuccess.applicationId || 'DL1234567890123'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Bank Reference No:</span>
                    <p className="font-bold font-mono text-slate-800 dark:text-slate-200">{paymentSuccess.bankRefNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Payment Mode:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{paymentSuccess.paymentMode}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Timestamp:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => printOfficialSlip({
                    title: 'Statutory Fee Payment & Tax Invoice Receipt',
                    subtitle: 'Ministry of Road Transport & Highways - CMVR 1989 Rule 32',
                    documentType: 'Official Payment Receipt',
                    referenceNumber: paymentSuccess.transactionId,
                    applicantName: paymentSuccess.applicantName || 'Krishna Mahto',
                    serviceName: serviceType === 'new_dl' ? 'Issue of Permanent Driving Licence' : 'Transport Service',
                    details: [
                      { label: 'Transaction Reference ID', value: paymentSuccess.transactionId },
                      { label: 'Bank Gateway Reference', value: paymentSuccess.bankRefNo },
                      { label: 'Sarathi Application Number', value: paymentSuccess.applicationId || 'DL1234567890123' },
                      { label: 'Applicant Name', value: paymentSuccess.applicantName || 'Krishna Mahto' },
                      { label: 'Payment Mode', value: paymentSuccess.paymentMode || 'BHIM / UPI' },
                      { label: 'Application Form & Processing Fee', value: `₹${breakdown.baseFee}` },
                      { label: 'Automated Driving Test (ADTT)', value: `₹${breakdown.testFee}` },
                      { label: 'Smart Card Polycarbonate Issuance', value: `₹${breakdown.smartCardFee}` },
                      { label: 'Speed Post Dispatch Charges', value: `₹${breakdown.postalFee}` },
                      { label: 'Total Reconciled Amount', value: `₹${paymentSuccess.amount}` }
                    ],
                    highlightBox: {
                      label: 'RBI Core Banking Reconciliation Status',
                      value: `SUCCESS (₹${paymentSuccess.amount} Reconciled)`
                    },
                    footerNotes: [
                      'This e-Receipt is an authentic proof of statutory CMVR payment.',
                      'No further fee or service charge is payable at any RTO counter.',
                      'In case of any reconciliation queries, quote the Transaction Reference ID: ' + paymentSuccess.transactionId
                    ]
                  })}
                  className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-600"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice & Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentSuccess(null)}
                  className="px-6 py-3 rounded-2xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Calculate Another Fee
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Service Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Driving Licence Service
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="new_ll">Issue of Learner Licence (LL) - Form 2</option>
                  <option value="new_dl">Issue of Permanent Driving Licence (DL) - Form 4</option>
                  <option value="renew_dl">Renewal of Driving Licence - Form 9</option>
                  <option value="endorse">Addition of Another Vehicle Class (COV)</option>
                  <option value="duplicate_dl">Duplicate Driving Licence (Lost/Damage)</option>
                  <option value="idp">International Driving Permit (IDP)</option>
                </select>
              </div>

              {/* Vehicle Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Vehicle Category
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: 'mcwg', label: '2-Wheeler' },
                    { id: 'lmv', label: '4-Wheeler' },
                    { id: 'both', label: 'Both (2W+4W)' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleCategory(v.id)}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
                        vehicleCategory === v.id
                          ? 'bg-blue-50 dark:bg-blue-950 border-[#0056D2] text-[#0056D2] shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="flex items-center space-x-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSmartCard}
                    onChange={(e) => setIncludeSmartCard(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>PVC Smart Card Driving Licence issuance charge (Form 7) (+₹200)</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePostal}
                    onChange={(e) => setIncludePostal(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Speed Post Doorstep Residential Delivery via India Post (+₹50)</span>
                </label>
              </div>

              {/* Statutory CMVR Breakdown Card */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 text-xs text-slate-800 dark:text-slate-200">
                <div className="flex items-center justify-between border-b dark:border-slate-700 pb-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Statutory Assessment</span>
                  <span className="text-[10px] text-blue-600 font-semibold">{breakdown.statutoryRule}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Application Form & Processing Fee:</span>
                  <span className="font-bold">₹{breakdown.baseFee}</span>
                </div>

                {breakdown.testFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Automated Driving Skill Test Fee (ADTT):</span>
                    <span className="font-bold">₹{breakdown.testFee}</span>
                  </div>
                )}

                {includeSmartCard && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Smart Card Polycarbonate DL (Rule 16):</span>
                    <span className="font-bold">₹{breakdown.smartCardFee}</span>
                  </div>
                )}

                {includePostal && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Speed Post Dispatch Logistics:</span>
                    <span className="font-bold">₹{breakdown.postalFee}</span>
                  </div>
                )}

                <div className="border-t dark:border-slate-700 pt-3 flex justify-between items-center text-sm font-black">
                  <span>Total Payable Statutory Fee:</span>
                  <span className="text-xl text-emerald-600 dark:text-emerald-400">₹{breakdown.totalAmount}</span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Payment Gateway / Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'UPI', label: 'BHIM / UPI / QR' },
                    { id: 'NET_BANKING', label: 'SBI / Canara ePay' },
                    { id: 'DEBIT_CARD', label: 'RuPay / Debit Card' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGateway(g.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        selectedGateway === g.id
                          ? 'bg-blue-50 dark:bg-blue-950 border-[#0056D2] text-[#0056D2]'
                          : 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Now Button */}
              <div>
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isPaying}
                  className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition cursor-pointer"
                >
                  <span>{isPaying ? 'Connecting to Core Banking (CBS)...' : `Pay ₹${breakdown.totalAmount} & Reconcile Payment`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
