import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  ClipboardList,
  User,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';
import {
  DEMO_CREDENTIALS,
  getRoleDashboardPath,
  loginWithSupabaseOrFallback,
  isSupabaseClientConfigured,
} from '../lib/supabase';
import { BrandLogo } from '../components/BrandLogo';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('dr.sharma@clinos.demo');
  const [password, setPassword] = useState<string>('Hackathon2026!');
  const [fullName, setFullName] = useState<string>('Dr. Sharma (Lead Physician)');
  const [role, setRole] = useState<UserRole>('physician');
  const [loadingRole, setLoadingRole] = useState<UserRole | 'standard' | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'info' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStandardAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRole('standard');

    try {
      const result = await loginWithSupabaseOrFallback(email, password, role, fullName);
      if (result.fromSupabase) {
        showToast('success', `Authenticated via Supabase as ${result.user.full_name}`);
      } else {
        showToast('info', `Active in Fast Hackathon Demo Mode as ${result.user.full_name}`);
      }
      setTimeout(() => {
        navigate(getRoleDashboardPath(result.user.role));
      }, 400);
    } catch (err: any) {
      showToast('error', 'Authentication failed. Please verify credentials.');
    } finally {
      setLoadingRole(null);
    }
  };

  const handleOneClickDemoLogin = async (targetRole: 'physician' | 'nurse' | 'patient') => {
    const creds = DEMO_CREDENTIALS[targetRole];
    setEmail(creds.email);
    setPassword(creds.password);
    setFullName(creds.full_name);
    setRole(creds.role);
    setLoadingRole(targetRole);

    try {
      const result = await loginWithSupabaseOrFallback(
        creds.email,
        creds.password,
        creds.role,
        creds.full_name
      );

      if (result.fromSupabase) {
        showToast('success', `Connected to Supabase! Welcome, ${creds.full_name}`);
      } else {
        showToast('info', `⚡ Instant Demo Mode: Welcome, ${creds.full_name}`);
      }

      setTimeout(() => {
        navigate(getRoleDashboardPath(targetRole));
      }, 500);
    } catch (err) {
      showToast('error', 'Demo session launch failed.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-slate-100 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Micro Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl border shadow-2xl flex items-center space-x-3 text-xs font-semibold backdrop-blur-xl ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-blue-950/90 border-blue-500/50 text-blue-200'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg relative z-10 my-8">
        
        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-3">
              <BrandLogo size="md" showText={false} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>ClinOS</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 font-mono text-sm uppercase px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30">
                RBAC Core
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Autonomous Multi-Agent Clinical Decision Workspace
            </p>
          </div>

          {/* Quick Demo Login Hero Banner (Hackathon Cheat Code) */}
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-teal-950/60 border border-blue-500/30 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-blue-200 tracking-wide uppercase flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>One-Click Demo Mode</span>
                </span>
              </div>
              <span className="text-[10px] font-mono font-medium text-slate-400 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700">
                Hackathon Ready
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
              Instant login for live judging & jury walkthroughs. Click any persona to launch their tailored workspace:
            </p>

            {/* 3 Interactive One-Click Demo Buttons */}
            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Doctor / Physician Demo Button */}
              <button
                type="button"
                onClick={() => handleOneClickDemoLogin('physician')}
                disabled={loadingRole !== null}
                className={`w-full group text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  loadingRole === 'physician'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white'
                    : 'bg-slate-800/60 hover:bg-emerald-950/40 border-slate-700/80 hover:border-emerald-500/60 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Dr. Sharma
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Lead Physician
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">dr.sharma@clinos.demo</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                  {loadingRole === 'physician' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <span className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity text-[11px]">
                      <span>Login</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </button>

              {/* Nurse / Practitioner Demo Button */}
              <button
                type="button"
                onClick={() => handleOneClickDemoLogin('nurse')}
                disabled={loadingRole !== null}
                className={`w-full group text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  loadingRole === 'nurse'
                    ? 'bg-teal-950/80 border-teal-500 text-white'
                    : 'bg-slate-800/60 hover:bg-teal-950/40 border-slate-700/80 hover:border-teal-500/60 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform shrink-0">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                        Nurse Priya
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Intake Specialist
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">intake@clinos.demo</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-teal-400 font-medium">
                  {loadingRole === 'nurse' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  ) : (
                    <span className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity text-[11px]">
                      <span>Login</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </button>

              {/* Patient Demo Button */}
              <button
                type="button"
                onClick={() => handleOneClickDemoLogin('patient')}
                disabled={loadingRole !== null}
                className={`w-full group text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  loadingRole === 'patient'
                    ? 'bg-blue-950/80 border-blue-500 text-white'
                    : 'bg-slate-800/60 hover:bg-blue-950/40 border-slate-700/80 hover:border-blue-500/60 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        Lokesh Yadhav
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Patient
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">lokesh@clinos.demo</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-blue-400 font-medium">
                  {loadingRole === 'patient' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  ) : (
                    <span className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity text-[11px]">
                      <span>Login</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </button>

            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-widest font-mono">
              Or Custom Credentials
            </span>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-2 rounded-lg transition-all ${
                isLogin
                  ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-2 rounded-lg transition-all ${
                !isLogin
                  ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Account
            </button>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleStandardAuth} className="space-y-4">
            
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Full Name & Title</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Jane Carter, MD"
                  className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Clinical Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@clinos.demo"
                className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Clinical Role (RBAC Target)</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="physician">Attending Physician (Doctor)</option>
                <option value="nurse">Triage Nurse (Practitioner)</option>
                <option value="patient">Patient / Care Recipient</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loadingRole !== null}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 mt-3 disabled:opacity-50"
            >
              {loadingRole === 'standard' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Authenticate Workspace' : 'Create Clinical Profile'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Security Footnote */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>HIPAA Compliant RBAC</span>
            </span>
            <span className="font-mono text-[10px]">
              {isSupabaseClientConfigured ? '🟢 Supabase Cloud' : '🔵 Fast Local Engine'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
