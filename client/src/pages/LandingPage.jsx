import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuickLoginBanner from '../components/QuickLoginBanner';
import {
  Sparkles,
  GraduationCap,
  Users,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Star,
  Award,
  Shield,
  Zap,
  Clock,
  Compass,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Background glow decorative blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6 shadow-sm shadow-indigo-950">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Connect. Help. Resolve. Together.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            The Smart Peer-to-Peer <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Campus Assistance & Issue Platform
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
            Empowering students to discover peers with the exact skills they need, exchange knowledge, and track campus infrastructure issues from report to resolution.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Quick Demo Personas Banner */}
          <div className="max-w-3xl mx-auto mb-16 text-left">
            <QuickLoginBanner />
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">94%</div>
              <div className="text-xs text-slate-400 font-medium">Matching Accuracy</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">&lt; 15 min</div>
              <div className="text-xs text-slate-400 font-medium">Avg. Peer Response</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-1">100%</div>
              <div className="text-xs text-slate-400 font-medium">Issue Tracking Transparency</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">4.9 / 5.0</div>
              <div className="text-xs text-slate-400 font-medium">Student Helper Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mission Pillars */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              Two Critical Campus Needs, One Central Ecosystem
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Colleges Rely on CampusConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1: Peer Help */}
            <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Peer-to-Peer Academic & Tech Assistance
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Never get stuck on coding bugs, project architecture, UI design, or course concepts. Post a help request and let our weighted Smart Matching Engine find the ideal student mentor.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>50% Skill Match</strong> + 20% Availability + 15% Location + 15% Reputation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Mutual Skill Exchanges</strong> (Teach Flutter, Learn Python)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Reputation System</strong> with star ratings & verified completed requests</span>
                </div>
              </div>

              <Link
                to="/help"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Explore Peer Requests</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pillar 2: Campus Issues */}
            <div className="glass-panel p-8 rounded-3xl border border-purple-500/20 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Transparent Campus Issue Management
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Broken projector in Seminar Hall? Wi-Fi disconnects in the library? Report issues with severity and location. Track the full resolution lifecycle step-by-step.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Full 6-Stage Lifecycle</strong>: Reported &rarr; Under Review &rarr; Assigned &rarr; Resolved</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Admin Triage Dashboard</strong> with department dispatch and SLA metrics</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Real-time status history</strong> so reporters never wonder what happened</span>
                </div>
              </div>

              <Link
                to="/issues"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300"
              >
                <span>View Campus Issues Feed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Engine Deep Dive */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4 border border-emerald-500/20">
                  <Zap className="w-3.5 h-3.5" /> Intelligent Engine
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  "Instead of simply asking who can help, CampusConnect identifies who is most likely to help."
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Our matching engine algorithm evaluates multiple contextual dimensions to deliver ranked compatibility scores for every request.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-indigo-400 font-bold text-lg">50% Weight</div>
                    <div className="text-xs text-slate-400">Skill match intersection</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-emerald-400 font-bold text-lg">20% Weight</div>
                    <div className="text-xs text-slate-400">Schedule availability fit</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-amber-400 font-bold text-lg">15% Weight</div>
                    <div className="text-xs text-slate-400">Campus location proximity</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-purple-400 font-bold text-lg">15% Weight</div>
                    <div className="text-xs text-slate-400">Student reputation & rating</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">Live Match Simulation</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      TOP MATCH: 94%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                      YG
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Yashas Gowda</div>
                      <div className="text-xs text-slate-400">Computer Science • 3rd Year</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Skills [Flutter, Firebase, Dart]</span>
                      <span className="text-emerald-400 font-semibold">50 / 50</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="w-full h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9 Rating
                    </span>
                    <span className="flex items-center gap-1 text-indigo-400">
                      <Award className="w-3.5 h-3.5" /> 95 Reputation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
