import React, { useState } from 'react';
import { Play, Sparkles, Sliders, ShieldCheck, FileCode, CheckCircle2, Stethoscope } from 'lucide-react';
import { WorkflowConfiguration, ComplexityLevel, OutputFormat } from '../types';

interface Props {
  onSubmit: (data: {
    clinicalCase: string;
    complexity: ComplexityLevel;
    enableCritic: boolean;
    outputFormat: OutputFormat;
    temperature: number;
  }) => void;
  isLoading?: boolean;
}

const SAMPLE_CASES = [
  {
    title: 'Acute RLQ Abdominal Pain (Possible Appendicitis)',
    text: '45-year-old male presents with severe persistent right lower quadrant abdominal pain for 18 hours. Pain initially started as vague periumbilical discomfort then localized to McBurney point. Associated with low-grade fever (38.1°C), nausea, 2 episodes of non-bilious vomiting, and anorexia. Pulse 98 bpm, BP 128/82 mmHg. History of treated hypertension.',
  },
  {
    title: 'Atypical Chest Pain & Exertional Dyspnea',
    text: '58-year-old female with type-2 diabetes and hyperlipidemia reports onset of substernal chest tightness radiating to left scapula occurring during moderate yard work. Accompanied by diaphoresis and shortness of breath. Symptoms partially resolved after 20 minutes rest. BP 144/90, HR 88, SpO2 97% on room air. No prior cardiac history.',
  },
  {
    title: 'Acute Severe Headache & Photophobia',
    text: '32-year-old female with no prior medical history presents to urgent care with sudden onset "worst headache of life" 4 hours ago. Pain is diffuse, throbbing, rated 9/10, accompanied by mild neck stiffness, light sensitivity, and nausea. Afebrile. Neurological exam reveals intact cranial nerves without focal deficits.',
  },
];

export const WorkflowConfigForm: React.FC<Props> = ({ onSubmit, isLoading = false }) => {
  const [clinicalCase, setClinicalCase] = useState<string>(SAMPLE_CASES[0].text);
  const [complexity, setComplexity] = useState<ComplexityLevel>('Complex');
  const [enableCritic, setEnableCritic] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('Markdown');
  const [temperature, setTemperature] = useState<number>(0.1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalCase.trim() || clinicalCase.length < 10) return;
    onSubmit({
      clinicalCase,
      complexity,
      enableCritic,
      outputFormat,
      temperature,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Sample Preset Case Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preset Patient Clinical Scenarios</span>
          </label>
          <span className="text-[11px] text-slate-400">Click to auto-populate</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SAMPLE_CASES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setClinicalCase(sample.text)}
              className="p-3 text-left rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-cyan-300 flex items-center justify-between mb-1">
                <span>{sample.title}</span>
                <Sparkles className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
                {sample.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Clinical Case Intake Textarea */}
      <div className="space-y-2">
        <label htmlFor="clinicalCase" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Patient Symptoms, Vitals & Medical History <span className="text-rose-400">*</span>
        </label>
        <textarea
          id="clinicalCase"
          rows={6}
          value={clinicalCase}
          onChange={(e) => setClinicalCase(e.target.value)}
          placeholder="Enter chief complaint, vital signs (BP, HR, SpO2, Temp), symptom timeline, physical examination findings, and past medical history..."
          className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm p-4 text-slate-100 placeholder:text-slate-500 font-mono leading-relaxed transition-all"
          required
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Minimum 10 characters required. Treated as confidential PHI simulation.</span>
          <span className="font-mono">{clinicalCase.length} / 3000 chars</span>
        </div>
      </div>

      {/* Multi-Agent Orchestration Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        
        {/* Case Complexity */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Case Complexity Protocol</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Routine', 'Complex', 'Deep Dive'] as ComplexityLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setComplexity(level)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  complexity === level
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            {complexity === 'Routine' && 'Standard 1-2 evaluation cycles.'}
            {complexity === 'Complex' && 'Multi-system 3-5 iteration reasoning & cross-checks.'}
            {complexity === 'Deep Dive' && 'Exhaustive differential search with deep risk scoring.'}
          </p>
        </div>

        {/* Clinical Strictness Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Clinical Temperature ({temperature.toFixed(2)})
            </label>
            <span className="text-[10px] font-mono text-cyan-400">
              {temperature === 0 ? 'Strict Guideline' : 'Broader Differential'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.4"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer h-2"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0.0 (Strictly Conservative)</span>
            <span>0.4 (Exploratory)</span>
          </div>
        </div>

        {/* Medical Critic Toggle */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Self-Correcting Critic Guardrail</span>
          </label>
          <div
            onClick={() => setEnableCritic(!enableCritic)}
            className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
              enableCritic
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center space-x-2.5 text-xs">
              <CheckCircle2 className={`w-4 h-4 ${enableCritic ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div>
                <span className="font-semibold block">Medical Critic Interceptor</span>
                <span className="text-[11px] opacity-80">Catches missed red flags & forces auto-retries</span>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
              {enableCritic ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>Output Format</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Markdown', 'JSON'] as OutputFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setOutputFormat(fmt)}
                className={`py-2.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                  outputFormat === fmt
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            {outputFormat === 'Markdown' ? 'Formatted clinical triage assessment report.' : 'Structured machine-readable JSON schema.'}
          </p>
        </div>

      </div>

      {/* Submit CTA Button */}
      <button
        type="submit"
        disabled={isLoading || clinicalCase.length < 10}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 group"
      >
        <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
        <span>{isLoading ? 'Initializing Clinical State Machine...' : 'Launch Autonomous Multi-Agent Pipeline'}</span>
      </button>

    </form>
  );
};
