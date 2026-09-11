import React, { useState, useEffect } from 'react';
import { helpApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import UrgencyBadge from '../../components/UrgencyBadge';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Clock,
  Loader2,
} from 'lucide-react';

export const AdminHelpRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const res = await helpApi.getAll(params);
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-8 h-8 text-purple-400" />
            <span>Campus Peer Requests Monitoring</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global administrative view of all academic and technical peer assistance requests.
          </p>
        </div>

        <Link
          to="/admin"
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 self-start sm:self-auto"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Filter */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchRequests()}
            placeholder="Search help requests..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="MATCHED">Matched</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-sm text-slate-400">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <p className="text-sm text-slate-400">No requests found matching criteria.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Request Title</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Required Skills</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Requester</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{req.title}</div>
                      <div className="text-xs text-slate-400">📍 {req.location}</div>
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-slate-300">
                      {req.category}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {req.requiredSkills?.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">
                      <div>{req.requester?.name}</div>
                      <div className="text-[11px] text-slate-500">{req.requester?.department}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/help/${req._id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHelpRequestsPage;
