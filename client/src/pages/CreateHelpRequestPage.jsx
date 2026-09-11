import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { helpApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
  HelpCircle,
  Plus,
  X,
  Sparkles,
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Flutter',
  'Firebase',
  'Dart',
  'React.js',
  'Node.js',
  'Python',
  'UI/UX',
  'Figma',
  'C++',
  'Java',
  'Machine Learning',
  'SQL',
];

export const CreateHelpRequestPage = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    location: 'Main Campus',
    urgency: 'Medium',
    availability: 'Flexible',
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || skillInput).trim();
    if (!s) return;
    if (skills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
      return;
    }
    setSkills([...skills, s]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) {
      error('Please specify at least one required skill.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await helpApi.create({
        ...formData,
        requiredSkills: skills,
      });

      if (res.data.success) {
        success('Help request posted! Finding matching peers...');
        navigate(`/help/${res.data.data._id}`);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create help request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-8 h-8 text-indigo-400" />
          <span>Request Peer Assistance</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Specify what you need help with. Our Smart Matching Engine will find students with matching expertise.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Request Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Need help with Flutter Firebase authentication"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the challenge you are facing, what you've tried so far, or what you want to learn..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Required Skills Manager */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Required Skills * (Smart Matching Key Factor — 50% Weight)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter skill (e.g. Flutter, Firebase, Dart)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
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
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-3">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No skills specified yet. Add above or click below.</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold"
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

            {/* Suggested quick clicks */}
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

          {/* Grid: Category, Location, Urgency, Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Academics">Academics</option>
                <option value="Technology">Technology</option>
                <option value="Communication">Communication</option>
                <option value="Creative">Creative</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Campus Location (15% Weight)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. ECE Block, Central Library, Hostel 3"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Urgency Level
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Low">Low (Within a week)</option>
                <option value="Medium">Medium (Next 2-3 days)</option>
                <option value="High">High (Within 24 hours)</option>
                <option value="Urgent">Urgent (Immediate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Your Availability (20% Weight)
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Flexible">Flexible</option>
                <option value="Today">Today</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Immediate">Available Now (Immediate)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching Students...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Post Request & Find Matches</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHelpRequestPage;
