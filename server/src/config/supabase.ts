import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export interface DbProfile {
  id: string;
  full_name: string;
  role: 'patient' | 'physician' | 'nurse' | 'admin';
  created_at: string;
}

export interface DbWorkflow {
  id: string;
  user_id: string;
  clinical_case: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  configuration: {
    complexity: 'Routine' | 'Complex' | 'Deep Dive';
    enableCritic: boolean;
    outputFormat: 'Markdown' | 'JSON';
    temperature: number;
  };
  final_output?: string | null;
  created_at: string;
  completed_at?: string | null;
}

export interface DbAgentLog {
  id: string;
  workflow_id: string;
  agent_role: 'planner' | 'researcher' | 'critic' | 'synthesizer';
  action: string;
  payload: any;
  timestamp: string;
}

// In-Memory Database Fallback for smooth out-of-the-box local operation
class InMemoryDb {
  public profiles: Map<string, DbProfile> = new Map();
  public workflows: Map<string, DbWorkflow> = new Map();
  public agentLogs: DbAgentLog[] = [];

  constructor() {
    // Seed default demo profiles
    const demoUser: DbProfile = {
      id: 'demo-physician-01',
      full_name: 'Dr. Sarah Jenkins, MD',
      role: 'physician',
      created_at: new Date().toISOString(),
    };
    this.profiles.set(demoUser.id, demoUser);
  }
}

export const inMemoryDb = new InMemoryDb();

export const isSupabaseConfigured =
  env.VITE_SUPABASE_URL &&
  env.VITE_SUPABASE_URL !== 'https://your-supabase-project.supabase.co' &&
  env.VITE_SUPABASE_URL !== 'https://demo.supabase.co' &&
  env.SUPABASE_SERVICE_ROLE_KEY &&
  env.SUPABASE_SERVICE_ROLE_KEY !== 'demo_key';

export const supabaseAdmin = isSupabaseConfigured
  ? createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null;
