import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Headphones, 
  Send, 
  Bot, 
  User, 
  Phone, 
  MessageSquareWarning, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const GrievancePage: React.FC = () => {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState<'grievance' | 'chat' | 'faq'>('grievance');

  // Grievance State
  const [appId, setAppId] = useState('');
  const [applicantName, setApplicantName] = useState('Krishna Mahto');
  const [mobile, setMobile] = useState('9876543210');
  const [category, setCategory] = useState('Payment Debited but Receipt Not Generated');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grievanceTicket, setGrievanceTicket] = useState<any>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Namaste! I am your 24x7 Parivahan Sarathi AI Assistant. Ask me anything regarding Driving Licence, LL test rules, RTO appointments, or fee calculation.',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

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
      let reply = "You can access complete contactless driving licence services directly from the Sarathi homepage.";
      if (currentInput.includes('fee') || currentInput.includes('cost') || currentInput.includes('charge')) {
        reply = "Under CMVR Rule 32, a new Learner Licence costs ₹200 (Form Fee + Test). A new DL costs ₹1000 including smart card and driving test charges.";
      } else if (currentInput.includes('renew')) {
        reply = "You can renew your Driving Licence online with Aadhaar authentication up to 1 year before and 1 year after expiration without a test.";
      } else if (currentInput.includes('status') || currentInput.includes('track')) {
        reply = "You can check your live 9-step application progression at any time in the 'Check Status' page using your Sarathi Application Number.";
      } else if (currentInput.includes('reconcile') || currentInput.includes('payment pending')) {
        reply = "If money was debited but the portal shows pending, click the 'Verify / Reconcile Bank Payment' button on the status page to instantly verify with CBS.";
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
        mobile,
        category,
        description
      });

      if (res.success && res.grievance) {
        setGrievanceTicket(res.grievance);
      }
    } catch (err) {
      alert('Failed to register grievance.');
    } finally {
      setIsSubmitting(false);
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
          <span className="text-[#0056D2] font-bold">Public Grievance Redressal & Helpdesk</span>
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Citizen Grievance Redressal & Support
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized Public Grievance Redress and Monitoring System (CPGRAMS) Integration with Nodal Officer Assignment.
              </p>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-150 dark:border-slate-700">
            {[
              { id: 'grievance', label: '1. File Formal Grievance' },
              { id: 'chat', label: '2. 24x7 AI Assistant' },
              { id: 'faq', label: '3. Knowledge Base FAQs' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-2 rounded-2xl text-xs font-bold transition cursor-pointer text-center ${
                  activeTab === tab.id
                    ? 'bg-[#0056D2] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          
          {activeTab === 'grievance' && (
            <div>
              {grievanceTicket ? (
                <div className="py-6 text-center space-y-6 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Ticket Assigned to Nodal Officer
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      Grievance Lodged Successfully!
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                      Your ticket reference has been logged into the National Register Database.
                    </p>
                  </div>

                  <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs shadow-inner">
                    <div className="flex items-center justify-between border-b dark:border-slate-700 pb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Grievance Ticket ID</span>
                        <p className="text-lg font-black text-[#0056D2] dark:text-blue-400">{grievanceTicket.ticketId}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                        OPEN / INVESTIGATING
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-slate-400">Applicant:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{grievanceTicket.applicantName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Category:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{grievanceTicket.category}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400">Nodal Resolution Note:</span>
                        <p className="font-bold text-emerald-600">{grievanceTicket.resolutionNotes}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGrievanceTicket(null)}
                    className="px-6 py-3 rounded-2xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    File Another Grievance
                  </button>
                </div>
              ) : (
                <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Application Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        placeholder="e.g. DL1234567890123"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
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
                        Mobile Number *
                      </label>
                      <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100">
                        <span className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border-r border-slate-300 dark:border-slate-700 flex items-center gap-1 select-none">
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Grievance Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                    >
                      <option>Payment Debited but Receipt Not Generated</option>
                      <option>Delay in Driving Licence Dispatch / Postal Tracking</option>
                      <option>RTO Driving Test Slot Booking Issue</option>
                      <option>Aadhaar e-KYC Verification Failure</option>
                      <option>Discrepancy in Name / Address in DL Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Detailed Problem Description *
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please explain the issue in detail, including bank transaction reference if applicable..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-3.5 rounded-2xl text-xs font-bold transition shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? 'Transmitting to Nodal Officer...' : 'Lodge Grievance Ticket (CPGRAMS)'}
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-[460px] flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((m, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                      m.sender === 'user' ? 'bg-[#0056D2] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}>
                      {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#0056D2] text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}>
                      <p>{m.text}</p>
                      <span className={`text-[9px] block mt-1 ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question about DL renewal, test slot rules, fees..."
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="bg-[#0056D2] hover:bg-blue-700 text-white px-5 rounded-2xl transition cursor-pointer flex items-center justify-center shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4 text-xs">
              {[
                { q: 'How do I renew my Driving Licence online without visiting RTO?', a: 'You can apply for DL Renewal via Aadhaar authentication. If you are below 40 years of age, no medical certificate is required, and the PVC Smart Card will be delivered to your address.' },
                { q: 'What should I do if fee was debited from bank but portal shows status Pending?', a: 'Under the Parivahan Instant Reconciliation feature, open the Check Status page, enter your application ID, and click "Verify / Reconcile Bank Payment Status" to immediately synchronize with Core Banking.' },
                { q: 'What is the validity of a Learner Licence?', a: 'A Learner Licence is valid for 6 months from the date of issue across India. You can apply for a permanent Driving Licence after 30 days of holding the LL.' },
                { q: 'How can I download my authentic digital Driving Licence?', a: 'You can download your verified digital DL directly from the Status page or add it to DigiLocker and mParivahan app legally under the IT Act 2000.' }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
