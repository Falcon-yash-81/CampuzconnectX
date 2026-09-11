import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { issueApi, adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import {
  AlertTriangle,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Save,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const STAGES = [
  'REPORTED',
  'UNDER REVIEW',
  'ASSIGNED',
  'IN PROGRESS',
  'RESOLVED',
  'CLOSED',
];

export const IssueDetailPage = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { success, error } = useNotification();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin update states
  const [adminStatus, setAdminStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const res = await issueApi.getById(id);
      if (res.data.success) {
        const data = res.data.data;
        setIssue(data);
        setAdminStatus(data.status);
        setAssignedTo(data.assignedTo || '');
        setResolutionNotes(data.resolutionNotes || '');
      }
    } catch (err) {
      console.error(err);
      error('Failed to load campus issue details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await adminApi.updateIssue(id, {
        status: adminStatus,
        assignedTo,
        resolutionNotes,
      });

      if (res.data.success) {
        success('Campus issue updated successfully!');
        setIssue(res.data.data);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update issue.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm text-slate-400">Loading issue tracking timeline...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Issue Not Found</h2>
        <Link to="/issues" className="text-amber-400 hover:underline text-sm">
          &larr; Back to Campus Issues
        </Link>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(issue.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/issues"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campus Issues</span>
      </Link>

      {/* Main Issue Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Category: {issue.category}
          </span>
          <div className="flex items-center gap-2">
            <UrgencyBadge urgency={issue.severity} size="sm" />
            <StatusBadge status={issue.status} size="sm" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {issue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-800">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400" />
            <strong>{issue.location}</strong>
          </span>
          <span>•</span>
          <span>Reported by {issue.reportedBy?.name || 'Student'} ({issue.reportedBy?.department})</span>
          <span>•</span>
          <span>{new Date(issue.createdAt).toLocaleString()}</span>
        </div>

        {/* 6-Stage Visual Stepper */}
        <div className="pt-2 pb-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
            Resolution Lifecycle Progress
          </h4>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            {/* Desktop connector line */}
            <div className="hidden md:block absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-800 -z-0" />

            {STAGES.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stage}
                  className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold tracking-tight ${
                        isCurrent
                          ? 'text-amber-400'
                          : isCompleted
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description & Assigned details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Issue Details
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {issue.description}
            </p>

            {issue.resolutionNotes && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Resolution Notes:</span>
                </div>
                <p className="text-xs text-slate-200">{issue.resolutionNotes}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Assigned Team:
              </div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>{issue.assignedTo || 'Pending Assignment'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1 text-xs">
              <span className="text-slate-400 font-medium">Last Updated:</span>
              <div className="font-semibold text-slate-200">
                {new Date(issue.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Triage Controls (Visible to Admin or for evaluation) */}
      {isAdmin && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/40 bg-purple-950/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span>Administrator Issue Triage & Dispatch</span>
          </div>

          <form onSubmit={handleAdminUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Update Status
              </label>
              <select
                value={adminStatus}
                onChange={(e) => setAdminStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Assign Department / Technician
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. AV Tech Team, IT Services, Electrical Dept"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Resolution Notes / Action Taken
              </label>
              <textarea
                rows={2}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Lamp bulb replaced and HDMI switcher configured. Testing confirmed working."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-900/30 flex items-center gap-1.5 disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Update Issue Progress</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Status History Log */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <span>Complete Audit & Status History</span>
        </h3>

        <div className="space-y-3">
          {(!issue.statusHistory || issue.statusHistory.length === 0) ? (
            <p className="text-xs text-slate-500">No status updates logged yet.</p>
          ) : (
            issue.statusHistory.map((hist, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={hist.status} size="sm" />
                    <span className="text-xs text-slate-400">
                      by <strong className="text-slate-200">{hist.updatedBy || 'Staff'}</strong>
                    </span>
                  </div>
                  {hist.notes && (
                    <p className="text-xs text-slate-300 mt-1">{hist.notes}</p>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 whitespace-nowrap">
                  {new Date(hist.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;
