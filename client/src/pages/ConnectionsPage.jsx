import React, { useState, useEffect } from 'react';
import { connectionApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatusBadge from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  MessageSquare,
  Award,
  Loader2,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const ConnectionsPage = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useNotification();

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

  // Rating Modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await connectionApi.getAll();
      if (res.data.success) {
        setConnections(res.data.data);
      }
    } catch (err) {
      console.error(err);
      error('Failed to load connections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await connectionApi.updateStatus(id, newStatus);
      success(`Connection ${newStatus.toLowerCase()} successfully!`);
      fetchConnections();
      refreshUser();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update connection status.');
    }
  };

  const handleOpenRating = (conn) => {
    setSelectedConnection(conn);
    setRatingVal(5);
    setFeedback('');
    setRatingModalOpen(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!selectedConnection) return;

    setSubmittingRating(true);
    try {
      await connectionApi.complete(selectedConnection._id, {
        rating: ratingVal,
        feedback,
      });

      success('Assistance marked as completed and helper rating recorded!');
      setRatingModalOpen(false);
      fetchConnections();
      refreshUser();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to complete assistance.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const receivedList = connections.filter((c) => c.helper?._id === user?._id);
  const sentList = connections.filter((c) => c.requester?._id === user?._id);
  const displayedList = activeTab === 'received' ? receivedList : sentList;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <GitPullRequest className="w-8 h-8 text-indigo-400" />
            <span>Peer Help Connections</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage incoming assistance requests, track active collaborations, and rate completed sessions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'received'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Received Help Offers ({receivedList.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sent'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Sent Requests ({sentList.length})
          </button>
        </div>
      </div>

      {/* Connection Cards */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-400">Loading your connections...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <GitPullRequest className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            {activeTab === 'received'
              ? 'No incoming help requests yet'
              : 'You have not sent any help requests'}
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {activeTab === 'received'
              ? 'When peers search for help matching your skills, their requests will appear here.'
              : 'Browse open requests or create one to connect with skilled peers.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((conn) => {
            const peer = activeTab === 'received' ? conn.requester : conn.helper;
            const isHelper = activeTab === 'received';

            return (
              <div
                key={conn._id}
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 transition-all hover:border-slate-700"
              >
                {/* Header: Peer info + Status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-base flex items-center justify-center shadow-md">
                      {peer?.name ? peer.name[0] : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">{peer?.name}</h3>
                        <span className="text-xs text-slate-500">
                          ({isHelper ? 'Requester' : 'Helper Mentor'})
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {peer?.department} • {peer?.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <StatusBadge status={conn.status} />
                  </div>
                </div>

                {/* Help Request Info Box */}
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Associated Request:
                  </div>
                  <div className="font-bold text-white text-sm">
                    {conn.helpRequest?.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>📍 {conn.helpRequest?.location}</span>
                    <span>•</span>
                    <span>Urgency: {conn.helpRequest?.urgency}</span>
                  </div>
                </div>

                {/* Completed Rating & Feedback display if COMPLETED */}
                {conn.status === 'COMPLETED' && conn.rating && (
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-emerald-300">
                          Assistance Rating:
                        </span>
                        <StarRating rating={conn.rating} size="sm" />
                      </div>
                      {conn.feedback && (
                        <p className="text-xs text-slate-300 italic">"{conn.feedback}"</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60">
                  <div className="text-xs text-slate-500">
                    Created: {new Date(conn.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions for Helper */}
                  {isHelper && conn.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(conn._id, 'ACCEPTED')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(conn._id, 'REJECTED')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium text-xs transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Actions for Requester */}
                  {!isHelper && conn.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusUpdate(conn._id, 'CANCELLED')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}

                  {/* Active session completion button for Requester */}
                  {!isHelper && conn.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleOpenRating(conn)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1.5 hover:scale-105"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Completed & Rate Helper</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete & Rating Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-md w-full shadow-2xl space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Rate Your Helper</h3>
              <p className="text-xs text-slate-400">
                How was the assistance provided by {selectedConnection?.helper?.name}?
              </p>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              {/* Star Selector */}
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <StarRating
                  rating={ratingVal}
                  size="lg"
                  interactive={true}
                  onChange={(val) => setRatingVal(val)}
                  showNumber={true}
                />
                <span className="text-xs text-slate-400">
                  {ratingVal === 5 ? 'Outstanding Mentorship! 🌟' : `${ratingVal} out of 5 stars`}
                </span>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Feedback & Review (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g. Yashas explained the Firebase authentication flow clearly and helped me fix the bug in 20 minutes!"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRatingModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submittingRating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit & Complete</span>
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

export default ConnectionsPage;
