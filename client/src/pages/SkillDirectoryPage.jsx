import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import {
  Users,
  Search,
  Award,
  Sparkles,
  Repeat,
  Loader2,
  Clock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const SkillDirectoryPage = () => {
  const [students, setStudents] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'exchanges'
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedDept) params.department = selectedDept;

      const [studentsRes, exchangesRes] = await Promise.all([
        userApi.getAll(params),
        userApi.getSkillExchanges(),
      ]);

      if (studentsRes.data.success) setStudents(studentsRes.data.data);
      if (exchangesRes.data.success) setExchanges(exchangesRes.data.data);
    } catch (err) {
      console.error('Error fetching directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedDept]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-8 h-8 text-indigo-400" />
            <span>Campus Skill Directory</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover peer expertise, explore who possesses what skills, and find mutual learning exchanges.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setViewMode('exchanges')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'exchanges'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Mutual Exchanges ({exchanges.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, skill (e.g. Flutter, UI/UX), or topic..."
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
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Science">Information Science</option>
          <option value="Electronics & Comm.">Electronics & Comm.</option>
          <option value="Design & Media">Design & Media</option>
        </select>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-400">Searching students & skills...</p>
        </div>
      ) : viewMode === 'exchanges' ? (
        /* Mutual Exchanges View */
        <div className="space-y-4">
          {exchanges.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
              <Repeat className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Direct Mutual Exchanges Yet</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
                Mutual exchanges happen when another student wants to learn what you can teach, AND you want to learn what they teach.
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Update Skills & Learning Goals
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exchanges.map((ex, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base">
                        {ex.student.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{ex.student.name}</h4>
                        <p className="text-xs text-slate-400">
                          {ex.student.department} • {ex.student.year}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40">
                      Mutual Fit
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>You can teach them:</span>
                      </div>
                      <div className="font-semibold text-xs text-emerald-300">
                        {ex.iCanTeachThem.join(', ')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-400" />
                        <span>They can teach you:</span>
                      </div>
                      <div className="font-semibold text-xs text-indigo-300">
                        {ex.theyCanTeachMe.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {ex.student.availability}
                    </span>
                    <Link
                      to="/help/create"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Request Help</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* All Students Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                      {student.name ? student.name[0].toUpperCase() : 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{student.name}</h4>
                      <p className="text-xs text-slate-400">
                        {student.department} • {student.year}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating & Reputation Badges */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={student.rating || 5.0} size="sm" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-indigo-300 font-semibold">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{student.reputationScore || 75} Rep</span>
                  </div>
                </div>

                {/* Bio snippet */}
                {student.bio && (
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    "{student.bio}"
                  </p>
                )}

                {/* Skills */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Skills:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(!student.skills || student.skills.length === 0) ? (
                      <span className="text-[11px] text-slate-500 italic">No skills listed</span>
                    ) : (
                      student.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Learning */}
                {student.learningSkills && student.learningSkills.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Wants to Learn:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {student.learningSkills.map((lSkill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px]"
                        >
                          {lSkill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {student.availability || 'Flexible'}
                </span>
                <span className="text-emerald-400 font-medium">
                  {student.requestsHelped || 0} peers helped
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillDirectoryPage;
