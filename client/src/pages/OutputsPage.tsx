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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 mb-1">
              <FileText className="w-4 h-4" />
              <span>Secure Clinical Deliverable Library</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Compiled Clinical Outputs</h1>
            <p className="text-xs text-slate-600 mt-1">
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
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:outline-none text-xs text-slate-800 placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Loading clinical report library...
          </div>
        ) : filteredOutputs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No matching clinical outputs found.</p>
            <p className="text-xs text-slate-500">Run a new clinical workflow to generate exportable reports.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOutputs.map((wf) => (
              <div
                key={wf.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      ID: {wf.id.slice(0, 8)}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(wf.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {wf.clinical_case}
                  </h3>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      Format: {wf.configuration?.outputFormat || 'Markdown'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Critic Verified</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedWorkflow(wf)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Quick Preview Report</span>
                  </button>

                  <Link
                    to={`/workflows/${wf.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all border border-slate-200"
                  >
                    View Execution
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Quick Preview */}
        {selectedWorkflow && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Report Preview: {selectedWorkflow.id}
                </span>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  Close
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <ClinicalOutputRenderer
                  content={selectedWorkflow.final_output || '# No output generated yet'}
                  outputFormat={selectedWorkflow.configuration?.outputFormat || 'Markdown'}
                  workflowId={selectedWorkflow.id}
                />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
