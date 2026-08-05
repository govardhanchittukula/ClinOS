import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from workspace root .env if present
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback local server .env

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GEMINI_API_KEY: z.string().optional().default('demo_key'),
  VITE_SUPABASE_URL: z.string().optional().default('https://demo.supabase.co'),
  VITE_SUPABASE_ANON_KEY: z.string().optional().default('demo_key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default('demo_key'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('⚠️ Environment variable validation warnings:', parsed.error.format());
}

export const env = parsed.success
  ? parsed.data
  : {
      PORT: process.env.PORT || '5000',
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'demo_key',
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://demo.supabase.co',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'demo_key',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_key',
    };
