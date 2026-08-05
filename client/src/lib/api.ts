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
} from '../types';

export const API_BASE = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '') + '/api';

export async function createWorkflowApi(payload: {
  clinicalCase: string;
  complexity: string;
  enableCritic: boolean;
  outputFormat: string;
  temperature: number;
  userId?: string;
}): Promise<{ success: boolean; workflowId: string; workflow: ClinicalWorkflow }> {
  const res = await fetch(`${API_BASE}/workflows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create clinical workflow');
  }

  return res.json();
}

export async function getSingleWorkflowApi(
  id: string
): Promise<{ success: boolean; workflow: ClinicalWorkflow; logs: AgentLog[] }> {
  const res = await fetch(`${API_BASE}/workflows/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch workflow details');
  }
  return res.json();
}

export async function cancelWorkflowApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/workflows/${id}/cancel`, {
    method: 'POST',
  });
  return res.ok;
}

export async function getOutputsApi(): Promise<{
  success: boolean;
  count: number;
  outputs: ClinicalWorkflow[];
}> {
  const res = await fetch(`${API_BASE}/outputs`);
  if (!res.ok) {
    throw new Error('Failed to fetch clinical outputs');
  }
  return res.json();
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
  const query = new URLSearchParams();
  if (params?.specialty) query.append('specialty', params.specialty);
  if (params?.search) query.append('search', params.search);
  if (params?.telehealthOnly) query.append('telehealthOnly', 'true');

  const res = await fetch(`${API_BASE}/specialists?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch specialists directory');
  }
  return res.json();
}

export async function getSpecialistByIdApi(id: string): Promise<{
  success: boolean;
  specialist: DoctorSpecialist;
}> {
  const res = await fetch(`${API_BASE}/specialists/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch specialist details');
  }
  return res.json();
}

export async function getSpecialistRecommendationsApi(payload: {
  clinicalCase: string;
  differentialDiagnoses?: string[];
}): Promise<{
  success: boolean;
  recommendation: RecommendationResult;
}> {
  const res = await fetch(`${API_BASE}/specialists/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch specialist recommendations');
  }
  return res.json();
}

export async function bookSpecialistAppointmentApi(
  payload: AppointmentBookingPayload
): Promise<{
  success: boolean;
  message: string;
  confirmation: AppointmentConfirmation;
}> {
  const res = await fetch(`${API_BASE}/specialists/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to book specialist appointment');
  }
  return res.json();
}

export async function getFormularyApi(params?: {
  drugClass?: string;
  search?: string;
}): Promise<{
  success: boolean;
  count: number;
  formulary: FormularyMedication[];
}> {
  const query = new URLSearchParams();
  if (params?.drugClass) query.append('drugClass', params.drugClass);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/prescriptions/formulary?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch medication formulary');
  }
  return res.json();
}

export async function getPrescriptionPlanApi(payload: {
  clinicalCase: string;
  differentialDiagnoses?: string[];
}): Promise<{
  success: boolean;
  plan: PrescriptionPlan;
}> {
  const res = await fetch(`${API_BASE}/prescriptions/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to generate prescription recommendations');
  }
  return res.json();
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
  const query = new URLSearchParams();
  if (params?.query) query.append('query', params.query);
  if (params?.locality) query.append('locality', params.locality);
  if (params?.bedType) query.append('bedType', params.bedType);

  const res = await fetch(`${API_BASE}/hospitals?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch nearby hospitals');
  }
  return res.json();
}

export async function bookHospitalBedApi(
  payload: BedBookingPayload
): Promise<{
  success: boolean;
  message: string;
  booking: BedBooking;
  updated_hospital: Hospital;
}> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to complete emergency bed booking');
  }
  return res.json();
}

export async function getBookingApi(
  idOrToken: string
): Promise<{
  success: boolean;
  booking: BedBooking;
}> {
  const res = await fetch(`${API_BASE}/bookings/${idOrToken}`);
  if (!res.ok) {
    throw new Error('Failed to retrieve bed booking status');
  }
  return res.json();
}

