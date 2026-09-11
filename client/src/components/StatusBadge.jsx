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
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: Clock,
  },
  MATCHED: {
    label: 'Matched',
    bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    icon: Search,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: PlayCircle,
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    icon: CheckCircle2,
  },
  CLOSED: {
    label: 'Closed',
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    icon: CheckCircle2,
  },

  // Connection statuses
  PENDING: {
    label: 'Pending Approval',
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: Clock,
  },
  ACCEPTED: {
    label: 'Accepted',
    bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    icon: UserCheck,
  },
  ACTIVE: {
    label: 'Active Assistance',
    bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    icon: PlayCircle,
  },
  COMPLETED: {
    label: 'Completed & Rated',
    bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Declined',
    bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    icon: XCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    icon: XCircle,
  },

  // Campus Issue statuses
  REPORTED: {
    label: 'Reported',
    bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    icon: AlertCircle,
  },
  'UNDER REVIEW': {
    label: 'Under Review',
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: Search,
  },
  ASSIGNED: {
    label: 'Assigned',
    bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    icon: UserCheck,
  },
};

export const StatusBadge = ({ status, size = 'md' }) => {
  const normalized = (status || '').toUpperCase();
  const config = statusConfig[normalized] || {
    label: status || 'Unknown',
    bg: 'bg-slate-700/30 text-slate-400 border-slate-600',
    icon: Clock,
  };

  const Icon = config.icon;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1'
      : 'px-2.5 py-1 text-xs font-medium gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
