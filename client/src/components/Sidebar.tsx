import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Stethoscope,
  Bed,
  Users,
  Pill,
  FileText,
  LogOut,
  X,
} from 'lucide-react';
import anime from 'animejs';
import { slideInFromLeft, killAnime } from '../utils/animation';
import { BrandLogo } from './BrandLogo';
import {
  getStoredAuthUser,
  clearStoredAuthUser,
  getRoleDashboardPath,
} from '../lib/supabase';
import { UserProfile } from '../types';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredAuthUser());

  useEffect(() => {
    // Sidebar entry animation
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const anim = slideInFromLeft('#sidebar', { duration: 600, easing: 'easeOutCubic' });
      return () => killAnime(anim);
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getStoredAuthUser());
    };
    window.addEventListener('clinos_auth_changed', handleAuthChange);
    return () => window.removeEventListener('clinos_auth_changed', handleAuthChange);
  }, []);

  const handleLogout = () => {
    clearStoredAuthUser();
    navigate('/auth');
    if (onClose) onClose();
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: getRoleDashboardPath(currentUser.role), icon: LayoutDashboard },
    { name: 'New Case Intake', path: '/workflows/new', icon: Stethoscope },
    { name: 'Examinations', path: '/examinations', icon: Stethoscope },
    { name: 'Hospital Beds', path: '/hospitals', icon: Bed },
    { name: 'Specialists', path: '/specialists', icon: Users },
    { name: 'Prescriptions', path: '/prescriptions', icon: Pill },
    { name: 'Clinical Outputs', path: '/outputs', icon: FileText },
  ];

  const sidebarContent = (
    <aside id="sidebar" className="w-[280px] h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between select-none shrink-0 shadow-xs">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between">
          <NavLink to="/" onClick={onClose} className="focus:outline-none">
            <BrandLogo size="md" />
          </NavLink>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="px-4 py-2 space-y-1.5 overflow-y-auto max-h-[calc(100vh-320px)]">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isHome = item.path === '/';
            const isActive = isHome
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50/90 text-blue-600 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {/* Account Info */}
        <div className="px-2">
          <p className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            ACCOUNT
          </p>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Dr. Sharma
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-normal truncate">
                Lead Physician
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/40 shrink-0" />
          </div>
        </div>

        {/* System Status Card */}
        <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl p-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              System Status
            </span>
          </div>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            All Systems Operational
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Updated just now
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-3 rounded-xl border border-slate-200/90 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex-1 flex max-w-[280px] w-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

