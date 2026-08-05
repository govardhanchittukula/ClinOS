export type UserRole = 'patient' | 'physician' | 'nurse' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  role: UserRole;
}

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ComplexityLevel = 'Routine' | 'Complex' | 'Deep Dive';
export type OutputFormat = 'Markdown' | 'JSON';

export interface WorkflowConfiguration {
  complexity: ComplexityLevel;
  enableCritic: boolean;
  outputFormat: OutputFormat;
  temperature: number;
}

export interface ClinicalWorkflow {
  id: string;
  user_id: string;
  clinical_case: string;
  status: WorkflowStatus;
  configuration: WorkflowConfiguration;
  final_output?: string | null;
  created_at: string;
  completed_at?: string | null;
}

export type AgentRole = 'planner' | 'researcher' | 'critic' | 'synthesizer' | 'system';

export interface AgentLog {
  id: string;
  workflowId: string;
  agentRole: AgentRole;
  action: string;
  payload: any;
  timestamp: string;
}

export interface WorkflowMetrics {
  totalExecutionTimeMs: number;
  criticIterations: number;
  isClinicallySafe: boolean;
  riskLevel: 'Low' | 'Moderate' | 'Critical - Retry Required';
}
