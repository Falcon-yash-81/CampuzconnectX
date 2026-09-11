import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, UserCheck, HelpCircle } from 'lucide-react';
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

  return (
    <div className={`w-full rounded-2xl glass-panel p-4 border border-indigo-500/20 shadow-lg ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Quick Demo Personas (1-Click Instant Login)</span>
        </div>
        <span className="text-xs text-slate-400">Pre-seeded with real PRD scenarios</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Helper */}
        <button
          onClick={() => handleSwitch('studentA')}
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
            user?.email === 'yashas@campusconnect.edu'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-950'
              : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate text-xs">Yashas Gowda</div>
            <div className="text-[10px] text-slate-400 truncate">Student Helper (Flutter/Node)</div>
          </div>
        </button>

        {/* Requester */}
        <button
          onClick={() => handleSwitch('studentB')}
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
            user?.email === 'alex@campusconnect.edu'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-950'
              : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate text-xs">Alex Rivera</div>
            <div className="text-[10px] text-slate-400 truncate">Requester (Needs Help)</div>
          </div>
        </button>

        {/* Admin */}
        <button
          onClick={() => handleSwitch('admin')}
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
            user?.role === 'ADMIN'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-950'
              : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate text-xs">Campus Admin</div>
            <div className="text-[10px] text-slate-400 truncate">Facilities & Staff Portal</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickLoginBanner;
