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
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
      
      {/* Renderer Header Bar */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Final Compiled Clinical Deliverable</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">
                {outputFormat}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Validated by ClinOS Medical Critic & Care Synthesizer Agents
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center space-x-1.5 border border-slate-300 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
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
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export File</span>
          </button>
        </div>
      </div>

      {/* Non-Removable Disclaimer Banner */}
      <MedicalDisclaimerBanner compact />

      {/* Main Report Body */}
      <div className="p-6 md:p-8 bg-white overflow-x-auto text-slate-800 leading-relaxed font-sans text-sm">
        {outputFormat === 'JSON' ? (
          <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-blue-900 font-mono text-xs overflow-x-auto">
            {content}
          </pre>
        ) : (
          <div className="max-w-none space-y-4">
            {content.split('\n\n').map((paragraph, index) => {
              // Heading level 1
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-xl md:text-2xl font-extrabold text-slate-900 border-b border-slate-200 pb-3 mt-4 mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-600 inline shrink-0" />
                    <span>{paragraph.replace('# ', '')}</span>
                  </h1>
                );
              }
              // Heading level 2
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-lg font-bold text-blue-700 mt-6 mb-3 border-b border-slate-100 pb-1">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              // Heading level 3
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-base font-semibold text-slate-900 mt-5 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              // Bullet lists
              if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((line) => line.trim().startsWith('- '));
                return (
                  <ul key={index} className="space-y-1.5 my-2 pl-4 list-disc marker:text-blue-600">
                    {items.map((item, i) => (
                      <li key={i} className="text-slate-700 text-sm">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              // Disclaimer Blockquote
              if (paragraph.includes('MANDATORY CLINICAL DISCLAIMER')) {
                return (
                  <div key={index} className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs my-6 flex items-start space-x-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>{paragraph.replace('> ', '')}</div>
                  </div>
                );
              }
              return (
                <p key={index} className="text-slate-700 text-sm leading-relaxed">
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
