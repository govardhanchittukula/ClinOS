import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  PlusCircle,
  FileText,
  CheckCircle2,
  Calendar,
  Pill,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  PhoneCall,
  AlertCircle,
  Bed,
} from 'lucide-react';
import { UserProfile, ClinicalWorkflow } from '../../types';
import { getStoredAuthUser } from '../../lib/supabase';
import { getOutputsApi } from '../../lib/api';

export const PatientDashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(getStoredAuthUser());
  const [workflows, setWorkflows] = useState<ClinicalWorkflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getOutputsApi()
      .then((data) => {
        setWorkflows(data.outputs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Patient dashboard fetch error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Calming Welcome Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full w-fit">
              <Heart className="w-3.5 h-3.5 text-rose-200 fill-rose-200" />
              <span>Patient Health & Wellness Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Welcome back, {user.full_name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-50/90 leading-relaxed">
              Your personal health assistant is ready. Check your symptoms, view recovery plans, and coordinate with verified medical specialists.
            </p>
          </div>

          <Link
            to="/workflows/new"
            className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all shrink-0 group self-start md:self-center"
          >
            <PlusCircle className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform duration-300" />
            <span>Start Symptom Check</span>
          </Link>
        </div>
      </div>

      {/* 4 Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: New Triage */}
        <Link
          to="/workflows/new"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/40 hover:border-blue-300 dark:hover:border-blue-600 shadow-xs hover:shadow-sm transition-all flex items-start space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              AI Health Assessment
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Instant symptom triage & care plan.
            </p>
          </div>
        </Link>

        {/* Card 2: Hospital Bed Tracker */}
        <Link
          to="/hospitals"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 hover:border-rose-300 dark:hover:border-rose-600 shadow-xs hover:shadow-sm transition-all flex items-start space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-rose-200 dark:border-rose-800">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs mb-0.5 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex items-center space-x-1">
              <span>Emergency Beds</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Live ICU/Oxygen bed tracking & holds.
            </p>
          </div>
        </Link>

        {/* Card 3: Prescriptions */}
        <Link
          to="/prescriptions"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-600 shadow-xs hover:shadow-sm transition-all flex items-start space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-purple-200 dark:border-purple-800">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs mb-0.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Medication Guide
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Prescriptions & dosage timing.
            </p>
          </div>
        </Link>

        {/* Card 4: Find Specialists */}
        <Link
          to="/specialists"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-xs hover:shadow-sm transition-all flex items-start space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-emerald-200 dark:border-emerald-800">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs mb-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Doctor Consultations
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Verified specialists & bookings.
            </p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Care Plans & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Care Plan & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Care Plan Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Active Care & Recovery Plan</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Personalized steps based on your latest checkup</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                On Track
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <strong className="text-slate-800 dark:text-slate-200 block">Hydration & Rest Routine</strong>
                  <p className="text-slate-600 dark:text-slate-400">Drink at least 2 liters of water daily and rest with your head slightly elevated.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <strong className="text-slate-800 dark:text-slate-200 block">Medication Adherence</strong>
                  <p className="text-slate-600 dark:text-slate-400">Take prescribed pain relief with meals. Complete the entire recommended duration.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5 text-amber-950 dark:text-amber-200">
                  <strong className="text-amber-900 dark:text-amber-300 block font-bold">When to Seek Emergency Attention</strong>
                  <p className="text-amber-800 dark:text-amber-400">If you experience sudden severe pain, chest tightness, or fever above 39°C (102.2°F), visit the nearest ER immediately.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Assessments History */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Your Health Assessments</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Past AI-guided triage summaries and doctor recommendations</p>
              </div>
              <Link
                to="/outputs"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading your health history...</div>
            ) : workflows.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <FileText className="w-7 h-7 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No previous assessments found.</p>
                <Link
                  to="/workflows/new"
                  className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Start your first symptom check →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {workflows.slice(0, 3).map((w) => (
                  <Link
                    key={w.id}
                    to={`/workflows/${w.id}`}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 hover:border-blue-200 transition-all flex items-center justify-between group block"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {w.clinical_case}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(w.created_at).toLocaleDateString()} • Completed
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Helpful Contacts & Shortcuts */}
        <div className="space-y-5">
          {/* Quick Contacts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>24/7 Clinical Care Line</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Need to speak to a triage nurse or verify urgent symptoms immediately?
            </p>
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/60 text-center font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              📞 +1 (800) 555-CLIN (Toll-Free)
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Available 24 hours • Free clinical guidance
            </p>
          </div>

          {/* Quick Booking Promo */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Specialist Referrals</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              Book a Same-Day Telehealth Visit
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect directly with board-certified physicians without waiting rooms.
            </p>
            <Link
              to="/specialists"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all"
            >
              <span>Browse Available Doctors</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
