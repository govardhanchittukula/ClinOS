import React, { useEffect, useState } from 'react';
import { Pill, Search, Filter, ShieldCheck, AlertTriangle, BookOpen, ChevronRight, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { FormularyMedication } from '../types';
import { getFormularyApi } from '../lib/api';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';

const DRUG_CLASSES = [
  'All',
  'Antibiotic / Antimicrobial',
  'Analgesic & Antipyretic',
  'Cardiovascular & Antihypertensive',
  'Antiemetic & Gastrointestinal',
  'Respiratory & Bronchodilator',
  'Anticoagulant & Antiplatelet',
  'Corticosteroid & Anti-inflammatory',
];

export const PrescriptionsPage: React.FC = () => {
  const [medications, setMedications] = useState<FormularyMedication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMed, setSelectedMed] = useState<FormularyMedication | null>(null);

  useEffect(() => {
    setLoading(true);
    getFormularyApi({
      drugClass: selectedClass,
      search: searchQuery || undefined,
    })
      .then((res) => {
        setMedications(res.formulary || []);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load formulary:', err);
        setLoading(false);
      });
  }, [selectedClass, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 mb-1">
              <Pill className="w-4 h-4" />
              <span>Evidence-Based Clinical Formulary & Rx Protocols</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Prescription & Medication Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Search verified prescription regimens, standard clinical dosing, route specifications, black-box contraindications, and patient counseling protocols.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-2 text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FDA / Clinical Evidence Validated</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by generic name, brand, indication, or symptom (e.g. Appendicitis, Zofran, Chest Pain)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none text-xs text-slate-900 placeholder:text-slate-400 shadow-inner"
              />
            </div>

          </div>

          {/* Drug Class Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {DRUG_CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedClass === cls
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Formulary Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            Loading clinical formulary database...
          </div>
        ) : medications.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
            <Pill className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No matching medications found.</p>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or drug category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map((med) => (
              <div
                key={med.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group shadow-sm"
              >
                <div>
                  {/* Top Bar: Drug Class Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono truncate">
                      {med.drugClass}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Pregnancy Cat: {med.pregnancyCategory}
                    </span>
                  </div>

                  {/* Generic & Brand Name */}
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {med.genericName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    Brand: <span className="text-slate-700">{med.brandNames.join(', ')}</span>
                  </p>

                  {/* Standard Dosage & Route */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <p className="font-bold text-slate-800">
                      <span className="text-slate-400 font-normal text-[11px]">Dose: </span>
                      {med.standardDosage}
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      <span className="text-slate-400 font-normal">Route: </span>
                      <strong className="text-blue-700">{med.route}</strong> • {med.frequency}
                    </p>
                  </div>

                  {/* Indications Tags */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Key Clinical Indications
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {med.indications.slice(0, 3).map((ind, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          {ind}
                        </span>
                      ))}
                      {med.indications.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{med.indications.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedMed(med)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>Full Clinical Monograph</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10px] font-mono text-slate-400">
                    {med.requiresPrescription ? 'Rx Only' : 'OTC / Clinician Directed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Monograph Detail Modal */}
        {selectedMed && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    Clinical Drug Monograph
                  </span>
                  <h2 className="text-xl font-black text-slate-900">{selectedMed.genericName}</h2>
                  <p className="text-xs text-slate-500">Brands: {selectedMed.brandNames.join(', ')}</p>
                </div>

                <button
                  onClick={() => setSelectedMed(null)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Close
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
                
                {/* Dosing Specs */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <h4 className="font-bold text-blue-900 text-xs uppercase font-mono">Dosing & Administration</h4>
                  <p><strong>Standard Dosage:</strong> {selectedMed.standardDosage}</p>
                  <p><strong>Administration Route:</strong> {selectedMed.route}</p>
                  <p><strong>Frequency:</strong> {selectedMed.frequency}</p>
                  <p><strong>Typical Course Duration:</strong> {selectedMed.typicalDuration}</p>
                </div>

                {/* Contraindications */}
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2 text-rose-950">
                  <div className="flex items-center space-x-1.5 font-bold text-rose-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Contraindications & Black Box Precautions</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedMed.contraindications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Side Effects */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase font-mono">Common Adverse Reactions</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedMed.sideEffects.join(' • ')}</p>
                </div>

                {/* Patient Counseling */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase font-mono">Patient Counseling Points</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedMed.counselingInstructions}</p>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};
