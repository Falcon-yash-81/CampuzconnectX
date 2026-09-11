import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  UserCheck,
  Search,
  XCircle,
} from 'lucide-react';

const statusConfig = {
  // Help Request statuses
  OPEN: {
    label: 'Open',
    bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]',
    dot: 'bg-emerald-400',
    icon: Clock,
  },
  MATCHED: {
    label: 'Matched',
    bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)]',
    dot: 'bg-indigo-400',
    icon: Search,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)]',
    dot: 'bg-amber-400',
    icon: PlayCircle,
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50 shadow-[0_0_14px_-2px_rgba(16,185,129,0.4)]',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  CLOSED: {
    label: 'Closed',
    bg: 'bg-slate-800/60 text-slate-400 border-slate-700/60',
    dot: 'bg-slate-500',
    icon: CheckCircle2,
  },

  // Connection statuses
  PENDING: {
    label: 'Pending Approval',
    bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_-2px_rgba(245,158,11,0.25)]',
    dot: 'bg-amber-400 animate-pulse',
    icon: Clock,
  },
  ACCEPTED: {
    label: 'Accepted',
    bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
    dot: 'bg-indigo-400',
    icon: UserCheck,
  },
  ACTIVE: {
    label: 'Active Session',
    bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_-2px_rgba(6,182,212,0.35)]',
    dot: 'bg-cyan-400 animate-ping',
    icon: PlayCircle,
  },
  COMPLETED: {
    label: 'Completed & Rated',
    bg: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 shadow-[0_0_14px_-2px_rgba(16,185,129,0.35)]',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Declined',
    bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    dot: 'bg-rose-400',
    icon: XCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-slate-800/60 text-slate-400 border-slate-700/60',
    dot: 'bg-slate-500',
    icon: XCircle,
  },

  // Campus Issue statuses
  REPORTED: {
    label: 'Reported',
    bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_12px_-2px_rgba(244,63,94,0.35)]',
    dot: 'bg-rose-400 animate-pulse',
    icon: AlertCircle,
  },
  'UNDER REVIEW': {
    label: 'Under Review',
    bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)]',
    dot: 'bg-amber-400',
    icon: Search,
  },
  ASSIGNED: {
    label: 'Assigned',
    bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)]',
    dot: 'bg-indigo-400',
    icon: UserCheck,
  },
};

export const StatusBadge = ({ status, size = 'md', showPulse = true }) => {
  const normalized = (status || '').toUpperCase();
  const config = statusConfig[normalized] || {
    label: status || 'Unknown',
    bg: 'bg-slate-800 text-slate-400 border-slate-700',
    dot: 'bg-slate-500',
    icon: Clock,
  };

  const Icon = config.icon;
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[11px] gap-1.5'
      : 'px-3 py-1 text-xs font-semibold gap-2';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} transition-all`}
    >
      {showPulse && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
