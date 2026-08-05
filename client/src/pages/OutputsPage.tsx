import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Download, ExternalLink, Calendar, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { ClinicalWorkflow } from '../types';
import { getOutputsApi } from '../lib/api';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import { ClinicalOutputRenderer } from '../components/ClinicalOutputRenderer';

export const OutputsPage: React.FC = () => {
  const [outputs, setOutputs] = useState<ClinicalWorkflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<ClinicalWorkflow | null>(null);

  useEffect(() => {
    getOutputsApi()
      .then((data) => {
        setOutputs(data.outputs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Fetch outputs error:', err);
        setLoading(false);
      });
  }, []);

  const filteredOutputs = outputs.filter((w) =>
    w.clinical_case.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0f19] pb-24">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
              <FileText className="w-4 h-4" />
              <span>Secure Clinical Deliverable Library</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Compiled Clinical Outputs</h1>
            <p className="text-xs text-slate-400 mt-1">
              Archived autonomous multi-agent triage assessments, differential diagnoses, and care plans
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports or symptoms..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Loading clinical report library...
          </div>
        ) : filteredOutputs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No matching clinical outputs found.</p>
            <p className="text-xs text-slate-500">Run a new clinical workflow to generate exportable reports.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOutputs.map((wf) => (
              <div
                key={wf.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      ID: {wf.id.slice(0, 8)}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{new Date(wf.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                    {wf.clinical_case}
                  </h3>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      Format: {wf.configuration?.outputFormat || 'Markdown'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      Complexity: {wf.configuration?.complexity || 'Complex'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedWorkflow(wf)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Report</span>
                  </button>

                  <Link
                    to={`/workflows/${wf.id}`}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                  >
                    <span>View Stream</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Renderer for Selected Report */}
        {selectedWorkflow && selectedWorkflow.final_output && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b0f19] border border-slate-700 shadow-2xl relative p-2">
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="absolute top-4 right-4 z-20 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700"
              >
                Close (ESC)
              </button>

              <ClinicalOutputRenderer
                content={selectedWorkflow.final_output}
                outputFormat={selectedWorkflow.configuration?.outputFormat || 'Markdown'}
                workflowId={selectedWorkflow.id}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
