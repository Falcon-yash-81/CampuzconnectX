import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import UrgencyBadge from '../../components/UrgencyBadge';
import {
  ShieldCheck,
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
        <p className="text-sm text-slate-400">Loading campus platform analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Campus Administrator Authority</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Central Campus Overview & Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor reported campus problems, assign maintenance teams, oversee peer learning requests, and track campus statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/issues"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-900/30 transition-all hover:scale-105"
          >
            Manage Issues Triage
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            User Directory
          </Link>
        </div>
      </div>

      {/* 4 Core PRD KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalStudents || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Enrolled & registered</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center justify-between text-rose-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Issues</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-300">{stats?.activeIssues || 0}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Needs action / In progress</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Help Requests</span>
            <HelpCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalHelpRequests || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">{stats?.openHelpRequests || 0} active / matching</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved Issues</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats?.resolvedIssues || 0}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Closed successfully</div>
        </div>
      </div>

      {/* Main Grid: Urgent Issues Triage & Category Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Urgent Issues Alert Card (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              <span>Urgent & High-Priority Campus Issues</span>
            </h3>
            <Link
              to="/admin/issues"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View All Triage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!stats?.urgentIssues || stats.urgentIssues.length === 0) ? (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No Critical or Urgent Issues Pending!</p>
              <p className="text-xs text-slate-500">All high-severity campus tickets are addressed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.urgentIssues.map((issue) => (
                <Link
                  key={issue._id}
                  to={`/issues/${issue._id}`}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all block group"
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

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/40">
                    <span>📍 {issue.location} • {issue.category}</span>
                    <span className="text-purple-400 group-hover:underline font-semibold flex items-center gap-1">
                      Assign / Update &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Analytics & Category Breakdown (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <span>Issues by Category</span>
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {(!stats?.categoryStats || stats.categoryStats.length === 0) ? (
              <p className="text-xs text-slate-500 text-center py-6">No data yet.</p>
            ) : (
              stats.categoryStats.map((item) => {
                const percent = Math.round((item.count / (stats.totalIssues || 1)) * 100);
                return (
                  <div key={item._id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{item._id}</span>
                      <span className="text-indigo-300">{item.count} issues ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-6 border-t border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Administrative Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/admin/issues"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold"
              >
                All Issues Triage &rarr;
              </Link>
              <Link
                to="/admin/users"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold"
              >
                Manage Users &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
