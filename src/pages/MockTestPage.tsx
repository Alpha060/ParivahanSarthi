import React, { useState, useEffect } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What is the mandatory action required when approaching a flashing amber traffic light at an intersection?',
    options: [
      'Accelerate rapidly to clear the crossing before the light turns red',
      'Slow down and proceed with extreme caution after verifying cross traffic',
      'Come to a complete stop and wait for a green signal',
      'Sound horn continuously and maintain speed'
    ],
    correctIndex: 1,
    explanation: 'A flashing amber signal indicates caution. Drivers must reduce speed and proceed only when the intersection is clear.'
  },
  {
    id: 2,
    question: 'Under Central Motor Vehicles Rules (CMVR), what is the legal blood alcohol concentration (BAC) limit for operating a motor vehicle?',
    options: [
      'Zero tolerance (0.0 mg per 100 ml blood)',
      '30 mg per 100 ml blood detected via breath analyzer',
      '50 mg per 100 ml blood',
      '80 mg per 100 ml blood'
    ],
    correctIndex: 1,
    explanation: 'Section 185 of the Motor Vehicles Act specifies a legal limit of 30 mg alcohol per 100 ml of blood.'
  },
  {
    id: 3,
    question: 'When overtaking another vehicle on a multi-lane national highway, which side is statutory and mandatory?',
    options: [
      'From the right side only',
      'From the left side (kerb side)',
      'From whichever side has a clear gap',
      'Overtaking on national highways is strictly prohibited'
    ],
    correctIndex: 0,
    explanation: 'In India (Right-hand drive traffic), overtaking must always be executed from the right side after proper signalling.'
  },
  {
    id: 4,
    question: 'What is the standard validity period of a Learner Licence (Form 2) issued under MoRTH guidelines?',
    options: [
      '30 days from the date of issue',
      '6 calendar months valid throughout India',
      '1 year with mandatory renewal',
      'Valid until the candidate turns 25 years of age'
    ],
    correctIndex: 1,
    explanation: 'A Learner Licence is valid for 6 months across India. You become eligible to take the permanent Driving Licence skill test after 30 days.'
  },
  {
    id: 5,
    question: 'What does a triangular traffic sign with a red border signify?',
    options: [
      'Mandatory Regulatory Order (e.g. Stop / No Entry)',
      'Cautionary / Warning Sign advising of road hazards ahead',
      'Informative Sign indicating hospital or petrol pump',
      'Toll Plaza indicator'
    ],
    correctIndex: 1,
    explanation: 'Equilateral triangles pointing upwards with red borders are cautionary signs warning road users of potential hazards.'
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

  const handleNext = () => {
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
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-[#0056D2] font-semibold">Services</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">Learner Licence Mock Test</span>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  Computerized LL Mock Skill Exam
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  MoRTH Standard Traffic Rules, Road Signs, and Defensive Driving Question Bank (Passing: 60%)
                </p>
              </div>
            </div>

            {!isFinished && (
              <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs font-bold text-rose-600">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
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
                    ? 'Congratulations! You have demonstrated adequate proficiency in mandatory road traffic safety regulations.' 
                    : 'Passing score is 60%. Please review traffic signage and retry the practice exam.'}
                </p>
              </div>

              {/* Review Answers */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-150 dark:border-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Answer Key</h3>
                {MOCK_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{idx + 1}. {q.question}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Correct Answer: {q.options[q.correctIndex]}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{q.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-600"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Exam</span>
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
                <span>Question {currentIdx + 1} of {MOCK_QUESTIONS.length}</span>
                <span className="text-[#0056D2] dark:text-blue-400">Mandatory Road Safety Rule</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {MOCK_QUESTIONS[currentIdx].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {MOCK_QUESTIONS[currentIdx].options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => setSelectedOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      selectedOption === optIdx
                        ? 'bg-blue-50 dark:bg-blue-950/80 border-[#0056D2] text-[#0056D2] shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                      selectedOption === optIdx ? 'bg-[#0056D2] border-[#0056D2] text-white' : 'border-slate-300'
                    }`}>
                      {selectedOption === optIdx && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
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
                  <span>{currentIdx + 1 === MOCK_QUESTIONS.length ? 'Submit Exam' : 'Next Question'}</span>
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
