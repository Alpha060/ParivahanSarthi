import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Fingerprint,
  Crown,
  Stethoscope,
  Car,
  Scale,
  Users,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { DigiLockerModal, DigiLockerFetchedData } from '../components/Modals/DigiLockerModal';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { darkMode, login } = useApp();

  const getIntendedRedirect = (defaultFallback: string, userRole?: string) => {
    const fromState = (location.state as any)?.from;
    const fromPath = typeof fromState === 'string' 
      ? fromState 
      : fromState?.pathname 
      ? `${fromState.pathname}${fromState.search || ''}` 
      : null;
    const redirectParam = searchParams.get('redirect') || searchParams.get('returnTo');
    const target = fromPath || redirectParam;
    
    if (!target || target === '/' || target === '/login' || target === '%2F') {
      return defaultFallback;
    }

    const isOfficial = userRole && userRole !== 'CITIZEN';
    const isCitizenOnlyRoute = target.startsWith('/applications') || target.startsWith('/my-applications');
    const isOfficerOnlyRoute = target.startsWith('/officer') || target.startsWith('/admin') || target.startsWith('/doctor') || target.startsWith('/dts') || target.startsWith('/counter') || target.startsWith('/enforcement');

    if (isOfficial && isCitizenOnlyRoute) {
      return defaultFallback;
    }
    if (!isOfficial && isOfficerOnlyRoute) {
      return '/applications';
    }

    return target;
  };
  
  // Login Tab
  const [loginType, setLoginType] = useState<'mobile' | 'aadhaar' | 'official'>('mobile');
  
  // Citizen state
  const [identifier, setIdentifier] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isDigiLockerOpen, setIsDigiLockerOpen] = useState(false);

  const handleDigiLockerLoginSuccess = (data: DigiLockerFetchedData) => {
    const citizenUser = {
      id: 'USR-001',
      name: data.applicantName || 'Krishna Mahto',
      mobile: data.mobile || '9876543210',
      role: 'CITIZEN',
      state: data.state || 'Jharkhand',
      isDigiLockerVerified: true,
      digiLockerData: data
    };
    login(citizenUser);
    setIsSuccess(true);
    setTimeout(() => {
      const target = getIntendedRedirect('/applications');
      navigate(target, { replace: true });
    }, 500);
  };
  
  // Official Officer State
  const [officerUsername, setOfficerUsername] = useState('OFFICER-JH01');
  const [officerPassword, setOfficerPassword] = useState('Parivahan@2024');
  const [officerRto, setOfficerRto] = useState('JH-01');
  const [officerPin, setOfficerPin] = useState('8492');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // CITIZEN OTP DISPATCH
  const handleSendCitizenOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (loginType === 'mobile') {
      const cleanMobile = identifier.replace(/\D/g, '');
      if (cleanMobile.length !== 10) {
        setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
        return;
      }
    } else if (loginType === 'aadhaar') {
      const cleanAadhaar = identifier.replace(/\D/g, '');
      if (cleanAadhaar.length !== 12) {
        setErrorMsg('Please enter a valid 12-digit Aadhaar Number.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const cleanIdentifier = identifier.replace(/\D/g, '');
      const res = await api.sendOtp(cleanIdentifier, loginType);
      if (res.success) {
        setOtpSent(true);
        setOtp(res.demoOtp || '123456');
      } else {
        setErrorMsg(res.error || 'Failed to dispatch OTP.');
      }
    } catch (err) {
      setErrorMsg('Authentication server unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  // CITIZEN VERIFY OTP
  const handleVerifyCitizenOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit authentication OTP.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const cleanIdentifier = identifier.replace(/\D/g, '');
      const res = await api.verifyOtp(cleanIdentifier, cleanOtp, 'Krishna Mahto');
      if (res.success) {
        const citizenUser = {
          id: 'USR-001',
          name: 'Krishna Mahto',
          mobile: cleanIdentifier || '9876543210',
          role: 'CITIZEN',
          state: 'Jharkhand'
        };
        login(citizenUser);
        setIsSuccess(true);
        setTimeout(() => {
          const target = getIntendedRedirect('/applications');
          navigate(target, { replace: true });
        }, 500);
      } else {
        setErrorMsg(res.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg('Authentication verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // RTO OFFICIAL LOGIN (USERNAME + PASSWORD + PIN)
  // RTO OFFICIAL & STAKEHOLDER MULTI-ROLE LOGIN
  const handleOfficialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const identifier = officerUsername.trim().toUpperCase();

    if (!identifier) {
      setErrorMsg('Please enter your Official Staff ID / Registration Number.');
      return;
    }
    if (!officerPassword.trim() || officerPassword.length < 4) {
      setErrorMsg('Please enter your valid Password or PIN.');
      return;
    }

    setIsLoading(true);
    try {
      // Authenticate via backend / local persona mapping
      let userObj: any = null;
      let targetRoute = '/officer-dashboard';

      if (identifier.includes('ADMIN') || identifier.includes('MORTH') || identifier === 'SUPERADMIN') {
        userObj = {
          id: 'USER-ADMIN-01',
          name: 'Dr. Rajesh Kumar, IAS',
          staffId: 'ADMIN-MoRTH-01',
          role: 'ADMIN',
          designation: 'Principal Secretary & Transport Commissioner (Director General)',
          rtoCode: 'ALL-INDIA',
          rtoName: 'MoRTH National Directorate, New Delhi',
          state: 'Central Directorate',
          mobile: '9810099887'
        };
        targetRoute = '/admin-dashboard';
      } else if (identifier.includes('DOC') || identifier.includes('MED') || identifier.includes('ANJALI')) {
        userObj = {
          id: 'USER-DOC-01',
          name: 'Dr. Anjali Mehta, MBBS, MS',
          staffId: 'DOC-NMC-84920',
          nmcRegNo: 'NMC-MCI/2014/84920',
          role: 'MEDICAL_DOCTOR',
          designation: 'Registered Medical Practitioner (Form 1A Examiner)',
          rtoCode: 'JH-01',
          rtoName: 'Ranchi RTO Medical Council Desk',
          state: 'Jharkhand',
          mobile: '9835099887'
        };
        targetRoute = '/doctor-portal';
      } else if (identifier.includes('DTS') || identifier.includes('MARUTI') || identifier.includes('SCHOOL')) {
        userObj = {
          id: 'USER-DTS-01',
          name: 'Maruti Suzuki Driving Training Centre',
          staffId: 'DTS-JH01-04',
          dtsCode: 'ADTC-JH01-2022-048',
          role: 'DRIVING_SCHOOL',
          designation: 'Accredited Driver Training Centre (CMVR Rule 31B)',
          rtoCode: 'JH-01',
          rtoName: 'Ranchi DTO Jurisdiction',
          state: 'Jharkhand',
          mobile: '9835077665'
        };
        targetRoute = '/dts-portal';
      } else if (identifier.includes('CLERK') || identifier.includes('COUNTER')) {
        userObj = {
          id: 'USER-CLERK-01',
          name: 'Shri Amit Roy',
          staffId: 'CLERK-JH01-C1',
          counterNo: 'Counter 01',
          role: 'COUNTER_OPERATOR',
          designation: 'Dealing Assistant & Biometrics Operator',
          rtoCode: 'JH-01',
          rtoName: 'Ranchi Regional Transport Office',
          state: 'Jharkhand',
          mobile: '9835044332'
        };
        targetRoute = '/counter-desk';
      } else if (identifier.includes('ENFORCE') || identifier.includes('FLYING') || identifier.includes('VIKRAM')) {
        userObj = {
          id: 'USER-ENFORCE-01',
          name: 'Inspector Vikram Singh',
          staffId: 'ENFORCE-JH01',
          badgeNo: 'ENFORCE-JH01-8492',
          role: 'ENFORCEMENT_OFFICER',
          designation: 'Enforcement Officer (Flying Squad In-Charge)',
          rtoCode: 'JH-01',
          rtoName: 'Jharkhand State Transport Enforcement',
          state: 'Jharkhand',
          mobile: '9835011223'
        };
        targetRoute = '/enforcement-portal';
      } else if (identifier.includes('DISPATCH') || identifier.includes('POST') || identifier.includes('NODAL')) {
        userObj = {
          id: 'USER-DISPATCH-01',
          name: 'Shri R. K. Mishra',
          staffId: 'DISPATCH-JH01',
          role: 'OFFICIAL',
          designation: 'Smart Card DL Printing & Dispatch Nodal',
          rtoCode: 'JH-01',
          rtoName: 'Ranchi Regional Transport Office (JH-01)',
          state: 'Jharkhand',
          mobile: '9835066778'
        };
        targetRoute = '/officer-dl-dispatch';
      } else if (identifier.includes('INSPECT') || identifier.includes('ADTT') || identifier.includes('PRIYA')) {
        userObj = {
          id: 'USER-INSPECT-01',
          name: 'Smt. Priya Sharma',
          staffId: 'INSPECT-DL01',
          role: 'ADTT_INSPECTOR',
          designation: 'Automated Driving Test Track Inspector',
          rtoCode: 'DL-01',
          rtoName: 'Delhi Civil Lines RTO (DL-01)',
          state: 'Delhi',
          mobile: '9811223344'
        };
        targetRoute = '/officer-adtt';
      } else {
        userObj = {
          id: 'USER-OFFICER-01',
          name: 'Shri S. K. Verma',
          staffId: identifier || 'OFFICER-JH01',
          role: 'OFFICIAL',
          designation: 'Senior Motor Licensing Officer (MLO)',
          rtoCode: officerRto,
          rtoName: 'Ranchi Regional Transport Office (JH-01)',
          state: 'Jharkhand',
          mobile: '9835012345'
        };
        targetRoute = '/officer-dashboard';
      }

      login(userObj);
      setIsSuccess(true);
      
      setTimeout(() => {
        const target = getIntendedRedirect(targetRoute, userObj.role);
        navigate(target, { replace: true });
      }, 500);
    } catch (err) {
      setErrorMsg('Official authentication gateway unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdentifierChange = (val: string) => {
    setErrorMsg(null);
    if (loginType === 'mobile') {
      const digits = val.replace(/\D/g, '').slice(0, 10);
      setIdentifier(digits);
    } else if (loginType === 'aadhaar') {
      const digits = val.replace(/\D/g, '').slice(0, 12);
      const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1-');
      setIdentifier(formatted);
    }
  };

  const autofillPreset = (id: string, pass: string, rto: string, pin: string) => {
    setOfficerUsername(id);
    setOfficerPassword(pass);
    setOfficerRto(rto);
    setOfficerPin(pin);
    setErrorMsg(null);
  };

  return (
    <div className={`min-h-screen py-12 flex items-center justify-center transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-md w-full mx-4">
        
        {/* Emblem & Portal Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-16 mx-auto flex items-center justify-center">
            <img 
              src="/assets/emblem.png" 
              alt="National Emblem" 
              className={`w-full h-full object-contain ${darkMode ? 'filter invert brightness-200' : ''}`}
            />
          </div>
          <div className="flex items-center justify-center space-x-1.5 text-xl font-extrabold tracking-tight">
            <span className={darkMode ? 'text-blue-400' : 'text-[#0B2545]'}>PARIVAHAN</span>
            <span className="text-[#0056D2]">SARATHI</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Government of India • National Transport Portal Login
          </p>
        </div>

        {/* Login Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-6 text-xs font-bold border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => { setLoginType('mobile'); setOtpSent(false); setIdentifier('9876543210'); setErrorMsg(null); }}
              className={`py-2 rounded-xl transition cursor-pointer ${
                loginType === 'mobile' ? 'bg-white dark:bg-slate-800 text-[#0056D2] shadow-xs' : 'text-slate-500'
              }`}
            >
              Citizen OTP
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('aadhaar'); setOtpSent(false); setIdentifier('9821-4456-7890'); setErrorMsg(null); }}
              className={`py-2 rounded-xl transition cursor-pointer ${
                loginType === 'aadhaar' ? 'bg-white dark:bg-slate-800 text-[#0056D2] shadow-xs' : 'text-slate-500'
              }`}
            >
              Aadhaar e-KYC
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('official'); setErrorMsg(null); }}
              className={`py-2 rounded-xl transition cursor-pointer ${
                loginType === 'official' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-500'
              }`}
            >
              RTO Official
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-300 font-semibold mb-5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {loginType === 'official' ? 'Official Session Established!' : 'Authentication Successful!'}
              </h3>
              <p className="text-xs text-slate-500">
                {loginType === 'official' ? 'Opening RTO Command Console...' : 'Redirecting to citizen dashboard...'}
              </p>
            </div>
          ) : loginType === 'official' ? (
            /* OFFICIAL LOGIN: USERNAME + PASSWORD + RTO JURISDICTION + 2FA PIN */
            <form onSubmit={handleOfficialLogin} className="space-y-4 animate-in fade-in">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>MLO Officer Statutory Scrutiny & Clearance Desk</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Staff ID / Username *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={officerUsername}
                    onChange={(e) => setOfficerUsername(e.target.value)}
                    placeholder="e.g. OFFICER-JH01"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Password / Passcode *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={officerPassword}
                    onChange={(e) => setOfficerPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Assigned RTO *
                  </label>
                  <select
                    value={officerRto}
                    onChange={(e) => setOfficerRto(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-amber-500"
                  >
                    <option value="JH-01">Ranchi (JH-01)</option>
                    <option value="JH-05">Jamshedpur (JH-05)</option>
                    <option value="JH-10">Dhanbad (JH-10)</option>
                    <option value="DL-01">Delhi (DL-01)</option>
                    <option value="MH-01">Mumbai (MH-01)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    2FA Security PIN *
                  </label>
                  <div className="relative">
                    <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={4}
                      value={officerPin}
                      onChange={(e) => setOfficerPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="8492"
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold tracking-widest text-center"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 py-3 rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
              >
                <span>{isLoading ? 'Authenticating Official...' : 'Authorize Role / Staff Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Multi-Role Presets */}
              <div className="space-y-2 pt-2 border-t dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> 1-Click Evaluation Presets (8 Specialized Portals)
                </p>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => autofillPreset('OFFICER-JH01', 'Parivahan@2024', 'JH-01', '8492')}
                    className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span className="truncate">MLO Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPreset('INSPECT-DL01', 'Adtt@2024', 'DL-01', '3344')}
                    className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Car className="w-3 h-3 text-indigo-600" />
                    <span className="truncate">ADTT Inspector</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPreset('DOC-NMC-84920', 'Doctor@2024', 'JH-01', '7788')}
                    className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-300 hover:bg-teal-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Stethoscope className="w-3 h-3 text-teal-600" />
                    <span className="truncate">Medical Doctor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPreset('DTS-JH01-04', 'Maruti@2024', 'JH-01', '5544')}
                    className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Car className="w-3 h-3 text-emerald-600" />
                    <span className="truncate">Driving School (DTS)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPreset('CLERK-JH01-C1', 'Counter@2024', 'JH-01', '1122')}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Users className="w-3 h-3 text-blue-600" />
                    <span className="truncate">Counter Biometric</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPreset('DISPATCH-JH01', 'Dispatch@2024', 'JH-01', '6677')}
                    className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-300 hover:bg-sky-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Award className="w-3 h-3 text-sky-600" />
                    <span className="truncate">Dispatch Nodal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPreset('ENFORCE-JH01', 'Enforce@2024', 'JH-01', '9911')}
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Scale className="w-3 h-3 text-rose-600" />
                    <span className="truncate">Enforcement Squad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPreset('ADMIN-MoRTH-01', 'SuperAdmin@2024', 'ALL-INDIA', '9999')}
                    className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Crown className="w-3 h-3 text-purple-600" />
                    <span className="truncate">Super Admin (DG)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : !otpSent ? (
            /* CITIZEN LOGIN STEP 1: MOBILE / AADHAAR */
            <form onSubmit={handleSendCitizenOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {loginType === 'mobile' ? 'Registered Mobile Number' : '12-Digit Aadhaar / Virtual ID'}
                </label>

                {loginType === 'mobile' ? (
                  <div className="space-y-3">
                    {/* 1-Click DigiLocker Cloud Fast Login */}
                    <button
                      type="button"
                      onClick={() => setIsDigiLockerOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Instant Login via DigiLocker Cloud (1-Click)</span>
                    </button>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold justify-center uppercase">
                      <span className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                      <span>Or Login via Mobile OTP</span>
                      <span className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                    </div>

                    <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100 shadow-2xs">
                      <span className="px-3.5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border-r border-slate-300 dark:border-slate-700 flex items-center gap-1.5 select-none">
                        <span className="text-[10px] font-black bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">IND</span> +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        value={identifier}
                        onChange={(e) => handleIdentifierChange(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-3.5 py-3 bg-transparent text-slate-800 dark:text-slate-100 text-xs font-bold tracking-wider focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* DigiLocker Instant Authentication Action */}
                    <button
                      type="button"
                      onClick={() => setIsDigiLockerOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Authenticate via DigiLocker Cloud (1-Click)</span>
                    </button>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold justify-center uppercase">
                      <span className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                      <span>Or Enter UIDAI Aadhaar No.</span>
                      <span className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                    </div>

                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={14}
                        value={identifier}
                        onChange={(e) => handleIdentifierChange(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold tracking-wider focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300">
                A 6-digit one-time password (OTP) will be dispatched to your registered device for multi-factor authentication.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
              >
                <span>{isLoading ? 'Dispatching OTP...' : 'Send Authentication OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* CITIZEN LOGIN STEP 2: VERIFY OTP */
            <form onSubmit={handleVerifyCitizenOtp} className="space-y-4 animate-in fade-in">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enter 6-Digit OTP
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold">Demo OTP: 123456</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold tracking-widest text-center focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
              >
                <span>{isLoading ? 'Verifying...' : 'Verify OTP & Enter Portal'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Change Mobile / Identifier
                </button>
              </div>
            </form>
          )}

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            <Link to="/" className="hover:text-[#0056D2] font-semibold">
              ← Return to Parivahan Sarathi Home
            </Link>
          </div>

        </div>

      </div>

      {/* DigiLocker Official Verification Gateway Modal */}
      <DigiLockerModal
        isOpen={isDigiLockerOpen}
        onClose={() => setIsDigiLockerOpen(false)}
        onSuccess={handleDigiLockerLoginSuccess}
        darkMode={darkMode}
      />
    </div>
  );
};
