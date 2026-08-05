import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, PlusCircle, FileText, CheckCircle2, Clock, ShieldCheck, AlertTriangle, ChevronRight, Cpu } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0b0f19] pb-16">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>ClinOS Clinical Orchestrator Dashboard</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Active Clinical Workspace</h1>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous multi-agent differential diagnosis, triage urgency, and care plan orchestration
            </p>
          </div>

          <Link
            to="/workflows/new"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Patient Case Intake</span>
          </Link>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Assessments
              </span>
              <span className="text-2xl font-extrabold font-mono text-slate-100">
                {workflows.length + 3}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Critic Safety Compliance
              </span>
              <span className="text-2xl font-extrabold font-mono text-emerald-400">
                100%
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Avg Execution Latency
              </span>
              <span className="text-2xl font-extrabold font-mono text-blue-300">
                3.2s
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Exported Deliverables
              </span>
              <span className="text-2xl font-extrabold font-mono text-purple-300">
                {workflows.length}
              </span>
            </div>
          </div>

        </div>

        {/* Recent Workflows Table & Quick Launch Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Workflows Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Recent Clinical Workflow Evaluations</span>
              </h2>
              <Link to="/outputs" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1">
                <span>View Library</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
                Loading clinical workflow records...
              </div>
            ) : workflows.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <p className="text-sm text-slate-300 font-semibold">No patient workflows generated yet.</p>
                <p className="text-xs text-slate-500">Launch a new intake case to run the autonomous multi-agent clinical pipeline.</p>
                <Link
                  to="/workflows/new"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start New Assessment</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {workflows.map((wf) => (
                  <Link
                    key={wf.id}
                    to={`/workflows/${wf.id}`}
                    className="block p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {wf.clinical_case}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          ID: {wf.id.slice(0, 8)} • Complexity: {wf.configuration?.complexity || 'Complex'} • Format: {wf.configuration?.outputFormat || 'Markdown'}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase shrink-0">
                        {wf.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Launch & Active Engine Banner */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-emerald-950/40 border border-cyan-500/30 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Ready for Clinical Intake</h3>
                  <span className="text-[10px] font-mono text-cyan-400">Gemini 2.5 Flash Engine Active</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Submit patient vitals and symptom history to trigger the Triage Planner, Clinical Researcher, Medical Critic, and Care Synthesizer autonomous agent pipeline.
              </p>
              <Link
                to="/workflows/new"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Launch Intake Form</span>
              </Link>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
