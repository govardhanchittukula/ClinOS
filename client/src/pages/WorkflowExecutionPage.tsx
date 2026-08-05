import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity, ArrowLeft, RefreshCw, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { ClinicalWorkflow, AgentLog, AgentRole } from '../types';
import { getSingleWorkflowApi, cancelWorkflowApi } from '../lib/api';
import { AgentNetworkGraph } from '../components/AgentNetworkGraph';
import { ThoughtStreamTerminal } from '../components/ThoughtStreamTerminal';
import { ClinicalOutputRenderer } from '../components/ClinicalOutputRenderer';
import { TaskMetricsCard } from '../components/TaskMetricsCard';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';

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

    const eventSource = new EventSource(`/api/workflows/${id}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const logEvent: AgentLog = JSON.parse(event.data);
        if ((logEvent as any).type === 'HANDSHAKE') return;

        setLogs((prev) => {
          // avoid duplicate logs by id
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
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Activity className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Connecting to ClinOS Agent Stream...</p>
        </div>
      </div>
    );
  }

  const isCompleted = workflow.status === 'completed' || Boolean(workflow.final_output);

  return (
    <div className="min-h-screen bg-[#0b0f19] pb-24">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">Clinical Workflow Execution</h1>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  ID: {workflow.id.slice(0, 8)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                Patient Case: "{workflow.clinical_case}"
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border uppercase flex items-center space-x-1.5 ${
                workflow.status === 'running'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                  : workflow.status === 'completed'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-rose-950 text-rose-300 border-rose-500/50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  workflow.status === 'running'
                    ? 'bg-cyan-400 animate-ping'
                    : workflow.status === 'completed'
                    ? 'bg-emerald-400'
                    : 'bg-rose-400'
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

        {/* Final Compiled Report (When Completed) */}
        {isCompleted && workflow.final_output && (
          <div className="pt-4">
            <ClinicalOutputRenderer
              content={workflow.final_output}
              outputFormat={workflow.configuration?.outputFormat || 'Markdown'}
              workflowId={workflow.id}
            />
          </div>
        )}

      </main>
    </div>
  );
};
