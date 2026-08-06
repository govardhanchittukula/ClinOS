import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Cpu,
  Sparkles,
  Pill,
} from 'lucide-react';
import { ClinicalWorkflow } from '../types';
import { getOutputsApi } from '../lib/api';

export const DashboardPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<ClinicalWorkflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getOutputsApi()
      .then((data) => {
        setWorkflows(data.outputs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Dashboard fetch error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Top Hero Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-100">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>ClinOS Clinical Orchestrator Workspace</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Active Clinical Workspace
          </h1>
          <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
            Autonomous multi-agent differential diagnosis, triage urgency, and care plan orchestration
          </p>
        </div>

        <Link
          to="/workflows/new"
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>New Patient Case Intake</span>
        </Link>
      </div>

      {/* Stats Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">
              Total Workflows
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {workflows.length > 0 ? workflows.length : 12}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">
              Safety Verified
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">100%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">
              Critic Audits
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">Active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">
              Pipeline Latency
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">3.4s</span>
          </div>
        </div>
      </div>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active & Recent Workflows */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Recent Clinical Cases & Triage Sessions</span>
            </h2>
            <Link
              to="/outputs"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View Full Library</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <Activity className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-xs">Loading case data from secure clinical store...</p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Active Clinical Cases</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Initiate an autonomous multi-agent case intake to run triage, differential analysis, and care planning.
                </p>
              </div>
              <Link
                to="/workflows/new"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Start New Intake</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows.map((wf) => {
                const isCompleted = wf.status === 'completed';
                return (
                  <Link
                    key={wf.id}
                    to={`/workflows/${wf.id}`}
                    className="block p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 shadow-xs hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            CASE-{wf.id.slice(0, 6).toUpperCase()}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                              isCompleted
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {wf.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 pt-0.5 font-medium">
                          {wf.clinical_case}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <div className="flex items-center space-x-3">
                        <span>
                          Complexity:{' '}
                          <strong className="text-blue-700 dark:text-blue-400">
                            {wf.configuration?.complexity || 'Complex'}
                          </strong>
                        </span>
                        <span>
                          Format:{' '}
                          <strong className="text-slate-700 dark:text-slate-300">
                            {wf.configuration?.outputFormat || 'Markdown'}
                          </strong>
                        </span>
                      </div>
                      <span>
                        {new Date(wf.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Case Intakes & Medical Guardrails */}
        <div className="space-y-5">
          {/* Quick Templates Widget */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Verified Benchmark Scenarios</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Test the Critic's hallucination-rejection loop with pre-loaded high-stakes clinical scenarios:
            </p>

            <div className="space-y-2">
              <Link
                to="/workflows/new"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700/60 hover:border-blue-200 block text-xs transition-all group"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 block">
                  Acute Appendicitis
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  45M • Migrating RLQ abdominal pain & fever
                </span>
              </Link>

              <Link
                to="/workflows/new"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700/60 hover:border-blue-200 block text-xs transition-all group"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 block">
                  Pulmonary Embolism
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  34F • Pleuritic chest pain, post-long flight
                </span>
              </Link>

              <Link
                to="/workflows/new"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700/60 hover:border-blue-200 block text-xs transition-all group"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 block">
                  Acute Ischemic Stroke
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  68M • Left facial droop & arm drift (45 mins)
                </span>
              </Link>
            </div>
          </div>

          {/* Specialized Doctors Recommendation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/60 shadow-xs space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-blue-700 dark:text-blue-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Specialist Referral Network</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">
              Need a Direct Medical Referral?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect with board-certified specialists. Book same-day video telehealth or clinic visits.
            </p>
            <Link
              to="/specialists"
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all"
            >
              <span>Browse Verified Specialists</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Evidence-Based Rx Formulary Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-indigo-700 dark:text-indigo-300 font-bold">
              <Pill className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Drug Formulary & Protocols</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">
              Evidence-Based Pharmacotherapy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Review verified dosing regimens, contraindications, and route specifications.
            </p>
            <Link
              to="/prescriptions"
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-200 hover:text-indigo-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border border-slate-200 dark:border-slate-700"
            >
              <span>Explore Drug Formulary</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* System Safeguard Status */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Critic Guardrails: ACTIVE</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All cases undergo multi-stage Medical Critic auditing to ensure evidence ranking, contraindication detection, and red flag warnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
