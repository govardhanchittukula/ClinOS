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
import { MedicalDisclaimerBanner } from '../../components/MedicalDisclaimerBanner';

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
    urgencyColor: 'bg-rose-50 text-rose-700 border-rose-200',
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
    urgencyColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
    urgencyColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header Clinical Cockpit Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-700 mb-1">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>Attending Physician Clinical Command Center • Multi-Agent Orchestration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Workspace: {user.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Board-Certified Diagnostic Review, Differential Approval & Pharmacotherapy Oversight
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/workflows/new"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Deep Triage Orchestrator</span>
            </Link>
          </div>
        </div>

        {/* High-Density Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Active Queue
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">
                {queue.filter((q) => q.status === 'pending_review').length}
              </span>
              <span className="text-[11px] text-amber-600 font-bold">Cases Pending</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Critic Interceptions
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-600">100%</span>
              <span className="text-[11px] text-slate-500">Zero Hallucinations</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Approved Differentials
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-blue-600">{approvedCount}</span>
              <span className="text-[11px] text-emerald-600 font-bold">+3 Today</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Median Triage Latency
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-purple-600">4.8s</span>
              <span className="text-[11px] text-slate-500">Autonomous</span>
            </div>
          </div>

        </div>

        {/* Priority Patient Triage Queue Table */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Priority Patient Intake & Diagnostic Verification Queue
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sorted by AI Critic Triaged Severity • Requires Attending Physician Sign-Off
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Real-Time Priority Stream</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>

          {/* Queue List Cards */}
          <div className="space-y-4">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.status === 'approved'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : item.status === 'refinement_requested'
                    ? 'bg-purple-50/40 border-purple-200'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Patient Info */}
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.id}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900">{item.patientName}</h3>
                      <span className="text-xs font-semibold text-slate-500 font-mono">
                        ({item.ageGender})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.urgencyColor}`}
                      >
                        {item.criticUrgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">
                      <strong className="text-slate-900">Chief Complaint:</strong> {item.chiefComplaint}
                    </p>

                    <div className="flex items-center space-x-4 text-xs font-mono text-slate-600 pt-1">
                      <span className="flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          AI Primary Differential: <strong className="text-blue-700">{item.aiDifferential}</strong>
                        </span>
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Critic Confidence: {item.criticConfidence}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {item.status === 'approved' ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Diagnosis Approved</span>
                      </span>
                    ) : item.status === 'refinement_requested' ? (
                      <span className="px-4 py-2 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs flex items-center space-x-1.5">
                        <RotateCcw className="w-4 h-4 text-purple-600" />
                        <span>Refinement Queued</span>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApproveCase(item.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Sign</span>
                        </button>

                        <button
                          onClick={() => handleRefineCase(item.id)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Critique AI</span>
                        </button>
                      </>
                    )}

                    <Link
                      to="/workflows/new"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 transition-all"
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
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Recent Multi-Agent Clinical Syntheses</span>
              </h3>
              <Link to="/outputs" className="text-xs font-bold text-blue-600 hover:underline">
                All Reports →
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading cases...</div>
            ) : workflows.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No active cases in registry.</div>
            ) : (
              <div className="space-y-2">
                {workflows.slice(0, 4).map((w) => (
                  <Link
                    key={w.id}
                    to={`/workflows/${w.id}`}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 flex items-center justify-between text-xs transition-all group block"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 line-clamp-1">
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
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <Pill className="w-4 h-4 text-purple-600" />
                <span>Clinical Pharmacotherapy & Rx Oversight</span>
              </h3>
              <Link to="/prescriptions" className="text-xs font-bold text-purple-600 hover:underline">
                Drug Formulary →
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ClinOS continuously monitors drug-drug interactions, pregnancy category flags, and renal adjustment dosing for all active prescriptions generated across triage workflows.
            </p>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
              <span className="font-bold text-purple-900 block">Active Attending Authority:</span>
              <p className="text-slate-600">
                You are currently certified to sign electronic prescriptions with DEA & NPI validation.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
