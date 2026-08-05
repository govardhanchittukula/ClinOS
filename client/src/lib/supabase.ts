import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo_key';

export const isSupabaseClientConfigured =
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  supabaseUrl !== 'https://demo.supabase.co' &&
  supabaseAnonKey !== 'demo_key';

export const supabase = isSupabaseClientConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock local auth session storage for instant demonstration
const LOCAL_USER_KEY = 'clinos_auth_user';

export const getStoredAuthUser = (): UserProfile => {
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }
  return {
    id: 'demo-physician-01',
    email: 'dr.jenkins@clinos.health',
    full_name: 'Dr. Sarah Jenkins, MD',
    role: 'physician',
  };
};

export const setStoredAuthUser = (user: UserProfile) => {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
};

export const clearStoredAuthUser = () => {
  localStorage.removeItem(LOCAL_USER_KEY);
};
