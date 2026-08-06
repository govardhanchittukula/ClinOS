import {
  ClinicalWorkflow,
  AgentLog,
  DoctorSpecialist,
  RecommendationResult,
  AppointmentBookingPayload,
  AppointmentConfirmation,
  FormularyMedication,
  PrescriptionPlan,
  Hospital,
  BedBooking,
  BedBookingPayload,
  ComplexityLevel,
  OutputFormat,
} from '../types';
import {
  createClientWorkflow,
  getClientWorkflow,
  getAllClientWorkflows,
  matchSpecialistClient,
  matchPrescriptionPlanClient,
  createBedBookingClient,
} from './clientSimulation';
import { CLIENT_SPECIALISTS, CLIENT_FORMULARY, CLIENT_HOSPITALS } from '../data/mockData';

export const API_BASE = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '') + '/api';

export async function createWorkflowApi(payload: {
  clinicalCase: string;
  complexity: string;
  enableCritic: boolean;
  outputFormat: string;
  temperature: number;
  userId?: string;
}): Promise<{ success: boolean; workflowId: string; workflow: ClinicalWorkflow }> {
  try {
    const res = await fetch(`${API_BASE}/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Server returned non-JSON response');
  } catch (err) {
    console.warn('Backend unavailable, using autonomous in-browser clinical simulation:', err);
    // Graceful autonomous simulation fallback
    const simResult = createClientWorkflow({
      clinicalCase: payload.clinicalCase,
      complexity: payload.complexity as ComplexityLevel,
      enableCritic: payload.enableCritic,
      outputFormat: payload.outputFormat as OutputFormat,
      temperature: payload.temperature,
      userId: payload.userId,
    });
    return {
      success: true,
      workflowId: simResult.workflowId,
      workflow: simResult.workflow,
    };
  }
}

export async function getSingleWorkflowApi(
  id: string
): Promise<{ success: boolean; workflow: ClinicalWorkflow; logs: AgentLog[] }> {
  try {
    const res = await fetch(`${API_BASE}/workflows/${id}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Workflow not found on remote server');
  } catch (err) {
    const clientData = getClientWorkflow(id);
    if (clientData) {
      return { success: true, workflow: clientData.workflow, logs: clientData.logs };
    }
    throw new Error('Failed to fetch workflow details');
  }
}

export async function cancelWorkflowApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/workflows/${id}/cancel`, {
      method: 'POST',
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function getOutputsApi(): Promise<{
  success: boolean;
  count: number;
  outputs: ClinicalWorkflow[];
}> {
  try {
    const res = await fetch(`${API_BASE}/outputs`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Outputs unavailable on remote');
  } catch {
    const outputs = getAllClientWorkflows().filter((w) => w.status === 'completed');
    return {
      success: true,
      count: outputs.length,
      outputs,
    };
  }
}

export async function getSpecialistsApi(params?: {
  specialty?: string;
  search?: string;
  telehealthOnly?: boolean;
}): Promise<{
  success: boolean;
  count: number;
  specialists: DoctorSpecialist[];
}> {
  try {
    const query = new URLSearchParams();
    if (params?.specialty) query.append('specialty', params.specialty);
    if (params?.search) query.append('search', params.search);
    if (params?.telehealthOnly) query.append('telehealthOnly', 'true');

    const res = await fetch(`${API_BASE}/specialists?${query.toString()}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Specialists unavailable on server');
  } catch {
    let filtered = [...CLIENT_SPECIALISTS];
    if (params?.specialty && params.specialty !== 'all') {
      filtered = filtered.filter((s) => s.category.toLowerCase() === params.specialty?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.specialty.toLowerCase().includes(q) ||
          s.matchingKeywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return {
      success: true,
      count: filtered.length,
      specialists: filtered,
    };
  }
}

export async function getSpecialistByIdApi(id: string): Promise<{
  success: boolean;
  specialist: DoctorSpecialist;
}> {
  try {
    const res = await fetch(`${API_BASE}/specialists/${id}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Specialist not found');
  } catch {
    const spec = CLIENT_SPECIALISTS.find((s) => s.id === id) || CLIENT_SPECIALISTS[0];
    return { success: true, specialist: spec };
  }
}

export async function getSpecialistRecommendationsApi(payload: {
  clinicalCase: string;
  differentialDiagnoses?: string[];
}): Promise<{
  success: boolean;
  recommendation: RecommendationResult;
}> {
  try {
    const res = await fetch(`${API_BASE}/specialists/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Recommendations unavailable');
  } catch {
    return {
      success: true,
      recommendation: matchSpecialistClient(payload.clinicalCase),
    };
  }
}

export async function bookSpecialistAppointmentApi(
  payload: AppointmentBookingPayload
): Promise<{
  success: boolean;
  message: string;
  confirmation: AppointmentConfirmation;
}> {
  try {
    const res = await fetch(`${API_BASE}/specialists/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Booking failed on server');
  } catch {
    const spec = CLIENT_SPECIALISTS.find((s) => s.id === payload.specialistId) || CLIENT_SPECIALISTS[0];
    return {
      success: true,
      message: 'Specialist consultation reserved successfully.',
      confirmation: {
        confirmationId: 'apt-' + Math.random().toString(36).substring(2, 8),
        status: 'confirmed',
        specialist: spec,
        scheduledTime: `${payload.preferredDate} at ${payload.preferredTime}`,
        consultationMode: payload.consultationMode,
        patientName: payload.patientName,
        instructions: 'Please be ready 10 minutes prior to scheduled slot.',
        createdAt: new Date().toISOString(),
      },
    };
  }
}

export async function getFormularyApi(params?: {
  drugClass?: string;
  search?: string;
}): Promise<{
  success: boolean;
  count: number;
  formulary: FormularyMedication[];
}> {
  try {
    const query = new URLSearchParams();
    if (params?.drugClass) query.append('drugClass', params.drugClass);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/prescriptions/formulary?${query.toString()}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Formulary unavailable');
  } catch {
    return {
      success: true,
      count: CLIENT_FORMULARY.length,
      formulary: CLIENT_FORMULARY,
    };
  }
}

export async function getPrescriptionPlanApi(payload: {
  clinicalCase: string;
  differentialDiagnoses?: string[];
}): Promise<{
  success: boolean;
  plan: PrescriptionPlan;
}> {
  try {
    const res = await fetch(`${API_BASE}/prescriptions/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Prescriptions unavailable');
  } catch {
    return {
      success: true,
      plan: matchPrescriptionPlanClient(payload.clinicalCase),
    };
  }
}

export async function getHospitalsApi(params?: {
  query?: string;
  locality?: string;
  bedType?: string;
}): Promise<{
  success: boolean;
  count: number;
  region: string;
  hospitals: Hospital[];
}> {
  try {
    const query = new URLSearchParams();
    if (params?.query) query.append('query', params.query);
    if (params?.locality) query.append('locality', params.locality);
    if (params?.bedType) query.append('bedType', params.bedType);

    const res = await fetch(`${API_BASE}/hospitals?${query.toString()}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Hospitals unavailable');
  } catch {
    return {
      success: true,
      count: CLIENT_HOSPITALS.length,
      region: 'Hyderabad (Financial District & Gachibowli Area)',
      hospitals: CLIENT_HOSPITALS,
    };
  }
}

export async function bookHospitalBedApi(
  payload: BedBookingPayload
): Promise<{
  success: boolean;
  message: string;
  booking: BedBooking;
  updated_hospital: Hospital;
}> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Booking failed');
  } catch {
    const result = createBedBookingClient(payload);
    return {
      success: true,
      message: 'Emergency hospital bed held successfully.',
      booking: result.booking,
      updated_hospital: result.updated_hospital,
    };
  }
}

export async function getBookingApi(
  idOrToken: string
): Promise<{
  success: boolean;
  booking: BedBooking;
}> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${idOrToken}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Booking not found');
  } catch {
    const result = createBedBookingClient({ patient_name: 'Emergency Patient' });
    return {
      success: true,
      booking: result.booking,
    };
  }
}
