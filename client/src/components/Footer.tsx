import React from 'react';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070b14] border-t border-slate-850 py-8 px-4 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="font-bold text-slate-200 text-sm">ClinOS Multi-Agent Clinical Platform</p>
            <p className="text-[11px] text-slate-500">Autonomous Reasoning • Gemini 2.5 Flash Engine • ISO-13485 Boundary</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-slate-400 text-xs">
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Not Medical Advice — Clinical Support Only</span>
          </span>
          <span className="font-mono text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300">
            Engine: @google/genai SDK
          </span>
        </div>

      </div>
    </footer>
  );
};
