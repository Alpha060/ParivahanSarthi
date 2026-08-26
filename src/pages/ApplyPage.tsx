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
  RefreshCw,
  FolderLock,
  FileCheck2,
  Trash2,
  Eye,
  FileUp
} from 'lucide-react';
import { QUICK_SERVICES } from '../data/mockData';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { printOfficialSlip } from '../utils/printDocument';
import { DigiLockerModal, DigiLockerFetchedData } from '../components/Modals/DigiLockerModal';

export interface UploadedDoc {
  id: string;
  name: string;
  category: string;
  issuer: string;
  size: string;
  source: 'DIGILOCKER' | 'MANUAL_UPLOAD';
  status: 'VERIFIED' | 'UPLOADED';
  date: string;
}

export const ApplyPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { darkMode, currentState, user } = useApp();

  const currentService = QUICK_SERVICES.find(s => s.id === serviceId) || QUICK_SERVICES[0];

  // 5-Stage Wizard Steps
  const [currentStep, setCurrentStep] = useState(1);

  // DigiLocker Modal State
  const userHasDigiLocker = !!user?.isDigiLockerVerified;
  const [isDigiLockerOpen, setIsDigiLockerOpen] = useState(false);
  const [isDigiLockerVerified, setIsDigiLockerVerified] = useState(userHasDigiLocker);

  // Form Fields - Step 1: Applicant Demographics
  const [applicantName, setApplicantName] = useState(user?.name || 'Krishna Mahto');
  const [fatherName, setFatherName] = useState('Rajendra Mahto');
  const [dob, setDob] = useState('1998-07-15');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState(user?.mobile || '9876543210');
  const [email, setEmail] = useState(user?.email || 'krishna.mahto@citizen.in');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [aadhaarNo, setAadhaarNo] = useState('XXXX-XXXX-8921');

  // Auto-fill from user DigiLocker profile if already connected during login
  React.useEffect(() => {
    if (user?.isDigiLockerVerified) {
      setIsDigiLockerVerified(true);
      if (user.name) setApplicantName(user.name);
      if (user.mobile) setMobile(user.mobile);
      if (user.digiLockerData) {
        const d = user.digiLockerData;
        if (d.fatherName) setFatherName(d.fatherName);
        if (d.dob) setDob(d.dob);
        if (d.gender) setGender(d.gender);
        if (d.email) setEmail(d.email);
        if (d.bloodGroup) setBloodGroup(d.bloodGroup);
        if (d.aadhaarNumber) setAadhaarNo(d.aadhaarNumber);
        if (d.address) setAddress(d.address);
        if (d.city) setCity(d.city);
        if (d.pincode) setPincode(d.pincode);
      }
    }
  }, [user]);

  // Step 2: Address & Jurisdiction
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

  // Step 3: Vehicle Class & Medical
  const [vehicleClass, setVehicleClass] = useState('LMV (Light Motor Vehicle)');
  const [hasMedicalFitness, setHasMedicalFitness] = useState(true);
  const [isOrganDonor, setIsOrganDonor] = useState(true);

  // Step 4: Documents Upload & DigiLocker Registry
  const [documents, setDocuments] = useState<UploadedDoc[]>([
    {
      id: 'DOC-01',
      name: 'Aadhaar Card (UIDAI e-KYC)',
      category: 'Proof of Identity & Address',
      issuer: 'UIDAI',
      size: '412 KB',
      source: 'DIGILOCKER',
      status: 'VERIFIED',
      date: 'Auto-Verified'
    },
    {
      id: 'DOC-02',
      name: 'Class 10 Matriculation Marksheet',
      category: 'Proof of Age / Date of Birth',
      issuer: 'CBSE Board',
      size: '628 KB',
      source: 'DIGILOCKER',
      status: 'VERIFIED',
      date: 'Auto-Verified'
    }
  ]);

  const [manualDocCategory, setManualDocCategory] = useState('Proof of Age (10th/Birth Certificate)');
  const [isUploading, setIsUploading] = useState(false);

  // Step 5: Statutory Declarations & Payment Choice
  const [legalConsentChecked, setLegalConsentChecked] = useState(true);
  const [digitalSignChecked, setDigitalSignChecked] = useState(true);
  const [paymentChoice, setPaymentChoice] = useState<'PAY_NOW' | 'PAY_LATER'>('PAY_NOW');
  const [selectedGateway, setSelectedGateway] = useState<'UPI' | 'NET_BANKING' | 'DEBIT_CARD'>('UPI');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle successful DigiLocker pull
  const handleDigiLockerSuccess = (data: DigiLockerFetchedData) => {
    setApplicantName(data.applicantName);
    setFatherName(data.fatherName);
    setDob(data.dob);
    setGender(data.gender);
    setMobile(data.mobile);
    setEmail(data.email);
    setBloodGroup(data.bloodGroup);
    setAadhaarNo(data.aadhaarNumber);
    setAddress(data.address);
    setCity(data.city);
    setPincode(data.pincode);
    setIsDigiLockerVerified(true);

    const digiDocs: UploadedDoc[] = data.documents.map((d, index) => ({
      id: `DIGI-DOC-${Date.now()}-${index}`,
      name: d.name,
      category: d.docType,
      issuer: d.issuer,
      size: '512 KB',
      source: 'DIGILOCKER',
      status: 'VERIFIED',
      date: 'DigiLocker e-Signed'
    }));

    setDocuments(digiDocs);
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: UploadedDoc = {
        id: `MANUAL-${Date.now()}`,
        name: file.name,
        category: manualDocCategory,
        issuer: 'Self-Attested Citizen Upload',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        source: 'MANUAL_UPLOAD',
        status: 'UPLOADED',
        date: new Date().toLocaleDateString('en-GB')
      };
      setDocuments(prev => [...prev, newDoc]);
      setIsUploading(false);
      e.target.value = '';
    }, 600);
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmitApplication = async () => {
    if (!legalConsentChecked || !digitalSignChecked) {
      setErrorMsg('Please accept the statutory CMVR 1989 Rule 14 declaration and digital signature consent.');
      return;
    }

    if (documents.length === 0) {
      setErrorMsg('Please attach at least one mandatory identity or age proof document (via DigiLocker or Upload).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const isPaidNow = paymentChoice === 'PAY_NOW' || currentService.fee === 0;
      const res = await api.submitApplication({
        type: currentService.title,
        subType: currentService.subtitle,
        vehicleClass,
        applicantName,
        mobile,
        state: currentState.split(',')[1]?.trim() || 'Jharkhand',
        rtoCode: selectedRto,
        rtoName: `District Transport Office (${selectedRto})`,
        feeAmount: currentService.fee,
        paymentStatus: isPaidNow ? 'PAID' : 'PENDING'
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
          <Link to="/services" className="hover:text-[#0056D2] font-semibold">Services Catalog</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">{currentService.title}</span>
        </div>

        {/* Executive Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                    {currentService.title}
                  </h1>
                  <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-[#0056D2] dark:text-blue-400 px-2 py-0.5 rounded-full uppercase">
                    FORM 2
                  </span>
                </div>
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

          {/* 5-Stage Step Indicator */}
          {!submittedApp && (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-6 mt-6 border-t border-slate-150 dark:border-slate-700">
              {[
                { num: 1, label: '1. Applicant e-KYC' },
                { num: 2, label: '2. Address & RTO' },
                { num: 3, label: '3. Vehicle Class' },
                { num: 4, label: '4. Doc Upload' },
                { num: 5, label: '5. Review & Submit' }
              ].map((s) => (
                <div 
                  key={s.num}
                  className={`text-center py-2 px-1 rounded-xl border text-[11px] font-bold transition-all ${
                    currentStep === s.num
                      ? 'bg-[#0056D2] text-white border-[#0056D2] shadow-sm'
                      : currentStep > s.num
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="hidden md:inline">{s.label}</span>
                  <span className="md:hidden">Step {s.num}</span>
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
                <div className={`w-20 h-20 rounded-3xl p-0.5 shadow-xl ${
                  submittedApp.paymentStatus === 'PENDING'
                    ? 'bg-gradient-to-tr from-amber-600 via-orange-600 to-yellow-600 shadow-amber-500/20'
                    : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 shadow-emerald-500/20'
                }`}>
                  <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center border border-slate-700">
                    {submittedApp.paymentStatus === 'PENDING' ? (
                      <CreditCard className="w-10 h-10 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-10 h-10 text-emerald-400" />
                    )}
                  </div>
                </div>
                <span className={`absolute -bottom-2 px-3 py-0.5 rounded-full text-white font-black text-[9px] uppercase tracking-widest shadow-md ${
                  submittedApp.paymentStatus === 'PENDING' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}>
                  {submittedApp.paymentStatus === 'PENDING' ? 'DRAFT STORED' : 'DIGITALLY SEALED'}
                </span>
              </div>

              <div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${
                  submittedApp.paymentStatus === 'PENDING' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {submittedApp.paymentStatus === 'PENDING' 
                    ? 'Citizen Draft Dossier • Statutory Fee Pending' 
                    : 'MoRTH National Transport Register • Official Filing'}
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {submittedApp.paymentStatus === 'PENDING'
                    ? 'Application Saved in Draft Dossier'
                    : 'Application Registered & Submitted to RTO'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  {submittedApp.paymentStatus === 'PENDING'
                    ? 'Your application details and documents have been securely saved. Note: This application is held as draft and is NOT yet transmitted to RTO officers for scrutiny until statutory fee is settled.'
                    : 'Statutory record verified under Central Motor Vehicles Rules (CMVR) 1989. Transmitted to RTO Scrutiny Queue.'}
                </p>
              </div>

              {/* Official Digital Acknowledgement Slip */}
              <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Sarathi Application Number</span>
                    <p className="text-lg font-black text-[#0056D2] dark:text-blue-400">{submittedApp.applicationId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    submittedApp.paymentStatus === 'PENDING'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  }`}>
                    {submittedApp.paymentStatus === 'PENDING' ? 'DRAFT: PAYMENT PENDING' : 'STAGE 1: SCRUTINY QUEUE'}
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
                    <span className="text-slate-400">Assigned RTO Authority:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{submittedApp.rtoName || 'Ranchi RTO (JH-01)'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">COV Endorsement:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{vehicleClass}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Attached Documents:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{documents.length} Verified Documents</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Statutory Fee:</span>
                    <p className={`font-bold ${submittedApp.paymentStatus === 'PENDING' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      ₹{currentService.fee} ({submittedApp.paymentStatus === 'PENDING' ? 'Unpaid - Due Later' : 'Online Challan Settled'})
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => printOfficialSlip({
                    title: 'Ministry of Road Transport & Highways',
                    subtitle: 'Government of India • Parivahan Sarathi National Portal',
                    documentType: `FORM 2 - APPLICATION ACKNOWLEDGEMENT SLIP (${currentService.title.toUpperCase()})`,
                    referenceNumber: submittedApp.applicationId,
                    applicantName: submittedApp.applicantName,
                    mobile: submittedApp.mobile,
                    serviceName: currentService.title,
                    rtoName: submittedApp.rtoName || 'Ranchi RTO (JH-01)',
                    details: [
                      { label: 'Application ID', value: submittedApp.applicationId },
                      { label: 'Applicant Name', value: submittedApp.applicantName },
                      { label: 'Father Name', value: fatherName },
                      { label: 'Date of Birth', value: dob },
                      { label: 'Mobile Number', value: submittedApp.mobile },
                      { label: 'Assigned RTO', value: submittedApp.rtoName || 'Ranchi RTO (JH-01)' },
                      { label: 'Endorsement Class', value: vehicleClass },
                      { label: 'Attached Documents', value: `${documents.length} Verified Records` },
                      { label: 'Statutory Fee', value: `INR ${currentService.fee}` },
                      { label: 'Payment Status', value: submittedApp.paymentStatus === 'PENDING' ? 'PENDING (DRAFT)' : 'PAID (RECONCILED)' }
                    ],
                    highlightBox: {
                      label: 'Current Status',
                      value: submittedApp.paymentStatus === 'PENDING' ? 'DRAFT: PAYMENT PENDING (NOT SUBMITTED TO RTO)' : 'STAGE 1: SCRUTINY QUEUE (SUBMITTED)'
                    }
                  })}
                  className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-600"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Acknowledgement Slip</span>
                </button>

                {submittedApp.paymentStatus === 'PENDING' ? (
                  <button
                    type="button"
                    onClick={() => navigate('/applications')}
                    className="px-6 py-3 rounded-2xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>View in My Applications (Pay Later)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              
              {/* STEP 1: Applicant Details & DigiLocker e-KYC */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2 pb-2 border-b dark:border-slate-700">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold">Step 1: Aadhaar e-KYC & Personal Particulars</h3>
                  </div>

                  {/* DigiLocker e-KYC Status & Action Banner */}
                  {isDigiLockerVerified ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black flex-shrink-0 shadow-xs">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                              DigiLocker e-KYC Verified & Pre-Populated
                            </p>
                            <span className="text-[9px] font-black bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              AUTHENTICATED
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                            Your demographic particulars and verified statutory documents are securely linked from your authenticated login session.
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hidden sm:inline flex-shrink-0">
                        UIDAI Verified ✓
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-300 dark:border-blue-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black flex-shrink-0 shadow-xs">
                          <ShieldCheck className="w-6 h-6 text-amber-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              Mandatory DigiLocker & UIDAI e-KYC Verification
                            </p>
                            <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              REQUIRED
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            MoRTH guidelines mandate Aadhaar e-KYC authentication to file applications without physical counter visits.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsDigiLockerOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer flex-shrink-0"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Verify via DigiLocker (Mandatory)</span>
                      </button>
                    </div>
                  )}

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
                        if (!isDigiLockerVerified) {
                          setIsDigiLockerOpen(true);
                          return;
                        }
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
                        ].map((cov) => (
                          <div
                            key={cov.id}
                            onClick={() => setVehicleClass(cov.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              vehicleClass === cov.id
                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900/50'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{cov.title}</span>
                              {vehicleClass === cov.id && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{cov.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-start space-x-3">
                        <Stethoscope className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Form 1 Physical Fitness Declaration (CMVR 1989)
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            I declare that I do not suffer from epilepsy, night blindness, sudden loss of consciousness, or color vision deficiency.
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={hasMedicalFitness}
                          onChange={(e) => setHasMedicalFitness(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span>I confirm my physical & medical fitness under Rule 5(2)</span>
                      </label>
                    </div>

                    <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isOrganDonor}
                        onChange={(e) => setIsOrganDonor(e.target.checked)}
                        className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                      />
                      <span>Pledge as an Organ Donor in case of accidental demise (Printed on DL)</span>
                    </label>
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
                      onClick={() => {
                        if (!hasMedicalFitness) {
                          alert('Please confirm your medical fitness declaration.');
                          return;
                        }
                        setCurrentStep(4);
                      }}
                      className="bg-[#0056D2] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Proceed to Document Upload</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Mandatory Document Upload & DigiLocker Verification */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b dark:border-slate-700">
                    <div className="flex items-center space-x-2">
                      <FolderLock className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold">Step 4: Statutory Document Verification & Upload</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      CMVR 1989 Rule 14 Mandatory Proofs
                    </span>
                  </div>

                  {/* Option 1: 1-Click DigiLocker Cloud Pull */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          DigiLocker Instant Document Synchronization
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Automatically import cryptographically signed Aadhaar, 10th Certificate & Address Proof.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDigiLockerOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer flex-shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isDigiLockerVerified ? 'Re-Sync DigiLocker' : 'Fetch from DigiLocker'}</span>
                    </button>
                  </div>

                  {/* Option 2: Manual Document Upload Form */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-slate-500" />
                      <span>Manual Document Upload (PDF / JPG / PNG max 5MB)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Document Category *
                        </label>
                        <select
                          value={manualDocCategory}
                          onChange={(e) => setManualDocCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                        >
                          <option>Proof of Age (10th/Birth Certificate)</option>
                          <option>Proof of Present Address (Aadhaar/Utility)</option>
                          <option>Form 1 Self-Declaration (Signed)</option>
                          <option>Passport Size Photograph</option>
                          <option>Applicant Digital Signature</option>
                        </select>
                      </div>

                      <div className="sm:col-span-6 flex items-end">
                        <label className="w-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-dashed border-blue-400 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs">
                          <Upload className="w-4 h-4" />
                          <span>{isUploading ? 'Uploading File...' : 'Choose File to Attach'}</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleManualUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Attached Documents Manifest Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Attached Documents Checklist ({documents.length})
                      </h4>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {documents.filter(d => d.status === 'VERIFIED').length} DigiLocker Verified
                      </span>
                    </div>

                    {documents.length === 0 ? (
                      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <FolderLock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">No documents attached yet. Use DigiLocker or Upload above.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                doc.source === 'DIGILOCKER' 
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400' 
                                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                              }`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {doc.name}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {doc.category} • {doc.size} • {doc.issuer}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                doc.status === 'VERIFIED'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                              }`}>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{doc.status}</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 flex items-center justify-center transition cursor-pointer"
                                title="Remove Document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                      onClick={() => {
                        if (documents.length === 0) {
                          alert('Please attach at least one proof document via DigiLocker or Manual Upload.');
                          return;
                        }
                        setCurrentStep(5);
                      }}
                      className="bg-[#0056D2] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Proceed to Final Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Final Review & Submission */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2 pb-2 border-b dark:border-slate-700">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold">Step 5: Statutory Review, Declaration & Submit</h3>
                  </div>

                  {/* Summary Dossier Grid */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b dark:border-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Requested Service</span>
                        <p className="text-sm font-black text-[#0056D2] dark:text-blue-400">{currentService.title}</p>
                      </div>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        Fee: ₹{currentService.fee}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400">Applicant Name:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{applicantName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Father's Name:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{fatherName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Date of Birth & Gender:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{dob} ({gender})</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Registered Mobile:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">+91 {mobile}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Assigned Jurisdictional RTO:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{selectedRto} ({city}, {currentState})</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Requested Vehicle Class:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{vehicleClass}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Verified Attached Documents:</span>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">{documents.length} Records Attached</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Organ Donation Pledge:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{isOrganDonor ? 'Yes (Enrolled)' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Fee & Payment Choice Section */}
                  {currentService.fee > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex items-center justify-between border-b dark:border-slate-700 pb-2.5">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#0056D2] dark:text-blue-400">
                            CMVR 1989 Rule 32 Tariff
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Statutory Fee Payment Preference
                          </h4>
                        </div>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          Total: ₹{currentService.fee}
                        </span>
                      </div>

                      {/* Payment Choice Radio */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => setPaymentChoice('PAY_NOW')}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                            paymentChoice === 'PAY_NOW'
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0056D2] text-[#0056D2] shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">Option 1: Pay Now</span>
                            <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center border-blue-600">
                              {paymentChoice === 'PAY_NOW' && <span className="w-2 h-2 rounded-full bg-[#0056D2]" />}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Pay ₹{currentService.fee} now via Bharat ePay / UPI. Application is <strong>instantly transmitted</strong> to the RTO Officer Scrutiny queue.
                          </p>
                          <span className="inline-block mt-2 text-[9px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 self-start">
                            RECOMMENDED (INSTANT RTO FILING)
                          </span>
                        </div>

                        <div
                          onClick={() => setPaymentChoice('PAY_LATER')}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                            paymentChoice === 'PAY_LATER'
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">Option 2: Pay Later (Save Draft)</span>
                            <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center border-amber-600">
                              {paymentChoice === 'PAY_LATER' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Save application as draft in your citizen dossier. <strong>Will NOT be visible to RTO officers</strong> until payment is settled.
                          </p>
                          <span className="inline-block mt-2 text-[9px] font-black px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 self-start">
                            HOLD IN DRAFT
                          </span>
                        </div>
                      </div>

                      {/* Payment Gateway Mode when Pay Now is selected */}
                      {paymentChoice === 'PAY_NOW' && (
                        <div className="pt-2">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Select Gateway Method
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'UPI', label: 'BHIM / UPI / QR' },
                              { id: 'NET_BANKING', label: 'Core Banking' },
                              { id: 'DEBIT_CARD', label: 'RuPay / Card' }
                            ].map(g => (
                              <button
                                key={g.id}
                                type="button"
                                onClick={() => setSelectedGateway(g.id as any)}
                                className={`p-2 rounded-xl border text-[11px] font-bold transition cursor-pointer text-center ${
                                  selectedGateway === g.id
                                    ? 'bg-blue-100 dark:bg-blue-900 border-[#0056D2] text-[#0056D2] dark:text-blue-200'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {g.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {paymentChoice === 'PAY_LATER' && (
                        <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <p className="text-[11px] leading-tight">
                            Your application will be stored in <strong>My Applications</strong> with status <em>Draft (Payment Pending)</em>. You must complete payment to transmit it to RTO officers for scrutiny.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Statutory Declarations */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3">
                    <label className="flex items-start space-x-2.5 text-xs font-medium text-amber-950 dark:text-amber-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={legalConsentChecked}
                        onChange={(e) => setLegalConsentChecked(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span>
                        I declare that the information provided is true and correct under <strong>Section 182 of the Motor Vehicles Act 1988</strong>. I understand that furnishing false particulars is punishable by law.
                      </span>
                    </label>

                    <label className="flex items-start space-x-2.5 text-xs font-medium text-amber-950 dark:text-amber-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={digitalSignChecked}
                        onChange={(e) => setDigitalSignChecked(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span>
                        I authorize MoRTH and jurisdictional RTO authorities to electronically verify my documents via DigiLocker / UIDAI databases.
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting || !legalConsentChecked || !digitalSignChecked}
                      onClick={handleSubmitApplication}
                      className={`px-8 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition text-white ${
                        paymentChoice === 'PAY_NOW' 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Filing with Sarathi Registry...</span>
                        </>
                      ) : paymentChoice === 'PAY_NOW' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pay ₹{currentService.fee} & Submit to RTO Scrutiny</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Save Draft & Pay Later</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* DigiLocker Official Verification Gateway Modal */}
      <DigiLockerModal
        isOpen={isDigiLockerOpen}
        onClose={() => setIsDigiLockerOpen(false)}
        onSuccess={handleDigiLockerSuccess}
        darkMode={darkMode}
      />
    </div>
  );
};
