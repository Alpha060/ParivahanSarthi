import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Send, 
  Sparkles, 
  Search, 
  Filter, 
  Globe, 
  Clock, 
  Calendar, 
  Building2, 
  ShieldCheck,
  ArrowRight,
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { NOTICES } from '../data/mockData';
import confetti from 'canvas-confetti';

export const OfficerNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [notices, setNotices] = useState<any[]>(NOTICES);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Modal State for New / Edit Notice
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('New');
  const [badgeColor, setBadgeColor] = useState('#0056D2');
  const [badgeBg, setBadgeBg] = useState('#EFF6FF');
  const [priority, setPriority] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert State
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await api.getNotices();
      if (res.success && res.notices) {
        setNotices(res.notices);
      }
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNewModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setType('New');
    setBadgeColor('#0056D2');
    setBadgeBg('#EFF6FF');
    setPriority(1);
    setShowModal(true);
  };

  const handleOpenEditModal = (notice: any) => {
    setIsEditing(true);
    setEditingId(notice.id || notice.noticeId);
    setTitle(notice.title || '');
    setContent(notice.content || '');
    setType(notice.type || 'New');
    setBadgeColor(notice.badgeColor || '#0056D2');
    setBadgeBg(notice.badgeBg || '#EFF6FF');
    setPriority(notice.priority || 1);
    setShowModal(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setAlert({ type: 'error', message: 'Please enter both Title and Notification Content.' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editingId) {
        const res = await api.updateNotice(editingId, {
          title,
          content,
          type,
          badgeColor,
          badgeBg,
          priority
        });
        if (res.success) {
          setAlert({ type: 'success', message: 'Official Notice updated & republished to public feed.' });
        }
      } else {
        const res = await api.createNotice({
          title,
          content,
          type,
          badgeColor,
          badgeBg,
          priority
        });
        if (res.success) {
          confetti({ particleCount: 80, spread: 60 });
          setAlert({ type: 'success', message: 'Official Gazette Notice published to National Portal & Public Feed!' });
        }
      }
      setShowModal(false);
      await fetchNotices();
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to save official notice.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (!confirm('Are you sure you want to retract and delete this official notice?')) return;
    
    try {
      const res = await api.deleteNotice(noticeId);
      if (res.success) {
        setAlert({ type: 'success', message: 'Notice retracted successfully.' });
        await fetchNotices();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete notice.' });
    } finally {
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      (n.title || '').toLowerCase().includes(query) ||
      (n.content || '').toLowerCase().includes(query) ||
      (n.noticeId || '').toLowerCase().includes(query);

    const matchesType = filterType === 'all' ? true : (n.type || '').toLowerCase() === filterType.toLowerCase();
    return matchesQuery && matchesType;
  });

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Header Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-[#0B2545] to-[#0056D2] text-white border-blue-900'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  MoRTH Gazette & Notifications Desk
                </span>
                <span className="text-xs text-blue-200 font-semibold">
                  Official Editorial Authority
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                National Circulars & Public Advisories Management
              </h1>
              <p className="text-xs text-blue-100/80 dark:text-slate-300 mt-0.5">
                Authority: <strong>{user?.name || 'Shri S. K. Verma (Senior MLO)'}</strong> • <strong>{user?.rtoName || 'Ranchi Regional Transport Office (JH-01)'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Link
              to="/notices"
              target="_blank"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleOpenNewModal}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Publish New Notice</span>
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {alert && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-2 shadow-md ${
            alert.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-800 dark:text-rose-200'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{alert.message}</span>
          </div>
        )}

        {/* Search & Filter Desk */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars, gazettes, keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:border-[#0056D2]"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="flex items-center space-x-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              >
                <option value="all">All Notification Types</option>
                <option value="New">New / Urgent</option>
                <option value="Update">Statutory Update</option>
                <option value="Info">General Public Info</option>
              </select>
            </div>
            <button
              onClick={fetchNotices}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-200 transition cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Notices Management List */}
        <div className="space-y-3">
          {filteredNotices.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <Bell className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Gazette Notices Found</h3>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your keyword filter or publish a new official circular.</p>
            </div>
          ) : (
            filteredNotices.map((n) => (
              <div
                key={n.id || n.noticeId}
                className={`p-5 rounded-3xl border shadow-sm transition hover:shadow-md ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={{ backgroundColor: n.badgeBg || '#EFF6FF', color: n.badgeColor || '#0056D2' }}
                      >
                        {n.type || 'Notice'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-bold">
                        {n.noticeId || 'CIRC-MoRTH-2024'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {n.date || 'Active'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {n.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {n.content}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 self-end md:self-start flex-shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => handleOpenEditModal(n)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0056D2] dark:text-blue-300 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(n.id || n.noticeId)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Retract</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Publish / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className={`rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border space-y-4 animate-in zoom-in-95 ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-700">
                <div className="flex items-center space-x-2 text-[#0056D2] dark:text-blue-400">
                  <Bell className="w-5 h-5" />
                  <h3 className="text-base font-extrabold">
                    {isEditing ? 'Edit Official Gazette / Notice' : 'Publish New Public Notice to National Feed'}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notification Headline / Circular Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Implementation of 100% Automated Driving Test Tracks (ADTT) in Jharkhand"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category Tag
                    </label>
                    <select
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                        if (e.target.value === 'New') {
                          setBadgeColor('#0056D2');
                          setBadgeBg('#EFF6FF');
                        } else if (e.target.value === 'Update') {
                          setBadgeColor('#7C3AED');
                          setBadgeBg('#F5F3FF');
                        } else {
                          setBadgeColor('#059669');
                          setBadgeBg('#ECFDF5');
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    >
                      <option value="New">New / Urgent Notice</option>
                      <option value="Update">Statutory Update</option>
                      <option value="Info">Public Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Display Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    >
                      <option value={2}>High (Top of Feed & Hero Ticker)</option>
                      <option value={1}>Normal Feed</option>
                      <option value={0}>Routine Information</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Statutory Text / Circular Description *
                  </label>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter complete circular text, instructions for citizens, statutory compliance deadlines, and CMVR references..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold leading-relaxed focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#0056D2] hover:bg-blue-700 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Publishing...' : isEditing ? 'Update Notice' : 'Publish to National Portal'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
