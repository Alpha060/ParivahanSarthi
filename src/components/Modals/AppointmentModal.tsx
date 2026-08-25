import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, X, ArrowRight, Printer, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
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
    if (isOpen) {
      fetchAvailability('JH-01');
    }
  }, [isOpen]);

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
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setError(res.error || 'Failed to book slot.');
      }
    } catch (err) {
      setError('Failed to connect to appointment reservation server.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0056D2] flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Book / Reschedule RTO Appointment
              </h3>
              <p className="text-xs text-slate-500">
                Sarathi e-Appointment Booking System (Live Database)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {bookedAppointment ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  Appointment Reserved Successfully!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Token <strong>{bookedAppointment.tokenNumber}</strong> has been allocated in the National Database.
                </p>
              </div>

              {/* Official Appointment Pass Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">Appointment ID:</span>
                  <span className="font-bold text-[#0056D2]">{bookedAppointment.appointmentId}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">Application No:</span>
                  <span className="font-bold text-slate-800">{bookedAppointment.applicationId || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-800">{bookedAppointment.applicantName}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-800">{bookedAppointment.serviceType}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">RTO Centre:</span>
                  <span className="font-bold text-slate-800">{bookedAppointment.rtoName}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 pt-1 text-sm">
                  <span>Reserved Slot:</span>
                  <span>{bookedAppointment.appointmentDate}, {bookedAppointment.timeSlot}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setBookedAppointment(null); onClose(); }}
                  className="flex-1 bg-[#0056D2] hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              
              {/* Application Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Number
                  </label>
                  <input
                    type="text"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Applicant Full Name
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Service & RTO Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Purpose / Test Type
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <option>Driving Skill Test (Form 7B)</option>
                    <option>Biometric & Document Scrutiny</option>
                    <option>International Driving Permit Endorsement</option>
                    <option>Commercial Transport Badge Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    RTO Location
                  </label>
                  <select
                    value={selectedRto}
                    onChange={(e) => handleRtoChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <option>Ranchi RTO (JH-01)</option>
                    <option>Jamshedpur RTO (JH-05)</option>
                    <option>Dhanbad RTO (JH-10)</option>
                    <option>Delhi Civil Lines RTO (DL-01)</option>
                    <option>Mumbai Central RTO (MH-01)</option>
                  </select>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Select Available Date
                  </label>
                  {isLoadingSlots && <span className="text-[10px] text-blue-600 animate-pulse">Loading live seats...</span>}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {availableDates.map((d, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={!d.available}
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        !d.available
                          ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed'
                          : selectedDate === d.date
                          ? 'bg-blue-50 border-[#0056D2] text-[#0056D2] font-bold shadow-xs'
                          : 'bg-white border-slate-200 hover:border-blue-200 text-slate-700'
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold text-slate-400">{d.day}</p>
                      <p className="text-xs font-extrabold">{d.date.split(' ')[0]} {d.date.split(' ')[1]}</p>
                      <p className="text-[9px] text-emerald-600 font-semibold">{d.available ? `${d.slots} left` : 'Full'}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Preferred Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedTime === slot
                          ? 'bg-blue-50 border-[#0056D2] text-[#0056D2] shadow-xs'
                          : 'bg-white border-slate-200 hover:border-blue-200 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-blue-500/20 active:scale-98 transition cursor-pointer"
                >
                  <span>Confirm Appointment Slot</span>
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
