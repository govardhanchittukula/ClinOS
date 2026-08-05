import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Filter, Copy, Check, ChevronRight, ChevronDown, Activity, RefreshCw } from 'lucide-react';
import { AgentLog, AgentRole } from '../types';

interface Props {
  logs: AgentLog[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  onCancel?: () => void;
}

export const ThoughtStreamTerminal: React.FC<Props> = ({ logs, status, onCancel }) => {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new logs arrive
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    if (filterRole === 'all') return true;
    return log.agentRole === filterRole;
  });

  const getAgentBadge = (role: AgentRole) => {
    switch (role) {
      case 'planner':
        return { label: 'PLANNER', bg: 'bg-blue-950/80 text-blue-300 border-blue-800' };
      case 'researcher':
        return { label: 'RESEARCHER', bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' };
      case 'critic':
        return { label: 'MEDICAL CRITIC', bg: 'bg-amber-950/80 text-amber-300 border-amber-800' };
      case 'synthesizer':
        return { label: 'SYNTHESIZER', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' };
      case 'system':
      default:
        return { label: 'SYSTEM ENGINE', bg: 'bg-purple-950/80 text-purple-300 border-purple-800' };
    }
  };

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${new Date(l.timestamp).toLocaleTimeString()}] [${l.agentRole.toUpperCase()}] ${l.action}: ${JSON.stringify(l.payload)}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-[#070b14] dark:bg-slate-950 border border-slate-700 dark:border-slate-800 shadow-2xl overflow-hidden font-mono text-xs transition-colors duration-300">
      
      {/* Terminal Top Bar */}
      <div className="px-4 py-3 bg-slate-900 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center space-x-2 text-slate-300 font-semibold text-xs border-l border-slate-700 pl-3">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Agent Thought Stream Terminal (SSE Live)</span>
          </div>
        </div>

        {/* Filter & Actions */}
        <div className="flex items-center space-x-2">
          
          {/* Role Filter Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none text-[11px]"
            >
              <option value="all">All Agents</option>
              <option value="planner">Planner</option>
              <option value="researcher">Researcher</option>
              <option value="critic">Medical Critic</option>
              <option value="synthesizer">Synthesizer</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Copy Logs Button */}
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-[11px] flex items-center space-x-1"
            title="Copy Raw Thought Stream Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Cancel Running Execution Button */}
          {status === 'running' && onCancel && (
            <button
              onClick={onCancel}
              className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-semibold transition-all flex items-center space-x-1"
            >
              <Activity className="w-3 h-3 animate-spin text-rose-400" />
              <span>Halt Workflow</span>
            </button>
          )}

        </div>
      </div>

      {/* Terminal Thought Body */}
      <div className="p-4 h-[420px] overflow-y-auto space-y-3 bg-[#070b14] leading-relaxed">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic">
            {status === 'pending'
              ? 'Connecting to ClinOS SSE Thought Stream...'
              : 'No thought logs recorded for selected filter.'}
          </div>
        ) : (
          filteredLogs.map((log) => {
            const badge = getAgentBadge(log.agentRole);
            const isExpanded = expandedLogId === log.id;
            const timeStr = new Date(log.timestamp).toLocaleTimeString();

            return (
              <div
                key={log.id}
                className="group p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 border border-slate-850 hover:border-slate-750 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-slate-500 text-[10px]">{timeStr}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-slate-200 font-semibold">{log.action}</span>
                  </div>

                  <button
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center space-x-0.5 ml-2"
                  >
                    <span>{isExpanded ? 'Collapse' : 'Inspect'}</span>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                </div>

                {/* Primary Message Preview */}
                {log.payload?.message && (
                  <p className="text-slate-300 mt-1.5 text-[11px] leading-relaxed font-sans">
                    {log.payload.message}
                  </p>
                )}

                {/* Highlighted Critic Rejection Feedback */}
                {log.action === 'CRITIC_REJECTED_RETRY' && (
                  <div className="mt-2 p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-200 text-[11px] font-sans">
                    <strong>⚠️ Critic Audit Rejection:</strong> {log.payload.feedback}
                  </div>
                )}

                {/* Expandable JSON Payload Inspection */}
                {isExpanded && (
                  <pre className="mt-2 p-3 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 overflow-x-auto">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                )}
              </div>
            );
          })
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer Status Bar */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'running'
                ? 'bg-cyan-400 animate-ping'
                : status === 'completed'
                ? 'bg-emerald-400'
                : 'bg-slate-600'
            }`}
          />
          <span className="capitalize">Status: <strong>{status}</strong></span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          Stream Protocol: Server-Sent Events (SSE)
        </span>
      </div>

    </div>
  );
};
