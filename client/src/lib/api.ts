import { ClinicalWorkflow, AgentLog } from '../types';

const API_BASE = '/api';

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
