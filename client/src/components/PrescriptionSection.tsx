import React, { useState, useEffect } from 'react';
import { Pill, FileText, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Clock, Info } from 'lucide-react';
import { PrescriptionPlan } from '../types';
import { getPrescriptionPlanApi } from '../lib/api';
import { PrintableRxModal } from './PrintableRxModal';

interface PrescriptionSectionProps {
  clinicalCase: string;
  differentialDiagnoses?: string[];
  initialPlan?: PrescriptionPlan;
}

export const PrescriptionSection: React.FC<PrescriptionSectionProps> = ({
  clinicalCase,
  differentialDiagnoses = [],
  initialPlan,
}) => {
  const [plan, setPlan] = useState<PrescriptionPlan | null>(initialPlan || null);
  const [loading, setLoading] = useState<boolean>(!initialPlan);
  const [error, setError] = useState<string | null>(null);
  const [isRxModalOpen, setIsRxModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialPlan) {
      setPlan(initialPlan);
      setLoading(false);
      return;
    }

    if (!clinicalCase) return;

    let isMounted = true;
    setLoading(true);

    getPrescriptionPlanApi({ clinicalCase, differentialDiagnoses })
      .then((res) => {
        if (isMounted && res.success) {
          setPlan(res.plan);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Prescription plan fetch error:', err);
          setError('Failed to generate prescription recommendations.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [clinicalCase, JSON.stringify(differentialDiagnoses), initialPlan]);

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100" />
          <div className="space-y-1">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-64 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-100 rounded-2xl" />
          <div className="h-32 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return null;
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-700 font-bold">
            <Pill className="w-4 h-4 text-blue-600" />
            <span>AI Pharmacotherapy & Prescription Regimen</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Evidence-Based Prescription Plan
          </h3>
          <p className="text-xs text-slate-500">
            Targeting: <span className="font-semibold text-slate-700">{plan.primaryConditionTarget}</span>
          </p>
        </div>

        <button
          onClick={() => setIsRxModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all shrink-0 group"
        >
          <FileText className="w-4 h-4 text-blue-100 group-hover:scale-110 transition-transform" />
          <span>View / Export e-Prescription (Rx) Slip</span>
        </button>
      </div>

      {/* Goal Summary */}
      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start space-x-3 text-xs text-slate-700">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-blue-900 block font-semibold mb-0.5">Therapeutic Protocol:</strong>
          <p className="leading-relaxed">{plan.overallTherapeuticGoal}</p>
        </div>
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plan.prescriptions.map((rx, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              {/* Card Top: Name & Tier Badge */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {rx.medication.genericName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Brand: {rx.medication.brandNames.join(', ')}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                  rx.tier === 'First-Line Therapy'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : rx.tier === 'Second-Line / Alternative'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {rx.tier}
                </span>
              </div>

              {/* Dosage, Route, Frequency */}
              <div className="space-y-1 py-2 border-y border-slate-200/60 font-mono text-[11px] text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dosage:</span>
                  <span className="font-bold text-slate-800 text-right">{rx.dosage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Frequency:</span>
                  <span className="font-semibold text-slate-800">{rx.frequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-semibold text-blue-700">{rx.duration}</span>
                </div>
              </div>

              {/* Clinical Rationale */}
              <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                <strong className="text-slate-700">Rationale: </strong>
                {rx.clinicalRationale}
              </p>
            </div>

            {/* Warning if present */}
            {rx.criticalWarning && (
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start space-x-1.5 mt-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{rx.criticalWarning}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Safety Alerts Box */}
      {plan.safetyAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Drug Safety & Contraindication Guardrails</span>
          </div>
          <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside">
            {plan.safetyAlerts.map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Printable Rx Modal */}
      <PrintableRxModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        plan={plan}
        patientCase={clinicalCase}
      />

    </div>
  );
};
