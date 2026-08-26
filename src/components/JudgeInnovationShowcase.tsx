import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Mic, 
  Camera, 
  Award, 
  MessageSquare, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JudgeInnovationShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useApp();

  const innovations = [
    {
      icon: Mic,
      iconColor: '#7C3AED',
      bgColor: '#F3E8FF',
      title: 'Voice-First AI (Bhasha Sahayak)',
      subtitle: 'Zero-Tech Literacy Barrier',
      govtIssue: 'Govt portal requires reading dense English/Hindi and filling 30+ form fields.',
      ourSolution: 'Speak naturally in Hindi or English (e.g. "Mera licence renew karna hai"). AI opens wizard and reads steps aloud.',
      actionText: 'Test Voice Assistant',
      action: () => navigate('/services')
    },
    {
      icon: Camera,
      iconColor: '#2563EB',
      bgColor: '#DBEAFE',
      title: 'AI Document Doctor',
      subtitle: 'Eliminates Cyber-Café Middlemen',
      govtIssue: 'Strict PDF/JPG 200KB limits force citizens to pay ₹500–₹1,500 to middlemen.',
      ourSolution: 'Point phone camera at Aadhaar. System auto-crops, enhances clarity, and auto-compresses to 200KB silently.',
      actionText: 'Try Form Wizard',
      action: () => navigate('/apply/ll-new')
    },
    {
      icon: Award,
      iconColor: '#D97706',
      bgColor: '#FEF3C7',
      title: 'Audio Mock Exam & 3D ADTT Guide',
      subtitle: '80%+ First-Time Pass Rate',
      govtIssue: 'Dry 50-page handbooks cause high failure rates on computer and track tests.',
      ourSolution: 'Every question is read aloud in Hindi/English with animated road signs and 3D track sensor tips.',
      actionText: 'Start Audio Mock Test',
      action: () => navigate('/mock-test')
    },
    {
      icon: MessageSquare,
      iconColor: '#059669',
      bgColor: '#DCFCE7',
      title: 'Human Radar & WhatsApp Tracking',
      subtitle: 'Zero Bureaucratic Anxiety',
      govtIssue: 'Cryptic codes like "MLO Scrutiny Level-2" leave citizens confused for weeks.',
      ourSolution: 'Plain human language ("Officer reviewing your photo") + live WhatsApp pings + Speed Post courier radar.',
      actionText: 'View Live Tracker',
      action: () => navigate('/status?appId=DL1234567890123')
    },
    {
      icon: QrCode,
      iconColor: '#9333EA',
      bgColor: '#F3E8FF',
      title: 'One-QR Jan Seva Kendra Bridge',
      subtitle: 'Omnichannel Digital Assistance',
      govtIssue: 'If citizens get stuck on their phone, they have to start over on paper at RTO.',
      ourSolution: '1-Click encrypted QR pass. Any CSC operator or RTO clerk scans it to resume the draft in 2 seconds.',
      actionText: 'Generate 1-Scan Pass',
      action: () => navigate('/apply/ll-new')
    }
  ];

  return (
    <section className="py-8 sm:py-12 px-3 sm:px-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm mb-6 ${
        darkMode 
          ? 'bg-slate-800/90 border-slate-700 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950 text-[#0056D2] dark:text-blue-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
              <Zap className="w-3.5 h-3.5 text-[#0056D2] dark:text-blue-400 fill-current" />
              <span>Hackathon Evaluation Spotlight</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Why ParivahanSarthi is 10x Better Than Legacy Government Portals
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Designed for everyday citizens: zero technical jargon, zero cyber-café middlemen fees, and voice-assisted in Indian regional languages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">100% Free</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Zero Dalal Charges</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-lg font-black text-[#0056D2] dark:text-blue-400">1-Handed</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Voice & DigiLocker</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {innovations.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className={`rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                darkMode 
                  ? 'bg-slate-800/90 border-slate-700 hover:border-blue-500/50' 
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-3">
                {/* Icon & Title */}
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    <IconComp className="w-5 h-5" style={{ color: item.iconColor }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Govt vs ParivahanSarthi Comparison */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-150 dark:border-rose-900/50">
                    <div className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-300 font-bold text-[11px] mb-0.5">
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Govt Portal Friction</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.govtIssue}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900/50">
                    <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>ParivahanSarthi Innovation</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {item.ourSolution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Interactive CTA */}
              <button
                type="button"
                onClick={item.action}
                className="mt-4 pt-3 border-t border-slate-150 dark:border-slate-700 w-full flex items-center justify-between text-xs font-bold text-[#0056D2] dark:text-blue-400 hover:underline cursor-pointer group"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
