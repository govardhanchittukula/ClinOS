import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { ClinicalWorkflow, AgentLog, AgentRole } from '../types';
import { getSingleWorkflowApi, cancelWorkflowApi, API_BASE } from '../lib/api';
import { AgentNetworkGraph } from '../components/AgentNetworkGraph';
import { ThoughtStreamTerminal } from '../components/ThoughtStreamTerminal';
import { ClinicalOutputRenderer } from '../components/ClinicalOutputRenderer';
import { TaskMetricsCard } from '../components/TaskMetricsCard';
import { RecommendedDoctorsSection } from '../components/RecommendedDoctorsSection';
import { PrescriptionSection } from '../components/PrescriptionSection';
import { HospitalLocator } from '../components/HospitalLocator';
import { BedType } from '../types';

export const WorkflowExecutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [workflow, setWorkflow] = useState<ClinicalWorkflow | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [activeAgent, setActiveAgent] = useState<AgentRole>('planner');
  const [criticIteration, setCriticIteration] = useState<number>(1);
  const [isCriticRejected, setIsCriticRejected] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);

  // Fetch initial workflow info
  useEffect(() => {
    if (!id) return;

    getSingleWorkflowApi(id)
      .then((data) => {
        setWorkflow(data.workflow);
        if (data.logs) setLogs(data.logs);
      })
      .catch((err) => console.warn('Fetch workflow error:', err));
  }, [id]);

  // Connect to SSE Log Stream
  useEffect(() => {
    if (!id) return;

    const eventSource = new EventSource(`${API_BASE}/workflows/${id}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const logEvent: AgentLog = JSON.parse(event.data);
        if ((logEvent as any).type === 'HANDSHAKE') return;

        setLogs((prev) => {
          if (prev.some((l) => l.id === logEvent.id)) return prev;
          return [...prev, logEvent];
        });

        // Update active agent node state based on log events
        if (logEvent.agentRole) {
          setActiveAgent(logEvent.agentRole);
        }

        if (logEvent.action === 'CRITIC_REJECTED_RETRY') {
          setIsCriticRejected(true);
          if (logEvent.payload?.iteration) {
            setCriticIteration(logEvent.payload.iteration);
          }
        } else if (logEvent.action === 'CRITIC_APPROVED') {
          setIsCriticRejected(false);
        }

        if (logEvent.action === 'ORCHESTRATION_FINISHED') {
          setExecutionTimeMs(Date.now() - startTime);
          // Refresh workflow to get final output
          getSingleWorkflowApi(id).then((data) => setWorkflow(data.workflow));
        }
      } catch (err) {
        console.warn('SSE Parse error:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE Connection closed or re-connecting:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [id, startTime]);

  const handleCancelWorkflow = async () => {
    if (!id) return;
    await cancelWorkflowApi(id);
    setWorkflow((prev) => (prev ? { ...prev, status: 'failed' } : null));
  };

  if (!workflow) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Activity className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Connecting to ClinOS Agent Stream...</p>
        </div>
      </div>
    );
  }

  const isCompleted = workflow.status === 'completed' || Boolean(workflow.final_output);

  // Auto-detect bed type & urgency recommendation from case text
  const caseLower = (workflow.clinical_case || '').toLowerCase();
  let recommendedBedType: BedType = 'general';
  let urgencyLevel = 'Urgent Care Routing';

  if (
    caseLower.includes('respiratory') ||
    caseLower.includes('dyspnea') ||
    caseLower.includes('hypoxia') ||
    caseLower.includes('oxygen') ||
    caseLower.includes('asthma') ||
    caseLower.includes('pneumonia') ||
    caseLower.includes('embolism')
  ) {
    recommendedBedType = 'oxygen';
    urgencyLevel = 'Urgent Care (Oxygen Support Required)';
  } else if (
    caseLower.includes('stroke') ||
    caseLower.includes('infarction') ||
    caseLower.includes('stemi') ||
    caseLower.includes('sepsis') ||
    caseLower.includes('shock') ||
    caseLower.includes('appendicitis') ||
    caseLower.includes('cardiac') ||
    caseLower.includes('chest pain')
  ) {
    recommendedBedType = 'icu';
    urgencyLevel = 'Emergency Admission (ICU/Trauma Hold)';
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Clinical Workflow Execution</h1>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                ID: {workflow.id.slice(0, 8)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Patient Case: "{workflow.clinical_case}"
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border uppercase flex items-center space-x-1.5 ${
              workflow.status === 'running'
                ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                : workflow.status === 'completed'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                workflow.status === 'running'
                  ? 'bg-blue-500 animate-ping'
                  : workflow.status === 'completed'
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
            />
            <span>{workflow.status}</span>
          </span>
        </div>
      </div>

      {/* Analytics & Metrics Card */}
      <TaskMetricsCard
        executionTimeMs={executionTimeMs || 3200}
        criticIterations={criticIteration}
        isClinicallySafe={!isCriticRejected}
        riskLevel={isCriticRejected ? 'Critical - Retry Required' : 'Low'}
        complexity={workflow.configuration?.complexity || 'Complex'}
      />

      {/* Live Agent Network Topology Graph */}
      <AgentNetworkGraph
        activeAgent={activeAgent}
        criticIteration={criticIteration}
        isCriticRejected={isCriticRejected}
        status={workflow.status}
      />

      {/* Thought Stream Terminal */}
      <ThoughtStreamTerminal
        logs={logs}
        status={workflow.status}
        onCancel={handleCancelWorkflow}
      />

      {/* Final Compiled Report, Bed Routing, Prescriptions & Doctors */}
      {isCompleted && (
        <div className="pt-2 space-y-6">
          {workflow.final_output && (
            <ClinicalOutputRenderer
              content={workflow.final_output}
              outputFormat={workflow.configuration?.outputFormat || 'Markdown'}
              workflowId={workflow.id}
            />
          )}

          {/* Real-Time Physical Bed Tracking & 2-Hour Reservation Hold */}
          <HospitalLocator
            recommendedBedType={recommendedBedType}
            triageUrgency={urgencyLevel}
            clinicalCaseSummary={workflow.clinical_case}
            isEmbedded={true}
          />

          {/* Evidence-Based Pharmacotherapy & Prescription Regimen */}
          <PrescriptionSection
            clinicalCase={workflow.clinical_case}
          />

          {/* Specialized Doctor Referrals */}
          <RecommendedDoctorsSection
            clinicalCase={workflow.clinical_case}
          />
        </div>
      )}
    </div>
  );
};
