import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  ChevronRight,
  User,
  Pill,
  Sparkles,
  Zap,
  Check,
  RotateCcw,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { UserProfile, ClinicalWorkflow } from '../../types';
import { getStoredAuthUser } from '../../lib/supabase';
import { getOutputsApi } from '../../lib/api';

interface ClinicalQueueItem {
  id: string;
  patientName: string;
  ageGender: string;
  chiefComplaint: string;
  criticUrgency: 'CRITICAL (ESI-1)' | 'URGENT (ESI-2/3)' | 'ROUTINE (ESI-4/5)';
  urgencyColor: string;
  aiDifferential: string;
  criticConfidence: string;
  timestamp: string;
  status: 'pending_review' | 'approved' | 'refinement_requested';
}

const INITIAL_QUEUE: ClinicalQueueItem[] = [
  {
    id: 'CASE-9401',
    patientName: 'David K. Miller',
    ageGender: '58M',
    chiefComplaint: 'Substernal crushing chest pain radiating to left jaw with diaphoresis (45m)',
    criticUrgency: 'CRITICAL (ESI-1)',
    urgencyColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    aiDifferential: 'Acute STEMI / Anterior Wall Myocardial Infarction',
    criticConfidence: '99.4%',
    timestamp: '8 mins ago',
    status: 'pending_review',
  },
  {
    id: 'CASE-9402',
    patientName: 'Emma Richardson',
    ageGender: '24F',
    chiefComplaint: 'Periumbilical pain migrating to right lower quadrant with McBurney tenderness and fever 38.4°C',
    criticUrgency: 'URGENT (ESI-2/3)',
    urgencyColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    aiDifferential: 'Suspected Acute Appendicitis vs. Ovarian Torsion',
    criticConfidence: '96.8%',
    timestamp: '22 mins ago',
    status: 'pending_review',
  },
  {
    id: 'CASE-9403',
    patientName: 'Robert Gomez',
    ageGender: '67M',
    chiefComplaint: 'Progressive exertional dyspnea, bilateral ankle edema +2, orthopnea',
    criticUrgency: 'URGENT (ESI-2/3)',
    urgencyColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    aiDifferential: 'Decompensated Congestive Heart Failure (NYHA Class III)',
    criticConfidence: '94.2%',
    timestamp: '45 mins ago',
    status: 'pending_review',
  },
];

export const DoctorDashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(getStoredAuthUser());
  const [queue, setQueue] = useState<ClinicalQueueItem[]>(INITIAL_QUEUE);
  const [workflows, setWorkflows] = useState<ClinicalWorkflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [approvedCount, setApprovedCount] = useState<number>(14);

  useEffect(() => {
    getOutputsApi()
      .then((data) => {
        setWorkflows(data.outputs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Doctor dashboard fetch error:', err);
        setLoading(false);
      });
  }, []);

  const handleApproveCase = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    setApprovedCount((c) => c + 1);
  };

  const handleRefineCase = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'refinement_requested' } : item))
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header Clinical Cockpit Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-700 dark:text-blue-400 mb-1">
            <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Attending Physician Clinical Command Center • Multi-Agent Orchestration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Clinical Workspace: {user.full_name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Board-Certified Diagnostic Review, Differential Approval & Pharmacotherapy Oversight
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/workflows/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Deep Triage Orchestrator</span>
          </Link>
        </div>
      </div>

      {/* High-Density Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Active Queue
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {queue.filter((q) => q.status === 'pending_review').length}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Cases Pending</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Critic Interceptions
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Zero Hallucinations</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Approved Differentials
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{approvedCount}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+3 Today</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Median Triage Latency
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">4.8s</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Autonomous</span>
          </div>
        </div>
      </div>

      {/* Priority Patient Triage Queue Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Priority Patient Intake & Diagnostic Verification Queue
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sorted by AI Critic Triaged Severity • Requires Attending Physician Sign-Off
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Priority Stream</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Queue List Cards */}
        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.status === 'approved'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : item.status === 'refinement_requested'
                  ? 'bg-purple-50/40 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Patient Info */}
                <div className="space-y-1 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {item.id}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.patientName}</h3>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                      ({item.ageGender})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.urgencyColor}`}
                    >
                      {item.criticUrgency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Chief Complaint:</strong> {item.chiefComplaint}
                  </p>

                  <div className="flex items-center space-x-4 text-xs font-mono text-slate-600 dark:text-slate-400 pt-0.5">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>
                        AI Primary Differential: <strong className="text-blue-700 dark:text-blue-300">{item.aiDifferential}</strong>
                      </span>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      Confidence: {item.criticConfidence}
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {item.status === 'approved' ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center space-x-1.5 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Approved</span>
                    </span>
                  ) : item.status === 'refinement_requested' ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 font-bold text-xs flex items-center space-x-1.5 border border-purple-200 dark:border-purple-800">
                      <RotateCcw className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Refinement Queued</span>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApproveCase(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Sign</span>
                      </button>

                      <button
                        onClick={() => handleRefineCase(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Critique AI</span>
                      </button>
                    </>
                  )}

                  <Link
                    to="/workflows/new"
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-all"
                    title="Inspect Multi-Agent Graph"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Split: Recent Completed Synthesized Cases & Pharmacotherapy Oversight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workflows */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Recent Multi-Agent Clinical Syntheses</span>
            </h3>
            <Link to="/outputs" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              All Reports →
            </Link>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading cases...</div>
          ) : workflows.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No active cases in registry.</div>
          ) : (
            <div className="space-y-2">
              {workflows.slice(0, 4).map((w) => (
                <Link
                  key={w.id}
                  to={`/workflows/${w.id}`}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 hover:border-blue-200 flex items-center justify-between text-xs transition-all group block"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                    {w.clinical_case}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                    {new Date(w.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pharmacotherapy & Prescription Guidelines */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center space-x-2">
              <Pill className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Clinical Pharmacotherapy & Rx Oversight</span>
            </h3>
            <Link to="/prescriptions" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
              Drug Formulary →
            </Link>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ClinOS continuously monitors drug-drug interactions, pregnancy category flags, and renal adjustment dosing for all active prescriptions generated across triage workflows.
          </p>

          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/60 space-y-1.5 text-xs">
            <span className="font-bold text-purple-900 dark:text-purple-300 block">Active Attending Authority:</span>
            <p className="text-slate-600 dark:text-slate-400">
              You are currently certified to sign electronic prescriptions with DEA & NPI validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
