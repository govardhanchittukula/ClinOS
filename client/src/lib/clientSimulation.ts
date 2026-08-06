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
