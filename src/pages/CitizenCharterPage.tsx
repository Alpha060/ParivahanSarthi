import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle2, Building, Scale, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CitizenCharterPage: React.FC = () => {
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
          <span className="text-[#0056D2] font-bold">Citizen Charter & Terms of Service</span>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Citizen Charter & Service Level Agreement (SLA)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ministry of Road Transport and Highways (MoRTH), Government of India Guaranteed Service Timelines.
              </p>
            </div>
          </div>
        </div>

        {/* SLA Table Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl space-y-6 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/80'
        }`}>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              Guaranteed Time-Bound Delivery of Transport Services
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In accordance with the Good Governance Directives and the Motor Vehicles Act 1988, the following maximum processing time limits are guaranteed for public applications submitted with complete documentation:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Service Name</th>
                  <th className="p-3.5">Mode</th>
                  <th className="p-3.5">Prescribed Fee</th>
                  <th className="p-3.5 rounded-r-xl">Guaranteed SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700 font-medium">
                <tr>
                  <td className="p-3.5 font-bold">Issue of Learner Licence (LL)</td>
                  <td className="p-3.5 text-blue-600">Aadhaar Contactless</td>
                  <td className="p-3.5">₹200</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Immediate (Online Test)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Driving Licence Renewal (e-KYC)</td>
                  <td className="p-3.5 text-blue-600">Contactless</td>
                  <td className="p-3.5">₹450</td>
                  <td className="p-3.5 text-emerald-600 font-bold">3 Working Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">New Permanent Driving Licence</td>
                  <td className="p-3.5 text-blue-600">RTO Skill Track</td>
                  <td className="p-3.5">₹1000</td>
                  <td className="p-3.5 text-emerald-600 font-bold">5 Working Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Change of Address in DL</td>
                  <td className="p-3.5 text-blue-600">e-KYC Online</td>
                  <td className="p-3.5">₹500</td>
                  <td className="p-3.5 text-emerald-600 font-bold">3 Working Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Duplicate Licence Issuance</td>
                  <td className="p-3.5 text-blue-600">Online Submission</td>
                  <td className="p-3.5">₹400</td>
                  <td className="p-3.5 text-emerald-600 font-bold">5 Working Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Public Grievance Resolution</td>
                  <td className="p-3.5 text-purple-600">CPGRAMS Portal</td>
                  <td className="p-3.5">Free</td>
                  <td className="p-3.5 text-emerald-600 font-bold">48 - 72 Hours</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <h4 className="font-bold text-blue-800 dark:text-blue-300">Right to Public Service Guarantee</h4>
            <p>If any application is delayed beyond the statutory timeline without valid technical scrutiny remarks, the citizen is entitled to immediate escalation to the State Transport Commissioner Nodal Desk.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
