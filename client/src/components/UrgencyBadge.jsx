import React from 'react';
import { Flame, AlertTriangle, AlertCircle, Clock } from 'lucide-react';

const urgencyConfig = {
  Low: {
    label: 'Low Urgency',
    bg: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    icon: Clock,
  },
  Medium: {
    label: 'Medium Urgency',
    bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_-2px_rgba(245,158,11,0.25)]',
    icon: AlertTriangle,
  },
  High: {
    label: 'High Priority',
    bg: 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-[0_0_12px_-2px_rgba(249,115,22,0.35)]',
    icon: AlertCircle,
  },
  Urgent: {
    label: 'Urgent',
    bg: 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-[0_0_15px_-2px_rgba(244,63,94,0.4)]',
    icon: Flame,
  },
  Critical: {
    label: 'Critical Severity',
    bg: 'bg-red-500/30 text-red-100 border-red-500/70 shadow-[0_0_20px_-2px_rgba(239,68,68,0.5)] animate-pulse-subtle',
    icon: Flame,
  },
};

export const UrgencyBadge = ({ urgency, size = 'md' }) => {
  const config = urgencyConfig[urgency] || urgencyConfig.Medium;
  const Icon = config.icon;

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[11px] gap-1.5'
      : 'px-3 py-1 text-xs font-semibold gap-2';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} transition-all`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

export default UrgencyBadge;
