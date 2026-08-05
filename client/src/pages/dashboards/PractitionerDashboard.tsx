import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  Thermometer,
  Zap,
  Clock,
  AlertTriangle,
  UserPlus,
  Send,
  Bed,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { getStoredAuthUser } from '../../lib/supabase';
import { createWorkflowApi } from '../../lib/api';
import { MedicalDisclaimerBanner } from '../../components/MedicalDisclaimerBanner';

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
  const [triageList, setTriageList] = useState<ActiveTriagePatient[]>(INITIAL_TRIAGE_LIST);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header Clinical Intake Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-teal-700 mb-1 font-bold">
              <HeartPulse className="w-4 h-4 text-teal-600" />
              <span>Triage Nurse & Intake Station • High-Velocity Care Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Triage Command: {user.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Rapid Patient Vitals Telemetry, Immediate ESI Stratification & Multi-Agent Routing
            </p>
          </div>

          {/* Quick Bed Capacity Strip */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <div className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-2">
              <Bed className="w-4 h-4 text-blue-600" />
              <span>Beds: <strong className="text-emerald-700 font-bold">18/24 Available</strong></span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Rapid Intake Form + Active Triage Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Rapid Patient Intake Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Rapid Patient Intake Form</h2>
                  <p className="text-xs text-slate-500">Capture vitals & launch immediate AI agent triage</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Instant Dispatch
              </span>
            </div>

            <form onSubmit={handleRapidIntakeSubmit} className="space-y-4">
              
              {/* Patient Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="45"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Chief Complaint & Primary Symptoms
                </label>
                <textarea
                  rows={3}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="e.g. 45-year-old presenting with sudden severe right flank pain radiating to groin with nausea..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Live Vitals Telemetry Grid */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Intake Vitals Telemetry</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">BP (mmHg)</label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={bpSystolic}
                        onChange={(e) => setBpSystolic(e.target.value)}
                        className="w-12 px-1.5 py-1 rounded-lg bg-white border border-slate-200 font-mono font-bold text-center"
                      />
                      <span>/</span>
                      <input
                        type="text"
                        value={bpDiastolic}
                        onChange={(e) => setBpDiastolic(e.target.value)}
                        className="w-12 px-1.5 py-1 rounded-lg bg-white border border-slate-200 font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">HR (bpm)</label>
                    <input
                      type="text"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">SpO2 (%)</label>
                    <input
                      type="text"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Temp (°C)</label>
                    <input
                      type="text"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono font-bold text-center"
                    />
                  </div>
                </div>

                {/* Pain Scale Slider */}
                <div className="pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[11px] font-semibold text-slate-600">Reported Pain Score (1-10):</span>
                    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                      painLevel >= 8 ? 'bg-rose-100 text-rose-700' : painLevel >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md shadow-teal-600/20 transition-all group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Initializing Multi-Agent Pipeline...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-teal-200 group-hover:rotate-12 transition-transform" />
                    <span>Dispatch Case to AI Triage Orchestrator</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right Column: Active Emergency Triage Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">Active Triage Intake Stream</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  ● Live Feed
                </span>
              </div>

              <div className="space-y-3">
                {triageList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-xs text-slate-900">{item.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono font-medium">
                            ({item.ageGender})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{item.id} • {item.waitTime}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] ${item.esiBadge}`}>
                        {item.esiScore}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 line-clamp-2">
                      {item.chiefComplaint}
                    </p>

                    <div className="p-2 rounded-lg bg-white border border-slate-200/80 font-mono text-[10px] text-slate-600">
                      {item.vitals}
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Attending: <strong>{item.assignedAttending}</strong></span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Triage Protocol Reminder Box */}
            <div className="p-5 rounded-3xl bg-teal-50/70 border border-teal-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Immediate Sepsis & STEMI Protocols</span>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">
                All cases with SpO2 &lt; 92% or systolic BP &lt; 90 mmHg automatically trigger immediate physician push alerts upon agent execution.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
