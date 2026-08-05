import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { getStoredAuthUser, getRoleDashboardPath } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(getStoredAuthUser());
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredAuthUser());
    };
    window.addEventListener('clinos_auth_changed', handleAuthChange);
    return () => window.removeEventListener('clinos_auth_changed', handleAuthChange);
  }, []);

  // 1. If not authenticated, send to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 2. If accessing root /dashboard, dynamically redirect to role-specific dashboard
  if (location.pathname === '/dashboard') {
    const targetPath = getRoleDashboardPath(user.role);
    return <Navigate to={targetPath} replace />;
  }

  // 3. Check role access
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const fallbackPath = getRoleDashboardPath(user.role);

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
          
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
              RBAC Security Intercept
            </span>
            <h2 className="text-xl font-black text-slate-900">Access Denied</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your active role (<strong className="capitalize text-slate-900 font-bold">{user.role}</strong>) does not have authorization to view this clinical console.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Current User:</span>
              <span className="font-bold text-slate-800">{user.full_name}</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Required Roles:</span>
              <span className="font-bold text-blue-700 capitalize">{allowedRoles.join(', ')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Navigate to={fallbackPath} replace />
            <a
              href={fallbackPath}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <span>Return to Authorized Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    );
  }

  return <>{children}</>;
};
