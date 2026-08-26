import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Languages, 
  Bot, 
  FileText, 
  Search, 
  RotateCcw, 
  MapPin, 
  Stethoscope, 
  Headphones, 
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BhashaSahayakWidget: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, language } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showGreetingBubble, setShowGreetingBubble] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState<'hi' | 'en'>('hi');

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Multilingual Dynamic Greetings
  const greetings: Record<string, { title: string; subtitle: string; voiceWelcome: string }> = {
    hi: {
      title: 'नमस्ते! मैं आपकी क्या सहायता करूँ?',
      subtitle: 'बोलकर या नीचे 1-टैप में कोई भी सेवा चुनें',
      voiceWelcome: 'Namaste! Main aapka Parivahan Sahayak hoon. Kahiye, main aapki kya madad kar sakta hoon?'
    },
    en: {
      title: 'Hello! How can I assist you today?',
      subtitle: 'Speak or tap to access any transport service',
      voiceWelcome: 'Hello! I am your Parivahan Sahayak. How may I assist you today?'
    },
    bn: {
      title: 'নমস্কার! আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
      subtitle: 'কথা বলুন বা যেকোনো সেবা বেছে নিন',
      voiceWelcome: 'Nomoshkar! Aami aponake kibhabe sahajyo korte pari?'
    },
    mr: {
      title: 'नमस्कार! मी आपली काय मदत करू शकतो?',
      subtitle: 'बोला किंवा 1-टॅपमध्ये सेवा निवडा',
      voiceWelcome: 'Namaskar! Mee aapli kaay madat karu shakto?'
    },
    gu: {
      title: 'નમસ્તે! હું તમારી શું મદદ કરી શકું?',
      subtitle: 'બોલીને અથવા 1-ટેપમાં સેવા પસંદ કરો',
      voiceWelcome: 'Namaste! Hu tamari shu madad kari shaku?'
    },
    ta: {
      title: 'வணக்கம்! நான் எவ்வாறு உதவ முடியும்?',
      subtitle: 'பேசுங்கள் அல்லது 1-தட்டலில் சேவையைத் தொடங்குங்கள்',
      voiceWelcome: 'Vanakkam! Naan ungalukku eppadi uthavalaam?'
    },
    te: {
      title: 'నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?',
      subtitle: 'మాట్లాడండి లేదా 1-ట్యాప్‌లో సేవను ఎంచుకోండి',
      voiceWelcome: 'Namaskaram! Nenu meeku ela sahayam cheyagalanu?'
    },
    kn: {
      title: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
      subtitle: 'ಮಾತನಾಡಿ ಅಥವಾ 1-ಟ್ಯಾಪ್‌ನಲ್ಲಿ ಸೇವೆ ಆರಿಸಿ',
      voiceWelcome: 'Namaskara! Naanu nimage hege sahaya madali?'
    }
  };

  const currentGreeting = greetings[language] || greetings[activeLanguage] || greetings.hi;

  const [assistantResponse, setAssistantResponse] = useState<string>(
    currentGreeting.voiceWelcome
  );

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Sync with mobile navbar scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 60) {
        setIsNavHidden(false);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setIsNavHidden(true);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsNavHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync with global language change
  useEffect(() => {
    if (language === 'en') {
      setActiveLanguage('en');
    } else {
      setActiveLanguage('hi');
    }
  }, [language]);

  // Clean, Authoritative Service Prompts
  const quickPrompts = [
    {
      icon: FileText,
      iconColor: '#0056D2',
      bgColor: '#EFF6FF',
      hindi: 'नया Learner Licence बनवाना है',
      english: 'Apply for new Learner Licence',
      action: () => {
        speakText('Zaroor! Naya Learner Licence ka aavedan khol raha hoon.');
        navigate('/apply/ll-new');
        setIsOpen(false);
      }
    },
    {
      icon: Search,
      iconColor: '#0284C7',
      bgColor: '#F0F9FF',
      hindi: 'मेरा Application Status चेक करो',
      english: 'Track my application status',
      action: () => {
        speakText('Theek hai, aapka live status tracker khol raha hoon.');
        navigate('/status');
        setIsOpen(false);
      }
    },
    {
      icon: Headphones,
      iconColor: '#D97706',
      bgColor: '#FFFBEB',
      hindi: 'Driving Test Mock Practice करनी है',
      english: 'Practice Driving License Mock Test',
      action: () => {
        speakText('Badhiya! Audio Mock Test shuru kar rahe hain.');
        navigate('/mock-test');
        setIsOpen(false);
      }
    },
    {
      icon: RotateCcw,
      iconColor: '#16A34A',
      bgColor: '#F0FDF4',
      hindi: 'Driving Licence Renew करना है',
      english: 'Renew my Driving Licence',
      action: () => {
        speakText('Contactless DL Renewal service khol raha hoon.');
        navigate('/apply/dl-renew');
        setIsOpen(false);
      }
    },
    {
      icon: MapPin,
      iconColor: '#EA580C',
      bgColor: '#FFF7ED',
      hindi: 'पास का RTO Office कहाँ है?',
      english: 'Find nearest RTO office',
      action: () => {
        speakText('Aapke kshetra ka RTO Directory khol raha hoon.');
        navigate('/rto-directory');
        setIsOpen(false);
      }
    },
    {
      icon: Stethoscope,
      iconColor: '#0D9488',
      bgColor: '#F0FDFA',
      hindi: 'Doctor Form 1A Medical Desk चाहिए',
      english: 'Find Form 1A Certified Doctor',
      action: () => {
        speakText('NMC Registered Doctor portal khol raha hoon.');
        navigate('/doctor-portal');
        setIsOpen(false);
      }
    }
  ];

  // Text-To-Speech Function
  const speakText = (text: string) => {
    if (!synthRef.current) return;

    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = activeLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech Recognition Handling
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setAssistantResponse('Aapke browser mein direct mic access uplabdh nahi hai. Kripya neeche diye gaye vikalpon par tap karein.');
      speakText('Kripya neeche diye gaye vikalp par tap karein.');
      return;
    }

    try {
      stopSpeaking();
      const recognition = new SpeechRecognition();
      recognition.lang = activeLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Sun raha hoon... Kahiye!');
      };

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript.toLowerCase();
        setTranscript(`"${spokenText}"`);
        processVoiceCommand(spokenText);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Aapki aawaz samajh nahi aayi, kripya dobara bolein ya vikalp chunein.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Natural Language Intent Matching
  const processVoiceCommand = (text: string) => {
    const q = text.toLowerCase();

    if (q.includes('learner') || q.includes('naya') || q.includes('new') || q.includes('ll')) {
      const resp = 'Ji haan! Naya Learner Licence aavedan khol diya gaya hai.';
      setAssistantResponse(resp);
      speakText(resp);
      setTimeout(() => {
        navigate('/apply/ll-new');
        setIsOpen(false);
      }, 1200);
    } else if (q.includes('renew') || q.includes('renewal') || q.includes('purana') || q.includes('khatam')) {
      const resp = 'Licence renewal page khol raha hoon.';
      setAssistantResponse(resp);
      speakText(resp);
      setTimeout(() => {
        navigate('/apply/dl-renew');
        setIsOpen(false);
      }, 1200);
    } else if (q.includes('status') || q.includes('track') || q.includes('kahan') || q.includes('check')) {
      const resp = 'Aapka aavedan status tracker khol diya gaya hai.';
      setAssistantResponse(resp);
      speakText(resp);
      setTimeout(() => {
        navigate('/status');
        setIsOpen(false);
      }, 1200);
    } else if (q.includes('test') || q.includes('mock') || q.includes('exam') || q.includes('sawal')) {
      const resp = 'Learner Licence Audio Mock Test shuru kar rahe hain.';
      setAssistantResponse(resp);
      speakText(resp);
      setTimeout(() => {
        navigate('/mock-test');
        setIsOpen(false);
      }, 1200);
    } else if (q.includes('doctor') || q.includes('medical') || q.includes('form 1a')) {
      const resp = 'Tele-Doctor Desk portal khol diya gaya hai.';
      setAssistantResponse(resp);
      speakText(resp);
      setTimeout(() => {
        navigate('/doctor-portal');
        setIsOpen(false);
      }, 1200);
    } else if (q.includes('rto') || q.includes('office') || q.includes('pincode')) {
      const resp = 'Nazdeeki RTO Office directory khol raha hoon.';
      setAssistantResponse(resp);
      speakText(resp);
      setTimeout(() => {
        navigate('/rto-directory');
        setIsOpen(false);
      }, 1200);
    } else if (q.includes('fee') || q.includes('paisa') || q.includes('kitna') || q.includes('kharcha')) {
      const resp = 'CMVR Rule 32 sarkari fee calculator khol diya gaya hai.';
      setAssistantResponse(resp);
      speakText(resp);
      setTimeout(() => {
        navigate('/fees');
        setIsOpen(false);
      }, 1200);
    } else {
      const resp = `Aapne poocha: "${text}". Aap neeche diye gaye seva vikalpon mein se ek chun sakte hain.`;
      setAssistantResponse(resp);
      speakText('Aap neeche diye gaye vikalpon mein se ek chun sakte hain.');
    }
  };

  // Page-Level Audio Summary
  const playPageSummary = () => {
    let summary = '';
    const path = location.pathname;

    if (path === '/') {
      summary = 'Yeh Parivahan Sarthi ka Home Page hai. Yahan aap bolkar ya ek tap mein naya licence, renewal, ya application status check kar sakte hain.';
    } else if (path.startsWith('/apply')) {
      summary = 'Yeh Application Wizard hai. Agar aapke paas DigiLocker hai, toh sirf ek click mein saare documents auto-verify ho jayenge bina cyber cafe jaye.';
    } else if (path.startsWith('/status')) {
      summary = 'Yeh Live Status Tracker hai. Yahan aap apne aavedan ki jaanch, Speed Post tracking aur WhatsApp alerts pa sakte hain.';
    } else if (path.startsWith('/mock-test')) {
      summary = 'Yeh Audio Mock Test hai. Har prashna ko sunkar sahi uttar par tap karein aur pehli baar mein test paas karein.';
    } else if (path.startsWith('/fees')) {
      summary = 'Yeh Sarkari Fee Calculator hai. Bina kisi dalal ya extra fees ke official sarkari dar dekhein.';
    } else {
      summary = 'Parivahan Sarthi portal par aapka swagat hai. Kisi bhi sahayata ke liye mic dabakar bolein.';
    }

    setAssistantResponse(summary);
    speakText(summary);
  };

  return (
    <>
      {/* Floating Voice AI Assistant FAB (Auto-Adjustable: Above Bottom Nav on Mobile, Bottom-6 on Desktop) */}
      <div className={`fixed ${isNavHidden ? 'bottom-6' : 'bottom-20 md:bottom-6'} right-3 sm:right-6 z-40 flex flex-col items-end transition-all duration-300 ease-in-out`}>
        
        {/* Multilingual Proactive Greeting Speech Bubble */}
        {showGreetingBubble && !isOpen && (
          <div className="mb-2.5 max-w-[290px] sm:max-w-xs p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl animate-in slide-in-from-bottom-2 duration-200 relative text-slate-900 dark:text-slate-100">
            {/* Pointer */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-700 transform rotate-45" />

            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-lg bg-[#0056D2] text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  भाषा सहायक
                </span>
                <span className="text-[9px] bg-blue-50 dark:bg-blue-950 text-[#0056D2] dark:text-blue-400 font-bold px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Voice AI
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreetingBubble(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md transition"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Greeting Text */}
            <div 
              onClick={() => {
                setIsOpen(true);
                speakText(currentGreeting.voiceWelcome);
              }}
              className="py-2 cursor-pointer group"
            >
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0056D2] transition-colors leading-snug">
                {currentGreeting.title}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {currentGreeting.subtitle}
              </p>
            </div>

            {/* Quick 1-Tap Direct Action Chips */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => {
                  speakText('Naya Licence wizard khol raha hoon.');
                  navigate('/apply/ll-new');
                }}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 hover:text-[#0056D2] rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3 h-3 text-[#0056D2]" />
                <span>{language === 'en' ? 'New DL' : 'नया DL'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  speakText('Aapka application status tracker khol raha hoon.');
                  navigate('/status');
                }}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 hover:text-[#0056D2] rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3 h-3 text-sky-600" />
                <span>{language === 'en' ? 'Status' : 'स्टेटस'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  speakText('Audio Mock Test shuru kar rahe hain.');
                  navigate('/mock-test');
                }}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 hover:text-[#0056D2] rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
              >
                <Headphones className="w-3 h-3 text-amber-600" />
                <span>{language === 'en' ? 'Mock Test' : 'टेस्ट'}</span>
              </button>
            </div>
          </div>
        )}

        {/* The Floating AI Button (True Circular FAB) */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              speakText(currentGreeting.voiceWelcome);
            } else {
              stopSpeaking();
              stopListening();
            }
          }}
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 flex items-center justify-center cursor-pointer relative ${
            isOpen
              ? 'bg-rose-700 border-white text-white ring-4 ring-rose-200'
              : 'bg-[#0B2545] hover:bg-[#003882] border-amber-400 text-white'
          }`}
          title="Bhasha Sahayak Voice Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          </div>
        </button>
      </div>

      {/* Interactive Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border ${
            darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          } max-h-[85vh] overflow-y-auto`}>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0056D2] text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold flex items-center space-x-1.5">
                    <span>Bhasha Sahayak</span>
                    <span className="text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-950 text-[#0056D2] dark:text-blue-300 px-2 py-0.5 rounded-full">
                      Voice AI
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bolkar ya 1-Tap mein seva chunein (Zero Tech Hassle)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Language Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const nextLang = activeLanguage === 'hi' ? 'en' : 'hi';
                    setActiveLanguage(nextLang);
                    speakText(nextLang === 'hi' ? 'Hindi bhasha chuni gayi hai.' : 'Switched to English voice assistance.');
                  }}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5 text-[#0056D2] dark:text-blue-400" />
                  <span>{activeLanguage === 'hi' ? 'हिंदी' : 'English'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    stopListening();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Speech Waveform / Speaking Indicator Card */}
            <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              {isListening ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-1.5 h-8">
                    <span className="w-1.5 h-6 bg-[#0056D2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1.5 h-7 bg-[#0056D2] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                  </div>
                  <p className="text-xs font-bold text-[#0056D2] dark:text-blue-400">
                    Aapki aawaz sun raha hoon... Kahiye!
                  </p>
                  {transcript && <p className="text-xs italic text-slate-600 dark:text-slate-300">{transcript}</p>}
                </div>
              ) : isSpeaking ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Volume2 className="w-5 h-5 text-[#0056D2] dark:text-blue-400 animate-pulse" />
                    <span className="text-xs font-bold text-[#0056D2] dark:text-blue-400">Sahayak bol raha hai...</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">{assistantResponse}</p>
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="text-[11px] font-bold text-rose-600 hover:underline inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Aawaz band karein (Stop Audio)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    {assistantResponse}
                  </p>
                  <div className="flex items-center justify-center space-x-3 pt-1">
                    <button
                      type="button"
                      onClick={() => speakText(assistantResponse)}
                      className="text-xs font-bold text-[#0056D2] dark:text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dobara Suniyen</span>
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={playPageSummary}
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Is Page Ki Jaankari Suniyen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Central Mic Button */}
            <div className="flex flex-col items-center justify-center py-2">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200 dark:ring-rose-950 animate-pulse'
                    : 'bg-[#0056D2] hover:bg-blue-700 text-white ring-4 ring-blue-100 dark:ring-blue-950'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                ) : (
                  <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                )}
              </button>
              <p className="text-[11px] sm:text-xs font-bold mt-2 text-slate-600 dark:text-slate-400">
                {isListening ? 'Bolna band karne ke liye tap karein' : 'Mic dabayein aur saaf aawaz mein bolein'}
              </p>
            </div>

            {/* Quick 1-Tap Common Voice Actions */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Ya direct tap karke shuru karein:
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>100% Free / No Dalal</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPrompts.map((p, idx) => {
                  const IconComp = p.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={p.action}
                      className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: p.bgColor }}
                        >
                          <IconComp className="w-3.5 h-3.5" style={{ color: p.iconColor }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0056D2] dark:group-hover:text-blue-400 truncate">
                            {activeLanguage === 'hi' ? p.hindi : p.english}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {activeLanguage === 'hi' ? p.english : p.hindi}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D2] transform group-hover:translate-x-0.5 transition flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="mt-4 pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Voice AI & DigiLocker e-KYC direct integration with MoRTH</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
