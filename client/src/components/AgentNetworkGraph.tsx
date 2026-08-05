import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, ShieldCheck, FileCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AgentRole } from '../types';

interface Props {
  activeAgent: AgentRole;
  criticIteration?: number;
  isCriticRejected?: boolean;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface NodeDef {
  role: AgentRole;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeColor: string;
}

const AGENT_NODES: NodeDef[] = [
  {
    role: 'planner',
    title: 'Triage Planner',
    subtitle: 'Decomposes case & symptoms',
    icon: Brain,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    activeColor: 'bg-blue-100 border-blue-500 text-blue-800 ring-2 ring-blue-400/40 shadow-md',
  },
  {
    role: 'researcher',
    title: 'Clinical Researcher',
    subtitle: 'Ranks differential & red flags',
    icon: Search,
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    activeColor: 'bg-teal-100 border-teal-500 text-teal-800 ring-2 ring-teal-400/40 shadow-md',
  },
  {
    role: 'critic',
    title: 'Medical Critic',
    subtitle: 'Audits safety & forces retries',
    icon: ShieldCheck,
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    activeColor: 'bg-amber-100 border-amber-500 text-amber-800 ring-2 ring-amber-400/40 shadow-md',
  },
  {
    role: 'synthesizer',
    title: 'Care Synthesizer',
    subtitle: 'Compiles final report',
    icon: FileCheck,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    activeColor: 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/40 shadow-md',
  },
];

export const AgentNetworkGraph: React.FC<Props> = ({
  activeAgent,
  criticIteration = 1,
  isCriticRejected = false,
  status,
}) => {
  return (
    <div className="w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
      
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span>Autonomous Agent Execution Topology</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time state machine routing control between specialized clinical AI agents
          </p>
        </div>

        {/* Iteration Badge */}
        {criticIteration > 1 && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-mono font-bold animate-bounce">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span>Critic Self-Correcting Loop (Iteration {criticIteration})</span>
          </div>
        )}
      </div>

      {/* Nodes Connection Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        {AGENT_NODES.map((node, index) => {
          const Icon = node.icon;
          const isActive = activeAgent === node.role && status === 'running';
          const isDone =
            status === 'completed' ||
            (activeAgent === 'researcher' && index === 0) ||
            (activeAgent === 'critic' && index <= 1) ||
            (activeAgent === 'synthesizer' && index <= 2);

          return (
            <motion.div
              key={node.role}
              initial={false}
              animate={{
                scale: isActive ? 1.03 : 1,
              }}
              className={`p-4 rounded-xl border transition-all relative ${
                isActive
                  ? node.activeColor
                  : isDone
                  ? 'bg-slate-50 border-slate-300 text-slate-800 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200 text-slate-400'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-sm'
                      : isDone
                      ? 'bg-white text-emerald-600 border border-slate-200'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {isDone && !isActive && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}

                {isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold animate-pulse">
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h4 className="font-bold text-xs text-slate-900 mb-1">{node.title}</h4>
              <p className="text-[11px] text-slate-600 leading-snug">{node.subtitle}</p>

              {/* Rejected Feedback indicator on Critic */}
              {node.role === 'critic' && isCriticRejected && (
                <div className="mt-2 text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center space-x-1">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>HALLUCINATION REJECTED</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
