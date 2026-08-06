import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  Zap,
  Clock,
  UserPlus,
  Bed,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { getStoredAuthUser } from '../../lib/supabase';
import { createWorkflowApi } from '../../lib/api';

interface ActiveTriagePatient {
  id: string;
  name: string;
  ageGender: string;
  vitals: string;
  chiefComplaint: string;
  esiScore: 'ESI-1 (Immediate)' | 'ESI-2 (Emergent)' | 'ESI-3 (Urgent)' | 'ESI-4 (Less Urgent)';
  esiBadge: string;
  waitTime: string;
  assignedAttending: string;
}

const INITIAL_TRIAGE_LIST: ActiveTriagePatient[] = [
  {
    id: 'TRIAGE-801',
    name: 'Eleanor Vance',
    ageGender: '72F',
    vitals: 'BP: 85/50 • HR: 122 • Temp: 39.1°C • SpO2: 91%',
    chiefComplaint: 'Lethargy, altered mental status, suspected septic shock',
    esiScore: 'ESI-1 (Immediate)',
    esiBadge: 'bg-rose-600 text-white font-bold',
    waitTime: '3 mins ago',
    assignedAttending: 'Dr. Sarah Jenkins (MD)',
  },
  {
    id: 'TRIAGE-802',
    name: 'Marcus Brody',
    ageGender: '34M',
    vitals: 'BP: 135/85 • HR: 88 • Temp: 37.2°C • SpO2: 98%',
    chiefComplaint: 'Right ankle deformity and inability to bear weight after fall',
    esiScore: 'ESI-3 (Urgent)',
    esiBadge: 'bg-amber-500 text-white font-bold',
    waitTime: '18 mins ago',
    assignedAttending: 'Dr. Michael Chen (DO)',
  },
  {
    id: 'TRIAGE-803',
    name: 'Sophia Patel',
    ageGender: '29F',
    vitals: 'BP: 120/78 • HR: 76 • Temp: 36.8°C • SpO2: 99%',
    chiefComplaint: 'Moderate migraine with photophobia (Pain Scale: 7/10)',
    esiScore: 'ESI-4 (Less Urgent)',
    esiBadge: 'bg-emerald-600 text-white font-bold',
    waitTime: '28 mins ago',
    assignedAttending: 'Triage Fast-Track',
  },
];

export const PractitionerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState<UserProfile>(getStoredAuthUser());
  const [triageList] = useState<ActiveTriagePatient[]>(INITIAL_TRIAGE_LIST);

  // Form State for Rapid Intake
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('Male');
  const [chiefComplaint, setChiefComplaint] = useState<string>('');
  const [bpSystolic, setBpSystolic] = useState<string>('120');
  const [bpDiastolic, setBpDiastolic] = useState<string>('80');
  const [heartRate, setHeartRate] = useState<string>('75');
  const [spo2, setSpo2] = useState<string>('98');
  const [temperature, setTemperature] = useState<string>('37.0');
  const [painLevel, setPainLevel] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRapidIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chiefComplaint || !patientName) return;

    setIsSubmitting(true);

    const compiledClinicalCase = `Patient: ${patientName}, ${patientAge}yo ${patientGender}. 
Chief Complaint: ${chiefComplaint}. 
Vitals on Intake: BP ${bpSystolic}/${bpDiastolic} mmHg, Heart Rate ${heartRate} bpm, SpO2 ${spo2}%, Temp ${temperature}°C. Reported Pain Scale: ${painLevel}/10. 
Triage Nurse: ${user.full_name}.`;

    try {
      const res = await createWorkflowApi({
        clinicalCase: compiledClinicalCase,
        complexity: 'Complex',
        enableCritic: true,
        outputFormat: 'Markdown',
        temperature: 0.2,
      });

      if (res.success && res.workflowId) {
        navigate(`/workflows/${res.workflowId}`);
      }
    } catch (err) {
      console.error('Rapid triage workflow error:', err);
      alert('Failed to dispatch to AI Triage Orchestrator.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header Clinical Intake Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-700 dark:text-teal-400 mb-1 font-bold">
            <HeartPulse className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Triage Nurse & Intake Station • High-Velocity Care Dispatch</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Triage Command: {user.full_name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rapid Patient Vitals Telemetry, Immediate ESI Stratification & Multi-Agent Routing
          </p>
        </div>

        {/* Quick Bed Capacity Strip */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-2">
            <Bed className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Beds: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">18/24 Available</strong></span>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Rapid Intake Form + Active Triage Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rapid Patient Intake Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Rapid Patient Intake Form</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Capture vitals & launch immediate AI agent triage</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Instant Dispatch
            </span>
          </div>

          <form onSubmit={handleRapidIntakeSubmit} className="space-y-4">
            {/* Patient Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="45"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Chief Complaint */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Chief Complaint & Primary Symptoms
              </label>
              <textarea
                rows={3}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. 45-year-old presenting with sudden severe right flank pain radiating to groin with nausea..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Live Vitals Telemetry Grid */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Intake Vitals Telemetry</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">BP (mmHg)</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(e.target.value)}
                      className="w-12 px-1.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center text-xs text-slate-900 dark:text-white"
                    />
                    <span>/</span>
                    <input
                      type="text"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(e.target.value)}
                      className="w-12 px-1.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">HR (bpm)</label>
                  <input
                    type="text"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">SpO2 (%)</label>
                  <input
                    type="text"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">Temp (°C)</label>
                  <input
                    type="text"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Pain Scale Slider */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Reported Pain Score (1-10):</span>
                  <span className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                    painLevel >= 8 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : painLevel >= 5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {painLevel} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all group disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Initializing Multi-Agent Pipeline...</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-teal-200 group-hover:rotate-12 transition-transform" />
                  <span>Dispatch Case to AI Triage Orchestrator</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Active Emergency Triage Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">Active Triage Intake Stream</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                ● Live Feed
              </span>
            </div>

            <div className="space-y-2.5">
              {triageList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-xs transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">{item.name}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                          ({item.ageGender})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{item.id} • {item.waitTime}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] ${item.esiBadge}`}>
                      {item.esiScore}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                    {item.chiefComplaint}
                  </p>

                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                    {item.vitals}
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-0.5">
                    <span>Attending: <strong>{item.assignedAttending}</strong></span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Triage Protocol Reminder Box */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-900 dark:text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Immediate Sepsis & STEMI Protocols</span>
            </div>
            <p className="text-xs text-teal-800 dark:text-teal-400 leading-relaxed">
              All cases with SpO2 &lt; 92% or systolic BP &lt; 90 mmHg automatically trigger immediate physician push alerts upon agent execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
