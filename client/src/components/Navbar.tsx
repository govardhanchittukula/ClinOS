import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ShieldCheck,
  ChevronDown,
  Stethoscope,
  HeartPulse,
  User,
  Sparkles,
  Bot,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { getStoredAuthUser, switchRole, getRoleDashboardPath } from '../lib/supabase';

interface NavbarProps {
  onOpenSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>(getStoredAuthUser());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredAuthUser());
    };

    window.addEventListener('clinos_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('clinos_auth_changed', handleAuthChange);
    };
  }, []);

  const handleRoleSwitch = (newRole: UserRole) => {
    const updated = switchRole(newRole);
    setUser(updated);
    setRoleDropdownOpen(false);
    navigate(getRoleDashboardPath(newRole));
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'physician':
        return 'Physician Mode';
      case 'nurse':
        return 'Nurse Mode';
      case 'patient':
        return 'Patient Mode';
      default:
        return 'Admin Mode';
    }
  };

  return (
    <header
      id="navbar-header"
      className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shrink-0"
    >
      <div className="w-full h-full px-6 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & System Status */}
        <div className="flex items-center gap-3">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <span
              id="navbar-status-dot"
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] inline-block"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              System Status: <span className="text-slate-900 dark:text-white font-bold">Active</span>
            </span>
          </div>
        </div>

        {/* Right: Clin AI button, ISO Badge, Mode Pill, and Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Clin AI Quick Launch Button */}
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Clin AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
          </button>

          {/* ISO-13485 Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>ISO-13485</span>
          </div>

          {/* Role Pill Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-emerald-50/90 dark:bg-emerald-950/50 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <span>{getRoleDisplay(user.role)}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                  <span>Switch Role</span>
                  <Sparkles className="w-3 h-3 text-blue-600" />
                </div>

                <button
                  onClick={() => handleRoleSwitch('physician')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                    user.role === 'physician'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Physician (Doctor)</span>
                </button>

                <button
                  onClick={() => handleRoleSwitch('nurse')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                    user.role === 'nurse'
                      ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <HeartPulse className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Nurse (Practitioner)</span>
                </button>

                <button
                  onClick={() => handleRoleSwitch('patient')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                    user.role === 'patient'
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Patient Mode</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
              DS
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Dr. Sharma
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                Lead Physician
              </p>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

