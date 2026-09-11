import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import StarRating from '../components/StarRating';
import {
  User,
  GraduationCap,
  Calendar,
  Clock,
  Award,
  Sparkles,
  Plus,
  X,
  Save,
  Loader2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Flutter',
  'Firebase',
  'Dart',
  'JavaScript',
  'React.js',
  'Node.js',
  'Python',
  'Machine Learning',
  'UI/UX',
  'Figma',
  'SQL',
  'Data Structures',
  'Cloud / AWS',
  'Cybersecurity',
  'C++',
  'Presentations',
];

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || 'Computer Science',
    year: user?.year || '3rd Year',
    bio: user?.bio || '',
    availability: user?.availability || 'Flexible',
  });

  const [skills, setSkills] = useState(user?.skills || []);
  const [learningSkills, setLearningSkills] = useState(user?.learningSkills || []);
  const [newSkill, setNewSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || newSkill).trim();
    if (!s) return;
    if (skills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
      error('Skill already added to your profile.');
      return;
    }
    setSkills([...skills, s]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddLearnSkill = () => {
    const s = newLearnSkill.trim();
    if (!s) return;
    if (learningSkills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
      error('Skill already in your learning list.');
      return;
    }
    setLearningSkills([...learningSkills, s]);
    setNewLearnSkill('');
  };

  const handleRemoveLearnSkill = (skillToRemove) => {
    setLearningSkills(learningSkills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        userApi.updateProfile(formData),
        userApi.updateSkills({ skills, learningSkills }),
      ]);
      await refreshUser();
      success('Profile & skills updated successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-sm text-slate-400">
                {user?.department} • {user?.year}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-slate-400">{user?.email}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[10px] border border-slate-700">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Reputation Stats */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-amber-400 font-bold text-lg flex items-center justify-center gap-1">
                <StarRating rating={user?.rating || 5.0} showNumber={false} size="sm" />
                <span>{Number(user?.rating || 5.0).toFixed(1)}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Rating ({user?.ratingsCount || 0} reviews)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-center">
              <div className="text-indigo-300 font-bold text-lg flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>{user?.reputationScore || 75}</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
              <div className="text-[10px] text-indigo-400 mt-0.5">Campus Reputation</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
          <div>
            <strong className="text-white">{user?.requestsHelped || 0}</strong> Students Helped
          </div>
          <div>
            <strong className="text-white">{user?.requestsCompleted || 0}</strong> Requests Resolved
          </div>
          <div>
            Availability: <strong className="text-emerald-400">{user?.availability || 'Flexible'}</strong>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Academic & Profile Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Flexible">Flexible</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Evenings">Evenings</option>
                <option value="Weekends">Weekends</option>
                <option value="Immediate">Available Now (Immediate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Academic Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Student Bio / Introduction
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell other students about your interests and what you love building..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Skills I Possess */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Skills I Can Help With ({skills.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The Smart Matching Engine uses these skills to connect you with peers who need help.
              </p>
            </div>
          </div>

          {/* Active Skills List */}
          <div className="flex flex-wrap gap-2 min-h-[42px] p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            {skills.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No skills added yet. Add some below!</span>
            ) : (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Custom Skill */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a new skill (e.g. Flutter, PyTorch, AutoCAD)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
              Popular Campus Skills (Click to add):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills I Want To Learn */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Skills I Want To Learn ({learningSkills.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Used to find potential mutual skill exchange partners on campus.
            </p>
          </div>

          {/* Active Learning Skills */}
          <div className="flex flex-wrap gap-2 min-h-[42px] p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            {learningSkills.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No learning goals specified yet.</span>
            ) : (
              learningSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLearnSkill(skill)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Learning Skill */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newLearnSkill}
              onChange={(e) => setNewLearnSkill(e.target.value)}
              placeholder="What skill do you want to learn? (e.g. AWS, Node.js, Blender)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLearnSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddLearnSkill}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
