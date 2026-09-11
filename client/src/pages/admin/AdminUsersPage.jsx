import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import StarRating from '../../components/StarRating';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  Award,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminUsersPage = () => {
  const { success, error } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const res = await adminApi.getUsers(params);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      error('Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN';
    try {
      await adminApi.updateUser(userId, { role: newRole });
      success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      error('Failed to update role.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-8 h-8 text-purple-400" />
            <span>Campus User Directory & Roles</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage registered students, monitor reputation scores, and assign administrator privileges.
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
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            placeholder="Search by student name, email, department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students Only</option>
          <option value="ADMIN">Admins Only</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-sm text-slate-400">Loading student directory...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <p className="text-sm text-slate-400">No users found matching query.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-4 py-4">Department & Year</th>
                  <th className="px-4 py-4">Rating & Rep</th>
                  <th className="px-4 py-4">Helped Count</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center">
                          {u.name ? u.name[0] : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-300">
                      <div>{u.department}</div>
                      <div className="text-slate-500">{u.year}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                          ⭐ {Number(u.rating || 5).toFixed(1)}
                        </span>
                        <span>•</span>
                        <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                          <Award className="w-3 h-3" /> {u.reputationScore || 75}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <span className="text-emerald-400 font-semibold">{u.requestsHelped || 0}</span> peers
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(u._id, u.role)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        {u.role === 'ADMIN' ? 'Demote to Student' : 'Promote to Admin'}
                      </button>
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

export default AdminUsersPage;
