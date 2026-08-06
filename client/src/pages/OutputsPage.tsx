import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { ClinicalWorkflow } from '../types';
import { getOutputsApi } from '../lib/api';
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 dark:text-blue-400 mb-1">
            <FileText className="w-4 h-4" />
            <span>Secure Clinical Deliverable Library</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Compiled Clinical Outputs</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
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
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-xs"
          />
        </div>
      </div>

      {/* Content Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          Loading clinical report library...
        </div>
      ) : filteredOutputs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No matching clinical outputs found.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Run a new clinical workflow to generate exportable reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOutputs.map((wf) => (
            <div
              key={wf.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    ID: {wf.id.slice(0, 8)}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(wf.created_at).toLocaleDateString()}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {wf.clinical_case}
                </h3>

                <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    Format: {wf.configuration?.outputFormat || 'Markdown'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Critic Verified</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedWorkflow(wf)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Quick Preview Report</span>
                </button>

                <Link
                  to={`/workflows/${wf.id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Report Preview: {selectedWorkflow.id}
              </span>
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedWorkflow.final_output ? (
                <ClinicalOutputRenderer
                  content={selectedWorkflow.final_output}
                  outputFormat={selectedWorkflow.configuration?.outputFormat || 'Markdown'}
                  workflowId={selectedWorkflow.id}
                />
              ) : (
                <p className="text-xs text-slate-500">No deliverable generated for this workflow.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
