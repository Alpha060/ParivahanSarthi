import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Calendar, 
  FileText, 
  Download, 
  Plus,
  ShieldCheck,
  X,
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { IMPORTANT_NOTICES } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const NoticesPage: React.FC = () => {
  const { darkMode, user } = useApp();
  const [notices, setNotices] = useState<any[]>(IMPORTANT_NOTICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('STATUTORY');
  const [gazetteNumber, setGazetteNumber] = useState('');
  const [content, setContent] = useState('');
  const [authority, setAuthority] = useState(
    user?.role === 'OFFICIAL' ? `${user.rtoName || 'Regional Transport Office'} (MoRTH)` : 'Ministry of Road Transport & Highways'
  );

  const isOfficial = user && ['OFFICIAL', 'SUPER_ADMIN', 'ADMIN', 'ENFORCEMENT_OFFICER'].includes(user.role);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.getNotices();
      if (res.success && res.notices && res.notices.length > 0) {
        setNotices(res.notices);
      }
    } catch (err) {
      // Fallback to initial
    }
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const newNoticePayload = {
        title,
        content,
        category,
        gazetteNumber: gazetteNumber || `MoRTH/2026/GS-${Math.floor(100 + Math.random() * 900)}`,
        issuingAuthority: authority
      };

      const res = await api.createNotice(newNoticePayload);
      
      const formattedNotice = {
        id: res.notice?.noticeId || `NOTIF-${Date.now()}`,
        title,
        content,
        category,
        type: category,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        badgeBg: category === 'NEW' ? '#DCFCE7' : category === 'UPDATE' ? '#DBEAFE' : '#FEF3C7',
        badgeColor: category === 'NEW' ? '#15803D' : category === 'UPDATE' ? '#1D4ED8' : '#B45309',
        gazetteNo: newNoticePayload.gazetteNumber,
        issuingAuthority: authority
      };

      setNotices([formattedNotice, ...notices]);
      setPublishSuccess(true);

      setTimeout(() => {
        setIsPublishModalOpen(false);
        setPublishSuccess(false);
        setTitle('');
        setContent('');
        setGazetteNumber('');
      }, 1200);
    } catch (err) {
      alert('Failed to publish notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = notices.filter(n => 
    (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (n.category && n.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`min-h-screen py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb & Official Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-[#0056D2] font-semibold">Home</Link>
            <span>/</span>
            <span className="text-[#0056D2] font-bold">Public Notices & Latest Updates</span>
          </div>

          {isOfficial && (
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              className="bg-[#0056D2] hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Notice / Update</span>
            </button>
          )}
        </div>

        {/* Header Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-md mb-8 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  Public Notices & Latest Updates
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official government notifications, rule updates, service advisories, and transport announcements.
                </p>
              </div>
            </div>
          </div>

          <div className="relative pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices by keyword or reference number..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 shadow-2xs"
            />
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filtered.map((notice) => (
            <div
              key={notice.id}
              className={`rounded-3xl p-6 border shadow-md hover:shadow-lg transition-all duration-200 space-y-3 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase"
                    style={{ color: notice.badgeColor || '#1D4ED8', backgroundColor: notice.badgeBg || '#DBEAFE' }}
                  >
                    {notice.category || notice.type || 'STATUTORY'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{notice.date || 'Live Gazette'}</span>
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  {notice.gazetteNo || `Gazette No: MoRTH/2026/${notice.id.slice(-4).toUpperCase()}`}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {notice.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-150 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Issuing Authority: <strong>{notice.issuingAuthority || 'Ministry of Road Transport & Highways'}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => alert(`Downloading official PDF circular: "${notice.title}"`)}
                  className="text-xs font-bold text-[#0056D2] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Circular</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
              <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No gazette circulars found matching your query.</p>
            </div>
          )}
        </div>

      </div>

      {/* Publish Notice Modal for Authorized Officials */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border ${
            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0056D2] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold">Publish Official Gazette Circular</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Authorized Official Notice Dispatch</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {publishSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Gazette Notice Published!</h4>
                <p className="text-xs text-slate-500">The notification is now live across the National Portal.</p>
              </div>
            ) : (
              <form onSubmit={handlePublishNotice} className="py-4 space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-bold mb-1">Circular Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mandatory Electronic Vehicle Fitness Advisory"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:border-[#0056D2] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                    >
                      <option value="STATUTORY">STATUTORY</option>
                      <option value="NEW">NEW ADVISORY</option>
                      <option value="UPDATE">REGULATION UPDATE</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Gazette Ref. No.</label>
                    <input
                      type="text"
                      value={gazetteNumber}
                      onChange={(e) => setGazetteNumber(e.target.value)}
                      placeholder="e.g. MoRTH/2026/GS-849"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Circular Content / Directives *</label>
                  <textarea
                    required
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter detailed statutory directives, implementation deadlines, and compliance rules..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:border-[#0056D2] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsPublishModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Publishing...' : 'Publish Notification'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
