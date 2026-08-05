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
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300',
    activeColor: 'bg-blue-500/20 border-blue-400 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.4)]',
  },
  {
    role: 'researcher',
    title: 'Clinical Researcher',
    subtitle: 'Ranks differential & red flags',
    icon: Search,
    color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300',
    activeColor: 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
  },
  {
    role: 'critic',
    title: 'Medical Critic',
    subtitle: 'Audits safety & forces retries',
    icon: ShieldCheck,
    color: 'from-amber-500/20 to-rose-500/20 border-amber-500/40 text-amber-300',
    activeColor: 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
  },
  {
    role: 'synthesizer',
    title: 'Care Synthesizer',
    subtitle: 'Compiles final report',
    icon: FileCheck,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    activeColor: 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
  },
];

export const AgentNetworkGraph: React.FC<Props> = ({
  activeAgent,
  criticIteration = 1,
  isCriticRejected = false,
  status,
}) => {
  return (
    <div className="w-full p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
      
      {/* Background Cybernetic Grid Subtle Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Autonomous Agent Execution Topology</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time state machine routing control between specialized clinical AI agents
          </p>
        </div>

        {/* Iteration Badge */}
        {criticIteration > 1 && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono animate-bounce">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Self-Correcting Loop (Iteration {criticIteration})</span>
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
            <React.Fragment key={node.role}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border transition-all duration-300 relative ${
                  isActive
                    ? node.activeColor
                    : isDone
                    ? 'bg-slate-950/80 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-850 text-slate-500'
                }`}
              >
                {/* Active Glowing Pulse Ring */}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -inset-0.5 rounded-xl border border-cyan-400/50 pointer-events-none"
                  />
                )}

                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-slate-900' : 'bg-slate-900/60'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 animate-spin-slow' : 'text-slate-400'}`} />
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {isActive ? (
                      <span className="text-cyan-400 animate-pulse">ACTIVE</span>
                    ) : isDone ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-2.5 h-2.5 inline" />
                        <span>DONE</span>
                      </span>
                    ) : (
                      <span>IDLE</span>
                    )}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-100">{node.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{node.subtitle}</p>

                {/* Critic Rejection Warning Indicator */}
                {node.role === 'critic' && isCriticRejected && (
                  <div className="mt-2 text-[10px] font-mono text-rose-300 bg-rose-950/60 border border-rose-800 p-1.5 rounded flex items-center space-x-1">
                    <RefreshCw className="w-3 h-3 animate-spin shrink-0 text-rose-400" />
                    <span>Red-flag retry triggered!</span>
                  </div>
                )}
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
};
