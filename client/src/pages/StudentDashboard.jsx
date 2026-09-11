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

  // Filter incoming pending requests (where I am the helper)
  const incomingPending = connections.filter(
    (c) => c.helper?._id === user?._id && c.status === 'PENDING'
  );

  // Filter active ongoing sessions
  const activeConnections = connections.filter((c) => c.status === 'ACTIVE');

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-400">Loading your student dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/20 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              <span>{user?.department}</span>
              <span>•</span>
              <span>{user?.year}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Connect with skilled peers, track your campus requests, and build your student reputation.
            </p>
          </div>

          {/* Reputation & Rating Pill */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-center pr-4 border-r border-slate-800">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xl">
                <span>⭐</span>
                <span>{Number(user?.rating || 5.0).toFixed(1)}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Peer Rating</div>
            </div>
            <div className="text-center pl-2">
              <div className="flex items-center justify-center gap-1 text-indigo-300 font-bold text-xl">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>{user?.reputationScore || 75}</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Reputation Score</div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
          <Link
            to="/help/create"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Help Request</span>
          </Link>
          <Link
            to="/issues/create"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Report Campus Issue</span>
          </Link>
          <Link
            to="/skills"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Find Skilled Students</span>
          </Link>
          <Link
            to="/profile"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors ml-auto"
          >
            <span>Update My Skills ({user?.skills?.length || 0})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">My Requests</span>
            <HelpCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white">{myRequests.length}</div>
          <div className="text-xs text-slate-400 mt-1">
            {myRequests.filter((r) => r.status === 'OPEN').length} currently open
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Sessions</span>
            <GitPullRequest className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{activeConnections.length}</div>
          <div className="text-xs text-slate-400 mt-1">Ongoing peer collaborations</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Students Helped</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">{user?.requestsHelped || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Peer assistance completed</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reported Issues</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white">{myIssues.length}</div>
          <div className="text-xs text-slate-400 mt-1">
            {myIssues.filter((i) => i.status === 'RESOLVED').length} resolved
          </div>
        </div>
      </div>

      {/* Incoming Assistance Requests Alert (If any student requested help from me) */}
      {incomingPending.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Pending Assistance Requests ({incomingPending.length})</span>
          </div>
          <div className="space-y-3">
            {incomingPending.map((conn) => (
              <div
                key={conn._id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    {conn.requester?.name} requested your help
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    For request: <span className="text-indigo-300">"{conn.helpRequest?.title}"</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {conn.requester?.department} • Location: {conn.helpRequest?.location}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleConnectionAction(conn._id, 'ACCEPTED')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Help</span>
                  </button>
                  <button
                    onClick={() => handleConnectionAction(conn._id, 'REJECTED')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium transition-colors flex items-center justify-center gap-1"
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

      {/* Two Column Section: My Active Requests & Skill Exchanges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: My Help Requests */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>My Help Requests</span>
            </h2>
            <Link to="/help" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 mb-3">You haven't posted any help requests yet.</p>
              <Link
                to="/help/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
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
                  className="block p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {req.title}
                    </h4>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {req.requiredSkills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-[10px] text-indigo-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/40">
                    <span>📍 {req.location}</span>
                    <span className="text-indigo-400 group-hover:underline flex items-center gap-1 text-[11px] font-semibold">
                      View Matches <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Mutual Skill Exchange Recommendations */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Repeat className="w-5 h-5 text-emerald-400" />
              <span>Skill Exchange Matches</span>
            </h2>
            <Link to="/skills" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
              <span>Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {skillExchanges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 mb-2">No direct mutual skill exchanges found yet.</p>
              <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                Add skills you can teach and skills you want to learn in your profile to discover mutual peer learning!
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
              >
                Configure Learning Skills
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {skillExchanges.slice(0, 3).map((exchange, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm text-white">{exchange.student?.name}</div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Mutual Fit
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">You can teach them:</div>
                      <div className="font-medium text-emerald-400 truncate">
                        {exchange.iCanTeachThem.join(', ')}
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">They can teach you:</div>
                      <div className="font-medium text-indigo-400 truncate">
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

      {/* Recent Campus Issues Tracked */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Campus Issues Tracked by Me</span>
          </h2>
          <Link to="/issues" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
            <span>Report / View Feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myIssues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">You have not reported any campus issues.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myIssues.slice(0, 4).map((issue) => (
              <Link
                key={issue._id}
                to={`/issues/${issue._id}`}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-colors block"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-white truncate">{issue.title}</h4>
                  <StatusBadge status={issue.status} size="sm" />
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  📍 {issue.location} • Category: {issue.category}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/40">
                  <UrgencyBadge urgency={issue.severity} size="sm" />
                  <span>Track resolution progress &rarr;</span>
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
