import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import workflowRoutes from './routes/workflow.routes';
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';
import { isLiveGeminiAvailable } from './config/gemini';
import { isSupabaseConfigured } from './config/supabase';

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for SSE & inline client dev compatibility
  })
);

// Enable CORS for frontend Vite client
app.use(
  cors({
    origin: '*', // Allows dev & production origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter middleware
app.use(rateLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: 'ClinOS Autonomous Multi-Agent Clinical Orchestrator',
    timestamp: new Date().toISOString(),
    liveGemini: isLiveGeminiAvailable,
    supabaseConnected: isSupabaseConfigured,
  });
});

// API Routes
app.use('/api', workflowRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = parseInt(env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🏥 ClinOS Autonomous Clinical Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🤖 Gemini AI Mode: ${isLiveGeminiAvailable ? 'LIVE SDK (gemini-2.5-flash)' : 'HIGH-FIDELITY SIMULATION'}`);
  console.log(`🗄️ Supabase Status: ${isSupabaseConfigured ? 'CONNECTED' : 'LOCAL IN-MEMORY DB'}`);
  console.log(`==================================================\n`);
});
