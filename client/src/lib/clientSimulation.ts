import {
  ClinicalWorkflow,
  AgentLog,
  ComplexityLevel,
  OutputFormat,
  RecommendationResult,
  PrescriptionPlan,
  BedBooking,
  Hospital,
  MatchedSpecialist,
} from '../types';
import { CLIENT_SPECIALISTS, CLIENT_FORMULARY, CLIENT_HOSPITALS } from '../data/mockData';

const STORAGE_WORKFLOWS_KEY = 'clinos_client_workflows';
const STORAGE_LOGS_KEY = 'clinos_client_logs';
const STORAGE_BOOKINGS_KEY = 'clinos_client_bookings';

function getStoredWorkflows(): Record<string, ClinicalWorkflow> {
  try {
    const raw = localStorage.getItem(STORAGE_WORKFLOWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveWorkflows(map: Record<string, ClinicalWorkflow>) {
  try {
    localStorage.setItem(STORAGE_WORKFLOWS_KEY, JSON.stringify(map));
  } catch {}
}

function getStoredLogs(): Record<string, AgentLog[]> {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLogs(map: Record<string, AgentLog[]>) {
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(map));
  } catch {}
}

export function emitClientLog(workflowId: string, log: AgentLog) {
  const allLogs = getStoredLogs();
  if (!allLogs[workflowId]) allLogs[workflowId] = [];
  allLogs[workflowId].push(log);
  saveLogs(allLogs);

  // Dispatch custom window event so WorkflowExecutionPage catches it live
  window.dispatchEvent(
    new CustomEvent('clinos_stream_event', {
      detail: log,
    })
  );
}

export function getClientWorkflow(workflowId: string): { workflow: ClinicalWorkflow; logs: AgentLog[] } | null {
  const workflows = getStoredWorkflows();
  const wf = workflows[workflowId];
  if (!wf) return null;
  const logs = getStoredLogs()[workflowId] || [];
  return { workflow: wf, logs };
}

export function getAllClientWorkflows(): ClinicalWorkflow[] {
  const workflows = getStoredWorkflows();
  return Object.values(workflows);
}

export function createClientWorkflow(payload: {
  clinicalCase: string;
  complexity: ComplexityLevel;
  enableCritic: boolean;
  outputFormat: OutputFormat;
  temperature: number;
  userId?: string;
}): { workflowId: string; workflow: ClinicalWorkflow } {
  const workflowId = 'wf-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);

  const workflow: ClinicalWorkflow = {
    id: workflowId,
    user_id: payload.userId || 'demo-user-id',
    clinical_case: payload.clinicalCase,
    status: 'running',
    configuration: {
      complexity: payload.complexity,
      enableCritic: payload.enableCritic,
      outputFormat: payload.outputFormat,
      temperature: payload.temperature,
    },
    created_at: new Date().toISOString(),
  };

  const workflows = getStoredWorkflows();
  workflows[workflowId] = workflow;
  saveWorkflows(workflows);

  // Start asynchronous multi-agent simulation pipeline
  runSimulationTimeline(workflowId, payload);

  return { workflowId, workflow };
}

function runSimulationTimeline(
  workflowId: string,
  payload: {
    clinicalCase: string;
    complexity: ComplexityLevel;
    enableCritic: boolean;
    outputFormat: OutputFormat;
  }
) {
  const isAppendicitis = /appendi|mcburney|rlq|right lower quadrant/i.test(payload.clinicalCase);
  const isCardiac = /chest pain|dyspnea|troponin|myocardial|angina/i.test(payload.clinicalCase);
  const isHeadache = /headache|photophobia|thunderclap|migraine/i.test(payload.clinicalCase);

  const diagTitle = isAppendicitis
    ? 'Acute Appendicitis (Alvarado Score: 8/10)'
    : isCardiac
    ? 'Acute Coronary Syndrome (NSTEMI / Unstable Angina)'
    : isHeadache
    ? 'Severe Acute Cephalea / Suspicious Neurovascular Event'
    : 'Acute Clinical Presentation — Multi-System Triage';

  // 1. Planner Agent (400ms)
  setTimeout(() => {
    emitClientLog(workflowId, {
      id: 'log-' + Math.random().toString(36).substring(2, 7),
      workflowId,
      agentRole: 'planner',
      action: 'PLANNER_STARTED',
      payload: {
        message: `Triage Planner initialized under ${payload.complexity.toUpperCase()} protocol. Decomposing unstructured clinical notes...`,
      },
      timestamp: new Date().toISOString(),
    });
  }, 400);

  setTimeout(() => {
    emitClientLog(workflowId, {
      id: 'log-' + Math.random().toString(36).substring(2, 7),
      workflowId,
      agentRole: 'planner',
      action: 'PLANNER_DECOMPOSED',
      payload: {
        clinicalSummary: `Identified key symptom clusters: "${payload.clinicalCase.slice(0, 95)}..."`,
        executionSteps: [
          'Step 1: Clinical Researcher analysis of chief complaint and red-flag biomarkers.',
          'Step 2: Medical Critic loop verification against emergency clinical guidelines.',
          'Step 3: Care Synthesizer generation of ICD-10 diagnostic consensus and orders.',
        ],
      },
      timestamp: new Date().toISOString(),
    });
  }, 1200);

  // 2. Clinical Researcher Agent (2000ms)
  setTimeout(() => {
    emitClientLog(workflowId, {
      id: 'log-' + Math.random().toString(36).substring(2, 7),
      workflowId,
      agentRole: 'researcher',
      action: 'RESEARCHER_STARTED',
      payload: {
        message: 'Clinical Researcher querying medical ontology, differential algorithms, and risk stratification models...',
      },
      timestamp: new Date().toISOString(),
    });
  }, 2000);

  setTimeout(() => {
    emitClientLog(workflowId, {
      id: 'log-' + Math.random().toString(36).substring(2, 7),
      workflowId,
      agentRole: 'researcher',
      action: 'RESEARCHER_ANALYZED',
      payload: {
        differentialDiagnoses: [
          `${diagTitle} (Confidence: 94%)`,
          'Secondary Differential: Acute Mesenteric Lymphadenitis / Gastroenteritis',
          'Tertiary Differential: Atypical Regional Inflammation',
        ],
        redFlagRisks: ['Immediate surgical / interventional consultation warranted', 'Observe serial vital signs for shock / sepsis trajectory'],
      },
      timestamp: new Date().toISOString(),
    });
  }, 3200);

  // 3. Critic Agent (4000ms)
  if (payload.enableCritic) {
    setTimeout(() => {
      emitClientLog(workflowId, {
        id: 'log-' + Math.random().toString(36).substring(2, 7),
        workflowId,
        agentRole: 'critic',
        action: 'CRITIC_EVALUATED',
        payload: {
          iteration: 1,
          safetyChecks: {
            contraindicationsChecked: true,
            drugAllergyAuditPassed: true,
            acuityAssessmentValidated: true,
          },
          critique: 'Safety review passed with zero critical flags. Recommending stat surgical ultrasound/CT verification.',
        },
        timestamp: new Date().toISOString(),
      });
    }, 4200);

    setTimeout(() => {
      emitClientLog(workflowId, {
        id: 'log-' + Math.random().toString(36).substring(2, 7),
        workflowId,
        agentRole: 'critic',
        action: 'CRITIC_APPROVED',
        payload: {
          approvalScore: 0.98,
          message: 'Autonomous Critic Guard verified clinical reasoning logic and diagnostic rigor.',
        },
        timestamp: new Date().toISOString(),
      });
    }, 5000);
  }

  // 4. Synthesizer Agent (5800ms)
  setTimeout(() => {
    emitClientLog(workflowId, {
      id: 'log-' + Math.random().toString(36).substring(2, 7),
      workflowId,
      agentRole: 'synthesizer',
      action: 'SYNTHESIZER_STARTED',
      payload: {
        message: 'Care Synthesizer consolidating all agent outputs into final physician care plan...',
      },
      timestamp: new Date().toISOString(),
    });
  }, 5800);

  setTimeout(() => {
    const finalReport = `### 📋 CLINICAL TRIAGE & DIAGNOSTIC CONSENSUS

**Primary Assessment:** ${diagTitle}
**Recommended Acuity:** Emergency / Urgent Triage (Level 2)
**Clinical Reasoning:** Presentation demonstrates hallmark focal tenderness with systemic inflammatory markers. Immediate imaging and specialist evaluation are indicated.

---

### 🩺 RECOMMENDED CLINICAL PATHWAY & ORDERS
1. **Immediate Laboratory Workup:** Complete Blood Count (CBC) with differential, Serum Chemistry, Urinalysis, CRP/ESR.
2. **Diagnostic Imaging:** Stat Abdominal/Pelvic Ultrasound or contrast-enhanced CT.
3. **Pharmacotherapy Initiation:** IV Crystalloid fluid hydration + pre-operative antibiotic coverage as per institutional protocol.
4. **Specialist Consult:** Urgent General Surgery / Interventional referral.`;

    const workflows = getStoredWorkflows();
    if (workflows[workflowId]) {
      workflows[workflowId].status = 'completed';
      workflows[workflowId].final_output = finalReport;
      saveWorkflows(workflows);
    }

    emitClientLog(workflowId, {
      id: 'log-' + Math.random().toString(36).substring(2, 7),
      workflowId,
      agentRole: 'synthesizer',
      action: 'SYNTHESIZER_FINISHED',
      payload: {
        reportSummary: finalReport,
      },
      timestamp: new Date().toISOString(),
    });

    emitClientLog(workflowId, {
      id: 'log-' + Math.random().toString(36).substring(2, 7),
      workflowId,
      agentRole: 'synthesizer',
      action: 'ORCHESTRATION_FINISHED',
      payload: {
        totalDurationMs: 6400,
        status: 'completed',
      },
      timestamp: new Date().toISOString(),
    });
  }, 6600);
}

export function matchSpecialistClient(clinicalCase: string): RecommendationResult {
  const isAppendicitis = /appendi|mcburney|rlq|right lower quadrant/i.test(clinicalCase);
  const isCardiac = /chest pain|dyspnea|troponin|myocardial|angina/i.test(clinicalCase);
  const isHeadache = /headache|photophobia|thunderclap|migraine/i.test(clinicalCase);

  let primary = CLIENT_SPECIALISTS[0];
  let specialty = 'General & Acute Care Surgery';
  if (isCardiac) {
    primary = CLIENT_SPECIALISTS[1];
    specialty = 'Interventional Cardiology';
  } else if (isHeadache) {
    primary = CLIENT_SPECIALISTS[2];
    specialty = 'Neurology & Neurovascular Medicine';
  }

  const matched: MatchedSpecialist[] = [
    {
      ...primary,
      matchScore: 98,
      matchReason: `High-signal correlation with clinical symptoms and acute triage protocol for ${specialty}.`,
      urgencyLevel: 'Emergency Consultation',
    },
    ...CLIENT_SPECIALISTS.filter((s) => s.id !== primary.id).slice(0, 2).map((s) => ({
      ...s,
      matchScore: 88,
      matchReason: `Secondary specialist match for cross-disciplinary diagnostic evaluation.`,
      urgencyLevel: 'Urgent Referral (Within 24h)' as const,
    })),
  ];

  return {
    primarySpecialty: specialty,
    referralRationale: `Clinical symptoms warrant urgent ${specialty} evaluation to rule out acute emergent pathology.`,
    recommendedSpecialists: matched,
    suggestedQuestionsForDoctor: [
      'What diagnostic imaging (CT vs Ultrasound) is recommended first?',
      'Are there any immediate dietary or physical restrictions?',
      'What warning symptoms warrant an immediate emergency room visit?',
    ],
  };
}

export function matchPrescriptionPlanClient(clinicalCase: string): PrescriptionPlan {
  const isCardiac = /chest pain|dyspnea|troponin|myocardial|angina/i.test(clinicalCase);
  const isHeadache = /headache|photophobia|thunderclap|migraine/i.test(clinicalCase);

  let primaryMed = CLIENT_FORMULARY[0];
  let supportive = CLIENT_FORMULARY[1];
  let target = 'Acute Appendicitis Prophylaxis';

  if (isCardiac) {
    primaryMed = CLIENT_FORMULARY[2]; // Aspirin
    supportive = CLIENT_FORMULARY[1];
    target = 'Acute Coronary Syndrome Protocol';
  } else if (isHeadache) {
    primaryMed = CLIENT_FORMULARY[3]; // Sumatriptan
    supportive = CLIENT_FORMULARY[1];
    target = 'Acute Migraine / Severe Cephalea';
  }

  return {
    rxIdentifier: 'RX-' + Math.floor(100000 + Math.random() * 900000),
    generatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    primaryConditionTarget: target,
    overallTherapeuticGoal: `Rapid symptom management and stabilization adhering to evidence-based clinical protocols.`,
    prescriptions: [
      {
        medication: primaryMed,
        tier: 'First-Line Therapy',
        dosage: primaryMed.standardDosage,
        route: primaryMed.route,
        frequency: primaryMed.frequency,
        duration: primaryMed.typicalDuration,
        clinicalRationale: `Primary therapeutic agent indicated for ${primaryMed.indications[0]}.`,
        dispenseQuantity: '1 Standard Course',
        refillsAllowed: 0,
        criticalWarning: primaryMed.contraindications[0],
      },
      {
        medication: supportive,
        tier: 'Symptomatic Relief',
        dosage: supportive.standardDosage,
        route: supportive.route,
        frequency: supportive.frequency,
        duration: supportive.typicalDuration,
        clinicalRationale: `Supportive therapy for nausea and discomfort.`,
        dispenseQuantity: '10 Doses',
        refillsAllowed: 0,
      },
    ],
    safetyAlerts: [
      'Confirm patient allergy profile before dispensing or administering.',
      'Monitor patient vitals 30 minutes post-administration.',
    ],
    dietaryAndLifestyleInstructions: [
      'Maintain strict NPO (nothing by mouth) if surgical intervention is pending.',
      'Ensure adequate IV hydration support.',
    ],
    mandatoryPhysicianDisclaimer:
      'This prescription regimen is an AI-generated clinical decision support proposal and must be verified and signed by a licensed physician before dispensing.',
  };
}

export function createBedBookingClient(payload: any): { booking: BedBooking; updated_hospital: Hospital } {
  const hosp = CLIENT_HOSPITALS.find((h) => h.id === payload.hospital_id) || CLIENT_HOSPITALS[0];
  const token = 'HOLD-' + Math.floor(100000 + Math.random() * 900000);

  const booking: BedBooking = {
    id: 'book-' + Math.random().toString(36).substring(2, 8),
    booking_token: token,
    patient_id: payload.patient_id || 'demo-patient',
    patient_name: payload.patient_name || 'Emergency Patient',
    patient_phone: payload.patient_phone || '+1 (555) 019-2831',
    hospital_id: hosp.id,
    hospital_name: hosp.name,
    bed_type: payload.bed_type || 'general',
    status: 'held',
    hold_duration_hours: payload.hold_duration_hours || 4,
    booking_timestamp: new Date().toISOString(),
    expires_at: new Date(Date.now() + (payload.hold_duration_hours || 4) * 3600000).toISOString(),
    instructions: `Present token #${token} at triage desk upon arrival. Ambulance notification dispatched.`,
  };

  try {
    const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    const bookings = raw ? JSON.parse(raw) : [];
    bookings.push(booking);
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {}

  return { booking, updated_hospital: hosp };
}

export function simulateChatSessionClient(message: string, userLocation?: { latitude: number; longitude: number }) {
  const text = message || '';
  const raw = text.toLowerCase();

  // 1. Dynamic Vitals & Clinical Marker Parsing
  let tempVal: number | undefined;
  const tempMatch = text.match(/(\d{2,3}(?:\.\d)?)\s*(?:°|deg|degrees)?\s*([fcFC])\b/) ||
                    text.match(/(?:temp|temperature|fever of)\s*[:=]?\s*(\d{2,3}(?:\.\d)?)/i);
  if (tempMatch) {
    tempVal = parseFloat(tempMatch[1]);
  } else if (raw.includes('fever') || raw.includes('chills')) {
    tempVal = 101.8;
  }

  let sysBp: number | undefined;
  let diaBp: number | undefined;
  const bpMatch = text.match(/(?:bp|blood pressure)?\s*[:=]?\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*(?:mmhg)?/i);
  if (bpMatch) {
    sysBp = parseInt(bpMatch[1], 10);
    diaBp = parseInt(bpMatch[2], 10);
  }

  let hrVal: number | undefined;
  const hrMatch = text.match(/(?:hr|heart rate|pulse)\s*[:=]?\s*(\d{2,3})\s*(?:bpm)?/i) || text.match(/(\d{2,3})\s*bpm/i);
  if (hrMatch) {
    hrVal = parseInt(hrMatch[1], 10);
  }

  let spo2Val: number | undefined;
  const spo2Match = text.match(/(?:spo2|o2 sat|oxygen|o2 saturation)\s*[:=]?\s*(\d{2,3})\s*%/i) || text.match(/(\d{2,3})\s*%\s*(?:spo2|o2|oxygen)/i);
  if (spo2Match) {
    spo2Val = parseInt(spo2Match[1], 10);
  }

  let painVal: number | undefined;
  const painMatch = text.match(/(?:pain|severity|scale)?\s*[:=]?\s*(\d{1,2})\s*(?:\/|out of)\s*10/i);
  if (painMatch) {
    painVal = Math.min(10, parseInt(painMatch[1], 10));
  } else if (raw.includes('severe') || raw.includes('crushing') || raw.includes('excruciating')) {
    painVal = 9;
  } else if (raw.includes('moderate')) {
    painVal = 5;
  }

  // 2. Dynamic Acuity / Clinical Score Calculation
  let scoreName = 'Modified Early Warning Score (MEWS)';
  let scoreVal = 2;
  let maxScore = 14;
  let scoreInterpretation = 'Clinically Stable for Ambulatory Care';

  if (raw.includes('appendix') || raw.includes('appendic') || raw.includes('right lower') || raw.includes('rlq') || (raw.includes('abdominal') && raw.includes('pain'))) {
    scoreName = 'Alvarado Score (Acute Appendicitis Probability)';
    maxScore = 10;
    let alv = 0;
    if (raw.includes('navel') || raw.includes('periumbilical') || raw.includes('migrat')) alv += 1;
    if (raw.includes('anorexia') || raw.includes('loss of appetite') || raw.includes('not eating')) alv += 1;
    if (raw.includes('nausea') || raw.includes('vomit')) alv += 1;
    if (raw.includes('tender') || raw.includes('sharp') || raw.includes('right lower')) alv += 2;
    if (raw.includes('rebound') || raw.includes('mcburney')) alv += 1;
    if (tempVal && tempVal >= 99.1) alv += 1;
    alv += 2; // Presumed leukocytosis
    scoreVal = Math.min(10, Math.max(4, alv));
    scoreInterpretation = scoreVal >= 7 ? 'High Probability of Acute Appendicitis — Urgent Surgical Referral' : 'Compatible with Appendicitis — Diagnostic Imaging Indicated';
  } else if (raw.includes('chest') || raw.includes('heart') || raw.includes('angina') || raw.includes('infarct')) {
    scoreName = 'HEART Score (Major Adverse Cardiac Events)';
    maxScore = 10;
    scoreVal = raw.includes('crushing') || raw.includes('radiat') ? 8 : 5;
    scoreInterpretation = scoreVal >= 7 ? 'High Risk for Acute Myocardial Infarction — Immediate Resuscitation' : 'Moderate Cardiac Risk — Inpatient Evaluation';
  } else {
    let mews = 0;
    if (hrVal && hrVal >= 111) mews += 2;
    if (sysBp && (sysBp <= 80 || sysBp >= 200)) mews += 2;
    if (spo2Val && spo2Val < 92) mews += 3;
    if (tempVal && tempVal >= 101.5) mews += 1;
    if (painVal && painVal >= 7) mews += 1;
    scoreVal = Math.min(14, Math.max(1, mews));
    scoreInterpretation = scoreVal >= 5 ? 'Critical Clinical Instability — Immediate ICU Bed Hold' : scoreVal >= 3 ? 'Urgent Clinical Review Required' : 'Clinically Stable for Ambulatory Care';
  }

  // 3. Dynamic Criticality Meter Computation (0% - 100%)
  const isEmergency =
    raw.includes('crushing') ||
    raw.includes('chest pressure') ||
    raw.includes('heart attack') ||
    raw.includes('stroke') ||
    raw.includes('unconscious') ||
    (spo2Val !== undefined && spo2Val < 90) ||
    (sysBp !== undefined && sysBp < 85);

  let criticalityPercentage = 25;
  if (isEmergency) {
    criticalityPercentage = Math.min(98, 88 + (scoreVal * 1.5));
  } else if (scoreName.includes('Alvarado') && scoreVal >= 7) {
    criticalityPercentage = Math.min(86, 74 + (scoreVal * 1.2));
  } else if (scoreName.includes('HEART') && scoreVal >= 7) {
    criticalityPercentage = Math.min(96, 80 + (scoreVal * 1.8));
  } else if (scoreVal >= 5 || (painVal !== undefined && painVal >= 8)) {
    criticalityPercentage = Math.min(78, 68 + scoreVal);
  } else if ((tempVal !== undefined && tempVal >= 100.4) || (painVal !== undefined && painVal >= 5) || raw.includes('migraine') || raw.includes('infection') || raw.includes('cough')) {
    criticalityPercentage = Math.min(65, 45 + (scoreVal * 3));
  } else {
    criticalityPercentage = Math.min(38, 15 + (scoreVal * 4));
  }

  criticalityPercentage = Math.round(criticalityPercentage);

  let criticalityTier: 'Low Concern (0-40%)' | 'Moderate Concern (41-70%)' | 'High Concern / Emergency (71-100%)';
  let criticalityExplanation = '';
  if (criticalityPercentage > 70) {
    criticalityTier = 'High Concern / Emergency (71-100%)';
    criticalityExplanation = `High acuity presentation (${criticalityPercentage}%) requiring immediate physical intervention, emergency bed reservation, and urgent specialist evaluation.`;
  } else if (criticalityPercentage >= 41) {
    criticalityTier = 'Moderate Concern (41-70%)';
    criticalityExplanation = `Moderate clinical presentation (${criticalityPercentage}%) suitable for outpatient symptomatic therapy, diagnostic panels, and targeted monitoring.`;
  } else {
    criticalityTier = 'Low Concern (0-40%)';
    criticalityExplanation = `Mild, self-limiting condition (${criticalityPercentage}%) manageable with outpatient supportive care and routine follow-up.`;
  }

  const isHighConcern = criticalityPercentage > 70;

  let urgencyLevel: 'Emergency (Level 1)' | 'Urgent (Level 2)' | 'Moderate (Level 3)' | 'Routine (Level 4)';
  if (criticalityPercentage >= 85) urgencyLevel = 'Emergency (Level 1)';
  else if (criticalityPercentage > 70) urgencyLevel = 'Urgent (Level 2)';
  else if (criticalityPercentage >= 41) urgencyLevel = 'Moderate (Level 3)';
  else urgencyLevel = 'Routine (Level 4)';

  const recommendation = matchSpecialistClient(message);
  const plan = matchPrescriptionPlanClient(message);
  
  const facilities = CLIENT_HOSPITALS.slice(0, 4).map((h) => ({
    id: h.id,
    name: h.name,
    address: h.address,
    locality: h.locality,
    rating: h.rating,
    userRatingsTotal: 340,
    distanceKm: h.distance_km,
    distanceText: `${h.distance_km} km`,
    estimatedTravelTime: `${Math.max(3, Math.round(h.distance_km * 2.2))} mins`,
    phoneNumber: h.contact_number,
    emergencyHelpline: h.emergency_helpline,
    googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(h.name + ' ' + h.address)}`,
    specialties: h.specialties || ['Emergency Trauma', 'Critical Care'],
    isOpenNow: true,
    availableBedTypes: {
      general: h.general_beds_available,
      oxygen: h.oxygen_beds_available,
      icu: h.icu_beds_available,
      total: h.general_beds_available + h.oxygen_beds_available + h.icu_beds_available,
    },
    totalBeds: {
      general: h.general_beds_total,
      oxygen: h.oxygen_beds_total,
      icu: h.icu_beds_total,
    },
    source: 'clinos_verified_registry' as const,
  }));

  const vitalsSummary = [
    tempVal ? `Temp: ${tempVal}°F` : '',
    sysBp && diaBp ? `BP: ${sysBp}/${diaBp} mmHg` : '',
    hrVal ? `HR: ${hrVal} bpm` : '',
    spo2Val ? `SpO2: ${spo2Val}%` : '',
    painVal ? `Pain: ${painVal}/10` : '',
  ].filter(Boolean).join(' | ');

  let replyText = '';
  if (isHighConcern) {
    replyText = `🚨 **CRITICALITY METER: ${criticalityPercentage}% — ${criticalityTier.toUpperCase()}**\n\n` +
      `**Dynamic Acuity Index:** ${scoreName}: **${scoreVal}/${maxScore}** (${scoreInterpretation})\n` +
      (vitalsSummary ? `**Extracted Objective Markers:** ${vitalsSummary}\n\n` : '\n') +
      `**⚠️ EMERGENCY TRIAGE PROTOCOL ACTIVATED:**\n` +
      `Your case presentation surpasses the acute clinical threshold (>70%). Immediate in-person medical intervention and trauma center routing have been engaged.\n\n` +
      `• **Live Hospital & ICU Bed Routing:** I have geolocated verified Level-1 trauma centers with available ICU/Oxygen beds in your regional corridor. Tap below to place an immediate 2-hour bed hold.\n` +
      `• **Urgent Specialist Referral:** Matched on-call **${recommendation.primarySpecialty}** specialists for urgent clinical review.\n` +
      `• **Pre-Hospital Safety:** Do not drive yourself. Maintain an open airway, sit upright if short of breath, and dispatch emergency transport (108/911).`;
  } else if (criticalityPercentage >= 41) {
    replyText = `📊 **CRITICALITY METER: ${criticalityPercentage}% — ${criticalityTier.toUpperCase()}**\n\n` +
      `**Dynamic Acuity Index:** ${scoreName}: **${scoreVal}/${maxScore}** (${scoreInterpretation})\n` +
      (vitalsSummary ? `**Extracted Objective Markers:** ${vitalsSummary}\n\n` : '\n') +
      `**Primary Working Assessment:** **${plan.primaryConditionTarget}**\n\n` +
      `*Emergency hospital bed routing has been bypassed as your acuity score is within the manageable outpatient range (≤70%).*\n\n` +
      `**Clinical Action Plan:**\n` +
      `1. **Outpatient Prescription Regimen:** Structured e-prescription draft prepared below for temporary control of health symptoms.\n` +
      `2. **Diagnostic Panel:** Recommended outpatient labs (CBC, CRP, targeted ultrasound/ECG) if symptoms persist beyond 48 hours.\n` +
      `3. **Specialist Telehealth:** Option to consult verified **${recommendation.primarySpecialty}** physicians.\n\n` +
      `⚠️ **Warning-Sign Checklist for Escalation:** Seek immediate emergency care if you develop sudden shortness of breath, unremitting vomiting, high fever (>103°F) with confusion, or severe chest/abdominal rigidity.`;
  } else {
    replyText = `🟢 **CRITICALITY METER: ${criticalityPercentage}% — ${criticalityTier.toUpperCase()}**\n\n` +
      `**Dynamic Acuity Index:** ${scoreName}: **${scoreVal}/${maxScore}** (${scoreInterpretation})\n` +
      `**Clinical Assessment:** **${plan.primaryConditionTarget}**\n\n` +
      `*Emergency bed routing bypassed (Low Concern ≤40%).*\n\n` +
      `**Home-Care & Symptom Management:**\n` +
      `• Follow the electronic supportive prescription draft provided below for symptom relief.\n` +
      `• Stay well-hydrated, rest, and monitor your temperature.\n` +
      `• Follow up with a physician if your symptoms fail to improve after 3 days.\n\n` +
      `⚠️ **Escalation Warning Signs:** Re-triage immediately if you develop high fever, difficulty breathing, or severe localized pain.`;
  }

  const primaryDiag = plan.primaryConditionTarget || 'Clinical Evaluation Pending';
  const icdCode = criticalityPercentage >= 85 ? 'I21.9' : raw.includes('appendic') ? 'K35.80' : raw.includes('migraine') ? 'G43.909' : 'R68.89';

  const warningSigns = [
    'Sudden onset of severe shortness of breath or cyanosis (blue lips)',
    'Chest pressure or crushing discomfort radiating to left arm or jaw',
    'Loss of consciousness, dizziness, or confusion',
    'Severe intractable abdominal pain with rigidity or continuous vomiting',
    'High fever > 103°F (39.4°C) unresponsive to antipyretics',
  ];

  const homeCare = [
    'Ensure adequate oral hydration with electrolyte fluids (2-3 L/day)',
    'Rest in a cool, quiet, and well-ventilated environment',
    'Take prescribed supportive medications strictly according to dosage schedule',
    'Monitor temperature and pulse twice daily',
    'Maintain light, easily digestible diet (bland foods, avoid oily/spicy meals)',
  ];

  const triageObj = {
    urgencyLevel,
    criticalityPercentage,
    criticalityTier,
    criticalityExplanation,
    warningSignsEscalation: warningSigns,
    homeCareGuidance: homeCare,
    primaryDiagnosis: primaryDiag,
    icd10Code: icdCode,
    confidenceScore: isEmergency ? 96 : isHighConcern ? 92 : 88,
    isRedFlag: isHighConcern,
    redFlagWarning: isHighConcern ? `Critical Life Threat Detected (${criticalityPercentage}%) — Score: ${scoreName} = ${scoreVal}/${maxScore}` : undefined,
    soapSubjective: `Patient Intake: "${text}".`,
    soapObjective: `${vitalsSummary || 'Standard clinical presentation'}. Criticality Meter: ${criticalityPercentage}% (${criticalityTier}). Metric: ${scoreName} = ${scoreVal}/${maxScore}.`,
    soapAssessment: `${primaryDiag} (ICD-10: ${icdCode}). Risk Stratification: ${criticalityExplanation}`,
    soapPlan: isHighConcern
      ? '1. Priority emergency trauma center routing. 2. Immediate ICU bed allocation. 3. 12-lead ECG, continuous vitals telemetry, emergency transport.'
      : '1. Initiate electronic outpatient prescription regimen. 2. Adhere to home-care protocols. 3. Escalate immediately if warning signs manifest.',
  };

  const followUps = isHighConcern
    ? ['Fastest driving route to emergency trauma center', 'Hold emergency ICU bed immediately', 'Call Emergency Ambulance (108/911)']
    : [
        'Download certified outpatient prescription PDF',
        'Schedule a telehealth consultation with matched specialist',
        'View warning-sign escalation checklist',
      ];

  const passedFacilities = isHighConcern || raw.includes('hospital') || raw.includes('bed') ? facilities : [];

  return {
    success: true,
    message: {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      sender: 'clin' as const,
      content: replyText,
      timestamp: new Date().toISOString(),
      metadata: {
        triage: triageObj,
        prescriptionPlan: plan,
        specialistReferral: {
          primarySpecialty: recommendation.primarySpecialty,
          rationale: recommendation.referralRationale,
          specialists: recommendation.recommendedSpecialists,
          questions: recommendation.suggestedQuestionsForDoctor,
        },
        nearbyFacilities: passedFacilities,
        emergencyTriggered: isHighConcern,
        suggestedFollowUps: followUps,
      },
    },
    triage: triageObj,
    prescriptionPlan: plan,
    specialistReferral: {
      primarySpecialty: recommendation.primarySpecialty,
      rationale: recommendation.referralRationale,
      specialists: recommendation.recommendedSpecialists,
      questions: recommendation.suggestedQuestionsForDoctor,
    },
    nearbyFacilities: passedFacilities,
    suggestedFollowUps: followUps,
  };
}

