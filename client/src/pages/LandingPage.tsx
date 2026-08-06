import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  LayoutDashboard,
  Brain,
  Stethoscope,
  ShieldCheck,
  ClipboardList,
  Bed,
  Users,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import anime from 'animejs';

export const LandingPage: React.FC = () => {
  const graphicRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Orbiting particles or gentle pulsing
    const pulseAnim = anime({
      targets: '.orbital-node',
      scale: [1, 1.04],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 2400,
      delay: anime.stagger(300),
    });

    // Pedestal glow animation
    const glowAnim = anime({
      targets: '#center-pedestal-glow',
      opacity: [0.4, 0.8],
      scale: [0.95, 1.05],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
      duration: 3000,
    });

    return () => {
      anime.remove('.orbital-node');
      anime.remove('#center-pedestal-glow');
    };
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 px-6 sm:px-8 py-8 flex flex-col space-y-8">
      {/* 1. HERO SECTION (2-Column Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline & Primary CTAs */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Intelligent Care.
              <br />
              <span className="text-slate-900 dark:text-white">Better Outcomes.</span>
            </h1>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            ClinOS orchestrates specialized AI agents to analyze symptoms, perform differential diagnostics, and generate production-grade triage care plans.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/workflows/new"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Case Intake</span>
            </Link>

            <Link
              to="/dashboard"
              className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200/90 dark:border-slate-800 shadow-xs transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Go to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Pedestal Orbital Graphic */}
        <div ref={graphicRef} className="lg:col-span-6 flex items-center justify-center relative py-6">
          {/* Subtle Ambient Radial Glow */}
          <div
            id="center-pedestal-glow"
            className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-400/20 via-teal-300/20 to-blue-500/20 blur-3xl pointer-events-none"
          />

          <div className="relative w-full max-w-[460px] h-[340px] flex items-center justify-center select-none">
            {/* SVG Elliptical Orbital Tracks & Connecting Dashes */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 460 340"
              fill="none"
            >
              {/* Outer Orbit Track */}
              <ellipse
                cx="230"
                cy="170"
                rx="195"
                ry="115"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="dark:stroke-slate-700 opacity-60"
              />
              {/* Inner Orbit Track */}
              <ellipse
                cx="230"
                cy="170"
                rx="135"
                ry="80"
                stroke="#e2e8f0"
                strokeWidth="1.5"
                className="dark:stroke-slate-800 opacity-80"
              />

              {/* Connecting Dashed Ray Lines to 4 Nodes */}
              {/* Top Node */}
              <line x1="230" y1="140" x2="230" y2="48" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Right Node */}
              <line x1="260" y1="170" x2="385" y2="170" stroke="#86efac" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Bottom Node */}
              <line x1="230" y1="200" x2="230" y2="292" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Left Node */}
              <line x1="200" y1="170" x2="75" y2="170" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            {/* Central 3D Floating Pedestal Platform */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Shadow underneath */}
              <div className="w-24 h-6 rounded-full bg-slate-400/20 dark:bg-slate-900/60 blur-md translate-y-10" />

              {/* 3D Isometric / Glossy Cube Core */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-500/10 flex items-center justify-center relative p-3">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 p-0.5 shadow-inner">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20" strokeOpacity="0.25" />
                      <path d="M3 12h3.5l1.5-4 3.5 9 2.5-7 1.5 3.5H21" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Orbit Node 1: TOP - AI Agents */}
            <div className="orbital-node absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <span className="mt-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800 shadow-xs">
                AI Agents
              </span>
            </div>

            {/* Orbit Node 2: RIGHT - Diagnosis */}
            <div className="orbital-node absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="mt-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800 shadow-xs">
                Diagnosis
              </span>
            </div>

            {/* Orbit Node 3: BOTTOM - Safety */}
            <div className="orbital-node absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-md shadow-teal-500/10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="mt-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800 shadow-xs">
                Safety
              </span>
            </div>

            {/* Orbit Node 4: LEFT - Care Plans */}
            <div className="orbital-node absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <span className="mt-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800 shadow-xs">
                Care Plans
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRICS ROW (4 Cards) */}
      <section ref={metricsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Cases Processed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Cases Processed</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">1,284</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <span>↑ 12.5% this week</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Beds Available */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Bed className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Beds Available</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">342</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <span>↑ 8.2% this week</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Active Specialists */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Specialists</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">156</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <span>↑ 5.1% this week</span>
            </p>
          </div>
        </div>

        {/* Metric 4: Safety Score */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Safety Score</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">98.7%</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              Excellent
            </p>
          </div>
        </div>
      </section>

      {/* 3. BOTTOM SECTION (Quick Actions & Recent Activity) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Action 1: New Case Intake */}
              <Link
                to="/workflows/new"
                className="bg-slate-50/70 dark:bg-slate-800/50 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 rounded-xl p-4 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  New Case Intake
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                  Start patient assessment
                </p>
              </Link>

              {/* Action 2: Search Hospitals */}
              <Link
                to="/hospitals"
                className="bg-slate-50/70 dark:bg-slate-800/50 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 rounded-xl p-4 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Search Hospitals
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                  Find beds & resources
                </p>
              </Link>

              {/* Action 3: Find Specialists */}
              <Link
                to="/specialists"
                className="bg-slate-50/70 dark:bg-slate-800/50 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 rounded-xl p-4 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Find Specialists
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                  Connect with experts
                </p>
              </Link>

              {/* Action 4: View Outputs */}
              <Link
                to="/outputs"
                className="bg-slate-50/70 dark:bg-slate-800/50 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 rounded-xl p-4 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  View Outputs
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                  Clinical reports & plans
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <Link
                to="/workflows"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {/* Activity Item 1 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      Case #C-2024-1284
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Completed • 2 min ago
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold shrink-0">
                  High Priority
                </span>
              </div>

              {/* Activity Item 2 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      Case #C-2024-1283
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      In Progress • 15 min ago
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-semibold shrink-0">
                  Medium
                </span>
              </div>

              {/* Activity Item 3 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      Case #C-2024-1282
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Completed • 1 hour ago
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold shrink-0">
                  High Priority
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER SAFETY BANNER */}
      <footer className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-100/80 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
              Clinical Safety First
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              All AI outputs are generated for licensed practitioner evaluation. Not Medical Advice — Always Consult a Qualified Physician.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('ClinOS is an ISO-13485 compliant clinical decision support system designed to assist licensed medical professionals.')}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Learn More</span>
        </button>
      </footer>
    </div>
  );
};

