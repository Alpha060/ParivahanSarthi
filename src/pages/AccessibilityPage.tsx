import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle2, Type, Sun, Keyboard, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccessibilityPage: React.FC = () => {
  const { darkMode } = useApp();

  return (
    <div className={`min-h-screen py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
          <span>/</span>
          <span className="text-[#0056D2] font-bold">Accessibility Statement</span>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Accessibility Statement (GIGW Compliance)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Guidelines for Indian Government Websites (GIGW) Level AA and World Wide Web Consortium (W3C) WCAG 2.1 Standards.
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/80'
        }`}>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
              Commitment to Universal Accessibility
            </h2>
            <p>
              We are committed to ensuring that the Parivahan Sarathi National Portal is accessible to all users irrespective of device, technology, or ability. It has been built with an aim to provide maximum accessibility and usability to its visitors including citizens with visual, auditory, motor, or cognitive impairments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Type className="w-4 h-4" />
                <span>Dynamic Text Resizing</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Use the A- / A / A+ accessibility buttons in the top header to increase or decrease text scale across the entire portal dynamically.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                <Sun className="w-4 h-4" />
                <span>High-Contrast & Dark Mode</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Toggle between standard government palette and high-contrast dark theme meeting WCAG AAA color contrast ratios (7:1+).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
                <Keyboard className="w-4 h-4" />
                <span>Full Keyboard Operability</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                All buttons, dropdowns, forms, and modals can be navigated entirely using the Tab, Space, Enter, and Arrow keys with visual focus rings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Screen Reader Support</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Portal markup adheres to semantic HTML5 with complete ARIA role tags, alternative text labels, and form label associations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
