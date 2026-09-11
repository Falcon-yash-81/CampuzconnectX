import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { helpApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import StarRating from '../components/StarRating';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Clock,
  MapPin,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const HelpRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [search, setSearch] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (urgency) params.urgency = urgency;
      if (search) params.search = search;

      const res = await helpApi.getAll(params);
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching help requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [category, urgency]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-8 h-8 text-indigo-400" />
            <span>Peer Help Requests</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse requests posted by fellow students or ask for assistance with your own projects.
          </p>
        </div>

        <Link
          to="/help/create"
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Help Request</span>
        </Link>
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
              placeholder="Search by topic, required skill (e.g. Flutter, React), or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          <option value="Programming">Programming</option>
          <option value="Design">Design</option>
          <option value="Academics">Academics</option>
          <option value="Technology">Technology</option>
          <option value="Communication">Communication</option>
          <option value="Creative">Creative</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Urgencies</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-400">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Help Requests Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or be the first to request assistance!
          </p>
          <Link
            to="/help/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Create Request
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <Link
              key={req._id}
              to={`/help/${req._id}`}
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Status and Urgency Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                    {req.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <UrgencyBadge urgency={req.urgency} size="sm" />
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-2">
                  {req.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {req.description}
                </p>

                {/* Required Skills Badges */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Required Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {req.requiredSkills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-indigo-950/70 border border-indigo-800/50 text-indigo-300 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requester & Location Footer */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">
                      {req.requester?.name ? req.requester.name[0] : 'S'}
                    </div>
                    <span className="text-slate-300 font-medium">{req.requester?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{req.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 text-indigo-400 font-semibold group-hover:underline">
                  <span>Smart Matching & Details</span>
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

export default HelpRequestsPage;
