import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import UrgencyBadge from '../../components/UrgencyBadge';
import {
  Users,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  GitPullRequest,
  ArrowRight,
  Flame,
  Loader2,
  PieChart,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStats();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-sm font-semibold text-slate-400">Loading campus platform analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Executive Campus Triage & Operations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor reported campus problems, dispatch maintenance crews, oversee peer requests, and inspect campus statistics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/issues"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 transition-all hover:scale-105"
          >
            Manage Issues Triage
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl glass-panel hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs transition-colors"
          >
            User Directory
          </Link>
        </div>
      </div>

      {/* 4 Core PRD KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 glass-panel-interactive">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold font-heading uppercase tracking-wider">Students</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{stats?.totalStudents || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Enrolled on platform</div>
        </div>

        <div className="glass-panel-elevated p-5 rounded-2xl border border-rose-500/25 bg-rose-500/5 glass-panel-interactive shadow-glow-rose">
          <div className="flex items-center justify-between text-rose-300 mb-2">
            <span className="text-xs font-bold font-heading uppercase tracking-wider">Active Issues</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-300 font-heading">{stats?.activeIssues || 0}</div>
          <div className="text-[11px] text-rose-400/80 mt-1 font-medium">Needs triage / In progress</div>
        </div>

        <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 glass-panel-interactive">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold font-heading uppercase tracking-wider">Help Requests</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{stats?.totalHelpRequests || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">{stats?.openHelpRequests || 0} active / matching</div>
        </div>

        <div className="glass-panel-elevated p-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 glass-panel-interactive shadow-glow-emerald">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-bold font-heading uppercase tracking-wider">Resolved Issues</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading">{stats?.resolvedIssues || 0}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-medium">Closed tickets</div>
        </div>
      </div>

      {/* Main Grid: Urgent Issues Triage & Category Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Urgent Issues Alert Card */}
        <div className="lg:col-span-7 glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>Priority Campus Triage Queue</span>
            </h3>
            <Link
              to="/admin/issues"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Full Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!stats?.urgentIssues || stats.urgentIssues.length === 0) ? (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white font-heading">All High-Priority Issues Resolved!</p>
              <p className="text-xs text-slate-500">No urgent facility or equipment reports pending.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.urgentIssues.map((issue) => (
                <Link
                  key={issue._id}
                  to={`/issues/${issue._id}`}
                  className="p-4 rounded-2xl bg-void-950/80 border border-slate-800 hover:border-purple-500/50 transition-all block group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                      {issue.title}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <UrgencyBadge urgency={issue.severity} size="sm" />
                      <StatusBadge status={issue.status} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1.5 border-t border-slate-800/60">
                    <span>📍 {issue.location} • {issue.category}</span>
                    <span className="text-purple-400 group-hover:underline font-bold flex items-center gap-1 text-[11px]">
                      Dispatch / Resolve &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Analytics & Category Breakdown */}
        <div className="lg:col-span-5 glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <span>Issues by Category</span>
            </h3>
          </div>

          <div className="space-y-3.5 pt-2">
            {(!stats?.categoryStats || stats.categoryStats.length === 0) ? (
              <p className="text-xs text-slate-500 text-center py-6">No data yet.</p>
            ) : (
              stats.categoryStats.map((item) => {
                const percent = Math.round((item.count / (stats.totalIssues || 1)) * 100);
                return (
                  <div key={item._id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{item._id}</span>
                      <span className="text-indigo-300">{item.count} issues ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Administrative Quick Jump
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/admin/issues"
                className="p-3 rounded-xl bg-void-950/80 border border-slate-800 hover:border-purple-500/50 text-slate-200 font-bold transition-colors"
              >
                All Issues Triage &rarr;
              </Link>
              <Link
                to="/admin/users"
                className="p-3 rounded-xl bg-void-950/80 border border-slate-800 hover:border-purple-500/50 text-slate-200 font-bold transition-colors"
              >
                User Directory &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
