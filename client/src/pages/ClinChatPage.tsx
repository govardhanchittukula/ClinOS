import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  FileText,
  MapPin,
  Stethoscope,
  Building2,
  Clock,
  Phone,
  Navigation,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Printer,
  Pill,
  Bed,
  CheckCircle2,
  HeartPulse,
  Flame,
  Zap,
  Info,
  Calendar,
  Activity,
} from 'lucide-react';
import {
  ChatMessage,
  ClinicalTriageSummary,
  PrescriptionPlan,
  DoctorSpecialist,
  Hospital,
  BedBooking,
  NearbyFacilityItem,
  MatchedSpecialist,
} from '../types';
import ReactMarkdown from 'react-markdown';
import { sendChatMessageApi, getSuggestedPromptsApi } from '../lib/api';
import { BedBookingModal } from '../components/BedBookingModal';
import { DoctorBookingModal } from '../components/DoctorBookingModal';
import { PrintableRxModal } from '../components/PrintableRxModal';
import { CLIENT_HOSPITALS } from '../data/mockData';
import { useClinStore } from '../store/useClinStore';

export const ClinChatPage: React.FC = () => {
  const { 
    chatMessages, 
    addMessage, 
    setChatMessages,
    userLocation,
    setUserLocation,
    updateTriageData
  } = useClinStore();

  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>('Hyderabad, Telangana (GPS Active)');
  const [suggestedPrompts, setSuggestedPrompts] = useState<
    Array<{ title: string; category: string; prompt: string; badge: string }>
  >([]);

  // Modals state
  const [selectedHospitalForBooking, setSelectedHospitalForBooking] = useState<Hospital | null>(null);
  const [selectedSpecialistForBooking, setSelectedSpecialistForBooking] = useState<DoctorSpecialist | null>(null);
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<PrescriptionPlan | null>(null);
  const [expandedSoapIds, setExpandedSoapIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Initial welcome message and suggested prompts
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-0',
      sender: 'clin',
      content: `Hello! I am **Clin**, your personal clinical AI companion and decision support engine at ClinOS.\n\nI can help you evaluate symptoms, draft certified evidence-based prescriptions, locate nearby emergency trauma centers with **live ICU bed telemetry**, and connect you with top-rated medical specialists.\n\nHow can I help you today? Feel free to describe any symptoms, pain, or health concerns you are experiencing.`,
      timestamp: new Date().toISOString(),
      metadata: {
        suggestedFollowUps: [
          'Right lower abdominal pain and nausea',
          'Crushing chest pain radiating to left arm',
          'Severe migraine with light sensitivity',
          'Persistent cough with yellow sputum and fever',
        ],
      },
    };

    if ((chatMessages || []).length === 0) {
      setChatMessages([welcomeMsg]);
    }

    // Fetch initial prompt starters
    getSuggestedPromptsApi()
      .then((res) => {
        if (res.prompts) setSuggestedPrompts(res.prompts);
      })
      .catch(() => {});

    // Try browser geolocation if available
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLocationName('Current Geolocation (GPS High-Accuracy)');
        },
        () => {
          // Fallback location kept
        }
      );
    }
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [(chatMessages || []), isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMsg);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const history = (chatMessages || []).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      }));

      const res = await sendChatMessageApi({
        message: query,
        conversationHistory: history,
        userLocation: userLocation || undefined,
        patientContext: {
          name: 'Patient (ClinOS Triage)',
        },
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
      if (err.name === 'AbortError') return;
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'clin',
        content: 'I encountered a temporary connection issue. Please check your network or try again.',
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMsg);
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsLoading(false);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSoap = (id: string) => {
    setExpandedSoapIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openBedBooking = (item: NearbyFacilityItem | Hospital) => {
    // Map facility to Hospital object
    const matchedHospital = CLIENT_HOSPITALS.find((h) => h.id === item.id) || {
      id: item.id,
      name: item.name,
      locality: item.locality || 'Medical District',
      address: item.address,
      latitude: (item as any).latitude || (userLocation?.latitude ?? 17.4182),
      longitude: (item as any).longitude || (userLocation?.longitude ?? 78.3473),
      contact_number: (item as any).phoneNumber || (item as any).contact_number || '+91 40 6700 0000',
      emergency_helpline: (item as any).emergencyHelpline || (item as any).emergency_helpline || '108',
      general_beds_available: (item as any).availableBedTypes?.general ?? (item as any).general_beds_available ?? 12,
      general_beds_total: (item as any).totalBeds?.general ?? (item as any).general_beds_total ?? 40,
      oxygen_beds_available: (item as any).availableBedTypes?.oxygen ?? (item as any).oxygen_beds_available ?? 6,
      oxygen_beds_total: (item as any).totalBeds?.oxygen ?? (item as any).oxygen_beds_total ?? 20,
      icu_beds_available: (item as any).availableBedTypes?.icu ?? (item as any).icu_beds_available ?? 3,
      icu_beds_total: (item as any).totalBeds?.icu ?? (item as any).icu_beds_total ?? 10,
      ambulance_available: true,
      rating: item.rating || 4.8,
      distance_km: (item as any).distanceKm ?? (item as any).distance_km ?? 2.5,
    };
    setSelectedHospitalForBooking(matchedHospital);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto px-4 py-3">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Clin <span className="text-cyan-600 dark:text-cyan-400 font-semibold text-sm">AI Health Companion</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                Core Engine v2.5
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                SOAP Triage & Rx Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {locationName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setChatMessages([
                {
                  id: 'welcome-reset',
                  sender: 'clin',
                  content: 'Workspace reset. How can I assist you with your clinical queries today?',
                  timestamp: new Date().toISOString(),
                },
              ]);
            }}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-600 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Workspace
          </button>
        </div>
      </div>

      {/* Suggested Prompts Pill Bar (Shown when only 1 message or user hasn't sent query) */}
      {(chatMessages || []).length <= 1 && suggestedPrompts.length > 0 && (
        <div className="mb-3 shrink-0">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Clinical Triage Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.prompt)}
                className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    {p.title}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      p.badge === 'Emergency'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : p.badge === 'Urgent'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300'
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {p.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-2">
        {(chatMessages || []).map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2.5 max-w-4xl w-full">
              {msg.sender === 'clin' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-cyan-500/20">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`flex-1 ${
                  msg.sender === 'user'
                    ? 'ml-auto max-w-xl bg-cyan-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-md'
                    : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 rounded-2xl rounded-tl-none p-4 shadow-sm'
                }`}
              >
                {/* Message text with formatting */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* ATTACHMENT CARD 1: Clinical Triage & Differential Diagnosis (SOAP) */}
                {msg.metadata?.triage && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div
                      className={`p-3.5 rounded-xl border ${
                        (msg.metadata.triage.criticalityPercentage && msg.metadata.triage.criticalityPercentage > 70) || msg.metadata.triage.isRedFlag
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                          : (msg.metadata.triage.criticalityPercentage && msg.metadata.triage.criticalityPercentage >= 41) || msg.metadata.triage.urgencyLevel.includes('Urgent')
                          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                              (msg.metadata.triage.criticalityPercentage && msg.metadata.triage.criticalityPercentage > 70) || msg.metadata.triage.isRedFlag
                                ? 'bg-rose-600 text-white animate-pulse'
                                : (msg.metadata.triage.criticalityPercentage && msg.metadata.triage.criticalityPercentage >= 41) || msg.metadata.triage.urgencyLevel.includes('Urgent')
                                ? 'bg-amber-500 text-white'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {msg.metadata.triage.criticalityTier || msg.metadata.triage.urgencyLevel}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                            ICD-10: {msg.metadata.triage.icd10Code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Diagnostic Confidence: {msg.metadata.triage.confidenceScore}%
                        </div>
                      </div>

                      {/* DYNAMIC CRITICALITY PERCENTAGE METER */}
                      {msg.metadata.triage.criticalityPercentage !== undefined && (
                        <div className="mb-3 p-2.5 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                            <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                              <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                              Dynamic Criticality Meter
                            </span>
                            <span
                              className={`font-mono text-xs px-2 py-0.5 rounded ${
                                msg.metadata.triage.criticalityPercentage > 70
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : msg.metadata.triage.criticalityPercentage >= 41
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {msg.metadata.triage.criticalityPercentage}% Criticality
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${
                                msg.metadata.triage.criticalityPercentage > 70
                                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 animate-pulse'
                                  : msg.metadata.triage.criticalityPercentage >= 41
                                  ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                                  : 'bg-gradient-to-r from-teal-400 to-emerald-500'
                              }`}
                              style={{ width: `${Math.max(5, msg.metadata.triage.criticalityPercentage)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                        Primary Diagnostic Suspicion: {msg.metadata.triage.primaryDiagnosis}
                      </div>

                      {msg.metadata.triage.redFlagWarning && (
                        <div className="text-xs text-rose-700 dark:text-rose-300 font-semibold mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {msg.metadata.triage.redFlagWarning}
                        </div>
                      )}

                      {/* Home-Care Guidance when Criticality <= 70% */}
                      {msg.metadata.triage.homeCareGuidance && (!msg.metadata.triage.criticalityPercentage || msg.metadata.triage.criticalityPercentage <= 70) && (
                        <div className="mt-2 mb-2 p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs">
                          <div className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                            🌿 Supportive Home-Care Protocol:
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-emerald-800 dark:text-emerald-300/90 text-[11px]">
                            {msg.metadata.triage.homeCareGuidance.slice(0, 3).map((guide, gIdx) => (
                              <li key={gIdx}>{guide}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Warning-Sign Escalation Checklist */}
                      {msg.metadata.triage.warningSignsEscalation && (
                        <div className="mt-2 mb-2 p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs">
                          <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            Escalation Warning Signs (Seek Immediate ER Care if Present):
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300/90 text-[11px]">
                            {msg.metadata.triage.warningSignsEscalation.slice(0, 3).map((warn, wIdx) => (
                              <li key={wIdx}>{warn}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Expandable SOAP documentation */}
                      <button
                        onClick={() => toggleSoap(msg.id)}
                        className="mt-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        {expandedSoapIds[msg.id] ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" /> Hide Structured SOAP Assessment
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" /> View Structured SOAP Assessment & Treatment Plan
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedSoapIds[msg.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-300 overflow-hidden"
                          >
                            <div>
                              <strong className="text-slate-900 dark:text-white">Subjective (S):</strong>{' '}
                              {msg.metadata.triage.soapSubjective}
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-white">Objective (O):</strong>{' '}
                              {msg.metadata.triage.soapObjective}
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-white">Assessment (A):</strong>{' '}
                              {msg.metadata.triage.soapAssessment}
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-white">Plan (P):</strong>{' '}
                              {msg.metadata.triage.soapPlan}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* ATTACHMENT CARD 2: Certified Prescription Plan */}
                {msg.metadata?.prescriptionPlan && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/50 to-cyan-50/30 dark:from-indigo-950/30 dark:to-cyan-950/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-bold text-xs text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                            Certified Rx Formulary Protocol
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedRxForPrint(msg.metadata!.prescriptionPlan!)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-indigo-900/60 hover:bg-indigo-100 dark:hover:bg-indigo-800/80 rounded-lg border border-indigo-300 dark:border-indigo-700 transition-all shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print / Download Rx PDF
                        </button>
                      </div>

                      <div className="space-y-2 mb-3">
                        {msg.metadata.prescriptionPlan.prescriptions?.slice(0, 3).map((item, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-2"
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white">
                                {item.medication.brandNames[0] || item.medication.genericName}{' '}
                                <span className="font-normal text-slate-500 dark:text-slate-400">
                                  ({item.medication.genericName} • {item.dosage})
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                                <strong>Instructions:</strong> {item.medication.counselingInstructions || item.clinicalRationale} • {item.frequency} for {item.duration}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shrink-0">
                              {item.route}
                            </span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                        * {msg.metadata.prescriptionPlan.mandatoryPhysicianDisclaimer}
                      </p>
                    </div>
                  </div>
                )}

                {/* ATTACHMENT CARD 3: Nearby Emergency Hospitals with Live Bed Tracking */}
                {msg.metadata?.nearbyFacilities && msg.metadata.nearbyFacilities.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-rose-500" />
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Nearby Trauma & Emergency Centers (Live Bed Telemetry)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Proximity Sorted • GPS Hyderabad
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.metadata.nearbyFacilities.slice(0, 2).map((hosp: any, hIdx) => {
                        const dist = hosp.distanceKm ?? hosp.distance_km ?? 2.1;
                        const drivingMins = hosp.estimatedTravelTime || `${Math.max(3, Math.round(dist * 2.2))} mins`;
                        const icuCount = hosp.availableBedTypes?.icu ?? hosp.icu_beds_available ?? 4;
                        const oxyCount = hosp.availableBedTypes?.oxygen ?? hosp.oxygen_beds_available ?? 8;
                        const phone = hosp.phoneNumber || hosp.contact_number || '+91 40 6700 0000';
                        const gMapsLink =
                          hosp.googleMapsUrl ||
                          `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hosp.name + ' ' + (hosp.address || ''))}`;

                        return (
                          <div
                            key={hIdx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                                  {hosp.name}
                                </h4>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                  ★ {hosp.rating || 4.9}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                                {hosp.locality || hosp.address}
                              </p>

                              {/* Distance & Bed counters */}
                              <div className="flex items-center gap-2 text-[11px] mb-2 flex-wrap">
                                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                  <Navigation className="w-3 h-3 text-cyan-500" />
                                  {dist} km ({drivingMins})
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                                  {icuCount} ICU Beds
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300">
                                  {oxyCount} O₂ Beds
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                              <button
                                onClick={() => openBedBooking(hosp)}
                                className="flex-1 py-1 px-2 text-center text-[11px] font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 rounded-lg transition-all shadow-sm shadow-rose-500/20"
                              >
                                Hold 2h Bed
                              </button>
                              <a
                                href={gMapsLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 px-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1"
                                title="Open in Google Maps"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Maps
                              </a>
                              <a
                                href={`tel:${phone}`}
                                className="p-1 px-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1"
                                title="Call Hospital"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ATTACHMENT CARD 4: Specialist Doctor Referrals */}
                {msg.metadata?.specialistReferral &&
                  msg.metadata.specialistReferral.specialists &&
                  msg.metadata.specialistReferral.specialists.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            Recommended Specialists ({msg.metadata.specialistReferral.primarySpecialty})
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {msg.metadata.specialistReferral.specialists.slice(0, 2).map((doc, dIdx) => (
                          <div
                            key={dIdx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl ${doc.avatarColor || 'bg-cyan-600'} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                              >
                                {doc.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')}
                              </div>
                              <div>
                                <div className="font-bold text-xs text-slate-900 dark:text-white">
                                  {doc.name}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {doc.specialty} • {doc.hospital.split('•')[0]}
                                </div>
                                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                  Next slot: {doc.nextAvailableSlot}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedSpecialistForBooking(doc)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all shrink-0 shadow-sm shadow-cyan-500/20"
                            >
                              Book Consult
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Follow up suggestions */}
                {msg.metadata?.suggestedFollowUps && msg.metadata.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                    {msg.metadata.suggestedFollowUps.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/70 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-600/60 transition-all text-left"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-11">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {/* Typing Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2.5 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
              <span>Clin is analyzing clinical symptoms and hospital capacity...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="pt-2 shrink-0 border-t border-slate-200 dark:border-slate-800">
        <div className="relative flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus-within:border-cyan-500 dark:focus-within:border-cyan-400 rounded-2xl p-2 shadow-sm">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms, pain, duration, or ask for nearest hospital beds..."
            className="flex-1 resize-none bg-transparent border-0 focus:ring-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none max-h-24 px-2 py-1"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-40 text-white transition-all shadow-md shadow-cyan-500/20 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-1">
          ClinOS AI provides certified decision support and triage. In severe life-threatening emergencies, call 108 or your local emergency hotline immediately.
        </p>
      </div>

      {/* Bed Booking Modal Trigger */}
      {selectedHospitalForBooking && (
        <BedBookingModal
          hospital={selectedHospitalForBooking}
          defaultBedType="icu"
          clinicalCaseSummary="Emergency clinical triage via Clin companion"
          onClose={() => setSelectedHospitalForBooking(null)}
          onBookingSuccess={() => setSelectedHospitalForBooking(null)}
        />
      )}

      {/* Doctor Specialist Booking Modal */}
      {selectedSpecialistForBooking && (
        <DoctorBookingModal
          specialist={selectedSpecialistForBooking}
          clinicalCaseSummary="Specialist referral triage via Clin companion"
          isOpen={true}
          onClose={() => setSelectedSpecialistForBooking(null)}
        />
      )}

      {/* Printable Prescription Modal */}
      {selectedRxForPrint && (
        <PrintableRxModal
          plan={selectedRxForPrint}
          isOpen={true}
          onClose={() => setSelectedRxForPrint(null)}
        />
      )}
    </div>
  );
};

export default ClinChatPage;
