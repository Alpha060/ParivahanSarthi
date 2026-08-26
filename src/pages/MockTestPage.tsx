import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  Volume2,
  VolumeX,
  Sparkles,
  Car,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdttTrackGuideModal } from '../components/Modals/AdttTrackGuideModal';

interface Question {
  id: number;
  question: string;
  questionHindi?: string;
  options: string[];
  optionsHindi?: string[];
  correctIndex: number;
  explanation: string;
  tag: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What is the mandatory action required when approaching a flashing amber traffic light at an intersection?',
    questionHindi: 'Chourahe par peeli batti (flashing amber light) jhapakhne par kya karna anivarya hai?',
    options: [
      'Accelerate rapidly to clear the crossing before the light turns red',
      'Slow down and proceed with extreme caution after verifying cross traffic',
      'Come to a complete stop and wait for a green signal',
      'Sound horn continuously and maintain speed'
    ],
    optionsHindi: [
      'Lal batti hone se pehle tezi se gaadi nikaalein',
      'Gati dheemi karein aur aaspas dekhkar savdhani se aage badhein',
      'Poori tarah ruk jayein aur hari batti ka intezar karein',
      'Lagaatar horn bajate hue usi gati mein chalein'
    ],
    correctIndex: 1,
    explanation: 'A flashing amber signal indicates caution. Drivers must reduce speed and proceed only when the intersection is clear.',
    tag: 'Cautionary Signals'
  },
  {
    id: 2,
    question: 'Under Central Motor Vehicles Rules (CMVR), what is the legal blood alcohol concentration (BAC) limit for operating a motor vehicle?',
    questionHindi: 'CMVR ke niyam anusaar gadi chalate samay alcohol (sharab) ki kanooni seema kya hai?',
    options: [
      'Zero tolerance (0.0 mg per 100 ml blood)',
      '30 mg per 100 ml blood detected via breath analyzer',
      '50 mg per 100 ml blood',
      '80 mg per 100 ml blood'
    ],
    optionsHindi: [
      'Zero tolerance (Shunya)',
      '30 mg per 100 ml khoon (Breath analyzer dwara)',
      '50 mg per 100 ml khoon',
      '80 mg per 100 ml khoon'
    ],
    correctIndex: 1,
    explanation: 'Section 185 of the Motor Vehicles Act specifies a legal limit of 30 mg alcohol per 100 ml of blood.',
    tag: 'Legal Limits'
  },
  {
    id: 3,
    question: 'When overtaking another vehicle on a multi-lane national highway, which side is statutory and mandatory?',
    questionHindi: 'National Highway par aage chal rahi gaadi ko kis disha se overtake karna chahiye?',
    options: [
      'From the right side only',
      'From the left side (kerb side)',
      'From whichever side has a clear gap',
      'Overtaking on national highways is strictly prohibited'
    ],
    optionsHindi: [
      'Kewal Daayin (Right) taraf se',
      'Baayin (Left) taraf se',
      'Jis taraf jagah dikhe wahan se',
      'Highway par overtake karna mana hai'
    ],
    correctIndex: 0,
    explanation: 'In India (Right-hand drive traffic), overtaking must always be executed from the right side after proper signalling.',
    tag: 'Lane Discipline'
  },
  {
    id: 4,
    question: 'What is the standard validity period of a Learner Licence (Form 2) issued under MoRTH guidelines?',
    questionHindi: 'Naye Learner Licence ki samay seema (validity) kitne mahine hoti hai?',
    options: [
      '30 days from the date of issue',
      '6 calendar months valid throughout India',
      '1 year with mandatory renewal',
      'Valid until the candidate turns 25 years of age'
    ],
    optionsHindi: [
      'Kewal 30 din',
      '6 mahine (Poore Bharat mein maanya)',
      '1 saal ke liye',
      '25 saal ki umra tak'
    ],
    correctIndex: 1,
    explanation: 'A Learner Licence is valid for 6 months across India. You become eligible to take the permanent Driving Licence skill test after 30 days.',
    tag: 'Licence Rules'
  },
  {
    id: 5,
    question: 'What does a triangular traffic sign with a red border signify?',
    questionHindi: 'Laal kinare wala Tikona (Triangular) traffic sign kya darshata hai?',
    options: [
      'Mandatory Regulatory Order (e.g. Stop / No Entry)',
      'Cautionary / Warning Sign advising of road hazards ahead',
      'Informative Sign indicating hospital or petrol pump',
      'Toll Plaza indicator'
    ],
    optionsHindi: [
      'Anivarya aadesh (Jaise Rukein / No Entry)',
      'Chetavni / Savdhani sign (Khatre ki suchna)',
      'Jaankari sign (Hospital / Petrol pump)',
      'Toll plaza suchak'
    ],
    correctIndex: 1,
    explanation: 'Equilateral triangles pointing upwards with red borders are cautionary signs warning road users of potential hazards.',
    tag: 'Traffic Signs'
  }
];

export const MockTestPage: React.FC = () => {
  const { darkMode } = useApp();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAdttOpen, setIsAdttOpen] = useState(false);
  const [languageMode, setLanguageMode] = useState<'en' | 'hi'>('hi');

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  // Read Current Question Aloud
  const readQuestionAloud = () => {
    if (!synthRef.current) return;

    try {
      synthRef.current.cancel();
      const q = MOCK_QUESTIONS[currentIdx];
      const textToRead = languageMode === 'hi'
        ? `Prashna ${currentIdx + 1}: ${q.questionHindi || q.question}. Vikalp ek: ${q.optionsHindi?.[0] || q.options[0]}. Vikalp do: ${q.optionsHindi?.[1] || q.options[1]}. Vikalp teen: ${q.optionsHindi?.[2] || q.options[2]}. Vikalp char: ${q.optionsHindi?.[3] || q.options[3]}.`
        : `Question ${currentIdx + 1}: ${q.question}. Option 1: ${q.options[0]}. Option 2: ${q.options[1]}. Option 3: ${q.options[2]}. Option 4: ${q.options[3]}.`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.92;
      utterance.lang = languageMode === 'hi' ? 'hi-IN' : 'en-IN';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleNext = () => {
    stopAudio();
    if (selectedOption === null) return;
    const isCorrect = selectedOption === MOCK_QUESTIONS[currentIdx].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnswers((prev) => [...prev, selectedOption]);

    if (currentIdx + 1 < MOCK_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    stopAudio();
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
    setIsFinished(false);
    setTimeLeft(300);
  };

  const isPassed = score >= 3;

  return (
    <div className={`min-h-screen py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-[#0056D2] font-semibold">Services</Link>
            <span>/</span>
            <span className="text-[#0056D2] font-bold">Audio LL Mock Test</span>
          </div>

          <button
            type="button"
            onClick={() => setIsAdttOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0056D2] dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition flex items-center space-x-1.5 border border-blue-200 dark:border-blue-800"
          >
            <Car className="w-3.5 h-3.5" />
            <span>3D ADTT Test Track Guide</span>
          </button>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                    Audio STALL AI Mock Exam
                  </h1>
                  <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                    Voice Assisted
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  MoRTH Road Safety & Signage Bank • Tap Speaker to Listen (Passing: 60%)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Language Switch */}
              <button
                type="button"
                onClick={() => setLanguageMode(languageMode === 'hi' ? 'en' : 'hi')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
              >
                {languageMode === 'hi' ? 'हिंदी प्रश्न' : 'English Questions'}
              </button>

              {!isFinished && (
                <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs font-bold text-rose-600">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          
          {isFinished ? (
            /* Result Screen */
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md ${
                isPassed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
              }`}>
                {isPassed ? <Award className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
              </div>

              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPassed ? 'Official Mock Test Passed' : 'Test Needs Revision'}
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  You Scored {score} out of {MOCK_QUESTIONS.length} ({Math.round((score / MOCK_QUESTIONS.length) * 100)}%)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {isPassed 
                    ? 'Badhai ho! Aapne MoRTH road safety standard score paas kar liya hai. Ab aap naye Learner Licence ke liye aavedan kar sakte hain.' 
                    : 'Passing score is 60%. Please review traffic signage and retry the practice exam.'}
                </p>
              </div>

              {/* Review Answers */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-150 dark:border-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Answer Key</h3>
                {MOCK_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{idx + 1}. {languageMode === 'hi' ? q.questionHindi || q.question : q.question}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Sahi Uttar: {languageMode === 'hi' ? q.optionsHindi?.[q.correctIndex] || q.options[q.correctIndex] : q.options[q.correctIndex]}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{q.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-600"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Dobara Exam Dein (Retry)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAdttOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>3D Track Test Guide Dekhein</span>
                </button>

                <Link
                  to="/apply/ll-new"
                  className="px-6 py-3 rounded-2xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <span>Apply for Actual Learner Licence</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Question Screen */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-700 text-xs font-bold text-slate-400">
                <div className="flex items-center space-x-2">
                  <span>Question {currentIdx + 1} of {MOCK_QUESTIONS.length}</span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                    {MOCK_QUESTIONS[currentIdx].tag}
                  </span>
                </div>

                {/* Audio Read Button */}
                <button
                  type="button"
                  onClick={isSpeaking ? stopAudio : readQuestionAloud}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                    isSpeaking 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Aawaz Rokein' : 'Bolkar Sunayein (Listen)'}</span>
                </button>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {languageMode === 'hi' 
                    ? MOCK_QUESTIONS[currentIdx].questionHindi || MOCK_QUESTIONS[currentIdx].question 
                    : MOCK_QUESTIONS[currentIdx].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {MOCK_QUESTIONS[currentIdx].options.map((opt, optIdx) => {
                  const optDisplay = languageMode === 'hi' 
                    ? MOCK_QUESTIONS[currentIdx].optionsHindi?.[optIdx] || opt 
                    : opt;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setSelectedOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        selectedOption === optIdx
                          ? 'bg-blue-50 dark:bg-blue-950/80 border-[#0056D2] text-[#0056D2] shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {optIdx + 1}
                        </span>
                        <span>{optDisplay}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                        selectedOption === optIdx ? 'bg-[#0056D2] border-[#0056D2] text-white' : 'border-slate-300'
                      }`}>
                        {selectedOption === optIdx && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAdttOpen(true)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>RTO Test Track Tips</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className={`px-8 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer ${
                    selectedOption !== null
                      ? 'bg-[#0056D2] hover:bg-blue-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{currentIdx + 1 === MOCK_QUESTIONS.length ? 'Submit Exam' : 'Agla Prashna (Next)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ADTT 3D Track Guide Modal */}
      <AdttTrackGuideModal
        isOpen={isAdttOpen}
        onClose={() => setIsAdttOpen(false)}
      />
    </div>
  );
};
