import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueApi, adminApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/StatusBadge';
import UrgencyBadge from '../../components/UrgencyBadge';
import {
  AlertTriangle,
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  Trash2,
  Edit,
  Loader2,
  ShieldCheck,
  Save,
  X,
} from 'lucide-react';

const STAGES = [
  'REPORTED',
  'UNDER REVIEW',
  'ASSIGNED',
  'IN PROGRESS',
  'RESOLVED',
  'CLOSED',
];

export const AdminIssuesPage = () => {
  const { success, error } = useNotification();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [search, setSearch] = useState('');

  // Quick edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (severityFilter) params.severity = severityFilter;
      if (search) params.search = search;

      const res = await issueApi.getAll(params);
      if (res.data.success) {
        setIssues(res.data.data);
      }
    } catch (err) {
      console.error(err);
      error('Failed to load issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, severityFilter]);

  const handleOpenEdit = (issue) => {
    setSelectedIssue(issue);
    setEditStatus(issue.status);
    setEditAssignedTo(issue.assignedTo || '');
    setEditNotes(issue.resolutionNotes || '');
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    setSaving(true);
    try {
      await adminApi.updateIssue(selectedIssue._id, {
        status: editStatus,
        assignedTo: editAssignedTo,
        resolutionNotes: editNotes,
      });

      success('Issue updated successfully!');
      setEditModalOpen(false);
      fetchIssues();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update issue.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this issue report?')) return;

    try {
      await issueApi.delete(id);
      success('Issue deleted successfully.');
      fetchIssues();
    } catch (err) {
      error('Failed to delete issue.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-8 h-8 text-purple-400" />
            <span>Campus Issue Triage & Management</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Assign maintenance teams, adjust severity, track resolution progress, and close resolved tickets.
          </p>
        </div>

        <Link
          to="/admin"
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 self-start sm:self-auto"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchIssues()}
            placeholder="Search issues by title, location, reporter..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All Statuses</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All Severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      {/* Issues Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-sm text-slate-400">Loading triage queue...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Issues Match Filters</h3>
          <p className="text-sm text-slate-400">Try clearing filters or search query.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Issue Details</th>
                  <th className="px-4 py-4">Severity</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Assigned To</th>
                  <th className="px-4 py-4">Reported By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {issues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/issues/${issue._id}`}
                        className="font-bold text-white hover:text-purple-300 transition-colors block"
                      >
                        {issue.title}
                      </Link>
                      <div className="text-xs text-slate-400 mt-0.5">
                        📍 {issue.location} • {issue.category}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <UrgencyBadge urgency={issue.severity} size="sm" />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-slate-300">
                        {issue.assignedTo && issue.assignedTo !== 'Unassigned'
                          ? issue.assignedTo
                          : <span className="text-slate-500 italic">Unassigned</span>}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">
                      <div>{issue.reportedBy?.name || 'Student'}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(issue)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 transition-colors inline-flex items-center"
                        title="Triage & Assign"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(issue._id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors inline-flex items-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Triage Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Triage & Dispatch Issue</span>
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <div className="font-bold text-white text-sm mb-1">
                  {selectedIssue?.title}
                </div>
                <div className="text-xs text-slate-400">
                  📍 {selectedIssue?.location} • Category: {selectedIssue?.category}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Update Lifecycle Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
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
                  Assign Team / Staff / Technician
                </label>
                <input
                  type="text"
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  placeholder="e.g. AV Tech Team, IT Services, Electrical Maintenance"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Resolution Notes (Logged in status history)
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Technician dispatched with replacement HDMI cord..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-900/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Dispatch</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIssuesPage;
