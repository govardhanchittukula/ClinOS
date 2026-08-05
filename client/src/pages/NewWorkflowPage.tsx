import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ShieldAlert, Sparkles } from 'lucide-react';
import { WorkflowConfigForm } from '../components/WorkflowConfigForm';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
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
    <div className="min-h-screen bg-[#0b0f19] pb-20">
      <MedicalDisclaimerBanner />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Clinical Intake Protocol</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">New Patient Case Intake</h1>
          <p className="text-xs text-slate-400 mt-1">
            Input unstructured clinical notes, vital signs, or symptoms to trigger the autonomous multi-agent reasoning board.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Configuration Form */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
          <WorkflowConfigForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>

      </main>
    </div>
  );
};
