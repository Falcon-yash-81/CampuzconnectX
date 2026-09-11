import React from 'react';
import { Flame, AlertTriangle, AlertCircle, Clock } from 'lucide-react';

const urgencyConfig = {
  Low: {
    label: 'Low Urgency',
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Clock,
  },
  Medium: {
    label: 'Medium Urgency',
    bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    icon: AlertTriangle,
  },
  High: {
    label: 'High Priority',
    bg: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
    icon: AlertCircle,
  },
  Urgent: {
    label: 'Urgent',
    bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-900/40',
    icon: Flame,
  },
  Critical: {
    label: 'Critical Severity',
    bg: 'bg-red-500/25 text-red-200 border-red-500/60 shadow-md shadow-red-950',
    icon: Flame,
  },
};

export const UrgencyBadge = ({ urgency, size = 'md' }) => {
  const config = urgencyConfig[urgency] || urgencyConfig.Medium;
  const Icon = config.icon;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1'
      : 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

export default UrgencyBadge;
