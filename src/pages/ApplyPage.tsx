import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  Printer, 
  Sparkles,
  Calendar,
  CreditCard,
  Building,
  Upload,
  User,
  AlertCircle,
  Stethoscope,
  Check,
  RefreshCw
} from 'lucide-react';
import { QUICK_SERVICES } from '../data/mockData';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { printOfficialSlip } from '../utils/printDocument';

export const ApplyPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { darkMode, currentState, user } = useApp();

  const currentService = QUICK_SERVICES.find(s => s.id === serviceId) || QUICK_SERVICES[0];

  // Wizard Step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [applicantName, setApplicantName] = useState('Krishna Mahto');
  const [fatherName, setFatherName] = useState('Rajendra Mahto');
  const [dob, setDob] = useState('1998-07-15');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('9876543210');
  const [email, setEmail] = useState('krishna.mahto@citizen.in');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [aadhaarNo, setAadhaarNo] = useState('XXXX-XXXX-8921');

  // Address
  const [address, setAddress] = useState('H.No 42, Kanke Road, Near CMPDI');
  const [city, setCity] = useState('Ranchi');
  const [pincode, setPincode] = useState('834008');
  const [selectedRto, setSelectedRto] = useState('JH-01');

  // Auto-sync RTO with current detected state
  React.useEffect(() => {
    const s = currentState.toLowerCase();
    if (s.includes('delhi')) setSelectedRto('DL-01');
    else if (s.includes('maharashtra') || s.includes('mumbai')) setSelectedRto('MH-01');
    else if (s.includes('karnataka') || s.includes('bengaluru')) setSelectedRto('KA-01');
    else if (s.includes('bihar') || s.includes('patna')) setSelectedRto('BR-01');
    else if (s.includes('jamshedpur')) setSelectedRto('JH-05');
    else if (s.includes('dhanbad')) setSelectedRto('JH-10');
    else setSelectedRto('JH-01');
  }, [currentState]);

  // Vehicle Class & Medical
  const [vehicleClass, setVehicleClass] = useState('LMV (Light Motor Vehicle)');
  const [hasMedicalFitness, setHasMedicalFitness] = useState(true);
  const [isOrganDonor, setIsOrganDonor] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDigiLockerAutofill = () => {
    setApplicantName(user?.name || 'Krishna Mahto');
    setFatherName('Late Shri Ramesh Mahto');
    setDob('1995-08-15');
    setGender('Male');
    setMobile(user?.mobile || '9876543210');
    setBloodGroup('O+');
    setAddress('Flat 4B, Shivalik Residency, Morabadi');
    setCity('Ranchi');
    setPincode('834008');
    setSelectedRto('JH-01');
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.submitApplication({
        type: currentService.title,
        subType: currentService.subtitle,
        vehicleClass,
        applicantName,
        mobile,
        state: currentState.split(',')[1]?.trim() || 'Jharkhand',
        rtoCode: selectedRto,
        rtoName: `District Transport Office (${selectedRto})`
      });

      if (res.success && res.application) {
        setSubmittedApp(res.application);
      } else {
        setErrorMsg(res.error || 'Submission failed. Please verify required fields.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to Sarathi National Register backend.');
    } finally {
      setIsSubmitting(false);
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
          <span>Services</span>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">{currentService.title}</span>
        </div>

        {/* Header Title Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0"
                style={{ backgroundColor: currentService.bgCircleColor }}
              >
                <FileCheck className="w-7 h-7" style={{ color: currentService.iconColor }} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  MoRTH e-Services Portal (Form 2 / Form 4)
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  {currentService.title}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentService.description}
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:pl-6 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Statutory Fee</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{currentService.fee}</p>
              <span className="text-[10px] text-slate-400">CMVR 1989 Rule 32</span>
            </div>
          </div>

          {/* 4-Stage Step Indicator */}
          {!submittedApp && (
            <div className="grid grid-cols-4 gap-2 pt-6 mt-6 border-t border-slate-150 dark:border-slate-700">
              {[
                { num: 1, label: '1. Applicant e-KYC' },
                { num: 2, label: '2. Address & RTO' },
                { num: 3, label: '3. Vehicle Class' },
                { num: 4, label: '4. Review & Submit' }
              ].map((s) => (
                <div 
                  key={s.num}
                  className={`text-center py-2 px-1 rounded-xl border text-xs font-bold transition-all ${
                    currentStep === s.num
                      ? 'bg-[#0056D2] text-white border-[#0056D2] shadow-sm'
                      : currentStep > s.num
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">Step {s.num}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Body Form */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          
          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-xs text-rose-800 dark:text-rose-300 font-semibold mb-6">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submittedApp ? (
            /* Post-Submission Executive-Grade Success Screen */
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Executive Cryptographic Verification Seal */}
              <div className="relative inline-flex items-center justify-center mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 p-0.5 shadow-xl shadow-emerald-500/20">
                  <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center border border-emerald-400/30">
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest shadow-md">
                  DIGITALLY SEALED
                </span>
              </div>

              <div>
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  MoRTH National Transport Register • Official Filing
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Application Registered & Dossier Synchronized
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Statutory record verified under Central Motor Vehicles Rules (CMVR) 1989.
                </p>
              </div>

              {/* Official Digital Acknowledgement Slip */}
              <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Sarathi Application Number</span>
                    <p className="text-lg font-black text-[#0056D2] dark:text-blue-400">{submittedApp.applicationId}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                    STAGE 1: SCRUTINY QUEUE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400">Applicant Full Name:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{submittedApp.applicantName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Registered Mobile:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{submittedApp.mobile}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Applied Service:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{submittedApp.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Vehicle Category:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{submittedApp.vehicleClass}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned RTO:</span>
                    <p className="font-bold text-emerald-600">{submittedApp.rtoName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Filing Date & Time:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => printOfficialSlip({
                    title: 'Form 2 / Form 4 e-Application Acknowledgement',
                    subtitle: 'MoRTH National Transport Register Record',
                    documentType: 'Official e-Filing Slip',
                    referenceNumber: submittedApp.applicationId,
                    applicantName: submittedApp.applicantName,
                    serviceName: submittedApp.type,
                    rtoName: submittedApp.rtoName,
                    details: [
                      { label: 'Sarathi Application Number', value: submittedApp.applicationId },
                      { label: 'Applicant Full Name', value: submittedApp.applicantName },
                      { label: 'Registered Mobile', value: submittedApp.mobile },
                      { label: 'Applied Service', value: submittedApp.type },
                      { label: 'Vehicle Category (COV)', value: submittedApp.vehicleClass },
                      { label: 'Jurisdictional RTO Office', value: submittedApp.rtoName },
                      { label: 'Current Processing State', value: 'IN PROGRESS (Step 1 of 9)' },
                      { label: 'CMVR Fee Assessment', value: `₹${currentService.fee}` }
                    ],
                    highlightBox: {
                      label: 'Assigned Application Number',
                      value: submittedApp.applicationId
                    },
                    footerNotes: [
                      'Your application is registered in the Sarathi National Database.',
                      'Please preserve this Form 2 / Form 4 slip for RTO biometrics and driving skill track slot.',
                      'You can track live 9-step progression at: http://localhost:5173/status?appId=' + submittedApp.applicationId
                    ]
                  })}
                  className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-600"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Form 2 Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/status?appId=${submittedApp.applicationId}`)}
                  className="px-5 py-3 rounded-2xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Track 9-Step Timeline</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/appointments')}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Driving Test Slot</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              
              {/* STEP 1: Applicant Details */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2 pb-2 border-b dark:border-slate-700">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold">Step 1: Aadhaar e-KYC & Personal Particulars</h3>
                  </div>

                  {/* 1-Click DigiLocker e-KYC Auto-Fill Banner */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0056D2] text-white flex items-center justify-center font-black flex-shrink-0 shadow-xs">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          DigiLocker & UIDAI Instant e-KYC
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Auto-populate verified Name, Father Name, DOB & Address from official registry.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDigiLockerAutofill}
                      className="px-4 py-2 rounded-xl bg-[#0056D2] hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer flex-shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1-Click Auto-Fill via DigiLocker</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name (As printed in Aadhaar) *
                      </label>
                      <input
                        type="text"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Father's / Guardian's Full Name *
                      </label>
                      <input
                        type="text"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Date of Birth (DD-MM-YYYY) *
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Gender *
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Transgender</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Registered Mobile Number (e-KYC) *
                      </label>
                      <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100">
                        <span className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border-r border-slate-300 dark:border-slate-700 flex items-center gap-1 select-none">
                          <span className="text-[10px] font-black bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">IND</span> +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98765 43210"
                          className="w-full px-3.5 py-2.5 bg-transparent text-slate-800 dark:text-slate-100 text-xs font-bold tracking-wider focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Blood Group *
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                      >
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (mobile.replace(/\D/g, '').length !== 10) {
                          alert('Please enter a valid 10-digit mobile number.');
                          return;
                        }
                        setCurrentStep(2);
                      }}
                      className="bg-[#0056D2] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Proceed to Address & RTO</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Address & RTO */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2 pb-2 border-b dark:border-slate-700">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold">Step 2: Residential Address & Jurisdictional RTO</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Flat / House No. & Street Address *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          City / District *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="834001"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Assigned Regional Transport Office (RTO) *
                        </label>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Auto-Mapped for: {currentState}
                        </span>
                      </div>
                      <select
                        value={selectedRto}
                        onChange={(e) => setSelectedRto(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="JH-01">Ranchi DTO (JH-01) - Kanke Road</option>
                        <option value="JH-05">Jamshedpur DTO (JH-05) - Sakchi</option>
                        <option value="JH-10">Dhanbad DTO (JH-10) - Luby Road</option>
                        <option value="DL-01">Delhi Civil Lines RTO (DL-01)</option>
                        <option value="MH-01">Mumbai Central RTO (MH-01)</option>
                        <option value="KA-01">Bengaluru Koramangala (KA-01)</option>
                        <option value="BR-01">Patna DTO (BR-01) - Gandhi Maidan</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-[#0056D2] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Proceed to Vehicle Class</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Vehicle Class Endorsement */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2 pb-2 border-b dark:border-slate-700">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold">Step 3: Vehicle Class & Medical Fitness (Form 1)</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Select Requested Class of Vehicle (COV) *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'LMV (Light Motor Vehicle)', title: 'LMV (Private Car / Jeep)', desc: 'Light motor vehicle for personal use' },
                          { id: 'MCWG (Motorcycle with Gear)', title: 'MCWG (Motorcycle with Gear)', desc: 'Two wheeler with manual/auto gears' },
                          { id: 'MCWOG (Without Gear)', title: 'MCWOG (Scooter / Electric)', desc: 'Two wheeler gearless (e.g. Activa)' },
                          { id: 'BOTH (MCWG + LMV)', title: 'BOTH (2-Wheeler + Car)', desc: 'Dual endorsement package' }
                        ].map((v) => (
                          <div
                            key={v.id}
                            onClick={() => setVehicleClass(v.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition ${
                              vehicleClass === v.id
                                ? 'bg-blue-50 dark:bg-blue-950 border-[#0056D2] text-[#0056D2] shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-300'
                            }`}
                          >
                            <p className="text-xs font-extrabold">{v.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{v.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Document Pre-Inspector & Auto-Optimizer */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-[#0056D2]" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            AI Document Pre-Inspector & Auto-Compressor
                          </h4>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          0% RTO REJECTION GUARANTEED
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold">Aadhaar Card (PDF / Scan)</span>
                            <span className="text-[10px] font-mono text-emerald-600 font-bold">OCR: 99.8%</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Original: 3.4 MB $\rightarrow$ <strong className="text-emerald-600">Compressed: 42.8 KB</strong> (CMVR Rule 14 Compliant)
                          </p>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-full" />
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold">Applicant Passport Photo</span>
                            <span className="text-[10px] font-mono text-emerald-600 font-bold">Face Clarity: 100%</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Original: 1.8 MB $\rightarrow$ <strong className="text-emerald-600">Compressed: 24.2 KB</strong> (ICAO Biometric Standard)
                          </p>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tele-Medical Form 1A Certified Doctor Bridge */}
                    <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-teal-900 dark:text-teal-200">
                            Form 1A Tele-Doctor Digital Booking Bridge
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300">
                          MV Act Section 8(3)
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-800/80 dark:text-teal-300">
                        Applicants aged 40+ or commercial vehicle applicants require a digitally signed Form 1A Medical Fitness Certificate.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-700 flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white">Dr. Priya Sharma, MBBS MD</p>
                            <p className="text-[10px] text-slate-400">Reg: NMC #84920 • Ranchi Civil Hospital</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-[10px] font-bold">
                            Available Now
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-700 flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white">Dr. A. K. Sengupta, MBBS MD</p>
                            <p className="text-[10px] text-slate-400">Reg: NMC #72109 • AIIMS Tele-Clinic</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-[10px] font-bold">
                            Available Now
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
                      <label className="flex items-center space-x-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasMedicalFitness}
                          onChange={(e) => setHasMedicalFitness(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span>I declare that I am medically fit to drive under Form 1 (Self Declaration).</span>
                      </label>

                      <label className="flex items-center space-x-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isOrganDonor}
                          onChange={(e) => setIsOrganDonor(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span>In case of accidental death, I wish to donate my organs (Optional).</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="bg-[#0056D2] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Proceed to Final Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Final Submission */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2 pb-2 border-b dark:border-slate-700">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold">Step 4: Application Dossier Summary & Final Submission</h3>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400">Applicant:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{applicantName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Father's Name:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{fatherName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">DOB & Blood Group:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{dob} ({bloodGroup})</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Mobile:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{mobile}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Vehicle Class:</span>
                        <p className="font-bold text-blue-600">{vehicleClass}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">RTO Jurisdiction:</span>
                        <p className="font-bold text-emerald-600">{selectedRto}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    <p className="font-bold text-blue-800 dark:text-blue-300">National Register Digital Submission Declaration</p>
                    <p>I hereby declare that all particulars furnished above are true to the best of my knowledge under the Motor Vehicles Act 1988.</p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmitApplication}
                      className="bg-[#0056D2] hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isSubmitting ? 'Transmitting to National Database...' : 'Submit Application (Form 2)'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
