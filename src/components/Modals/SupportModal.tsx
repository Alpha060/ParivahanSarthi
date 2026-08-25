import React, { useState } from 'react';
import { Headphones, Send, Bot, User, X, Phone, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'grievance' | 'faq'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Parivahan Sarathi Citizen Virtual Assistant. How can I help you today? You can ask about Learner Licence, DL Renewal, RTO Test slots, or Fee details.',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  
  // Grievance Form State
  const [appId, setAppId] = useState('');
  const [applicantName, setApplicantName] = useState('Krishna Mahto');
  const [category, setCategory] = useState('Delay in Driving Licence Dispatch');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grievanceTicket, setGrievanceTicket] = useState<any>(null);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText.toLowerCase();
    setInputText('');

    setTimeout(() => {
      let reply = "Thank you for reaching out. You can apply for DL services online using your Aadhaar authentication directly from the home screen.";
      if (currentInput.includes('fee') || currentInput.includes('cost') || currentInput.includes('charge')) {
        reply = "The statutory fee for a Learner Licence is ₹150 + ₹50 test fee. For a new Driving Licence, the fee is ₹200 + ₹300 driving test fee + ₹200 Smart Card fee.";
      } else if (currentInput.includes('renew') || currentInput.includes('expiry')) {
        reply = "You can renew your Driving Licence online up to 1 year before and 1 year after the expiry date without re-test.";
      } else if (currentInput.includes('status') || currentInput.includes('track') || currentInput.includes('where is')) {
        reply = "You can track your application in real-time by entering your 13-digit Application Number in the 'Check Status' card on the portal.";
      } else if (currentInput.includes('slot') || currentInput.includes('appointment')) {
        reply = "RTO driving test slots can be booked from the 'Book an Appointment' section. Ensure fee payment is reconciled beforehand.";
      } else if (currentInput.includes('rto') || currentInput.includes('office') || currentInput.includes('address')) {
        reply = "Use our 'RTO Finder' tool to look up your district transport office address, phone number, and working hours.";
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 500);
  };

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.submitGrievance({
        applicationId: appId || undefined,
        applicantName,
        category,
        description
      });

      if (res.success && res.grievance) {
        setGrievanceTicket(res.grievance);
      }
    } catch (err) {
      alert('Failed to register grievance ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[600px] max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0056D2] flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Parivahan Sarathi Helpdesk
              </h3>
              <p className="text-xs text-slate-500">
                24x7 Citizen Support & Automated Help (Prisma DB Connected)
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-150 bg-slate-50/50 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'chat' ? 'bg-white text-[#0056D2] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Assistant Chat
          </button>
          <button
            onClick={() => setActiveTab('grievance')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'grievance' ? 'bg-white text-[#0056D2] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Raise Grievance
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'faq' ? 'bg-white text-[#0056D2] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FAQs
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                    m.sender === 'user' ? 'bg-[#0056D2] text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-[#0056D2] text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <p>{m.text}</p>
                    <span className={`text-[9px] block mt-1 ${m.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-150 bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask your question (e.g. How to renew DL?)..."
                className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white focus:border-[#0056D2]"
              />
              <button
                type="submit"
                className="bg-[#0056D2] hover:bg-[#0047b3] text-white px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'grievance' && (
          <div className="flex-1 p-6 overflow-y-auto">
            {grievanceTicket ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Grievance Registered in National Register</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                  <p>Ticket Reference: <strong className="text-[#0056D2]">{grievanceTicket.ticketId}</strong></p>
                  <p>Category: <strong>{grievanceTicket.category}</strong></p>
                  <p>Status: <span className="text-emerald-700 font-bold">OPEN / ASSIGNED</span></p>
                  <p className="text-[11px] text-slate-500 pt-1">Officer: {grievanceTicket.resolutionNotes}</p>
                </div>
                <button 
                  onClick={() => setGrievanceTicket(null)}
                  className="mt-2 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Submit Another Grievance
                </button>
              </div>
            ) : (
              <form onSubmit={handleGrievanceSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Application Number (Optional)</label>
                    <input 
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      placeholder="DL1234567890123" 
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Name</label>
                    <input 
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs" 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grievance Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option>Delay in Driving Licence Dispatch</option>
                    <option>Payment Debited but Receipt Not Generated</option>
                    <option>Slot Booking Error / RTO Unavailable</option>
                    <option>Biometric / Photograph Mismatch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3} 
                    placeholder="Please provide specific details so the Nodal Officer can investigate..." 
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs" 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-xs"
                >
                  {isSubmitting ? 'Registering Ticket in Database...' : 'Submit Grievance to Nodal Officer'}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <h5 className="font-bold text-slate-900 mb-1">How do I renew my DL if it is expired?</h5>
              <p className="text-slate-600">You can renew it online using Aadhaar OTP authentication. If expired for more than 1 year, a skill re-test is required.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <h5 className="font-bold text-slate-900 mb-1">Is physical RTO visit mandatory for Learner Licence?</h5>
              <p className="text-slate-600">No, with Aadhaar authenticated application, the learner licence skill test can be taken from home on your PC or mobile.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <h5 className="font-bold text-slate-900 mb-1">How can I download my digital Driving Licence?</h5>
              <p className="text-slate-600">You can download it from DigiLocker or mParivahan app using your DL number and Date of Birth.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
