import { GoogleGenAI } from '@google/genai';
import { env } from './env';

const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || 'demo_key';

// Initialize Google GenAI SDK instance
export const ai = new GoogleGenAI({ apiKey });

export const isLiveGeminiAvailable = apiKey && apiKey !== 'demo_key' && apiKey !== 'your_gemini_api_key_here';

// Core AI system configuration for clinical reasoning
export const agentConfig = {
  model: 'gemini-2.5-flash',
  temperature: 0.1,
};
