import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  HelpCircle,
  AlertTriangle,
  Users,
  GitPullRequest,
  ShieldCheck,
  LogOut,
  User,
  Menu,
  X,
  Star,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2">
      <div className="max-w-7xl mx-auto">
        <nav className="glass-panel-elevated rounded-2xl px-4 sm:px-6 border border-white/10 backdrop-blur-2xl bg-void-900/80 shadow-2xl transition-all">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_0_rgba(99,102,241,0.7)] group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight font-heading bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  CampusConnect
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive('/dashboard')
                        ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850/80'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/help"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive('/help') || location.pathname.startsWith('/help/')
                        ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850/80'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Peer Help</span>
                  </Link>

                  <Link
                    to="/issues"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive('/issues') || location.pathname.startsWith('/issues/')
                        ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850/80'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Campus Issues</span>
                  </Link>

                  <Link
                    to="/skills"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive('/skills')
                        ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850/80'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Skill Directory</span>
                  </Link>

                  <Link
                    to="/connections"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive('/connections')
                        ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850/80'
                    }`}
                  >
                    <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
                    <span>Connections</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`ml-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                        location.pathname.startsWith('/admin')
                          ? 'bg-purple-600/30 text-purple-200 border border-purple-400/50 shadow-[0_0_16px_-2px_rgba(168,85,247,0.4)]'
                          : 'text-purple-300 bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/60'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-glow-sm hover:shadow-glow-md transition-all hover:scale-105"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Pill & Logout */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2.5">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-1.5 pr-3.5 rounded-xl border border-white/10 bg-slate-900/80 hover:border-indigo-500/50 hover:bg-slate-850 transition-all shadow-inner-specular group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                      <span className="truncate max-w-[120px]">{user.name}</span>
                      {isAdmin && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-purple-500/25 text-purple-300 border border-purple-500/40 uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {Number(user.rating || 5.0).toFixed(1)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-indigo-300 font-bold">
                        <Award className="w-2.5 h-2.5 text-indigo-400" />
                        {user.reputationScore || 75} Rep
                      </span>
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl border border-white/10 bg-slate-900/80 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-950/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              {isAuthenticated && (
                <Link to="/profile" className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300">
                  <User className="w-5 h-5" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 pt-3 pb-5 space-y-2 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="p-3 mb-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.department} • {user.year}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-amber-400 font-bold">⭐ {Number(user.rating || 5).toFixed(1)}</div>
                      <div className="text-indigo-300 font-semibold">{user.reputationScore || 75} Rep</div>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
                  >
                    Peer Help Requests
                  </Link>
                  <Link
                    to="/issues"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
                  >
                    Campus Issues
                  </Link>
                  <Link
                    to="/skills"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
                  >
                    Skill Directory & Exchanges
                  </Link>
                  <Link
                    to="/connections"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
                  >
                    Connections
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
                  >
                    My Profile
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-bold text-purple-300 bg-purple-950/50 border border-purple-800/50"
                    >
                      Admin Portal
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full mt-2 text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-950/30"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white border border-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
