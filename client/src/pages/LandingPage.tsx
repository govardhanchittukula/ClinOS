import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Brain, Search, ShieldCheck, FileCheck, ArrowRight, CheckCircle2, ShieldAlert, Cpu, Sparkles, Stethoscope, FileText, Zap, HeartPulse } from 'lucide-react';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import { BrandLogo } from '../components/BrandLogo';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <MedicalDisclaimerBanner />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Ambient Medical Blue & Teal Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-400/15 via-teal-400/10 to-emerald-400/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Hero Brand Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <BrandLogo size="lg" />
          </motion.div>

          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="font-semibold">Next-Generation Multi-Agent Clinical Intelligence</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]"
          >
            Beyond Chatbots.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Autonomous AI Clinical Board.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            ClinOS orchestrates specialized AI agents (Planner, Researcher, Medical Critic, Synthesizer) to analyze patient symptoms, perform differential diagnostics, audit clinical safety, and compile production-grade triage care plans.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/workflows/new"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-base tracking-wide shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Launch Clinical Case Intake</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-base shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <Cpu className="w-5 h-5 text-blue-600" />
              <span>Physician Dashboard</span>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 4 Multi-Agent Architecture Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-2">
            The ClinOS Multi-Agent Pipeline
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Four Specialized Agents. Zero Unchecked Hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Agent 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono font-bold text-blue-600">AGENT 01</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">Triaging</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Triage Planner</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Decomposes unstructured symptoms, patient history, and vital signs into a structured clinical execution graph with assigned urgency.
            </p>
          </div>

          {/* Agent 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-teal-600" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono font-bold text-teal-600">AGENT 02</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">Diagnosis</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Clinical Researcher</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fetches evidence-based differential diagnoses, clinical red flags, and diagnostic criteria from medical knowledge graphs.
            </p>
          </div>

          {/* Agent 3 - The Critic */}
          <div className="p-6 rounded-2xl bg-white border-2 border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400 transition-all group relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-mono font-bold text-amber-800">
              HALLUCINATION GUARD
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono font-bold text-amber-600">AGENT 03</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">Safety Audit</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Medical Critic</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Audits diagnostic reasoning. If contraindications or missing red flags are detected, it <strong>rejects the hypothesis</strong> and triggers autonomous self-correction.
            </p>
          </div>

          {/* Agent 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono font-bold text-emerald-600">AGENT 04</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">Synthesis</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Care Synthesizer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assembles verified differential hypotheses, recommended diagnostic workups, and red flags into EHR-ready medical summaries.
            </p>
          </div>

        </div>
      </section>

      {/* Clinical Feature Matrix */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Pre-Hospital Triage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Computes standardized ESI (Emergency Severity Index) triage urgency ratings with explicit risk stratification.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Real-Time SSE Streaming</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch agent thoughts, iterative critic evaluations, and reasoning updates stream live via Server-Sent Events.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Clinical Safety Safeguards</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict medical disclaimers, critic-driven iteration gates, and audit trails safeguard patient decision support.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <BrandLogo size="sm" showText={false} />
            <span>ClinOS v2.5 PRO • Multi-Agent Clinical Decision Support</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Designed for Clinical Decision Support • ISO-13485 Boundary
          </div>
        </div>
      </footer>

    </div>
  );
};
