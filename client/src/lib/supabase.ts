import { createClient } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../types';

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

export const DEMO_CREDENTIALS = {
  patient: {
    email: 'lokesh@clinos.demo',
    password: 'Hackathon2026!',
    full_name: 'Lokesh Yadhav',
    role: 'patient' as UserRole,
  },
  physician: {
    email: 'dr.sharma@clinos.demo',
    password: 'Hackathon2026!',
    full_name: 'Dr. Sharma (Lead Physician)',
    role: 'physician' as UserRole,
  },
  nurse: {
    email: 'intake@clinos.demo',
    password: 'Hackathon2026!',
    full_name: 'Nurse Priya (Intake Specialist)',
    role: 'nurse' as UserRole,
  },
};

export const getRoleDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'patient':
      return '/dashboard/patient';
    case 'physician':
      return '/dashboard/doctor';
    case 'nurse':
      return '/dashboard/practitioner';
    case 'admin':
      return '/dashboard/doctor';
    default:
      return '/dashboard/patient';
  }
};

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
    email: 'dr.sharma@clinos.demo',
    full_name: 'Dr. Sharma (Lead Physician)',
    role: 'physician',
  };
};

export const setStoredAuthUser = (user: UserProfile) => {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('clinos_auth_changed'));
};

export const clearStoredAuthUser = () => {
  localStorage.removeItem(LOCAL_USER_KEY);
  window.dispatchEvent(new Event('clinos_auth_changed'));
};

export const switchRole = (newRole: UserRole): UserProfile => {
  const roleData = DEMO_CREDENTIALS[newRole as keyof typeof DEMO_CREDENTIALS] || {
    email: `${newRole}@clinos.demo`,
    full_name: `Demo ${newRole.toUpperCase()}`,
    role: newRole,
  };

  const updatedUser: UserProfile = {
    id: `user-${newRole}-01`,
    email: roleData.email,
    full_name: roleData.full_name,
    role: newRole,
  };

  setStoredAuthUser(updatedUser);
  return updatedUser;
};

export async function loginWithSupabaseOrFallback(
  email: string,
  password: string,
  targetRole?: UserRole,
  fullName?: string
): Promise<{ user: UserProfile; fromSupabase: boolean; error?: string }> {
  // If Supabase client is live and configured, try signInWithPassword
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        // Try to fetch profile from profiles table
        let profileRole: UserRole = targetRole || (data.user.user_metadata?.role as UserRole) || 'physician';
        let profileName = fullName || data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'ClinOS User';

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileData) {
          if (profileData.role) profileRole = profileData.role;
          if (profileData.full_name) profileName = profileData.full_name;
        }

        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: profileName,
          role: profileRole,
        };

        setStoredAuthUser(userProfile);
        return { user: userProfile, fromSupabase: true };
      }
    } catch (err: any) {
      console.warn('Supabase Auth error, switching to instant demo fallback:', err);
    }
  }

  // Graceful Demo Fallback (Instant Hackathon Mode)
  let matchedRole: UserRole = targetRole || 'physician';
  let matchedName: string = fullName || 'ClinOS User';

  const lowerEmail = email.toLowerCase();
  if (lowerEmail.includes('lokesh') || lowerEmail.includes('patient')) {
    matchedRole = 'patient';
    matchedName = 'Lokesh Yadhav';
  } else if (lowerEmail.includes('priya') || lowerEmail.includes('intake') || lowerEmail.includes('nurse')) {
    matchedRole = 'nurse';
    matchedName = 'Nurse Priya (Intake Specialist)';
  } else if (lowerEmail.includes('sharma') || lowerEmail.includes('doctor') || lowerEmail.includes('physician') || lowerEmail.includes('dr.')) {
    matchedRole = 'physician';
    matchedName = 'Dr. Sharma (Lead Physician)';
  }

  const fallbackUser: UserProfile = {
    id: `demo-${matchedRole}-${Date.now()}`,
    email,
    full_name: matchedName,
    role: matchedRole,
  };

  setStoredAuthUser(fallbackUser);
  return { user: fallbackUser, fromSupabase: false };
}


