import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ArrowRight, 
  Printer, 
  AlertCircle,
  MapPin,
  Clock,
  User,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { printOfficialSlip } from '../utils/printDocument';

export const AppointmentPage: React.FC = () => {
  const { darkMode } = useApp();

  const [selectedService, setSelectedService] = useState('Driving Skill Test (Form 7B)');
  const [selectedRto, setSelectedRto] = useState('Ranchi RTO (JH-01)');
  const [rtoCode, setRtoCode] = useState('JH-01');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [applicantName, setApplicantName] = useState('Krishna Mahto');
  const [applicationId, setApplicationId] = useState('DL1234567890123');
  const [mobile, setMobile] = useState('9876543210');

  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability('JH-01');
  }, []);

  const fetchAvailability = async (code: string) => {
    setIsLoadingSlots(true);
    setError(null);
    try {
      const res = await api.getAppointmentAvailability(code);
      if (res.success) {
        setAvailableDates(res.dates || []);
        setTimeSlots(res.timeSlots || []);
        if (res.dates && res.dates.length > 0) {
          const firstAvailable = res.dates.find((d: any) => d.available) || res.dates[0];
          setSelectedDate(firstAvailable.date);
        }
        if (res.timeSlots && res.timeSlots.length > 0) {
          setSelectedTime(res.timeSlots[0]);
        }
      }
    } catch (err) {
      setError('Could not retrieve live slot calendar.');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleRtoChange = (rtoName: string) => {
    setSelectedRto(rtoName);
    const codeMatch = rtoName.match(/\(([^)]+)\)/);
    const code = codeMatch ? codeMatch[1] : 'JH-01';
    setRtoCode(code);
    fetchAvailability(code);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.bookAppointment({
        applicationId,
        applicantName,
        mobile,
        rtoCode,
        rtoName: selectedRto,
        serviceType: selectedService,
        appointmentDate: selectedDate,
        timeSlot: selectedTime
      });

      if (res.success && res.appointment) {
        setBookedAppointment(res.appointment);
      } else {
        setError(res.error || 'Failed to book slot.');
      }
    } catch (err) {
      setError('Failed to connect to appointment reservation server.');
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
          <span className="text-[#0056D2] font-bold">RTO Appointment & Slot Booking</span>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Sarathi e-Appointment Booking System
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Reserve automated driving test track slots, biometric scrutiny, and document verification across all RTOs.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-xs text-rose-800 dark:text-rose-300 font-semibold mb-6">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {bookedAppointment ? (
            /* Official Executive Pass Slip Screen */
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Executive Cryptographic Verification Seal */}
              <div className="relative inline-flex items-center justify-center mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 p-0.5 shadow-xl shadow-emerald-500/20">
                  <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center border border-emerald-400/30">
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest shadow-md">
                  SLOT ALLOCATED
                </span>
              </div>

              <div>
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  National Appointment Register • Confirmed Slot
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  RTO Appointment Reserved Successfully
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Token Number <strong>{bookedAppointment.tokenNumber}</strong> confirmed in RTO Queue.
                </p>
              </div>

              {/* Pass Card */}
              <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Appointment Reference</span>
                    <p className="text-lg font-black text-[#0056D2] dark:text-blue-400">{bookedAppointment.appointmentId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Token Number</span>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{bookedAppointment.tokenNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400">Application Number:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{bookedAppointment.applicationId || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Applicant Full Name:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{bookedAppointment.applicantName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Purpose / Service:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{bookedAppointment.serviceType}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">RTO Center:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{bookedAppointment.rtoName}</p>
                  </div>
                  <div className="col-span-2 p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 flex justify-between items-center text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    <span>Scheduled Slot:</span>
                    <span>{bookedAppointment.appointmentDate}, {bookedAppointment.timeSlot}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => printOfficialSlip({
                    title: 'RTO Slot Booking & Driving Skill Test Pass',
                    subtitle: 'MoRTH Automated Driving Testing Track (ADTT) Reservation',
                    documentType: 'Official Appointment Pass',
                    referenceNumber: bookedAppointment.appointmentId,
                    applicantName: bookedAppointment.applicantName,
                    serviceName: bookedAppointment.serviceType,
                    rtoName: bookedAppointment.rtoName,
                    details: [
                      { label: 'Appointment Reference ID', value: bookedAppointment.appointmentId },
                      { label: 'Token Queue Number', value: bookedAppointment.tokenNumber },
                      { label: 'Sarathi Application Number', value: bookedAppointment.applicationId || 'N/A' },
                      { label: 'Applicant Full Name', value: bookedAppointment.applicantName },
                      { label: 'Registered Mobile', value: bookedAppointment.mobile },
                      { label: 'Purpose / Service Category', value: bookedAppointment.serviceType },
                      { label: 'Testing Center (RTO)', value: bookedAppointment.rtoName },
                      { label: 'Reserved Test Date', value: bookedAppointment.appointmentDate },
                      { label: 'Reporting Time Window', value: bookedAppointment.timeSlot }
                    ],
                    highlightBox: {
                      label: 'Assigned RTO Token Number',
                      value: `${bookedAppointment.tokenNumber} (Slot: ${bookedAppointment.timeSlot})`
                    },
                    footerNotes: [
                      'Please report to the assigned RTO testing track 15 minutes before the scheduled time window.',
                      'Bring your vehicle in the requested category with valid insurance and PUC certificate.',
                      'Carry original Form 2 / Form 4 acknowledgement slip along with Aadhaar ID.'
                    ]
                  })}
                  className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-600"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slot Confirmation Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookedAppointment(null)}
                  className="px-6 py-3 rounded-2xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Book Another Appointment
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-6">
              
              {/* Applicant & Application info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sarathi Application No. *
                  </label>
                  <input
                    type="text"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Applicant Full Name *
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
                    Mobile (For SMS Alerts) *
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border-r border-slate-300 dark:border-slate-700 flex items-center gap-1 select-none">
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
                      className="w-full px-3 py-2.5 bg-transparent text-slate-800 dark:text-slate-100 text-xs font-bold tracking-wider focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Service & RTO Center */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Appointment Purpose / Test Category
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Driving Skill Test (Form 7B)</option>
                    <option>Biometric & Document Scrutiny</option>
                    <option>International Driving Permit Verification</option>
                    <option>Commercial Transport Badge Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select RTO Testing Center
                  </label>
                  <select
                    value={selectedRto}
                    onChange={(e) => handleRtoChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Ranchi RTO (JH-01)</option>
                    <option>Jamshedpur RTO (JH-05)</option>
                    <option>Dhanbad RTO (JH-10)</option>
                    <option>Delhi Civil Lines RTO (DL-01)</option>
                    <option>Mumbai Central RTO (MH-01)</option>
                    <option>Bengaluru Koramangala (KA-01)</option>
                    <option>Patna DTO (BR-01)</option>
                  </select>
                </div>
              </div>

              {/* Live Available Dates */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Test Date (Live Database Seats)
                  </label>
                  {isLoadingSlots && <span className="text-xs text-blue-600 animate-pulse font-semibold">Updating live seat count...</span>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {availableDates.map((d, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={!d.available}
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-3 rounded-2xl text-center border transition cursor-pointer ${
                        !d.available
                          ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                          : selectedDate === d.date
                          ? 'bg-blue-50 dark:bg-blue-950 border-[#0056D2] text-[#0056D2] font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-700 hover:border-blue-300 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold text-slate-400">{d.day}</p>
                      <p className="text-xs font-extrabold mt-0.5">{d.date}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                        {d.available ? `${d.slots} seats left` : 'Fully Booked'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Preferred Reporting Time Window
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedTime === slot
                          ? 'bg-blue-50 dark:bg-blue-950 border-[#0056D2] text-[#0056D2] font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-700 hover:border-blue-300 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirmation CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/20 active:scale-98 transition cursor-pointer"
                >
                  <span>Confirm Slot Reservation & Generate Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
