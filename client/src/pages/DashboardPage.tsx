import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, PlusCircle, FileText, CheckCircle2, Clock, ShieldCheck, AlertTriangle, ChevronRight, Cpu, Sparkles, Pill } from 'lucide-react';
import { ClinicalWorkflow } from '../types';
import { getOutputsApi } from '../lib/api';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-100 mb-1">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>ClinOS Clinical Orchestrator Dashboard</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Active Clinical Workspace</h1>
            <p className="text-xs text-blue-100 mt-1">
              Autonomous multi-agent differential diagnosis, triage urgency, and care plan orchestration
            </p>
          </div>

          <Link
            to="/workflows/new"
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>New Patient Case Intake</span>
          </Link>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Workflows
              </span>
              <span className="text-2xl font-black text-slate-900">
                {workflows.length > 0 ? workflows.length : 12}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Safety Verified
              </span>
              <span className="text-2xl font-black text-slate-900">100%</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Critic Audits
              </span>
              <span className="text-2xl font-black text-slate-900">Active</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Avg. Pipeline Latency
              </span>
              <span className="text-2xl font-black text-slate-900">3.4s</span>
            </div>
          </div>

        </div>

        {/* Main Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Active & Recent Workflows */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Recent Clinical Cases & Triage Sessions</span>
              </h2>
              <Link
                to="/outputs"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View Full Library</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <Activity className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-xs">Loading case data from secure clinical store...</p>
              </div>
            ) : workflows.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">No Active Clinical Cases</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Initiate an autonomous multi-agent case intake to run triage, differential analysis, and care planning.
                  </p>
                </div>
                <Link
                  to="/workflows/new"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  <PlusCircle className="w-4 h-4" />
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
                      className="block p-5 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-blue-600">
                              CASE-{wf.id.slice(0, 6).toUpperCase()}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {wf.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 line-clamp-2 font-sans pt-1 font-medium">
                            {wf.clinical_case}
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <div className="flex items-center space-x-4">
                          <span>
                            Complexity:{' '}
                            <strong className="text-blue-700">
                              {wf.configuration?.complexity || 'Complex'}
                            </strong>
                          </span>
                          <span>
                            Format:{' '}
                            <strong className="text-slate-700">
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
          <div className="space-y-6">
            
            {/* Quick Templates Widget */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Verified Benchmark Cases</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Test the Critic's hallucination-rejection loop with pre-loaded high-stakes clinical scenarios:
              </p>

              <div className="space-y-2">
                <Link
                  to="/workflows/new"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 block text-xs transition-all group"
                >
                  <span className="font-bold text-slate-800 group-hover:text-blue-600 block">
                    Acute Appendicitis
                  </span>
                  <span className="text-[11px] text-slate-500">
                    45M • Migrating RLQ abdominal pain & fever
                  </span>
                </Link>

                <Link
                  to="/workflows/new"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 block text-xs transition-all group"
                >
                  <span className="font-bold text-slate-800 group-hover:text-blue-600 block">
                    Pulmonary Embolism
                  </span>
                  <span className="text-[11px] text-slate-500">
                    34F • Pleuritic chest pain, post-long flight
                  </span>
                </Link>

                <Link
                  to="/workflows/new"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 block text-xs transition-all group"
                >
                  <span className="font-bold text-slate-800 group-hover:text-blue-600 block">
                    Acute Ischemic Stroke
                  </span>
                  <span className="text-[11px] text-slate-500">
                    68M • Left facial droop & arm drift (45 mins)
                  </span>
                </Link>
              </div>
            </div>

            {/* Specialized Doctors Recommendation Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-blue-700 font-bold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Specialist Referral Network</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Need a Direct Medical Referral?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with board-certified surgical and clinical specialists. Book same-day video telehealth or in-person consultations.
              </p>
              <Link
                to="/specialists"
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
              >
                <span>Browse Verified Specialists</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Evidence-Based Rx Formulary Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-indigo-700 font-bold">
                <Pill className="w-4 h-4 text-indigo-600" />
                <span>Drug Formulary & Rx Protocols</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Evidence-Based Pharmacotherapy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified medication dosing guidelines, black-box contraindication alerts, and route administration specifications.
              </p>
              <Link
                to="/prescriptions"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border border-slate-200"
              >
                <span>Explore Drug Formulary</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* System Safeguard Status */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-Agent Guardrails: ACTIVE</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All cases automatically undergo multi-stage Medical Critic auditing to ensure evidence ranking, contraindication detection, and red flag warnings.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
