import React, { useState, useRef } from 'react';
import { Play, Sparkles, Sliders, ShieldCheck, FileCode, CheckCircle2, Stethoscope, Upload, FileText, Activity } from 'lucide-react';
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
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setClinicalCase(text);
    };
    reader.readAsText(file);
  };

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
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>Preset Patient Clinical Scenarios</span>
          </label>
          <span className="text-[11px] text-slate-500">Click to auto-populate</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {SAMPLE_CASES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setClinicalCase(sample.text)}
              className="p-3 text-left rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-800 group-hover:text-blue-600 flex items-center justify-between mb-1">
                <span>{sample.title}</span>
                <Sparkles className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">
                {sample.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Clinical Case Intake Textarea & File Upload */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label htmlFor="clinicalCase" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Unstructured Patient Clinical Notes & Symptoms
          </label>
          
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.pdf,.docx,.json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-medium transition-all"
            >
              <Upload className="w-3 h-3 text-blue-600" />
              <span>{uploadedFileName ? `Loaded: ${uploadedFileName.slice(0, 15)}...` : 'Upload Lab / Report'}</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            id="clinicalCase"
            rows={5}
            value={clinicalCase}
            onChange={(e) => setClinicalCase(e.target.value)}
            placeholder="e.g. 45-year-old male with migrating RLQ abdominal pain, fever (38.1°C), and vomiting..."
            className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all leading-relaxed"
            required
          />
        </div>
        <p className="text-[11px] text-slate-500 flex items-center space-x-1">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Supports unstructured physician dictation, EHR triage notes, or patient symptom descriptions.</span>
        </p>
      </div>

      {/* Workflow Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* Complexity Level */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Diagnostic Depth
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {(['Simple', 'Medium', 'Complex'] as ComplexityLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setComplexity(level)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  complexity === level
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Output Format
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {(['Markdown', 'JSON', 'HL7-FHIR'] as OutputFormat[]).map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => setOutputFormat(format)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  outputFormat === format
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Hallucination Critic Switch */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Medical Critic Loop
          </label>
          <div
            onClick={() => setEnableCritic(!enableCritic)}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              enableCritic
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShieldCheck className={`w-4 h-4 ${enableCritic ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="text-xs font-bold">Critic Guard</span>
            </div>
            <div
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${
                enableCritic ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  enableCritic ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isLoading || !clinicalCase.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Activity className="w-5 h-5 animate-spin" />
              <span>Initializing Autonomous Clinical Multi-Agent Board...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>Orchestrate Clinical Case Execution</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
