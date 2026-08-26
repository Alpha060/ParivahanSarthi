import React, { useState } from 'react';
import { 
  Car, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Clock, 
  Navigation, 
  HelpCircle,
  Sparkles,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdttTrackGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdttTrackGuideModal: React.FC<AdttTrackGuideModalProps> = ({ isOpen, onClose }) => {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState<'8_TRACK' | 'H_TRACK' | 'GRADIENT' | 'PARALLEL'>('8_TRACK');

  if (!isOpen) return null;

  const tracks = [
    {
      id: '8_TRACK',
      title: "1. The '8' Figure Track",
      sub: 'Two-Wheeler (MCWG) Skill Test',
      vehicle: 'Motorcycle / Scooter',
      timeLimit: '60 Seconds',
      passCondition: 'Zero Foot Touches, Proper Turn Indicators',
      rules: [
        'Enter the start loop in 1st gear at a steady speed (10-15 km/h).',
        'Follow the clockwise curvature without letting either foot touch the ground.',
        'Smoothly transition into the counter-clockwise loop without touching sensor curbs.',
        'Exit the track within 60 seconds with turn indicator engaged.'
      ],
      sensorTips: 'Sensor cameras track yellow line boundaries. Maintain smooth throttle control rather than sudden braking.',
      failPitfall: 'Putting foot down when taking tight curve.'
    },
    {
      id: 'H_TRACK',
      title: "2. The 'H' Forward & Reverse Track",
      sub: 'Four-Wheeler (LMV) Precision Maneuver',
      vehicle: 'Light Motor Vehicle (Car)',
      timeLimit: '120 Seconds',
      passCondition: 'Zero Pole Hits, Max 2 Reversals',
      rules: [
        'Drive forward into the left lane of the H-box.',
        'Shift to reverse gear and back into the middle crossing corridor.',
        'Steer into the right-hand bay in one smooth motion using side mirrors.',
        'Drive forward out of the bay to the finish line.'
      ],
      sensorTips: 'Ultrasonic pole sensors detect 10cm proximity. Keep rear wheels aligned with lane center.',
      failPitfall: 'Looking backwards over the seat instead of using both side rearview mirrors.'
    },
    {
      id: 'GRADIENT',
      title: '3. Upward Gradient / Slope Stop',
      sub: 'Hill-Start & Handbrake Hold Test',
      vehicle: 'Four-Wheeler (LMV)',
      timeLimit: '30 Seconds',
      passCondition: 'Rollback under 15 cm, Zero Engine Stalling',
      rules: [
        'Drive up the 18-degree incline ramp to the stop line.',
        'Pull handbrake fully and shift to neutral when the signal turns yellow.',
        'On green signal: Engage 1st gear, balance clutch-accelerator bite point, and release handbrake.',
        'Vehicle must climb over the crest without rolling backwards.'
      ],
      sensorTips: 'Infrared ground sensor triggers FAIL if vehicle rolls back more than 15cm (6 inches).',
      failPitfall: 'Releasing handbrake before clutch reaches the friction bite point.'
    },
    {
      id: 'PARALLEL',
      title: '4. Computerized Parallel Parking',
      sub: '45-Degree Reverse Box Alignment',
      vehicle: 'Light Motor Vehicle (Car)',
      timeLimit: '90 Seconds',
      passCondition: 'Parked within curb lines in 3 attempts',
      rules: [
        'Pull alongside the front marker cone leaving 1 meter gap.',
        'Turn steering wheel 360 degrees towards curb and reverse at 45-degree angle.',
        'Straighten wheel as rear wheel passes front boundary, then steer full opposite.',
        'Center vehicle inside yellow parking box without touching front/rear sensor poles.'
      ],
      sensorTips: 'Both left tires must be within 20cm of the kerb and completely inside the yellow line.',
      failPitfall: 'Turning steering too late, causing rear bumper to trigger curb sensor.'
    }
  ];

  const currentTrack = tracks.find(t => t.id === activeTab) || tracks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      } max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black">
                  ADTT Computerized Test Track Guide
                </h3>
                <span className="text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full hidden xs:inline">
                  Pass on 1st Attempt
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MoRTH Automated Driving Skill Sensor Rules & Pro Tips
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Selector Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto py-3 border-b border-slate-100 dark:border-slate-800 [&::-webkit-scrollbar]:hidden">
          {tracks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex-shrink-0 ${
                activeTab === t.id
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Active Track Diagram & Details */}
        <div className="py-4 space-y-4">
          
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
              <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Vehicle Type</div>
              <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{currentTrack.vehicle}</div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
              <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Time Limit</div>
              <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{currentTrack.timeLimit}</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Pass Criteria</div>
              <div className="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5">{currentTrack.passCondition}</div>
            </div>
          </div>

          {/* Visual Track Simulation Box */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white relative overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-300">Live ADTT Sensor Overlay</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                AI Trajectory Guide
              </span>
            </div>

            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-900/50 border-2 border-dashed border-blue-400 flex items-center justify-center mb-2 animate-spin-slow">
                <Navigation className="w-8 h-8 text-amber-400 transform rotate-45" />
              </div>
              <h4 className="text-sm font-black text-white">{currentTrack.title}</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                {currentTrack.sub} • Automated overhead cameras track speed and tire trajectories.
              </p>
            </div>
          </div>

          {/* Step-by-Step Rules */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              Step-by-Step Driving Instructions:
            </h4>
            <div className="space-y-2">
              {currentTrack.rules.map((rule, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0056D2] font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips & Sensor Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
              <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sensor Pro-Tip</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {currentTrack.sensorTips}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
              <div className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-300 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Failing Mistake</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {currentTrack.failPitfall}
              </p>
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Passed applicants get instant permanent DL dispatch</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0056D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
          >
            I Understand, Ready for Test
          </button>
        </div>

      </div>
    </div>
  );
};
