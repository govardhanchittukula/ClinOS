import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Pill,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  PhoneCall,
  Activity,
  AlertCircle,
  Building2,
  Bed,
} from 'lucide-react';
import { UserProfile, ClinicalWorkflow } from '../../types';
import { getStoredAuthUser } from '../../lib/supabase';
import { getOutputsApi } from '../../lib/api';
import { MedicalDisclaimerBanner } from '../../components/MedicalDisclaimerBanner';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Calming Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                <Heart className="w-3.5 h-3.5 text-rose-200 fill-rose-200" />
                <span>Patient Health & Wellness Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {user.full_name.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-blue-50/90 leading-relaxed">
                Your personal health assistant is ready. Check your symptoms, view recovery plans, and coordinate with verified medical specialists.
              </p>
            </div>

            <Link
              to="/workflows/new"
              className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md transition-all shrink-0 group"
            >
              <PlusCircle className="w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform duration-300" />
              <span>Start New Symptom Check</span>
            </Link>
          </div>
        </div>

        {/* 4 Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: New Triage */}
          <Link
            to="/workflows/new"
            className="p-5 rounded-3xl bg-white border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs mb-0.5 group-hover:text-blue-600 transition-colors">
                AI Health Assessment
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Instant symptom triage & care plan.
              </p>
            </div>
          </Link>

          {/* Card 2: Hospital Bed Tracker */}
          <Link
            to="/hospitals"
            className="p-5 rounded-3xl bg-white border border-red-100 hover:border-red-300 shadow-sm hover:shadow-md transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs mb-0.5 group-hover:text-red-600 transition-colors flex items-center space-x-1">
                <span>Emergency Beds</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Live ICU/Oxygen bed tracking & 2h holds.
              </p>
            </div>
          </Link>

          {/* Card 3: Prescriptions */}
          <Link
            to="/prescriptions"
            className="p-5 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs mb-0.5 group-hover:text-purple-600 transition-colors">
                Medication Guide
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Prescriptions & dosage timing.
              </p>
            </div>
          </Link>

          {/* Card 4: Find Specialists */}
          <Link
            to="/specialists"
            className="p-5 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs mb-0.5 group-hover:text-emerald-600 transition-colors">
                Doctor Consultations
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Verified specialists & bookings.
              </p>
            </div>
          </Link>

        </div>

        {/* Main Grid: Care Plans & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Active Care Plan & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Care Plan Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Your Active Care & Recovery Plan</h2>
                    <p className="text-xs text-slate-500">Personalized steps based on your latest checkup</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  On Track
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <strong className="text-slate-800 block">Hydration & Rest Routine</strong>
                    <p className="text-slate-600">Drink at least 2 liters of water daily and rest with your head slightly elevated.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <strong className="text-slate-800 block">Medication Adherence</strong>
                    <p className="text-slate-600">Take prescribed pain relief with meals. Complete the entire recommended duration.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5 text-amber-950">
                    <strong className="text-amber-900 block font-bold">When to Seek Immediate Medical Attention</strong>
                    <p className="text-amber-800">If you experience sudden severe abdominal pain, shortness of breath, or high fever above 39°C (102.2°F), visit the nearest emergency room immediately.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Assessments History */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Your Recent Health Assessments</h3>
                  <p className="text-xs text-slate-500">Past AI-guided triage summaries and doctor recommendations</p>
                </div>
                <Link
                  to="/outputs"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading your health history...</div>
              ) : workflows.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">No previous assessments found.</p>
                  <Link
                    to="/workflows/new"
                    className="inline-block text-xs font-bold text-blue-600 hover:underline"
                  >
                    Start your first symptom check →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {workflows.slice(0, 3).map((w) => (
                    <Link
                      key={w.id}
                      to={`/workflows/${w.id}`}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between group block"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {w.clinical_case}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {new Date(w.created_at).toLocaleDateString()} • Status: Completed
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar: Helpful Contacts & Shortcuts */}
          <div className="space-y-6">
            
            {/* Quick Contacts */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                <span>24/7 Clinical Care Line</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need to speak to a triage nurse or verify urgent symptoms immediately?
              </p>
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-center font-mono text-xs font-bold text-blue-700">
                📞 +1 (800) 555-CLIN (Toll-Free)
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Available 24 hours • Free clinical guidance
              </p>
            </div>

            {/* Quick Booking Promo */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-800 font-bold">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Specialist Referrals</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Book a Same-Day Telehealth Visit
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with board-certified physicians without waiting rooms.
              </p>
              <Link
                to="/specialists"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
              >
                <span>Browse Available Doctors</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
