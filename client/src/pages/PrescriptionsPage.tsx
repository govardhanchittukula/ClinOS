import React, { useEffect, useState } from 'react';
import { Pill, Search, Filter, ShieldCheck, AlertTriangle, ChevronRight } from 'lucide-react';
import { FormularyMedication } from '../types';
import { getFormularyApi } from '../lib/api';

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 dark:text-blue-400 mb-1">
            <Pill className="w-4 h-4" />
            <span>Evidence-Based Clinical Formulary & Rx Protocols</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Prescription & Medication Guide
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
            Search verified prescription regimens, standard clinical dosing, route specifications, black-box contraindications, and patient counseling protocols.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>FDA / Clinical Evidence Validated</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by generic name, brand, indication, or symptom (e.g. Appendicitis, Zofran, Chest Pain)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Drug Class Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {DRUG_CLASSES.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all text-xs ${
                selectedClass === cls
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Formulary Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          Loading clinical formulary database...
        </div>
      ) : medications.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <Pill className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching medications found.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search keywords or drug category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5 group"
            >
              <div>
                {/* Top Bar: Drug Class Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono truncate">
                    {med.drugClass}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                    Pregnancy: {med.pregnancyCategory}
                  </span>
                </div>

                {/* Generic & Brand Name */}
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {med.genericName}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
                  Brand: <span className="text-slate-700 dark:text-slate-300">{med.brandNames.join(', ')}</span>
                </p>

                {/* Standard Dosage & Route */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-0.5 text-xs">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-slate-400 font-normal text-[11px]">Dose: </span>
                    {med.standardDosage}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    <span className="text-slate-400 font-normal">Route: </span>
                    <strong className="text-blue-700 dark:text-blue-400">{med.route}</strong> • {med.frequency}
                  </p>
                </div>

                {/* Indications Tags */}
                <div className="mt-2.5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                    Key Indications
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {med.indications.slice(0, 3).map((ind, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
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
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedMed(med)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Full Monograph</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] font-mono text-slate-400">
                  {med.requiresPrescription ? 'Rx Only' : 'OTC / Directed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monograph Detail Modal */}
      {selectedMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                  Clinical Drug Monograph
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">{selectedMed.genericName}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Brands: {selectedMed.brandNames.join(', ')}</p>
              </div>

              <button
                onClick={() => setSelectedMed(null)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
              {/* Dosing Specs */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/60 space-y-1.5 text-blue-950 dark:text-blue-200">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 text-xs uppercase font-mono">Dosing & Administration</h4>
                <p><strong>Standard Dosage:</strong> {selectedMed.standardDosage}</p>
                <p><strong>Route:</strong> {selectedMed.route}</p>
                <p><strong>Frequency:</strong> {selectedMed.frequency}</p>
                <p><strong>Typical Course Duration:</strong> {selectedMed.typicalDuration}</p>
              </div>

              {/* Contraindications */}
              <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-1.5 text-rose-950 dark:text-rose-200">
                <div className="flex items-center space-x-1.5 font-bold text-rose-900 dark:text-rose-300 text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Contraindications & Black Box Precautions</span>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {selectedMed.contraindications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Side Effects */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono">Common Adverse Reactions</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedMed.sideEffects.join(' • ')}</p>
              </div>

              {/* Patient Counseling */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono">Patient Counseling Points</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedMed.counselingInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
