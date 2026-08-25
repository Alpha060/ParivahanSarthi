import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, ShieldCheck, Lock, ArrowRight, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { darkMode, login } = useApp();
  const [activeTab, setActiveTab] = useState<'citizen' | 'aadhaar' | 'official'>('citizen');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'official') {
      const officialUser = {
        id: 'OFFICER-JH01',
        name: 'Shri S. K. Verma (Senior MLO)',
        mobile: '9835012345',
        role: 'OFFICIAL',
        designation: 'Senior Motor Licensing Officer & Test Inspector',
        rtoCode: 'JH-01',
        rtoName: 'Ranchi Regional Transport Office (JH-01)',
        employeeCode: 'GOV-JH-8492'
      };
      login(officialUser);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        navigate('/officer-dashboard');
      }, 500);
      return;
    }

    if (mobileNumber.length >= 10 || activeTab === 'aadhaar') {
      setOtpSent(true);
      setOtpValue('123456');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length >= 4) {
      const citizenUser = {
        id: 'USR-001',
        name: 'Krishna Mahto',
        mobile: mobileNumber || '9876543210',
        role: 'CITIZEN',
        state: 'Jharkhand'
      };
      login(citizenUser);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setOtpSent(false);
        setOtpValue('');
        onClose();
        navigate('/applications');
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className={`rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border flex flex-col animate-in zoom-in-95 duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-150 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${
          darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-150 bg-slate-50/60'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] dark:text-blue-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Parivahan Single Sign-On
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Secure Citizen & Service Authentication
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className={`flex border-b p-1.5 gap-1 text-xs font-bold ${
          darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-150 bg-slate-50/40'
        }`}>
          <button
            onClick={() => { setActiveTab('citizen'); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'citizen' 
                ? 'bg-[#0056D2] text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Citizen Login
          </button>
          <button
            onClick={() => { setActiveTab('aadhaar'); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'aadhaar' 
                ? 'bg-[#0056D2] text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Aadhaar e-KYC
          </button>
          <button
            onClick={() => { setActiveTab('official'); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'official' 
                ? 'bg-[#0056D2] text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            RTO Official
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Authentication Successful!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Welcome to Parivahan Sarathi Citizen Portal. Logged in successfully.
              </p>
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {activeTab === 'citizen' ? 'Registered Mobile Number' : activeTab === 'aadhaar' ? '12-Digit Aadhaar Number / VID' : 'Government Official User ID'}
                </label>

                {activeTab === 'citizen' ? (
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:bg-white focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100 transition">
                    <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border-r border-slate-200 dark:border-slate-600 flex items-center gap-1 select-none">
                      <span className="text-[10px] font-black bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">IND</span> +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="w-full px-3 py-2.5 bg-transparent text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 focus:outline-none"
                      required
                    />
                  </div>
                ) : activeTab === 'aadhaar' ? (
                  <div className="relative flex items-center">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={14}
                      value={mobileNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setMobileNumber(digits.replace(/(\d{4})(?=\d)/g, '$1-'));
                      }}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold tracking-wider text-slate-800 dark:text-slate-100 focus:outline-hidden focus:bg-white focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition"
                      required
                    />
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="gov.officer@nic.in"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:bg-white focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition"
                      required
                    />
                  </div>
                )}
              </div>

              {activeTab === 'official' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password / Security PIN
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:bg-white focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-blue-500/20 active:scale-98 transition cursor-pointer"
              >
                <span>{activeTab === 'official' ? 'Login with Security Credential' : 'Generate One Time Password (OTP)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMobileNumber('9876543210'); setOtpSent(true); setOtpValue('123456'); }}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Quick Demo Login (Click to Autofill)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-blue-50/80 dark:bg-blue-950/60 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300">
                <p>OTP sent to registered identifier: <strong className="text-slate-900 dark:text-white">{mobileNumber || '9876543210'}</strong></p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Use demo code: <strong>123456</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter 6-Digit OTP
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold tracking-widest text-slate-800 dark:text-slate-100 focus:outline-hidden focus:bg-white focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition text-center"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-blue-500/20 active:scale-98 transition cursor-pointer"
              >
                <span>Verify & Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)} 
                  className="hover:text-blue-600 cursor-pointer font-medium"
                >
                  ← Change Number
                </button>
                <button 
                  type="button" 
                  onClick={() => setOtpValue('123456')} 
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 text-center border-t border-slate-150 dark:border-slate-800">
            <p className="text-[10px] text-slate-400">
              Protected by National Informatics Centre (NIC) 256-bit SSL encryption.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
