import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
  AlertTriangle,
  MapPin,
  Flame,
  FileText,
  Image,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CreateIssuePage = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Equipment',
    location: '',
    severity: 'High',
    image: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await issueApi.create(formData);
      if (res.data.success) {
        success('Campus issue reported successfully! Administrators have been notified.');
        navigate(`/issues/${res.data.data._id}`);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to report campus issue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/issues"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campus Issues</span>
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          <span>Report Campus Issue</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Report broken facilities, equipment failures, or utility disruptions. Track resolution from report to closure.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Issue Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Projector not working in Seminar Hall"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
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
              placeholder="Describe the problem, when it started, and any symptoms (e.g. projector lamp flashing red, smells burnt)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Equipment">Equipment (Projector, PC, Lab gear)</option>
                <option value="Internet / Wi-Fi">Internet / Wi-Fi</option>
                <option value="Electrical">Electrical (Lights, Fans, Sockets)</option>
                <option value="Plumbing">Plumbing (Leaks, Taps, Restrooms)</option>
                <option value="Infrastructure">Infrastructure (Doors, Windows, Benches)</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Classroom">Classroom</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Security">Security</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Severity Level *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Low">Low (Minor inconvenience)</option>
                <option value="Medium">Medium (Affects normal study)</option>
                <option value="High">High (Disrupts classes / labs)</option>
                <option value="Critical">Critical (Safety hazard / urgent)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Exact Location *
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Seminar Hall 2, Science Block Room 304, Central Library 2nd Floor"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Image link */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Image / Photo URL (Optional)
            </label>
            <div className="relative">
              <Image className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-xl shadow-amber-900/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Report...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Submit Campus Issue</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssuePage;
