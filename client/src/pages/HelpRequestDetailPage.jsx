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

        // Fetch matches if current user is the requester or admin
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
        success('Help connection request sent! Helper has been notified.');
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
        <p className="text-sm text-slate-400">Loading help request and matches...</p>
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
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Help Requests</span>
      </Link>

      {/* Active Connection Banner if exists */}
      {currentConnection && (
        <div className="glass-panel p-5 rounded-3xl border border-indigo-500/40 bg-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                Active Connection with {currentConnection.helper?.name}
              </div>
              <div className="text-xs text-indigo-300 mt-0.5">
                Status: <strong className="uppercase">{currentConnection.status}</strong> • Department: {currentConnection.helper?.department}
              </div>
            </div>
          </div>

          <Link
            to="/connections"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            <span>Manage in Connections</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Request Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {request.category}
                </span>
                <div className="flex items-center gap-2">
                  <UrgencyBadge urgency={request.urgency} size="sm" />
                  <StatusBadge status={request.status} size="sm" />
                </div>
              </div>

              <h1 className="text-2xl font-extrabold text-white leading-tight mb-3">
                {request.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-800">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {request.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {request.availability}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Problem Description
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                {request.description}
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Required Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {request.requiredSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Requester Profile Snapshot */}
            <div className="pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Posted By
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {request.requester?.name ? request.requester.name[0] : 'U'}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{request.requester?.name}</div>
                  <div className="text-xs text-slate-400">
                    {request.requester?.department} • {request.requester?.year}
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                      ⭐ {Number(request.requester?.rating || 5.0).toFixed(1)}
                    </span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                      <Award className="w-3.5 h-3.5" /> {request.requester?.reputationScore || 75} Rep
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Smart Matching Engine Recommendations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 flex-wrap gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Smart Matching Engine</span>
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Recommended Student Mentors
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Weighted by Skills (50%), Availability (20%), Location (15%), Reputation (15%)
              </span>
            </div>

            {matchingLoading ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                <p className="text-sm text-slate-400">
                  Scanning student profiles, skills, and availability...
                </p>
              </div>
            ) : matches.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-white">No Direct Matches Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No other student currently has these exact skills listed on their profile. Check the Skill Directory to find mentors or encourage peers to add their skills.
                </p>
                <Link
                  to="/skills"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
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
                          ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900/90 border-indigo-500/50 shadow-xl shadow-indigo-950/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-base flex items-center justify-center shadow-md">
                            {student.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base text-white">{student.name}</h4>
                              {isTopMatch && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 uppercase">
                                  Top Match
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">
                              {student.department} • {student.year}
                            </p>
                          </div>
                        </div>

                        {/* Compatibility Score Circle/Pill */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                          <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1">
                            <span>{score}%</span>
                            <span className="text-xs text-slate-400 font-normal">Match</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {student.requestsHelped || 0} peers helped
                          </div>
                        </div>
                      </div>

                      {/* Compatibility Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700"
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      {/* 4 Factor Breakdown Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-4">
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                          <div className="text-slate-400">Skills (50% max)</div>
                          <div className="font-bold text-indigo-300">
                            {match.breakdown?.skillScore} / 50
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                          <div className="text-slate-400">Availability (20%)</div>
                          <div className="font-bold text-emerald-300">
                            {match.breakdown?.availabilityScore} / 20
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                          <div className="text-slate-400">Location (15%)</div>
                          <div className="font-bold text-amber-300">
                            {match.breakdown?.locationScore} / 15
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                          <div className="text-slate-400">Reputation (15%)</div>
                          <div className="font-bold text-purple-300">
                            {match.breakdown?.reputationScore} / 15
                          </div>
                        </div>
                      </div>

                      {/* Matched Skills Pills */}
                      <div className="space-y-1.5 mb-5">
                        <div className="text-[11px] font-semibold text-slate-400">
                          Matched Skills:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {match.matchedSkills?.map((skill, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                            >
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>{skill}</span>
                            </span>
                          ))}
                          {match.missingSkills?.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-500 text-xs line-through"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button: Request Help from this Student */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                            ⭐ {Number(student.rating || 5.0).toFixed(1)}
                          </span>
                          <span>•</span>
                          <span className="text-indigo-400 font-semibold">
                            {student.reputationScore} Rep
                          </span>
                        </div>

                        {isOwner ? (
                          hasRequestedThis ? (
                            <span className="px-4 py-2 rounded-xl bg-indigo-950 text-indigo-300 font-semibold text-xs border border-indigo-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Request Sent ({currentConnection?.status})</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendConnection(student._id)}
                              disabled={requestingId === student._id}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
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
