import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  ClipboardList,
  Brain,
  AlertTriangle,
  Activity,
  Thermometer,
  Heart,
  Droplets,
  Wind,
  CheckCircle2,
  ChevronRight,
  Search,
  Plus,
  Printer,
  BedDouble,
  ArrowUpRight,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  Tag,
  Zap,
  X,
  Star,
  Clock,
  User,
  FlaskConical,
  Scan,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ESI = 'ESI-1' | 'ESI-2' | 'ESI-3' | 'ESI-4';

interface PatientVitals {
  bp: string;
  hr: number;
  temp: number;
  spo2: number;
  rr: number;
}

interface QueuePatient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  esi: ESI;
  complaint: string;
  vitals: PatientVitals;
  attending: string;
  nurseNotes: string;
  arrivalTime: string;
  differentials: Array<{ dx: string; confidence: 'High' | 'Moderate' | 'Low'; color: string }>;
  carePlan: string[];
}

interface DiagnosticOrder {
  id: string;
  label: string;
  category: 'Blood Work' | 'Imaging' | 'Urinalysis' | 'Microbiology';
  stat: boolean;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const QUEUE_PATIENTS: QueuePatient[] = [
  {
    id: 'p1',
    name: 'Eleanor Vance',
    age: 72,
    gender: 'F',
    esi: 'ESI-1',
    complaint: 'Acute Altered Mental Status & Hypotension',
    vitals: { bp: '78/42', hr: 128, temp: 39.2, spo2: 91, rr: 26 },
    attending: 'Dr. Sharma',
    nurseNotes:
      'Pt arrived via EMS. Unresponsive to commands at triage. Diaphoretic, pallor. BP dropped precipitously en route. Started 1L NS bolus. Family reports hx of UTI 5 days ago treated at home. FAST+ for SIRS criteria.',
    arrivalTime: '10:14',
    differentials: [
      { dx: 'Septic Shock', confidence: 'High', color: 'rose' },
      { dx: 'Pulmonary Embolism', confidence: 'Moderate', color: 'amber' },
      { dx: 'Adrenal Crisis', confidence: 'Low', color: 'sky' },
    ],
    carePlan: [
      'IV access × 2 (large bore) + aggressive fluid resuscitation',
      'Draw Blood Cultures × 2 before antibiotics',
      'Broad-spectrum antibiotics: Piperacillin-Tazobactam IV stat',
      'Lactate, CBC, CMP, Procalcitonin, D-Dimer stat labs',
      'ICU admission — MICU bed request initiated',
    ],
  },
  {
    id: 'p2',
    name: 'Marcus Brody',
    age: 34,
    gender: 'M',
    esi: 'ESI-2',
    complaint: 'Crushing Chest Pain — Radiation to Left Arm',
    vitals: { bp: '155/96', hr: 98, temp: 37.1, spo2: 97, rr: 18 },
    attending: 'Dr. Sharma',
    nurseNotes:
      '34M with no known cardiac history. Pain 9/10, sudden onset 40 min ago at rest. Diaphoretic. Aspirin 325mg administered at triage. 12-Lead ECG shows ST elevation in II, III, aVF. Cath Lab on standby.',
    arrivalTime: '10:32',
    differentials: [
      { dx: 'STEMI (Inferior)', confidence: 'High', color: 'rose' },
      { dx: 'Aortic Dissection', confidence: 'Moderate', color: 'amber' },
      { dx: 'NSTEMI', confidence: 'Low', color: 'sky' },
    ],
    carePlan: [
      'Activate Cardiac Cath Lab — STEMI Protocol',
      'Heparin 5,000 units IV bolus',
      'Clopidogrel 600mg loading dose PO',
      'Cardiology consult STAT — Interventional team paged',
      'Repeat ECG in 15 minutes + Serial Troponin',
    ],
  },
  {
    id: 'p3',
    name: 'Sophia Patel',
    age: 29,
    gender: 'F',
    esi: 'ESI-3',
    complaint: 'Severe Dyspnea + Pleuritic Chest Pain (post-flight)',
    vitals: { bp: '122/78', hr: 112, temp: 37.5, spo2: 94, rr: 22 },
    attending: 'Dr. Sharma',
    nurseNotes:
      'F29 returned from 14hr international flight yesterday. Onset dyspnea and right-sided pleuritic chest pain this AM. Leg swelling noted. On OCP. Wells score calculated = 6 (High Probability PE). O2 applied, 4L NC.',
    arrivalTime: '11:05',
    differentials: [
      { dx: 'Pulmonary Embolism', confidence: 'High', color: 'rose' },
      { dx: 'Pleuritis', confidence: 'Moderate', color: 'amber' },
      { dx: 'Pneumothorax', confidence: 'Low', color: 'sky' },
    ],
    carePlan: [
      'CTA Chest with PE Protocol — stat',
      'D-Dimer, CBC, BMP, PT/INR, Troponin',
      'If CTA confirms PE: Anticoagulation with Enoxaparin weight-based',
      'Lower extremity Doppler ultrasound',
      'OCP held — Thrombophilia workup',
    ],
  },
];

const DIAGNOSTIC_ORDERS: DiagnosticOrder[] = [
  { id: 'cbc', label: 'CBC with Differential', category: 'Blood Work', stat: true },
  { id: 'cmp', label: 'Comprehensive Metabolic Panel', category: 'Blood Work', stat: true },
  { id: 'lactate', label: 'Lactic Acid (Serum)', category: 'Blood Work', stat: true },
  { id: 'troponin', label: 'Troponin I (Serial)', category: 'Blood Work', stat: true },
  { id: 'ddimer', label: 'D-Dimer', category: 'Blood Work', stat: false },
  { id: 'procalcitonin', label: 'Procalcitonin', category: 'Blood Work', stat: false },
  { id: 'cultures', label: 'Blood Cultures × 2', category: 'Microbiology', stat: true },
  { id: 'cxr', label: 'Chest X-Ray (PA/Lateral)', category: 'Imaging', stat: false },
  { id: 'ctpe', label: 'CTA Chest — PE Protocol', category: 'Imaging', stat: true },
  { id: 'echo', label: 'Bedside Echocardiogram', category: 'Imaging', stat: false },
  { id: 'ua', label: 'Urinalysis + Culture', category: 'Urinalysis', stat: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESI_CONFIG: Record<ESI, { label: string; bg: string; text: string; border: string }> = {
  'ESI-1': { label: 'ESI-1 · Immediate', bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-500/60' },
  'ESI-2': { label: 'ESI-2 · Emergent', bg: 'bg-orange-950/80', text: 'text-orange-300', border: 'border-orange-500/60' },
  'ESI-3': { label: 'ESI-3 · Urgent', bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-500/60' },
  'ESI-4': { label: 'ESI-4 · Less Urgent', bg: 'bg-teal-950/80', text: 'text-teal-300', border: 'border-teal-500/60' },
};

const CONFIDENCE_COLORS: Record<string, string> = {
  rose: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
  amber: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
  sky: 'text-sky-400 bg-sky-950/60 border-sky-500/40',
};

const TIMELINE_STEPS = ['Intake', 'Triage', 'Examination', 'Treatment', 'Disposition'];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Blood Work': FlaskConical,
  Imaging: Scan,
  Urinalysis: Droplets,
  Microbiology: FlaskConical,
};

const EXAM_TEMPLATES = [
  'General Appearance:',
  'Head/Eyes/ENT:',
  'Cardiovascular:',
  'Respiratory:',
  'Abdomen:',
  'Neurological:',
  'Clinical Impression:',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function VitalBadge({ label, value, unit, alert = false }: { label: string; value: string | number; unit?: string; alert?: boolean }) {
  return (
    <div className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg border ${alert ? 'bg-rose-950/60 border-rose-500/40' : 'bg-slate-800/60 border-slate-700/60'}`}>
      <span className={`text-[10px] font-mono uppercase tracking-wider ${alert ? 'text-rose-400' : 'text-slate-400'}`}>{label}</span>
      <span className={`text-sm font-bold leading-tight ${alert ? 'text-rose-300' : 'text-white'}`}>{value}</span>
      {unit && <span className={`text-[10px] ${alert ? 'text-rose-400/60' : 'text-slate-500'}`}>{unit}</span>}
    </div>
  );
}

function PatientQueueCard({ patient, isActive, onClick }: { patient: QueuePatient; isActive: boolean; onClick: () => void }) {
  const esi = ESI_CONFIG[patient.esi];
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`p-3 rounded-xl border cursor-pointer transition-all ${
        isActive
          ? 'bg-blue-950/50 border-blue-500/60 shadow-lg shadow-blue-900/30'
          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600/80 hover:bg-slate-800/70'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-white">{patient.name}</span>
          <span className="text-[11px] text-slate-400 ml-1.5">{patient.age}{patient.gender}</span>
        </div>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${esi.bg} ${esi.text} ${esi.border}`}>
          {patient.esi}
        </span>
      </div>
      <p className="text-[11px] text-slate-300 mb-2 line-clamp-2">{patient.complaint}</p>
      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
        <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
          <Heart className="w-2.5 h-2.5 text-rose-400" />
          <span>{patient.vitals.hr} bpm</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
          <Activity className="w-2.5 h-2.5 text-blue-400" />
          <span>{patient.vitals.bp}</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
          <Wind className="w-2.5 h-2.5 text-teal-400" />
          <span>SpO₂ {patient.vitals.spo2}%</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1 ml-auto">
          <Clock className="w-2.5 h-2.5" />
          <span>{patient.arrivalTime}</span>
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const ExaminationsPage: React.FC = () => {
  const [activePatientId, setActivePatientId] = useState<string>('p1');
  const [openTabs, setOpenTabs] = useState<string[]>(['p1', 'p2', 'p3']);
  const [examNotes, setExamNotes] = useState<Record<string, string>>({
    p1: 'General Appearance: Elderly female appearing acutely ill, diaphoretic, pallor noted.\n\nCardiovascular: Tachycardic HR 128. Weak radial pulses bilaterally. No murmurs.\n\nRespiratory: Tachypneic, increased work of breathing. Bilateral crackles at bases.\n\nClinical Impression: Clinical picture consistent with septic shock, likely urinary source. Initiating Sepsis Bundle.',
    p2: '',
    p3: '',
  });
  const [orderedTests, setOrderedTests] = useState<Record<string, Set<string>>>({
    p1: new Set(['cbc', 'cmp', 'lactate', 'cultures']),
    p2: new Set(['cbc', 'troponin']),
    p3: new Set(['ddimer', 'ctpe']),
  });
  const [orderSearch, setOrderSearch] = useState('');
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const activePatient = QUEUE_PATIENTS.find((p) => p.id === activePatientId)!;
  const esi = ESI_CONFIG[activePatient.esi];
  const currentOrders = orderedTests[activePatientId] || new Set();

  const toggleOrder = (orderId: string) => {
    setOrderedTests((prev) => {
      const next = new Set(prev[activePatientId] || []);
      next.has(orderId) ? next.delete(orderId) : next.add(orderId);
      return { ...prev, [activePatientId]: next };
    });
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t !== id);
    setOpenTabs(remaining);
    if (activePatientId === id && remaining.length > 0) setActivePatientId(remaining[0]);
  };

  const saveNotes = () => {
    setSavedNote(activePatientId);
    setTimeout(() => setSavedNote(null), 2500);
  };

  const applyFormat = (format: string) => {
    const ta = document.getElementById('exam-notes') as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    let insert = selected;
    if (format === 'bold') insert = `**${selected}**`;
    else if (format === 'italic') insert = `_${selected}_`;
    else if (format === 'underline') insert = `__${selected}__`;
    else if (format === 'list') insert = `\n• ${selected}`;
    const newVal = ta.value.substring(0, start) + insert + ta.value.substring(end);
    setExamNotes((prev) => ({ ...prev, [activePatientId]: newVal }));
  };

  const insertTemplate = (tpl: string) => {
    setExamNotes((prev) => ({
      ...prev,
      [activePatientId]: (prev[activePatientId] || '') + '\n\n' + tpl,
    }));
  };

  const filteredOrders = DIAGNOSTIC_ORDERS.filter((o) =>
    o.label.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const groupedOrders = filteredOrders.reduce<Record<string, DiagnosticOrder[]>>((acc, o) => {
    if (!acc[o.category]) acc[o.category] = [];
    acc[o.category].push(o);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 flex flex-col">

      {/* ── Top Header ── */}
      <div className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-2.5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">

          {/* Page Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight">Physician Examination Portal</h1>
              <p className="text-[10px] text-slate-400">AI-Augmented Clinical Workspace · Dr. Sharma</p>
            </div>
          </div>

          {/* Patient Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto">
            {openTabs.map((tabId) => {
              const pt = QUEUE_PATIENTS.find((p) => p.id === tabId);
              if (!pt) return null;
              const tabEsi = ESI_CONFIG[pt.esi];
              return (
                <button
                  key={tabId}
                  onClick={() => setActivePatientId(tabId)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all whitespace-nowrap ${
                    activePatientId === tabId
                      ? 'bg-blue-950/60 border-blue-500/60 text-white shadow'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${pt.esi === 'ESI-1' ? 'bg-rose-500' : pt.esi === 'ESI-2' ? 'bg-orange-500' : 'bg-amber-500'}`} />
                  <span>{pt.name}</span>
                  <span className={`text-[10px] ${tabEsi.text}`}>{pt.age}{pt.gender}</span>
                  <button
                    onClick={(e) => closeTab(tabId, e)}
                    className="ml-0.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </button>
              );
            })}
            <button className="px-3 py-1.5 rounded-lg border border-dashed border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 text-xs font-medium transition-all flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Examine Records</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-semibold">Live CDM</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 5-Step Timeline ── */}
      <div className="border-b border-slate-800/60 bg-slate-900/50 px-4 py-2">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center space-x-1">
          {TIMELINE_STEPS.map((step, idx) => {
            const isDone = idx < 2;
            const isCurrent = idx === 2;
            return (
              <React.Fragment key={step}>
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow shadow-emerald-900/40'
                    : isDone
                    ? 'bg-slate-800/60 border-slate-600/40 text-slate-300'
                    : 'bg-transparent border-slate-800 text-slate-600'
                }`}>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-teal-400" />}
                  {isCurrent && <Stethoscope className="w-3 h-3 text-emerald-400" />}
                  <span>{step}</span>
                </div>
                {idx < TIMELINE_STEPS.length - 1 && (
                  <ChevronRight className={`w-3.5 h-3.5 ${idx < 2 ? 'text-teal-500' : 'text-slate-700'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-3 py-4 grid grid-cols-12 gap-3">

        {/* ════════ LEFT — Queue ════════ */}
        <div className="col-span-3 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-teal-400" />
              <span>Awaiting Examination</span>
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold">
              {QUEUE_PATIENTS.length}
            </span>
          </div>

          <div className="space-y-2">
            {QUEUE_PATIENTS.map((patient) => (
              <PatientQueueCard
                key={patient.id}
                patient={patient}
                isActive={activePatientId === patient.id}
                onClick={() => {
                  setActivePatientId(patient.id);
                  if (!openTabs.includes(patient.id)) setOpenTabs((prev) => [...prev, patient.id]);
                }}
              />
            ))}
          </div>
        </div>

        {/* ════════ CENTER — Active Exam ════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePatientId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="col-span-5 flex flex-col space-y-3"
          >
            {/* Patient Bio Banner */}
            <div className={`rounded-2xl border p-4 ${esi.bg} ${esi.border}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-extrabold text-white">{activePatient.name}</h2>
                    <span className="text-xs text-slate-400">{activePatient.age}{activePatient.gender}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${esi.bg} ${esi.text} ${esi.border}`}>
                      {esi.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{activePatient.complaint}</p>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Arrived {activePatient.arrivalTime}</span>
                </div>
              </div>

              {/* Vitals Strip */}
              <div className="flex items-center space-x-2 mt-3 flex-wrap gap-y-2">
                <VitalBadge label="BP" value={activePatient.vitals.bp} unit="mmHg" alert={parseInt(activePatient.vitals.bp) < 90} />
                <VitalBadge label="HR" value={activePatient.vitals.hr} unit="bpm" alert={activePatient.vitals.hr > 120} />
                <VitalBadge label="Temp" value={`${activePatient.vitals.temp}°`} unit="C" alert={activePatient.vitals.temp > 38.5} />
                <VitalBadge label="SpO₂" value={`${activePatient.vitals.spo2}%`} alert={activePatient.vitals.spo2 < 94} />
                <VitalBadge label="RR" value={activePatient.vitals.rr} unit="/min" alert={activePatient.vitals.rr > 20} />
              </div>
            </div>

            {/* Nurse Intake Notes */}
            <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 p-3">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">Nurse Priya — Intake Notes</span>
              </div>
              <p className="text-[12px] text-slate-200 leading-relaxed">{activePatient.nurseNotes}</p>
            </div>

            {/* Examination Notes Editor */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 flex flex-col flex-1">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Physician Examination Notes</span>
                </span>
                {savedNote === activePatientId && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </motion.span>
                )}
              </div>

              {/* Rich-Text Toolbar */}
              <div className="flex items-center space-x-1 px-3 py-1.5 border-b border-slate-800 bg-slate-950/40">
                {[
                  { icon: Bold, action: 'bold', title: 'Bold' },
                  { icon: Italic, action: 'italic', title: 'Italic' },
                  { icon: Underline, action: 'underline', title: 'Underline' },
                  { icon: List, action: 'list', title: 'Bullet List' },
                ].map(({ icon: Icon, action, title }) => (
                  <button
                    key={action}
                    title={title}
                    onClick={() => applyFormat(action)}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
                <div className="w-px h-4 bg-slate-700 mx-1" />
                <div className="relative">
                  <select
                    onChange={(e) => { if (e.target.value) { insertTemplate(e.target.value); e.target.value = ''; } }}
                    className="appearance-none bg-slate-800 border border-slate-700 text-[11px] text-slate-300 rounded px-2 py-0.5 pr-5 focus:outline-none hover:border-slate-600 cursor-pointer"
                  >
                    <option value="">+ Structured Finding</option>
                    {EXAM_TEMPLATES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="relative ml-1">
                  <select
                    onChange={(e) => { if (e.target.value) { insertTemplate(e.target.value); e.target.value = ''; } }}
                    className="appearance-none bg-slate-800 border border-slate-700 text-[11px] text-slate-300 rounded px-2 py-0.5 pr-5 focus:outline-none hover:border-slate-600 cursor-pointer"
                  >
                    <option value="">Systems Review</option>
                    <option value="HEENT: ">HEENT</option>
                    <option value="Respiratory: ">Respiratory</option>
                    <option value="GI/Abdomen: ">GI/Abdomen</option>
                    <option value="Musculoskeletal: ">Musculoskeletal</option>
                    <option value="Skin/Integument: ">Skin</option>
                  </select>
                </div>
              </div>

              <textarea
                id="exam-notes"
                value={examNotes[activePatientId] || ''}
                onChange={(e) => setExamNotes((prev) => ({ ...prev, [activePatientId]: e.target.value }))}
                placeholder="Begin charting examination findings…"
                spellCheck
                className="flex-1 resize-none bg-transparent text-xs text-slate-100 placeholder-slate-600 p-3 focus:outline-none min-h-[220px] font-mono leading-relaxed"
              />
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center space-x-2">
              <button
                onClick={saveNotes}
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-900/40"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Update Examination Notes</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/40">
                <BedDouble className="w-3.5 h-3.5" />
                <span>Admit Patient</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-all shadow-lg shadow-teal-900/40">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Transfer to ICU</span>
              </button>
              <button className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ════════ RIGHT — Diagnostics & AI CDS ════════ */}
        <div className="col-span-4 flex flex-col space-y-3">

          {/* Diagnostic Order Entry */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                <span>Diagnostic Orders</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">
                {currentOrders.size} ordered
              </span>
            </div>

            <div className="relative mb-2.5">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search labs, imaging…"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
              {Object.entries(groupedOrders).map(([cat, orders]) => {
                const CatIcon = CATEGORY_ICONS[cat] || FlaskConical;
                return (
                  <div key={cat}>
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      <CatIcon className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{cat}</span>
                    </div>
                    <div className="space-y-1">
                      {orders.map((order) => (
                        <label
                          key={order.id}
                          className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                            currentOrders.has(order.id)
                              ? 'bg-blue-950/50 border-blue-500/50 text-blue-200'
                              : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={currentOrders.has(order.id)}
                            onChange={() => toggleOrder(order.id)}
                            className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-0 shrink-0"
                          />
                          <span className="text-[11px] font-medium flex-1">{order.label}</span>
                          {order.stat && (
                            <span className="flex items-center space-x-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-950/70 border border-rose-500/40 text-rose-300">
                              <Zap className="w-2.5 h-2.5" />
                              <span>STAT</span>
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Clinical Decision Support Panel */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-blue-950/40 p-3 flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wide flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Clinical Decision Support</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono">
                Multi-Agent
              </span>
            </div>

            {/* Differential Diagnoses */}
            <div className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                <Star className="w-3 h-3 text-amber-400" />
                <span>Prioritized Differentials</span>
              </p>
              <div className="space-y-2">
                {activePatient.differentials.map((dx, idx) => (
                  <div
                    key={dx.dx}
                    className={`flex items-center justify-between p-2 rounded-lg border ${CONFIDENCE_COLORS[dx.color]}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-black opacity-60`}>#{idx + 1}</span>
                      <span className="text-xs font-bold text-white">{dx.dx}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${CONFIDENCE_COLORS[dx.color]}`}>
                      {dx.confidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Care Plan */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                <ClipboardList className="w-3 h-3 text-teal-400" />
                <span>Recommended Care Plan</span>
              </p>
              <div className="space-y-1.5">
                {activePatient.carePlan.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                    <CheckCircle2 className="w-3 h-3 text-teal-400 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-slate-200 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="mt-3 p-2.5 rounded-xl border border-rose-500/40 bg-rose-950/30 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <p className="text-[11px] text-rose-300 font-medium leading-snug">
                {activePatient.esi === 'ESI-1'
                  ? 'CRITICAL: Initiate Sepsis Bundle within 1 hour. ICU bed hold recommended.'
                  : activePatient.esi === 'ESI-2'
                  ? 'EMERGENT: Cath Lab on standby. Cardiac team alerted.'
                  : 'URGENT: High clinical suspicion for PE. Immediate CTA required.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
