import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { helpApi, connectionApi, issueApi, userApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import StarRating from '../components/StarRating';
import {
  HelpCircle,
  AlertTriangle,
  GitPullRequest,
  Users,
  Award,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Repeat,
  Compass,
  Flame,
  Check,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useNotification();

  const [myRequests, setMyRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [skillExchanges, setSkillExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, connRes, issueRes, exchRes] = await Promise.all([
        helpApi.getMyRequests(),
        connectionApi.getAll(),
        issueApi.getMyReports(),
        userApi.getSkillExchanges(),
      ]);

      if (reqRes.data.success) setMyRequests(reqRes.data.data);
      if (connRes.data.success) setConnections(connRes.data.data);
      if (issueRes.data.success) setMyIssues(issueRes.data.data);
      if (exchRes.data.success) setSkillExchanges(exchRes.data.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConnectionAction = async (connectionId, status) => {
    try {
      await connectionApi.updateStatus(connectionId, status);
      success(`Connection request ${status.toLowerCase()} successfully!`);
      fetchData();
      refreshUser();
    } catch (err) {
      error(err.response?.data?.message || `Failed to ${status.toLowerCase()} request.`);
    }
  };

  const incomingPending = connections.filter(
    (c) => c.helper?._id === user?._id && c.status === 'PENDING'
  );

  const activeConnections = connections.filter((c) => c.status === 'ACTIVE');

  // Circular gauge calculations
  const reputation = user?.reputationScore || 75;
  const strokeDashoffset = 251.2 - (251.2 * reputation) / 100;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-500" />
        <p className="text-sm font-semibold text-slate-400">Loading your student workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Radiant Welcome Banner with Circular Reputation Gauge */}
      <div className="relative glass-panel-elevated rounded-3xl p-6 sm:p-9 border border-indigo-500/25 overflow-hidden shadow-2xl">
        {/* Ambient illumination blobs */}
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-gradient-to-br from-indigo-600/20 via-violet-600/15 to-transparent blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-gradient-to-tr from-cyan-600/10 to-transparent blur-[70px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Welcome Text */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wider uppercase font-heading">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{user?.department} • {user?.year}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
              Welcome back, <span className="text-gradient-brand">{user?.name}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Discover skilled peers, exchange knowledge, and track campus infrastructure issues with zero friction.
            </p>
          </div>

          {/* Elevated Circular Reputation & Rating Pod */}
          <div className="flex items-center gap-6 p-4 sm:p-5 rounded-2xl bg-void-950/80 border border-white/10 shadow-inner-specular self-start lg:self-auto backdrop-blur-xl">
            {/* Circular Progress Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-slate-800/80"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#reputationGradient)"
                  strokeWidth="7"
                  strokeDasharray="251.2"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="reputationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-white font-heading leading-none">
                  {reputation}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">
                  / 100 Rep
                </span>
              </div>
            </div>

            {/* Rating Details */}
            <div className="space-y-1.5 pr-2">
              <div className="text-xs font-bold text-slate-300 font-heading uppercase tracking-wider">
                Campus Rating
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={user?.rating || 5.0} size="md" />
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>{user?.requestsHelped || 0} peers helped</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
          <Link
            to="/help/create"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Help Request</span>
          </Link>

          <Link
            to="/issues/create"
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all hover:border-amber-500/40"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Report Campus Issue</span>
          </Link>

          <Link
            to="/skills"
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all hover:border-indigo-500/40"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Browse Skill Directory</span>
          </Link>

          <Link
            to="/profile"
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 font-bold text-xs flex items-center gap-2 transition-all ml-auto hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Edit My Skills ({user?.skills?.length || 0})</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Metric Cards with Radiant Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 glass-panel-interactive">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold font-heading uppercase tracking-wider">My Requests</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{myRequests.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            <span className="text-indigo-400 font-bold">
              {myRequests.filter((r) => r.status === 'OPEN').length}
            </span>{' '}
            currently open
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 glass-panel-interactive">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold font-heading uppercase tracking-wider">Active Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <GitPullRequest className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{activeConnections.length}</div>
          <div className="text-[11px] text-cyan-400 font-medium mt-1">Ongoing peer collaborations</div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel-elevated p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 glass-panel-interactive">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold font-heading uppercase tracking-wider text-emerald-300">
              Students Helped
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-glow-emerald">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading">
            {user?.requestsHelped || 0}
          </div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1">
            Assistance sessions completed
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-panel-elevated p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 glass-panel-interactive">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold font-heading uppercase tracking-wider text-amber-300">
              Reported Issues
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{myIssues.length}</div>
          <div className="text-[11px] text-amber-400/80 font-medium mt-1">
            {myIssues.filter((i) => i.status === 'RESOLVED').length} resolved tickets
          </div>
        </div>
      </div>

      {/* Pending Incoming Connection Requests (When peers requested help from me) */}
      {incomingPending.length > 0 && (
        <div className="glass-panel-elevated rounded-3xl p-6 border border-amber-500/40 bg-amber-500/10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm font-heading">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Incoming Assistance Requests ({incomingPending.length})</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold">
              Peers are waiting for your response
            </span>
          </div>

          <div className="space-y-3">
            {incomingPending.map((conn) => (
              <div
                key={conn._id}
                className="p-4 rounded-2xl bg-void-950/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
              >
                <div>
                  <div className="font-bold text-white text-sm">
                    {conn.requester?.name} requested your assistance
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    For ticket: <span className="text-cyan-300 font-semibold">"{conn.helpRequest?.title}"</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {conn.requester?.department} • Campus Location: {conn.helpRequest?.location}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleConnectionAction(conn._id, 'ACCEPTED')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-glow-emerald flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Help</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConnectionAction(conn._id, 'REJECTED')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Grid: My Help Requests & Mutual Skill Exchanges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: My Help Requests */}
        <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5 font-heading">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span>My Help Requests</span>
            </h2>
            <Link
              to="/help"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-400 mb-3">You haven't posted any help requests yet.</p>
              <Link
                to="/help/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-glow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Post First Request
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.slice(0, 3).map((req) => (
                <Link
                  key={req._id}
                  to={`/help/${req._id}`}
                  className="block p-4 rounded-2xl bg-void-950/70 border border-slate-800/80 hover:border-indigo-500/50 transition-all group shadow-sm hover:shadow-glow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {req.title}
                    </h4>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {req.requiredSkills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-800/50 text-[10px] text-indigo-300 font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>📍 {req.location}</span>
                    <span className="text-indigo-400 font-bold group-hover:underline flex items-center gap-1 text-[11px]">
                      View Matching Mentors <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Mutual Skill Exchange Recommendations */}
        <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5 font-heading">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Repeat className="w-4 h-4" />
              </div>
              <span>Mutual Skill Exchanges</span>
            </h2>
            <Link
              to="/skills"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {skillExchanges.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm text-slate-400">No mutual skill exchanges detected yet.</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                Add skills you can teach and skills you want to learn to discover mutual peer learning partnerships!
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
              >
                Configure Learning Goals
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {skillExchanges.slice(0, 3).map((exchange, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-void-950/70 border border-slate-800/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-white">{exchange.student?.name}</div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40">
                      Mutual Fit
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-semibold mb-0.5">You can teach:</div>
                      <div className="font-bold text-emerald-400 truncate">
                        {exchange.iCanTeachThem.join(', ')}
                      </div>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-semibold mb-0.5">They teach you:</div>
                      <div className="font-bold text-indigo-400 truncate">
                        {exchange.theyCanTeachMe.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Campus Issues Tracked by Me */}
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5 font-heading">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>Campus Issues Tracked by Me</span>
          </h2>
          <Link
            to="/issues"
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>Campus Feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myIssues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">You have not reported any campus issues.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myIssues.slice(0, 4).map((issue) => (
              <Link
                key={issue._id}
                to={`/issues/${issue._id}`}
                className="p-4 rounded-2xl bg-void-950/70 border border-slate-800 hover:border-amber-500/40 transition-all block group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                    {issue.title}
                  </h4>
                  <StatusBadge status={issue.status} size="sm" />
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  📍 {issue.location} • Category: {issue.category}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/50">
                  <UrgencyBadge urgency={issue.severity} size="sm" />
                  <span className="text-amber-400 font-semibold group-hover:underline">
                    Track status stepper &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
