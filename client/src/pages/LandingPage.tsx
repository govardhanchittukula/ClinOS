import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Brain, Search, ShieldCheck, FileCheck, ArrowRight, CheckCircle2, ShieldAlert, Cpu, Sparkles, Stethoscope } from 'lucide-react';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <MedicalDisclaimerBanner />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Ambient Glow Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-8 shadow-lg shadow-cyan-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Generation Multi-Agent Healthcare Intelligence</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-none"
          >
            Beyond Chatbots.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Autonomous AI Clinical Board.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            ClinOS orchestrates specialized AI agents (Planner, Researcher, Medical Critic, Synthesizer) to analyze raw patient symptoms, perform differential diagnostics, self-correct clinical hallucinations, and compile production-grade triage care plans.
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
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-base tracking-wide shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Launch Clinical Case Intake</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base transition-all flex items-center justify-center space-x-2"
            >
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Explore Dashboard</span>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Interactive Multi-Agent Pipeline Feature Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              4-Stage Multi-Agent State Machine
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-100">
              Autonomous Collaboration & Self-Correction
            </p>
            <p className="mt-3 text-slate-400 text-sm">
              Each specialized agent runs dedicated prompts and strict JSON schema validations powered by Gemini 2.5 Flash.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Agent 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider block mb-1">
                Node 01
              </span>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Triage Planner</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Decomposes unstructured symptoms, vitals, and chief complaints into an execution plan.
              </p>
            </div>

            {/* Agent 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                Node 02
              </span>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Clinical Researcher</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ranks differential diagnoses, pinpoints potential red-flag symptoms, and proposes lab/imaging workups.
              </p>
            </div>

            {/* Agent 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                Node 03 (Interceptor)
              </span>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Medical Critic</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Audits researcher findings for safety guardrails. If dangerous gaps are found, it triggers a forced retry loop.
              </p>
            </div>

            {/* Agent 4 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                Node 04
              </span>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Care Synthesizer</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Compiles validated clinical findings into an executive report with embedded non-removable disclaimers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Target Clinical Domains */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Stethoscope className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-base font-bold text-slate-100 mb-2">Diagnostic Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sorts complex symptom clusters by clinical urgency, risk factors, and vital instability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Activity className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-slate-100 mb-2">Differential Prioritization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates weighted probability vectors for primary and alternative pathologies based on patient history.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <ShieldAlert className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-base font-bold text-slate-100 mb-2">Self-Correcting Guardrails</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protects against hallucinated clinical facts or omitted red-flag surgical emergencies.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
