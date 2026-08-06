import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ShieldAlert } from 'lucide-react';
import { WorkflowConfigForm } from '../components/WorkflowConfigForm';
import { createWorkflowApi } from '../lib/api';
import { getStoredAuthUser } from '../lib/supabase';
import { ComplexityLevel, OutputFormat } from '../types';

export const NewWorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = async (formData: {
    clinicalCase: string;
    complexity: ComplexityLevel;
    enableCritic: boolean;
    outputFormat: OutputFormat;
    temperature: number;
  }) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const user = getStoredAuthUser();
      const response = await createWorkflowApi({
        ...formData,
        userId: user.id,
      });

      if (response.success && response.workflowId) {
        navigate(`/workflows/${response.workflowId}`);
      } else {
        throw new Error('Failed to obtain workflow session ID.');
      }
    } catch (err: any) {
      console.error('Case submission error:', err);
      setErrorMsg(err.message || 'An error occurred while initializing clinical agent workflow.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 dark:text-blue-400 mb-1 font-bold">
          <Stethoscope className="w-4 h-4" />
          <span>Clinical Intake Protocol</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">New Patient Case Intake</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          Input unstructured clinical notes, vital signs, or symptoms to trigger the autonomous multi-agent reasoning board.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Configuration Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <WorkflowConfigForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};
