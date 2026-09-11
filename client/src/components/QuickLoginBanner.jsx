import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, UserCheck, HelpCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickLoginBanner = ({ compact = false }) => {
  const { demoLogin, user } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (role) => {
    try {
      const loggedUser = await demoLogin(role);
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isYashas = user?.email === 'yashas@campusconnect.edu';
  const isAlex = user?.email === 'alex@campusconnect.edu';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className={`w-full rounded-2xl glass-panel-elevated p-4 border border-indigo-500/25 relative overflow-hidden shadow-2xl ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 blur-[50px] pointer-events-none" />

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2 text-indigo-300 font-bold tracking-tight font-heading">
          <div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span>Interactive Demo Persona Dock</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
          Click to Switch Role Instantly
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        {/* Helper Persona */}
        <button
          type="button"
          onClick={() => handleSwitch('studentA')}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
            isYashas
              ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
              : 'bg-slate-900/70 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-850 hover:-translate-y-0.5'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">
            {isYashas ? <Check className="w-5 h-5 stroke-[2.5]" /> : <UserCheck className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs truncate">Yashas Gowda</span>
              {isYashas && (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950">
                  Active
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-300 font-medium truncate">Student Helper (Flutter/Node)</div>
          </div>
        </button>

        {/* Requester Persona */}
        <button
          type="button"
          onClick={() => handleSwitch('studentB')}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
            isAlex
              ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_-3px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
              : 'bg-slate-900/70 border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-850 hover:-translate-y-0.5'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">
            {isAlex ? <Check className="w-5 h-5 stroke-[2.5]" /> : <HelpCircle className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs truncate">Alex Rivera</span>
              {isAlex && (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  Active
                </span>
              )}
            </div>
            <div className="text-[10px] text-amber-300 font-medium truncate">Requester (Needs Help)</div>
          </div>
        </button>

        {/* Admin Persona */}
        <button
          type="button"
          onClick={() => handleSwitch('admin')}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
            isAdmin
              ? 'bg-purple-500/15 border-purple-400 shadow-[0_0_20px_-3px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
              : 'bg-slate-900/70 border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-850 hover:-translate-y-0.5'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">
            {isAdmin ? <Check className="w-5 h-5 stroke-[2.5]" /> : <ShieldCheck className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs truncate">Campus Admin</span>
              {isAdmin && (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-400 text-slate-950">
                  Active
                </span>
              )}
            </div>
            <div className="text-[10px] text-purple-300 font-medium truncate">Facilities & Staff Portal</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickLoginBanner;
