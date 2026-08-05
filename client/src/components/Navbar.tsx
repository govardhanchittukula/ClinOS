import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Cpu, FileText, PlusCircle, Shield, User, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { getStoredAuthUser, clearStoredAuthUser } from '../lib/supabase';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>(getStoredAuthUser());
  const [systemOnline, setSystemOnline] = useState<boolean>(true);

  useEffect(() => {
    // Ping healthcheck
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setSystemOnline(data.status === 'healthy'))
      .catch(() => setSystemOnline(false));
  }, []);

  const handleLogout = () => {
    clearStoredAuthUser();
    setUser({
      id: 'demo-guest',
      full_name: 'Guest User',
      role: 'patient',
    });
    navigate('/auth');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Cpu },
    { path: '/workflows/new', label: 'New Case Intake', icon: PlusCircle },
    { path: '/outputs', label: 'Clinical Outputs', icon: FileText },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'physician':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'nurse':
        return 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
      case 'admin':
        return 'bg-purple-950 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ClinOS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                v2.5-PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium">
              Autonomous Clinical Orchestrator
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Badge & Auth User Info */}
        <div className="flex items-center space-x-4">
          
          {/* Health Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                systemOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-400 font-mono text-[11px]">
              Engine: <strong className="text-slate-200">{systemOnline ? 'ACTIVE' : 'DEGRADED'}</strong>
            </span>
          </div>

          {/* User Profile / Role */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">{user.full_name}</p>
                <span
                  className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border capitalize ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-900/40 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};
