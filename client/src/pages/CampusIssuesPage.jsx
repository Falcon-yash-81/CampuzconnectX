import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import {
  AlertTriangle,
  Plus,
  Search,
  MapPin,
  Clock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const CampusIssuesPage = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'my'
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [search, setSearch] = useState('');

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (severity) params.severity = severity;
      if (search) params.search = search;

      let res;
      if (filterMode === 'my') {
        res = await issueApi.getMyReports();
      } else {
        res = await issueApi.getAll(params);
      }

      if (res.data.success) {
        setIssues(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filterMode, category, severity]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <span>Campus Issue Reporting & Tracking</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Report infrastructure, Wi-Fi, lab, and equipment issues. Track resolution in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* My reports vs all toggle */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Issues
            </button>
            <button
              onClick={() => setFilterMode('my')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'my'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Reports
            </button>
          </div>

          <Link
            to="/issues/create"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-900/30 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Report Issue</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by issue title, location (e.g. Seminar Hall), or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="">All Categories</option>
          <option value="Equipment">Equipment</option>
          <option value="Internet / Wi-Fi">Internet / Wi-Fi</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Laboratory">Laboratory</option>
          <option value="Classroom">Classroom</option>
          <option value="Cleanliness">Cleanliness</option>
          <option value="Security">Security</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="">All Severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      {/* Issues Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm text-slate-400">Loading campus issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Campus Issues Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
            Everything looks in good shape! If you encounter broken equipment or infrastructure problems, report it.
          </p>
          <Link
            to="/issues/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Report Campus Issue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <Link
              key={issue._id}
              to={`/issues/${issue._id}`}
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {issue.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <UrgencyBadge urgency={issue.severity} size="sm" />
                    <StatusBadge status={issue.status} size="sm" />
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-2">
                  {issue.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {issue.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="font-medium text-slate-300 truncate">{issue.location}</span>
                </div>

                {issue.assignedTo && issue.assignedTo !== 'Unassigned' && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800/50 text-[11px] text-indigo-300 font-medium">
                    <UserCheck className="w-3 h-3 text-indigo-400" />
                    <span>Assigned: {issue.assignedTo}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Reported by {issue.reportedBy?.name || 'Student'}</span>
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-amber-400 font-semibold group-hover:underline">
                  <span>View Full Status Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampusIssuesPage;
