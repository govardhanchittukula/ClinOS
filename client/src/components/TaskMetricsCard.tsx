import React from 'react';
import { Clock, RefreshCw, ShieldCheck, Cpu, AlertTriangle } from 'lucide-react';

interface Props {
  executionTimeMs?: number;
  criticIterations: number;
  isClinicallySafe: boolean;
  riskLevel: string;
  complexity: string;
}

export const TaskMetricsCard: React.FC<Props> = ({
  executionTimeMs = 3450,
  criticIterations = 1,
  isClinicallySafe = true,
  riskLevel = 'Low',
  complexity = 'Complex',
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      
      {/* Metric 1: Execution Time */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Execution Time
          </span>
          <span className="text-sm font-bold font-mono text-slate-100">
            {(executionTimeMs / 1000).toFixed(2)}s
          </span>
        </div>
      </div>

      {/* Metric 2: Critic Iterations */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800">
          <RefreshCw className={`w-5 h-5 ${criticIterations > 1 ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Validation Cycles
          </span>
          <span className="text-sm font-bold font-mono text-cyan-300">
            {criticIterations} {criticIterations === 1 ? 'Pass' : 'Iterated'}
          </span>
        </div>
      </div>

      {/* Metric 3: Safety Guardrail Status */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
        <div
          className={`p-2.5 rounded-lg border ${
            isClinicallySafe
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
              : 'bg-rose-950/80 text-rose-400 border-rose-800'
          }`}
        >
          {isClinicallySafe ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Critic Safety Status
          </span>
          <span
            className={`text-xs font-bold ${
              isClinicallySafe ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isClinicallySafe ? 'CLINICALLY SAFE' : 'RETRY REQUIRED'}
          </span>
        </div>
      </div>

      {/* Metric 4: Protocol Complexity */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-purple-950/80 text-purple-400 border border-purple-800">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Protocol Complexity
          </span>
          <span className="text-sm font-bold font-mono text-purple-300">
            {complexity}
          </span>
        </div>
      </div>

    </div>
  );
};
