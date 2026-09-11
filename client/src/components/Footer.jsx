import React from 'react';
import { GraduationCap, Heart, Sparkles, Shield, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">CampusConnect</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
              Connect. Help. Resolve. Together. The all-in-one platform uniting student peer assistance, smart skill matching, and transparent campus issue resolution.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> MERN Stack
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Smart Weighted Matching
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Role-Based Access
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Peer Assistance
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/help" className="hover:text-indigo-400 transition-colors">
                  Browse Help Requests
                </Link>
              </li>
              <li>
                <Link to="/help/create" className="hover:text-indigo-400 transition-colors">
                  Request Peer Assistance
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-indigo-400 transition-colors">
                  Skill Discovery & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/connections" className="hover:text-indigo-400 transition-colors">
                  My Connections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Campus Management
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/issues" className="hover:text-indigo-400 transition-colors">
                  Campus Issue Feed
                </Link>
              </li>
              <li>
                <Link to="/issues/create" className="hover:text-indigo-400 transition-colors">
                  Report Infrastructure Issue
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-400 transition-colors">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} CampusConnect. Built with modern MERN architecture for connected digital campuses.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by peer collaboration & community support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
