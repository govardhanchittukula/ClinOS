import React, { useRef } from 'react';
import { X, Printer, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Pill } from 'lucide-react';
import { PrescriptionPlan } from '../types';

interface PrintableRxModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PrescriptionPlan;
  patientCase?: string;
}

export const PrintableRxModal: React.FC<PrintableRxModalProps> = ({
  isOpen,
  onClose,
  plan,
  patientCase,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              Rx
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Clinical e-Prescription Slip</h3>
              <p className="text-[11px] text-slate-500 font-mono">Reference: {plan.rxIdentifier}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div ref={printRef} className="p-8 bg-white space-y-6 text-slate-900 print:p-0">
          
          {/* Institutional Clinic Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                ✚
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900">ClinOS ACUTE CARE HEALTH SYSTEM</h1>
                <p className="text-xs text-slate-600 font-medium">Division of Clinical Decision Support & Telepharmacology</p>
                <p className="text-[11px] text-slate-500">750 Medical Plaza, Suite 400 • Clinical Hotline: +1 (800) 555-CLIN</p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-slate-700 space-y-0.5">
              <p className="font-bold text-blue-700">DEA / NPI: 948291048</p>
              <p>Rx ID: <span className="font-bold text-slate-900">{plan.rxIdentifier}</span></p>
              <p>Date: {new Date(plan.generatedDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Patient Details Subheader */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Patient Encounter</span>
              <span className="font-bold text-slate-800">Verified Clinical Intake</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Target Indication</span>
              <span className="font-bold text-blue-700">{plan.primaryConditionTarget}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Allergies / Flags</span>
              <span className="font-bold text-emerald-700">NKDA (Screened for Sensitivities)</span>
            </div>
          </div>

          {/* Rx Medication Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-black tracking-wider text-slate-800 uppercase font-mono flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Prescribed Medications (Rx)</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {plan.prescriptions.length} Item(s) Prescribed
              </span>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {plan.prescriptions.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-slate-900 font-serif">
                          ℞ {idx + 1}. {item.medication.genericName}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({item.medication.brandNames.join(', ')})
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {item.tier}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        Sig: {item.dosage} — {item.route} — {item.frequency} for {item.duration}
                      </p>
                    </div>

                    <div className="text-right text-xs font-mono shrink-0">
                      <span className="font-bold text-slate-900 block">Qty: {item.dispenseQuantity}</span>
                      <span className="text-slate-500 text-[11px]">Refills: {item.refillsAllowed}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-700">Clinical Rationale:</strong> {item.clinicalRationale}
                  </p>

                  {item.criticalWarning && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item.criticalWarning}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Alerts and Patient Counseling */}
          {plan.safetyAlerts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Critical Safety Alerts & Contraindications</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside">
                {plan.safetyAlerts.map((alert, i) => (
                  <li key={i}>{alert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Lifestyle and Dietary Instructions */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
            <span className="text-xs font-bold text-blue-900 block">Pharmacist & Patient Instructions:</span>
            <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
              {plan.dietaryAndLifestyleInstructions.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
          </div>

          {/* Physician Co-Signature & Pharmacy Barcode */}
          <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                Authorized Attending Physician Signature
              </div>
              <div className="border-b border-slate-400 pb-1 pt-4">
                <span className="font-serif italic text-base text-blue-950 font-bold">
                  Dr. Julian Hayes, MD, FACS / ClinOS Attending
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Lic #: NY-7849201</span>
                <span>Dispense as Written [DAW-0]</span>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end justify-center space-y-1">
              <div className="font-mono text-[11px] tracking-widest bg-slate-100 px-3 py-1 rounded border border-slate-200 font-bold text-slate-800">
                |||||| | |||| ||||| |||| || ||||||
              </div>
              <span className="text-[10px] font-mono text-slate-400">{plan.rxIdentifier}</span>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
            <p>{plan.mandatoryPhysicianDisclaimer}</p>
          </div>

        </div>

      </div>
    </div>
  );
};
