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
  Repeat,
  Check,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
        {/* Background glow decorative blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15] font-heading">
            The Smart Peer-to-Peer <br />
            <span className="text-gradient-brand">
              Campus Assistance & Issue Platform
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 mb-12 leading-relaxed font-normal">
            Empowering students to discover peers with the exact skills they need, exchange knowledge, and track campus infrastructure issues from report to resolution.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-glow-md flex items-center justify-center gap-2.5 transition-all hover:scale-105"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-glow-md flex items-center justify-center gap-2.5 transition-all hover:scale-105"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-850 border border-slate-700/80 text-slate-200 font-bold text-base transition-all"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
            <div className="p-4 rounded-2xl glass-panel-elevated border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading mb-1">94%</div>
              <div className="text-xs text-slate-400 font-semibold">Matching Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel-elevated border border-emerald-500/20">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-heading mb-1">&lt; 15 min</div>
              <div className="text-xs text-slate-400 font-semibold">Avg. Peer Response</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel-elevated border border-cyan-500/20">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-heading mb-1">100%</div>
              <div className="text-xs text-slate-400 font-semibold">Issue Transparency</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel-elevated border border-purple-500/20">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-heading mb-1">4.9 / 5.0</div>
              <div className="text-xs text-slate-400 font-semibold">Helper Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mission Pillars */}
      <section className="py-20 bg-void-900/60 border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 font-heading">
              Two Critical Campus Needs • One Central Platform
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Why Institutions Rely on CampusConnect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1: Peer Help */}
            <div className="glass-panel-elevated p-8 sm:p-10 rounded-3xl border border-indigo-500/25 relative overflow-hidden group glass-panel-interactive">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-glow-sm">
                <Users className="w-7 h-7 text-indigo-300" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                Peer-to-Peer Academic & Tech Assistance
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Never get stuck on coding bugs, project architecture, UI design, or course concepts. Post a help request and let our weighted Smart Matching Engine connect you to verified student mentors.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>50% Skill Match</strong> + 20% Availability + 15% Location + 15% Reputation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Mutual Skill Exchanges</strong> (Teach Flutter, Learn Python)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Reputation System</strong> with star ratings & verified completed requests</span>
                </div>
              </div>

              <Link
                to="/help"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Peer Requests Feed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pillar 2: Campus Issues */}
            <div className="glass-panel-elevated p-8 sm:p-10 rounded-3xl border border-purple-500/25 relative overflow-hidden group glass-panel-interactive">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-[0_0_20px_-3px_rgba(168,85,247,0.3)]">
                <AlertTriangle className="w-7 h-7 text-purple-300" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                Transparent Campus Issue Management
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Broken projector in Seminar Hall? Wi-Fi disconnects in the library? Report issues with severity and location. Track the full resolution lifecycle step-by-step.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Full 6-Stage Lifecycle</strong>: Reported &rarr; Under Review &rarr; Assigned &rarr; Resolved</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Admin Triage Dashboard</strong> with department dispatch and SLA metrics</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Real-time status history</strong> so reporters never wonder what happened</span>
                </div>
              </div>

              <Link
                to="/issues"
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 group-hover:translate-x-1 transition-all"
              >
                <span>View Campus Issues Feed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Matching Engine Deep Dive */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-elevated p-8 sm:p-14 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 font-heading">
                  <Zap className="w-3.5 h-3.5" /> 
                  <span>Smart Matching Engine</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-heading">
                  "Instead of simply asking who can help, CampusConnect identifies who is most likely to help."
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Our matching engine algorithm evaluates multiple contextual dimensions to deliver ranked compatibility scores for every peer request.
                </p>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-void-950/80 border border-slate-800">
                    <div className="text-indigo-400 font-extrabold text-xl font-heading">50% Weight</div>
                    <div className="text-xs text-slate-400 font-medium">Skill match intersection</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-void-950/80 border border-slate-800">
                    <div className="text-emerald-400 font-extrabold text-xl font-heading">20% Weight</div>
                    <div className="text-xs text-slate-400 font-medium">Schedule availability fit</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-void-950/80 border border-slate-800">
                    <div className="text-amber-400 font-extrabold text-xl font-heading">15% Weight</div>
                    <div className="text-xs text-slate-400 font-medium">Campus location proximity</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-void-950/80 border border-slate-800">
                    <div className="text-cyan-400 font-extrabold text-xl font-heading">15% Weight</div>
                    <div className="text-xs text-slate-400 font-medium">Student reputation & rating</div>
                  </div>
                </div>
              </div>

              {/* Simulation Visual Dial */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-3xl bg-void-950 border border-indigo-500/40 shadow-2xl space-y-5 relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Live Match Simulation
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/40 uppercase tracking-wider">
                      Top Match: 94%
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-xl shadow-glow-sm">
                      YG
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-base font-heading">Yashas Gowda</div>
                      <div className="text-xs text-slate-400">Computer Science • 3rd Year</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Skills [Flutter, Firebase, Dart]</span>
                      <span className="text-emerald-400">50 / 50</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9 Rating
                    </span>
                    <span className="flex items-center gap-1 text-indigo-400 font-bold">
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
