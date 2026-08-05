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
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
            Execution Time
          </span>
          <span className="text-sm font-bold font-mono text-slate-900">
            {(executionTimeMs / 1000).toFixed(2)}s
          </span>
        </div>
      </div>

      {/* Metric 2: Critic Iterations */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
          <RefreshCw className={`w-5 h-5 ${criticIterations > 1 ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
            Validation Cycles
          </span>
          <span className="text-sm font-bold font-mono text-teal-700">
            {criticIterations} {criticIterations === 1 ? 'Pass' : 'Iterated'}
          </span>
        </div>
      </div>

      {/* Metric 3: Safety Guardrail Status */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
        <div
          className={`p-2.5 rounded-lg border ${
            isClinicallySafe
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
        >
          {isClinicallySafe ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
            Critic Safety Status
          </span>
          <span
            className={`text-xs font-bold ${
              isClinicallySafe ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isClinicallySafe ? 'CLINICALLY SAFE' : 'RETRY REQUIRED'}
          </span>
        </div>
      </div>

      {/* Metric 4: Protocol Complexity */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
            Protocol Complexity
          </span>
          <span className="text-sm font-bold font-mono text-purple-700">
            {complexity}
          </span>
        </div>
      </div>

    </div>
  );
};
