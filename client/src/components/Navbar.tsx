import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Cpu,
  FileText,
  PlusCircle,
  Shield,
  User,
  LogOut,
  Stethoscope,
  Pill,
  HeartPulse,
  ChevronDown,
  Bed,
  Sparkles,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { getStoredAuthUser, clearStoredAuthUser, switchRole, getRoleDashboardPath } from '../lib/supabase';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>(getStoredAuthUser());
  const [systemOnline, setSystemOnline] = useState<boolean>(true);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    // Ping healthcheck
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setSystemOnline(data.status === 'healthy'))
      .catch(() => setSystemOnline(false));

    const handleAuthChange = () => {
      setUser(getStoredAuthUser());
    };
    window.addEventListener('clinos_auth_changed', handleAuthChange);
    return () => window.removeEventListener('clinos_auth_changed', handleAuthChange);
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

  const handleRoleSwitch = (newRole: UserRole) => {
    const updated = switchRole(newRole);
    setUser(updated);
    setRoleDropdownOpen(false);
    navigate(getRoleDashboardPath(newRole));
  };

  const currentDashboardPath = getRoleDashboardPath(user.role);

  const navLinks = [
    { path: currentDashboardPath, label: 'Dashboard', icon: Cpu, matchPrefix: '/dashboard' },
    { path: '/workflows/new', label: 'New Case Intake', icon: PlusCircle },
    { path: '/examinations', label: 'Examinations', icon: Stethoscope },
    { path: '/hospitals', label: 'Hospital Beds', icon: Bed },
    { path: '/specialists', label: 'Specialists', icon: Stethoscope },
    { path: '/prescriptions', label: 'Prescriptions', icon: Pill },
    { path: '/outputs', label: 'Clinical Outputs', icon: FileText },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'physician':
        return {
          label: 'Attending Physician',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: Stethoscope,
        };
      case 'nurse':
        return {
          label: 'Triage Nurse',
          color: 'bg-teal-50 text-teal-800 border-teal-200',
          icon: HeartPulse,
        };
      case 'patient':
        return {
          label: 'Patient User',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: User,
        };
      default:
        return {
          label: 'Administrator',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: Shield,
        };
    }
  };

  const badgeInfo = getRoleBadge(user.role);
  const BadgeIcon = badgeInfo.icon;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="hover:opacity-95 transition-opacity">
          <BrandLogo size="md" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.matchPrefix
              ? location.pathname.startsWith(link.matchPrefix)
              : location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Badge, Role Switcher & Auth User Info */}
        <div className="flex items-center space-x-3">
          
          {/* Health Status Indicator */}
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                systemOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-600 font-mono text-[11px]">
              Engine: <strong className="text-slate-900 font-semibold">{systemOnline ? 'ACTIVE' : 'DEGRADED'}</strong>
            </span>
          </div>

          {/* Quick RBAC Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-sm ${badgeInfo.color}`}
              title="Click to Switch User Role"
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{user.role}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-100 mb-1 flex items-center justify-between">
                  <span>Switch Role (RBAC)</span>
                  <Sparkles className="w-3 h-3 text-blue-600" />
                </div>

                <button
                  onClick={() => handleRoleSwitch('physician')}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all ${
                    user.role === 'physician'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="block font-bold">Doctor (Physician)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Diagnostic Approval Queue</span>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSwitch('nurse')}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all ${
                    user.role === 'nurse'
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <HeartPulse className="w-4 h-4 text-teal-600" />
                  <div>
                    <span className="block font-bold">Nurse (Practitioner)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Rapid Vitals Intake Stream</span>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSwitch('patient')}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all ${
                    user.role === 'patient'
                      ? 'bg-blue-50 text-blue-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="block font-bold">Patient (Consumer)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Health check & Care plans</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Logout */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="text-right hidden lg:block">
                <p className="text-xs font-bold text-slate-800">{user.full_name}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20"
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

