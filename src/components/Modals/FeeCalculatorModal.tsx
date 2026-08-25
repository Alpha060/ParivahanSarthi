import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

interface FeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeeCalculatorModal: React.FC<FeeCalculatorModalProps> = ({ isOpen, onClose }) => {
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
    totalAmount: 750
  });

  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      calculateLive();
    }
  }, [isOpen, serviceType, vehicleCategory, includeSmartCard, includePostal, lateMonths]);

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
        paymentMode: 'UPI'
      });

      if (res.success && res.payment) {
        setPaymentSuccess(res.payment);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert('Payment processing failed.');
    } finally {
      setIsPaying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Statutory Fee Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Rule 32, Central Motor Vehicles Rules (CMVR) 1989 (Live API)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {paymentSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  Payment Reconciled & Confirmed!
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receipt Ref: <strong>{paymentSuccess.transactionId}</strong>
                </p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  Bank Reference: {paymentSuccess.bankRefNo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => { setPaymentSuccess(null); onClose(); }}
                className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close & View Updated Application
              </button>
            </div>
          ) : (
            <>
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Driving Licence Service
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="new_ll">Issue of Learner Licence (LL)</option>
                  <option value="new_dl">Issue of Permanent Driving Licence (DL)</option>
                  <option value="renew_dl">Renewal of Driving Licence</option>
                  <option value="endorse">Addition of Another Vehicle Class</option>
                  <option value="duplicate_dl">Duplicate Driving Licence (Lost/Torn)</option>
                  <option value="idp">International Driving Permit (IDP)</option>
                </select>
              </div>

              {/* Vehicle Class */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vehicle Class
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setVehicleCategory('mcwg')}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border cursor-pointer transition ${
                      vehicleCategory === 'mcwg' ? 'bg-blue-50 border-[#0056D2] text-[#0056D2]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    2-Wheeler (MCWG)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleCategory('lmv')}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border cursor-pointer transition ${
                      vehicleCategory === 'lmv' ? 'bg-blue-50 border-[#0056D2] text-[#0056D2]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    4-Wheeler (LMV)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleCategory('both')}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border cursor-pointer transition ${
                      vehicleCategory === 'both' ? 'bg-blue-50 border-[#0056D2] text-[#0056D2]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Both (MCWG + LMV)
                  </button>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={includeSmartCard}
                    onChange={(e) => setIncludeSmartCard(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  <span>Include Smart Card Form 7 Fee (+₹200)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={includePostal}
                    onChange={(e) => setIncludePostal(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  <span>Speed Post Doorstep Delivery (+₹50)</span>
                </label>
              </div>

              {/* Statutory Breakdown Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Application / Service Fee:</span>
                  <span className="font-semibold text-slate-800">₹{breakdown.baseFee}</span>
                </div>
                {breakdown.testFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>RTO Driving Skill Test Fee:</span>
                    <span className="font-semibold text-slate-800">₹{breakdown.testFee}</span>
                  </div>
                )}
                {includeSmartCard && (
                  <div className="flex justify-between text-slate-600">
                    <span>PVC Smart Card Issuance:</span>
                    <span className="font-semibold text-slate-800">₹{breakdown.smartCardFee}</span>
                  </div>
                )}
                {includePostal && (
                  <div className="flex justify-between text-slate-600">
                    <span>Speed Post Courier Dispatch:</span>
                    <span className="font-semibold text-slate-800">₹{breakdown.postalFee}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>Total Payable Amount:</span>
                  <span className="text-base text-emerald-700">₹{breakdown.totalAmount}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isPaying}
                  className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
                >
                  <span>{isPaying ? 'Connecting to RBI e-Pay...' : 'Simulate UPI / NetBanking Payment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
