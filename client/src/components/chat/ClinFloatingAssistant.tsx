import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Pill,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../../types';
import { sendChatMessageApi } from '../../lib/api';
import { useClinStore } from '../../store/useClinStore';
import { getStoredAuthUser } from '../../lib/supabase';

export const ClinFloatingAssistant: React.FC = () => {
  const { 
    chatMessages, 
    addMessage, 
    isOverlayActive, 
    setOverlayActive,
    updateTriageData,
    userLocation 
  } = useClinStore();

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const user = getStoredAuthUser();

  useEffect(() => {
    if (isOverlayActive) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOverlayActive]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-close overlay when navigating to another route
    if (isOverlayActive) {
      setOverlayActive(false);
    }
  }, [location.pathname]);

  // If already on the dedicated /chat or /companion page, hide floating trigger to avoid duplicate interface
  if (
    location.pathname === '/chat' || 
    location.pathname === '/companion' ||
    user?.role !== 'patient'
  ) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMsg);
    if (!textToSend) setInput('');
    setLoading(true);

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await sendChatMessageApi({ 
        message: query,
        userLocation: userLocation || undefined
      }, abortController.signal);
      
      if (res && res.message) {
        addMessage(res.message);
        
        if (res.triage) {
          updateTriageData({
            triageSummary: res.triage,
            prescriptionPlan: res.prescriptionPlan,
            specialistReferral: res.specialistReferral,
            nearbyFacilities: res.nearbyFacilities
          });
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return; // Ignore aborted requests
      addMessage({
        id: 'err-' + Date.now(),
        sender: 'clin',
        content: 'Unable to reach clinical server. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      if (abortControllerRef.current === abortController) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOverlayActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    Clin <span className="text-xs font-normal opacity-90">AI Companion</span>
                  </h3>
                  <p className="text-[10px] text-cyan-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Clinical Engine v2.5 Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setOverlayActive(false);
                    navigate('/chat');
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-all"
                  title="Expand to Fullscreen Clinical Workspace"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOverlayActive(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
              <button
                onClick={() => handleSend('Check nearest emergency hospital beds')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 whitespace-nowrap font-medium transition-all"
              >
                🏥 Find Emergency Beds
              </button>
              <button
                onClick={() => handleSend('Right lower abdominal pain triage')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 whitespace-nowrap font-medium transition-all"
              >
                ⚡ Abdominal Triage
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {(chatMessages || []).map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-cyan-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>

                    {/* Compact Triage Alert if present */}
                    {m.metadata?.triage && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="font-bold text-cyan-700 dark:text-cyan-300">
                          {m.metadata.triage.primaryDiagnosis}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Confidence: {m.metadata.triage.confidenceScore}% • {m.metadata.triage.urgencyLevel}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
                  Clin is thinking...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Bottom link to full page */}
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Need full prescription PDF?</span>
              <button
                onClick={() => {
                  setOverlayActive(false);
                  navigate('/chat');
                }}
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                Open Full Workspace <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Clin anything..."
                className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white rounded-xl transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOverlayActive(!isOverlayActive)}
        className="relative group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 text-white rounded-full shadow-xl shadow-cyan-600/30 hover:shadow-cyan-600/50 transition-all border border-white/20"
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
        </div>
        <span className="font-bold text-sm tracking-wide">
          {isOverlayActive ? 'Close Clin' : 'Ask Clin AI'}
        </span>
      </motion.button>
    </div>
  );
};

export default ClinFloatingAssistant;
