import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { helpApi, connectionApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import StarRating from '../components/StarRating';
import {
  HelpCircle,
  Sparkles,
  MapPin,
  Clock,
  User,
  Award,
  CheckCircle2,
  Send,
  Loader2,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  AlertCircle,
  GitPullRequest,
} from 'lucide-react';

export const HelpRequestDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [requestingId, setRequestingId] = useState(null);

  const fetchRequestAndMatches = async () => {
    try {
      setLoading(true);
      const res = await helpApi.getById(id);
      if (res.data.success) {
        setRequest(res.data.data);
        setCurrentConnection(res.data.currentConnection);

        const isOwner = res.data.data.requester?._id === user?._id;
        if (isOwner || user?.role === 'ADMIN') {
          setMatchingLoading(true);
          const matchRes = await helpApi.getMatches(id);
          if (matchRes.data.success) {
            setMatches(matchRes.data.data);
          }
          setMatchingLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      error('Failed to load help request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestAndMatches();
  }, [id]);

  const handleSendConnection = async (helperId) => {
    setRequestingId(helperId);
    try {
      const res = await connectionApi.create({
        helperId,
        helpRequestId: id,
      });

      if (res.data.success) {
        success('Assistance request sent! Helper has been notified.');
        setCurrentConnection(res.data.data);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to send help request.');
    } finally {
      setRequestingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-semibold text-slate-400">Loading help request and matches...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Request Not Found</h2>
        <Link to="/help" className="text-indigo-400 hover:underline text-sm">
          &larr; Back to Help Requests
        </Link>
      </div>
    );
  }

  const isOwner = request.requester?._id === user?._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/help"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Help Requests</span>
      </Link>

      {/* Active Connection Banner if exists */}
      {currentConnection && (
        <div className="glass-panel-elevated p-5 sm:p-6 rounded-3xl border border-indigo-500/40 bg-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-base font-heading">
                Active Assistance with {currentConnection.helper?.name}
              </div>
              <div className="text-xs text-indigo-300 font-semibold mt-0.5">
                Current Status: <strong className="uppercase text-white">{currentConnection.status}</strong> • Department: {currentConnection.helper?.department}
              </div>
            </div>
          </div>

          <Link
            to="/connections"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-glow-sm hover:scale-105"
          >
            <span>Manage in Connections</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Request Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider font-heading">
                  {request.category}
                </span>
                <div className="flex items-center gap-2">
                  <UrgencyBadge urgency={request.urgency} size="sm" />
                  <StatusBadge status={request.status} size="sm" />
                </div>
              </div>

              <h1 className="text-2xl font-extrabold text-white leading-tight mb-3 font-heading">
                {request.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-800">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {request.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {request.availability}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">
                Problem Description
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-void-950/80 p-4 rounded-2xl border border-slate-800">
                {request.description}
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 font-heading">
                Required Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {request.requiredSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Requester Profile Snapshot */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-heading">
                Requester Information
              </h4>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                  {request.requester?.name ? request.requester.name[0] : 'U'}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{request.requester?.name}</div>
                  <div className="text-xs text-slate-400">
                    {request.requester?.department} • {request.requester?.year}
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      ⭐ {Number(request.requester?.rating || 5.0).toFixed(1)}
                    </span>
                    <span>•</span>
                    <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                      <Award className="w-3.5 h-3.5" /> {request.requester?.reputationScore || 75} Rep
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Smart Matching Engine Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-indigo-500/30 relative shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight font-heading">
                  Recommended Student Mentors
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Weighted by Skills (50%), Availability (20%), Location (15%), Reputation (15%)
              </span>
            </div>

            {matchingLoading ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-9 h-9 animate-spin text-indigo-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">
                  Scanning student profiles, skill intersection, and schedule fit...
                </p>
              </div>
            ) : matches.length === 0 ? (
              <div className="p-8 rounded-2xl bg-void-950/70 border border-slate-800 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-white">No Direct Matches Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No other student currently has these skills listed. Explore the Skill Directory to find mentors or encourage peers to add their skills.
                </p>
                <Link
                  to="/skills"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Browse Student Directory
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, idx) => {
                  const student = match.student;
                  const isTopMatch = idx === 0;
                  const score = match.compatibilityScore;
                  const hasRequestedThis =
                    currentConnection?.helper?._id === student._id;

                  return (
                    <div
                      key={student._id}
                      className={`p-6 rounded-2xl border transition-all ${
                        isTopMatch
                          ? 'bg-gradient-to-b from-indigo-950/50 to-void-950/90 border-indigo-500/60 shadow-glow-md'
                          : 'bg-void-950/70 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-cyan-500 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                            {student.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base text-white font-heading">
                                {student.name}
                              </h4>
                              {isTopMatch && (
                                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40 uppercase tracking-wider">
                                  Top Match
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">
                              {student.department} • {student.year}
                            </p>
                          </div>
                        </div>

                        {/* Compatibility Score */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                          <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-1 font-heading">
                            <span>{score}%</span>
                            <span className="text-xs text-slate-400 font-normal">Match</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-semibold">
                            {student.requestsHelped || 0} peers helped
                          </div>
                        </div>
                      </div>

                      {/* Compatibility Progress Bar */}
                      <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden mb-4 p-0.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700 shadow-glow-emerald"
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      {/* 4 Factor Breakdown Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-4">
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                          <div className="text-slate-400 font-medium">Skills (50% max)</div>
                          <div className="font-extrabold text-indigo-300 font-heading">
                            {match.breakdown?.skillScore} / 50
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                          <div className="text-slate-400 font-medium">Availability (20%)</div>
                          <div className="font-extrabold text-emerald-300 font-heading">
                            {match.breakdown?.availabilityScore} / 20
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                          <div className="text-slate-400 font-medium">Location (15%)</div>
                          <div className="font-extrabold text-amber-300 font-heading">
                            {match.breakdown?.locationScore} / 15
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                          <div className="text-slate-400 font-medium">Reputation (15%)</div>
                          <div className="font-extrabold text-cyan-300 font-heading">
                            {match.breakdown?.reputationScore} / 15
                          </div>
                        </div>
                      </div>

                      {/* Matched Skills Badges */}
                      <div className="space-y-1.5 mb-5">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Matched Skills:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {match.matchedSkills?.map((skill, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                              <span>{skill}</span>
                            </span>
                          ))}
                          {match.missingSkills?.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg bg-slate-800/60 text-slate-500 text-xs line-through"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-amber-400 font-bold flex items-center gap-0.5">
                            ⭐ {Number(student.rating || 5.0).toFixed(1)}
                          </span>
                          <span>•</span>
                          <span className="text-indigo-400 font-bold">
                            {student.reputationScore} Rep
                          </span>
                        </div>

                        {isOwner ? (
                          hasRequestedThis ? (
                            <span className="px-4 py-2 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs border border-indigo-800 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                              <span>Request Sent ({currentConnection?.status})</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendConnection(student._id)}
                              disabled={requestingId === student._id}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
                            >
                              {requestingId === student._id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Sending Request...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Request Help from {student.name.split(' ')[0]}</span>
                                </>
                              )}
                            </button>
                          )
                        ) : (
                          <span className="text-xs text-slate-500 italic">
                            Only the requester can send connection requests.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpRequestDetailPage;
