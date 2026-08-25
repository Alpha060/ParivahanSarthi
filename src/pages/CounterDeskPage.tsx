import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Camera, 
  Fingerprint, 
  Volume2, 
  CheckCircle2, 
  RefreshCw, 
  Printer, 
  Search, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  User,
  Sparkles,
  Check,
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TokenItem {
  tokenNumber: string;
  applicantName: string;
  serviceName: string;
  applicationId: string;
  status: 'WAITING' | 'SERVING' | 'COMPLETED';
  photoCaptured: boolean;
  signatureCaptured: boolean;
  fingerprintCaptured: boolean;
  feePaid: boolean;
}

const INITIAL_TOKENS: TokenItem[] = [
  {
    tokenNumber: 'A-104',
    applicantName: 'Krishna Mahto',
    serviceName: 'Driving Licence Biometric Verification',
    applicationId: 'DL1234567890123',
    status: 'SERVING',
    photoCaptured: false,
    signatureCaptured: false,
    fingerprintCaptured: false,
    feePaid: true
  },
  {
    tokenNumber: 'A-105',
    applicantName: 'Rohit Verma',
    serviceName: 'Learner Licence Photo & Fingerprint',
    applicationId: 'LL4567891234567',
    status: 'WAITING',
    photoCaptured: false,
    signatureCaptured: false,
    fingerprintCaptured: false,
    feePaid: true
  },
  {
    tokenNumber: 'A-106',
    applicantName: 'Ananya Sharma',
    serviceName: 'DL Renewal Biometric Update',
    applicationId: 'DL9876543210987',
    status: 'WAITING',
    photoCaptured: false,
    signatureCaptured: false,
    fingerprintCaptured: false,
    feePaid: true
  }
];

export const CounterDeskPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [tokens, setTokens] = useState<TokenItem[]>(INITIAL_TOKENS);
  const [activeToken, setActiveToken] = useState<TokenItem>(INITIAL_TOKENS[0]);
  const [isCalling, setIsCalling] = useState(false);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [isCapturingSignature, setIsCapturingSignature] = useState(false);
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Digital Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = darkMode ? '#38BDF8' : '#0B2545';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
      }
    }
  }, [darkMode, activeToken]);

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleCallNextToken = () => {
    setIsCalling(true);
    
    // Simulate token chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio fallback
    }

    setTimeout(() => {
      const waiting = tokens.find(t => t.status === 'WAITING');
      if (waiting) {
        setTokens(prev => prev.map(t => {
          if (t.tokenNumber === activeToken.tokenNumber) return { ...t, status: 'COMPLETED' };
          if (t.tokenNumber === waiting.tokenNumber) return { ...t, status: 'SERVING' };
          return t;
        }));
        setActiveToken({ ...waiting, status: 'SERVING' });
      }
      setIsCalling(false);
    }, 600);
  };

  const handleCapturePhoto = () => {
    setIsCapturingPhoto(true);
    setTimeout(() => {
      setIsCapturingPhoto(false);
      setActiveToken(prev => ({ ...prev, photoCaptured: true }));
      setTokens(prev => prev.map(t => t.tokenNumber === activeToken.tokenNumber ? { ...t, photoCaptured: true } : t));
    }, 800);
  };

  const handleSaveSignature = () => {
    setIsCapturingSignature(true);
    setTimeout(() => {
      setIsCapturingSignature(false);
      setActiveToken(prev => ({ ...prev, signatureCaptured: true }));
      setTokens(prev => prev.map(t => t.tokenNumber === activeToken.tokenNumber ? { ...t, signatureCaptured: true } : t));
    }, 600);
  };

  const handleCaptureFingerprint = () => {
    setIsCapturingFingerprint(true);
    setTimeout(() => {
      setIsCapturingFingerprint(false);
      setActiveToken(prev => ({ ...prev, fingerprintCaptured: true }));
      setTokens(prev => prev.map(t => t.tokenNumber === activeToken.tokenNumber ? { ...t, fingerprintCaptured: true } : t));
    }, 700);
  };

  const handleCompleteBiometrics = () => {
    setNotification({
      type: 'success',
      message: `Biometrics & webcam dossier confirmed for ${activeToken.applicantName} (${activeToken.tokenNumber})!`
    });
    setTokens(prev => prev.map(t => t.tokenNumber === activeToken.tokenNumber ? { ...t, status: 'COMPLETED' } : t));
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Counter Header Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-[#0B2545] via-[#133E7C] to-[#0056D2] text-white border-blue-950'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  RTO Service Counter 01
                </span>
                <span className="text-xs text-blue-200 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Token Queue Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Counter Dealing Assistant & Biometric Capture Desk
              </h1>
              <p className="text-xs text-blue-100/80 dark:text-slate-300 mt-0.5">
                Operator: <strong>{user?.name || 'Shri Amit Roy (Dealing Assistant)'}</strong> • Location: <strong>Counter 01, Ranchi DTO (JH-01)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Link
              to="/login"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <span>Switch Persona</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className="p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-2 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Main Workdesk Grid: Token Queue (Left) + Biometric Station (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Token Queue (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Active Serving Token Display */}
            <div className={`p-6 rounded-3xl border shadow-xl text-center space-y-3 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Currently Serving at Counter 01
              </span>
              <div className="text-4xl font-black font-mono text-[#0056D2] dark:text-blue-400 animate-pulse">
                {activeToken.tokenNumber}
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {activeToken.applicantName}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {activeToken.applicationId}
              </p>

              <button
                onClick={handleCallNextToken}
                disabled={isCalling}
                className="w-full mt-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isCalling ? 'Calling Token...' : 'Call Next Token'}</span>
              </button>
            </div>

            {/* Waiting Queue List */}
            <div className={`p-5 rounded-3xl border shadow-md space-y-3 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-2 border-b dark:border-slate-700">
                Queue Waiting List ({tokens.filter(t => t.status === 'WAITING').length})
              </h3>

              <div className="space-y-2">
                {tokens.map((tok) => (
                  <div
                    key={tok.tokenNumber}
                    onClick={() => setActiveToken(tok)}
                    className={`p-3 rounded-2xl border transition cursor-pointer ${
                      tok.tokenNumber === activeToken.tokenNumber
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-[#0056D2] ring-2 ring-blue-200'
                        : darkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-[#0056D2] dark:text-blue-400">
                        {tok.tokenNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                        tok.status === 'SERVING' 
                          ? 'bg-amber-100 text-amber-800 animate-pulse' 
                          : tok.status === 'COMPLETED' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tok.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{tok.applicantName}</p>
                    <p className="text-[10px] text-slate-400">{tok.serviceName}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: 3-in-1 Biometric Capture Station (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              
              <div className="flex items-center justify-between pb-4 border-b dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Active Dossier</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Biometric Capture for {activeToken.applicantName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">App ID: {activeToken.applicationId}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    activeToken.photoCaptured && activeToken.signatureCaptured && activeToken.fingerprintCaptured
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {activeToken.photoCaptured && activeToken.signatureCaptured && activeToken.fingerprintCaptured
                      ? 'BIOMETRICS COMPLETE'
                      : 'CAPTURE IN PROGRESS'}
                  </span>
                </div>
              </div>

              {/* 3 Biometric Capture Modules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Live Webcam Photo */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 text-center space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">1. Webcam Photo</span>
                    {activeToken.photoCaptured && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>

                  <div className="w-32 h-36 mx-auto rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                    {activeToken.photoCaptured ? (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-indigo-900 flex items-center justify-center text-white">
                        <User className="w-16 h-16 opacity-80" />
                        <span className="absolute bottom-1 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-black">CAPTURED</span>
                      </div>
                    ) : (
                      <Camera className="w-8 h-8 text-slate-500 animate-pulse" />
                    )}
                  </div>

                  <button
                    onClick={handleCapturePhoto}
                    disabled={isCapturingPhoto}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                  >
                    {isCapturingPhoto ? 'Snapping Photo...' : 'Capture Photo'}
                  </button>
                </div>

                {/* 2. Digital Stylus Signature */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 text-center space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">2. Stylus Signature</span>
                    {activeToken.signatureCaptured && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>

                  <div className="w-full h-36 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 relative overflow-hidden flex items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={200}
                      height={140}
                      onMouseDown={handleStartDrawing}
                      onMouseMove={handleDraw}
                      onMouseUp={handleStopDrawing}
                      onMouseLeave={handleStopDrawing}
                      className="cursor-crosshair w-full h-full"
                    />
                    {!activeToken.signatureCaptured && (
                      <span className="absolute bottom-1 text-[9px] text-slate-400 pointer-events-none">
                        Sign inside this box
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleClearSignature}
                      className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSaveSignature}
                      disabled={isCapturingSignature}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                    >
                      {isCapturingSignature ? 'Saving...' : 'Save Sign'}
                    </button>
                  </div>
                </div>

                {/* 3. 10-Fingerprint Scanner */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 text-center space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">3. Optical Biometrics</span>
                    {activeToken.fingerprintCaptured && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>

                  <div className="w-32 h-36 mx-auto rounded-2xl bg-slate-950 border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                    <Fingerprint className={`w-14 h-14 ${activeToken.fingerprintCaptured ? 'text-emerald-400' : 'text-slate-500 animate-pulse'}`} />
                    {activeToken.fingerprintCaptured && (
                      <span className="text-[10px] text-emerald-300 font-mono font-bold mt-1">98% Match (UIDAI)</span>
                    )}
                  </div>

                  <button
                    onClick={handleCaptureFingerprint}
                    disabled={isCapturingFingerprint}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                  >
                    {isCapturingFingerprint ? 'Scanning...' : 'Scan Biometrics'}
                  </button>
                </div>

              </div>

              {/* Confirm Biometrics CTA */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    Form 7 Smart Card Personalization Verification
                  </p>
                  <p className="text-xs text-blue-900 dark:text-blue-100 font-semibold mt-0.5">
                    Webcam photo and fingerprint will be cryptographically written to the 64KB driving licence microchip.
                  </p>
                </div>

                <button
                  onClick={handleCompleteBiometrics}
                  disabled={!activeToken.photoCaptured || !activeToken.signatureCaptured || !activeToken.fingerprintCaptured}
                  className="px-5 py-3 rounded-xl bg-[#0056D2] hover:bg-blue-700 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer flex-shrink-0 disabled:opacity-40"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Sync to Dossier</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
