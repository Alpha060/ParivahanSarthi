import React from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Lock, ArrowRight, Home, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'OFFICIAL' | 'CITIZEN' | 'LOGGED_IN' | 'ADMIN' | 'MEDICAL_DOCTOR' | 'DRIVING_SCHOOL' | 'COUNTER_OPERATOR' | 'ENFORCEMENT_OFFICER' | string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'LOGGED_IN' 
}) => {
  const { user, isLoggedIn, darkMode, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Not logged in at all
  if (!isLoggedIn || !user) {
    if (requiredRole !== 'CITIZEN' && requiredRole !== 'LOGGED_IN') {
      return (
        <div className={`min-h-[80vh] flex items-center justify-center p-4 transition-colors ${
          darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
        }`}>
          <div className={`max-w-md w-full p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-5 ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                Restricted Transport Portal Zone
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                Authorized Role Authentication Required
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Access to this workdesk requires authorized government or stakeholder credentials.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { state: { from: location } })}
                className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In via Official / Stakeholder Login</span>
              </button>
              <Link
                to="/"
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center justify-center gap-1.5 transition block"
              >
                <Home className="w-4 h-4" />
                <span>Return to Citizen Portal</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} state={{ from: location }} replace />;
  }

  // Super Admin has universal clearance over all portals
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return <>{children}</>;
  }

  // 2. Checking Admin Specific Role
  if (requiredRole === 'ADMIN' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center p-4 transition-colors ${
        darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
      }`}>
        <div className={`max-w-lg w-full p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider">
              Super Admin Clearance Required
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
              National Directorate Access Restricted
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              This area is restricted to the <strong>Director General & Super Admin Commissioners</strong>. Standard credentials are not permitted to commission officers or modify central policies.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { state: { from: location } })}
              className="w-full bg-[#0056D2] hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Sign In as Super Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Role-specific validation
  const officialRoles = ['OFFICIAL', 'MLO_OFFICER', 'ADTT_INSPECTOR', 'DISPATCH_NODAL', 'RTO_DIRECTOR'];
  const hasAccess = 
    requiredRole === 'LOGGED_IN' ||
    requiredRole === user.role ||
    (requiredRole === 'OFFICIAL' && officialRoles.includes(user.role)) ||
    (requiredRole === 'CITIZEN' && (user.role === 'CITIZEN' || !user.role));

  if (!hasAccess) {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center p-4 transition-colors ${
        darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
      }`}>
        <div className={`max-w-lg w-full p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
              Security Barrier 403
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
              Unauthorized Role Access
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              You are currently authenticated as a Citizen (<strong>{user.name}</strong>). The RTO Command Console is reserved exclusively for statutory Transport Officers & MLO Inspectors.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Authenticated Role:</span>
              <strong className="text-emerald-600 font-bold uppercase">{user.role}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Required Role:</span>
              <strong className="text-amber-600 font-bold uppercase">OFFICIAL / MLO</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition"
            >
              <span>Switch to Officer Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/applications"
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center justify-center gap-1.5 transition block"
            >
              <span>My Citizen Dossiers</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
