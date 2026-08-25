import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  Search, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Key, 
  Lock, 
  Globe, 
  Activity, 
  FileText, 
  Car, 
  Award, 
  Bell, 
  ChevronRight,
  Phone,
  Mail,
  Sliders,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface Officer {
  id: string;
  staffId: string;
  name: string;
  mobile: string;
  email: string;
  role: 'MLO_OFFICER' | 'ADTT_INSPECTOR' | 'ENFORCEMENT_OFFICER' | 'RTO_DIRECTOR' | 'DISPATCH_NODAL' | 'SUPER_ADMIN';
  roleLabel: string;
  designation: string;
  rtoCode: string;
  rtoName: string;
  state: string;
  permissions: string[];
  isActive: boolean;
  commissionedAt: string;
  lastActive: string;
}

export const SuperAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useApp();

  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOfficerForEdit, setSelectedOfficerForEdit] = useState<Officer | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Officer Form
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    mobile: '',
    email: '',
    role: 'MLO_OFFICER',
    designation: 'Senior Motor Licensing Officer (MLO)',
    state: 'Jharkhand',
    rtoCode: 'JH-01',
    rtoName: 'Ranchi Regional Transport Office (JH-01)',
    permissions: ['SCRUTINY_APPROVE', 'ADTT_CLEARANCE', 'SMART_CARD_DISPATCH'],
    password: ''
  });

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setIsLoading(true);
    try {
      const res = await api.getOfficers();
      if (res.success && res.officers) {
        setOfficers(res.officers);
      }
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.staffId) {
      alert('Officer Name and Staff ID are required.');
      return;
    }

    try {
      const res = await api.createOfficer(formData);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Officer ${formData.name} (${formData.staffId}) commissioned with Level-3 HSM credentials!`
        });
        setIsAddModalOpen(false);
        setFormData({
          staffId: '',
          name: '',
          mobile: '',
          email: '',
          role: 'MLO_OFFICER',
          designation: 'Senior Motor Licensing Officer (MLO)',
          state: 'Jharkhand',
          rtoCode: 'JH-01',
          rtoName: 'Ranchi Regional Transport Office (JH-01)',
          permissions: ['SCRUTINY_APPROVE', 'ADTT_CLEARANCE'],
          password: ''
        });
        await fetchOfficers();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to commission officer.' });
    } finally {
      setTimeout(() => setNotification(null), 4500);
    }
  };

  const handleToggleOfficerStatus = async (officer: Officer) => {
    const updatedStatus = !officer.isActive;
    try {
      const res = await api.updateOfficer(officer.id, { isActive: updatedStatus });
      if (res.success) {
        setOfficers(prev => prev.map(o => o.id === officer.id ? { ...o, isActive: updatedStatus } : o));
        setNotification({
          type: 'success',
          message: `Officer ${officer.name} is now ${updatedStatus ? 'ACTIVATED' : 'SUSPENDED'}.`
        });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update officer status.' });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDeleteOfficer = async (officer: Officer) => {
    if (!window.confirm(`Are you sure you want to permanently revoke Commission for ${officer.name} (${officer.staffId})?`)) {
      return;
    }

    try {
      const res = await api.deleteOfficer(officer.id);
      if (res.success) {
        setOfficers(prev => prev.filter(o => o.id !== officer.id));
        setNotification({
          type: 'success',
          message: `Commission revoked for ${officer.name}. HSM tokens destroyed.`
        });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to revoke officer.' });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const filteredOfficers = officers.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (o.name || '').toLowerCase().includes(q) ||
      (o.staffId || '').toLowerCase().includes(q) ||
      (o.rtoCode || '').toLowerCase().includes(q) ||
      (o.rtoName || '').toLowerCase().includes(q) ||
      (o.state || '').toLowerCase().includes(q);

    const matchesRole = selectedRoleFilter === 'ALL' || o.role === selectedRoleFilter;
    const matchesState = selectedStateFilter === 'ALL' || o.state === selectedStateFilter;

    return matchesSearch && matchesRole && matchesState;
  });

  return (
    <div className={`min-h-screen py-6 sm:py-8 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Super Admin Command Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-[#1A0B2E] via-[#2D124D] to-[#0056D2] text-white border-purple-900'
        }`}>
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Super Admin Directorate
                </span>
                <span className="text-xs text-purple-200 font-semibold flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-300" />
                  National Command & Officer Commissioning
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                National Transport Directorate & Officer Administration
              </h1>
              <p className="text-xs text-purple-100/80 dark:text-slate-300 mt-0.5">
                Principal Authority: <strong>{user?.name || 'Dr. Rajesh Kumar, IAS'}</strong> • Designation: <strong>Transport Commissioner & Director General</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto z-10">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Commission New Officer</span>
            </button>
            <button
              onClick={fetchOfficers}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Registry</span>
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-2 shadow-md ${
            notification.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-800 dark:text-rose-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Directorate Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-3xl border shadow-sm ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-purple-600">
              <span className="text-[11px] font-black uppercase tracking-wider">Commissioned Officers</span>
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black mt-1">{officers.length}</h3>
            <p className="text-[10px] text-slate-400">All India Active Transport Cadre</p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-blue-600">
              <span className="text-[11px] font-black uppercase tracking-wider">Connected RTOs</span>
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black mt-1">1,420</h3>
            <p className="text-[10px] text-slate-400">Across 36 States & UTs</p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-[11px] font-black uppercase tracking-wider">HSM Security Grid</span>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black mt-1 text-emerald-600">100% Active</h3>
            <p className="text-[10px] text-slate-400">NIC Cryptographic Signatures</p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-[11px] font-black uppercase tracking-wider">Daily Clearances</span>
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black mt-1">14,892</h3>
            <p className="text-[10px] text-slate-400">Driving Licences Issued Today</p>
          </div>
        </div>

        {/* Quick Operations Strip */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-wrap items-center justify-between gap-3 ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Directorate Super-Power Jump:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/officer-scrutiny"
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0056D2] dark:text-blue-300 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>National Scrutiny Queue</span>
            </Link>
            <Link
              to="/officer-adtt"
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition"
            >
              <Car className="w-3.5 h-3.5" />
              <span>ADTT Sensor Tracks</span>
            </Link>
            <Link
              to="/officer-dl-dispatch"
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 transition"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Smart Card Dispatch</span>
            </Link>
            <Link
              to="/officer-notifications"
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 transition"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Gazettes & Circulars</span>
            </Link>
          </div>
        </div>

        {/* Search & Role Filter Desk */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Officer Name, Staff ID, RTO Code, State..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#0056D2]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            >
              <option value="ALL">All Officer Cadres</option>
              <option value="MLO_OFFICER">Motor Licensing Officers (MLO)</option>
              <option value="ADTT_INSPECTOR">ADTT Track Inspectors</option>
              <option value="RTO_DIRECTOR">Regional Directors / DTOs</option>
              <option value="ENFORCEMENT_OFFICER">Enforcement Officers</option>
              <option value="SUPER_ADMIN">Super Admins / Commissioners</option>
            </select>

            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            >
              <option value="ALL">All States / UTs</option>
              <option value="Jharkhand">Jharkhand (JH)</option>
              <option value="Delhi">Delhi (DL)</option>
              <option value="Maharashtra">Maharashtra (MH)</option>
              <option value="Karnataka">Karnataka (KA)</option>
              <option value="Central Directorate">Central Directorate</option>
            </select>
          </div>
        </div>

        {/* Officer Registry Table */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={`uppercase font-black text-[10px] tracking-wider border-b ${
                darkMode ? 'bg-slate-900/80 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="p-4">Official Staff ID</th>
                  <th className="p-4">Officer Name & Contact</th>
                  <th className="p-4">Cadre & Designation</th>
                  <th className="p-4">Jurisdiction & RTO</th>
                  <th className="p-4">Commission Status</th>
                  <th className="p-4 text-right">Super-Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                {filteredOfficers.map((officer) => {
                  const isSelf = officer.staffId === 'ADMIN-MoRTH-01';

                  return (
                    <tr key={officer.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40 transition">
                      <td className="p-4 font-mono font-extrabold text-[#0056D2] dark:text-blue-400">
                        {officer.staffId}
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{officer.name}</span>
                          {officer.role === 'SUPER_ADMIN' && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                              Director General
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>+91 {officer.mobile}</span>
                          <span className="mx-1">•</span>
                          <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">{officer.email}</span>
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          officer.role === 'SUPER_ADMIN' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' 
                            : officer.role === 'RTO_DIRECTOR'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {officer.roleLabel}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{officer.designation}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white">{officer.rtoName}</p>
                        <span className="text-[10px] text-slate-400 font-mono">Code: {officer.rtoCode} • {officer.state}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          officer.isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {officer.isActive ? 'COMMISSIONED' : 'SUSPENDED'}
                        </span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">Active: {officer.lastActive}</span>
                      </td>
                      <td className="p-4 text-right">
                        {!isSelf && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleOfficerStatus(officer)}
                              className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition cursor-pointer ${
                                officer.isActive
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                              }`}
                              title={officer.isActive ? 'Suspend Officer' : 'Activate Officer'}
                            >
                              {officer.isActive ? <Lock className="w-3 h-3" /> : <Key className="w-3 h-3" />}
                              <span>{officer.isActive ? 'Suspend' : 'Activate'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteOfficer(officer)}
                              className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                              title="Revoke Commission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission New Officer Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
            <div className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b dark:border-slate-700">
                <div className="flex items-center space-x-3 text-[#0056D2] dark:text-blue-400">
                  <Crown className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Commission New Transport Officer
                    </h3>
                    <p className="text-xs text-slate-400">Ministry of Road Transport & Highways Official Cadre</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOfficer} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Officer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Shri Vikram Rathore"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Official Staff ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.staffId}
                      onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                      placeholder="e.g. OFFICER-JH04"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Mobile Number (+91)
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Govt NIC Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="officer@parivahan.gov.in"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Officer Cadre / Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        const desigs: Record<string, string> = {
                          'MLO_OFFICER': 'Senior Motor Licensing Officer (MLO)',
                          'ADTT_INSPECTOR': 'Automated Test Track Inspector',
                          'RTO_DIRECTOR': 'Deputy Commissioner & Regional Director',
                          'MEDICAL_DOCTOR': 'Registered Medical Practitioner (Form 1A)',
                          'DRIVING_SCHOOL': 'Accredited Driving School In-Charge (Form 5B)',
                          'COUNTER_OPERATOR': 'Dealing Assistant & Biometric Clerk',
                          'ENFORCEMENT_OFFICER': 'Enforcement Officer (Flying Squad)',
                          'DISPATCH_NODAL': 'Smart Card DL Dispatch Nodal',
                          'SUPER_ADMIN': 'Joint Director General'
                        };
                        setFormData({ 
                          ...formData, 
                          role: val,
                          designation: desigs[val] || 'Motor Licensing Officer'
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    >
                      <option value="MLO_OFFICER">Motor Licensing Officer (MLO)</option>
                      <option value="ADTT_INSPECTOR">Automated Test Track Inspector</option>
                      <option value="RTO_DIRECTOR">Regional Transport Director / DTO</option>
                      <option value="MEDICAL_DOCTOR">Registered Medical Practitioner (Form 1A)</option>
                      <option value="DRIVING_SCHOOL">Accredited Driving School (Form 5B)</option>
                      <option value="COUNTER_OPERATOR">Counter Biometrics & Token Clerk</option>
                      <option value="ENFORCEMENT_OFFICER">Enforcement Officer (Flying Squad)</option>
                      <option value="DISPATCH_NODAL">Smart Card Dispatch Nodal</option>
                      <option value="SUPER_ADMIN">Super Admin (Central Directorate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Jurisdiction RTO Code & Name
                    </label>
                    <input
                      type="text"
                      value={formData.rtoName}
                      onChange={(e) => setFormData({ ...formData, rtoName: e.target.value })}
                      placeholder="e.g. Ranchi RTO (JH-01)"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* Modular Authority Checkboxes */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Statutory Delegated Permissions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#0056D2]" />
                      <span>Form 2 & 4 Document Scrutiny</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#0056D2]" />
                      <span>ADTT Test Track Clearance (Form 7B)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#0056D2]" />
                      <span>Smart Card DL Printing & Dispatch</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#0056D2]" />
                      <span>MoRTH Gazette & Notice Publisher</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1A0B2E] to-[#0056D2] hover:opacity-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>Issue HSM Commission Certificate</span>
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
