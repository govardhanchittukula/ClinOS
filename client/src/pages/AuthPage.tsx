import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, UserCheck, Stethoscope, HeartHandshake, KeyRound, Sparkles } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { setStoredAuthUser } from '../lib/supabase';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('dr.jenkins@clinos.health');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [fullName, setFullName] = useState<string>('Dr. Sarah Jenkins, MD');
  const [role, setRole] = useState<UserRole>('physician');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      full_name: fullName || 'Dr. Sarah Jenkins, MD',
      role,
    };
    setStoredAuthUser(user);
    navigate('/dashboard');
  };

  const handleQuickDemoLogin = (selectedRole: UserRole, name: string) => {
    const demoUser: UserProfile = {
      id: `demo-${selectedRole}`,
      email: `${selectedRole}@clinos.health`,
      full_name: name,
      role: selectedRole,
    };
    setStoredAuthUser(demoUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">ClinOS Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access the Autonomous Clinical Orchestration Workspace
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setIsLogin(true)}
            className={`py-2 rounded-lg transition-all ${
              isLogin ? 'bg-slate-800 text-cyan-300 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`py-2 rounded-lg transition-all ${
              !isLogin ? 'bg-slate-800 text-cyan-300 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Full Name & Credentials</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Sarah Jenkins, MD"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Clinical Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Select Verified Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="physician">Attending Physician (MD/DO)</option>
              <option value="nurse">Triage Nurse (RN/NP)</option>
              <option value="patient">Patient / User</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all mt-2"
          >
            {isLogin ? 'Authenticate Workspace' : 'Create Clinical Account'}
          </button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold text-center mb-3 flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Instant Demo Access</span>
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('physician', 'Dr. Sarah Jenkins, MD')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left text-xs transition-all group"
            >
              <span className="font-semibold text-emerald-300 block group-hover:text-emerald-200">
                Dr. Jenkins (MD)
              </span>
              <span className="text-[10px] text-slate-400">Physician Role</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('nurse', 'Nurse Marcus Vance, RN')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left text-xs transition-all group"
            >
              <span className="font-semibold text-cyan-300 block group-hover:text-cyan-200">
                Marcus Vance (RN)
              </span>
              <span className="text-[10px] text-slate-400">Triage Nurse Role</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
