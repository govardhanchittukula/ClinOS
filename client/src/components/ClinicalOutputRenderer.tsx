import React, { useState } from 'react';
import { Copy, Check, Download, FileText, ShieldAlert, Sparkles } from 'lucide-react';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';

interface Props {
  content: string;
  outputFormat?: 'Markdown' | 'JSON';
  workflowId?: string;
}

export const ClinicalOutputRenderer: React.FC<Props> = ({
  content,
  outputFormat = 'Markdown',
  workflowId = 'clinos-report',
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = outputFormat === 'JSON' ? 'json' : 'md';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ClinOS_Triage_Report_${workflowId.slice(0, 8)}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Renderer Header Bar */}
      <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>Final Compiled Clinical Deliverable</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {outputFormat}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Validated by ClinOS Medical Critic & Care Synthesizer Agents
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center space-x-1.5 border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export File</span>
          </button>
        </div>
      </div>

      {/* Non-Removable Disclaimer Banner */}
      <MedicalDisclaimerBanner compact />

      {/* Main Report Body */}
      <div className="p-6 md:p-8 bg-[#0b0f19] overflow-x-auto text-slate-200 leading-relaxed font-sans text-sm">
        {outputFormat === 'JSON' ? (
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-cyan-300 font-mono text-xs overflow-x-auto">
            {content}
          </pre>
        ) : (
          <div className="prose prose-invert max-w-none space-y-4">
            {content.split('\n\n').map((paragraph, index) => {
              // Heading level 1
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-xl md:text-2xl font-extrabold text-white border-b border-slate-800 pb-3 mt-4 mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cyan-400 inline shrink-0" />
                    <span>{paragraph.replace('# ', '')}</span>
                  </h1>
                );
              }
              // Heading level 2
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-lg font-bold text-cyan-300 mt-6 mb-3 border-b border-slate-800/60 pb-1">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              // Heading level 3
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-base font-semibold text-slate-100 mt-5 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              // Bullet lists
              if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((line) => line.trim().startsWith('- '));
                return (
                  <ul key={index} className="space-y-1.5 my-2 pl-4 list-disc marker:text-cyan-400">
                    {items.map((item, i) => (
                      <li key={i} className="text-slate-300 text-sm">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              // Disclaimer Blockquote
              if (paragraph.includes('MANDATORY CLINICAL DISCLAIMER')) {
                return (
                  <div key={index} className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs my-6 flex items-start space-x-3">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>{paragraph.replace('> ', '')}</div>
                  </div>
                );
              }
              return (
                <p key={index} className="text-slate-300 text-sm leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
