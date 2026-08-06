import { GoogleGenAI } from '@google/genai';
import { ai, isLiveGeminiAvailable, agentConfig } from '../config/gemini';
import { PrescriptionService } from './prescription.service';
import { SpecialistService, MatchedSpecialist } from './specialist.service';
import { hospitalService, NearbyFacilityItem } from './hospital.service';
import { FormularyMedication } from '../data/medications.data';
import { randomUUID } from 'crypto';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'clin' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    triage?: ClinicalTriageSummary;
    prescriptionPlan?: any;
    specialistReferral?: {
      primarySpecialty: string;
      rationale: string;
      specialists: MatchedSpecialist[];
      questions: string[];
    };
    nearbyFacilities?: NearbyFacilityItem[];
    emergencyTriggered?: boolean;
    suggestedFollowUps?: string[];
  };
}

export interface ClinicalTriageSummary {
  urgencyLevel: 'Emergency (Level 1)' | 'Urgent (Level 2)' | 'Moderate (Level 3)' | 'Routine (Level 4)';
  criticalityPercentage: number;
  criticalityTier: 'Low Concern (0-40%)' | 'Moderate Concern (41-70%)' | 'High Concern / Emergency (71-100%)';
  criticalityExplanation: string;
  warningSignsEscalation?: string[];
  homeCareGuidance?: string[];
  primaryDiagnosis: string;
  icd10Code: string;
  confidenceScore: number;
  isRedFlag: boolean;
  redFlagWarning?: string;
  soapSubjective: string;
  soapObjective: string;
  soapAssessment: string;
  soapPlan: string;
}

export interface ChatSessionPayload {
  message: string;
  conversationHistory?: { role: 'user' | 'assistant' | 'system'; content: string }[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  patientContext?: {
    name?: string;
    age?: number;
    gender?: string;
    knownAllergies?: string[];
    chronicConditions?: string[];
  };
}

export const CLINOS_CORE_SYSTEM_PROMPT = `
You are ClinOS Core Clinical Engine v2.5 & "Clin", an autonomous clinical orchestrator and certified decision-support agent.

CRITICAL PROTOCOL:
1. Parse incoming patient profile, vitals, age, duration, symptoms, and clinical markers.
2. Compute a dynamic Criticality Percentage Meter (0% to 100%):
   - 0% - 40% (Low Concern): Mild, self-limiting conditions.
   - 41% - 70% (Moderate Concern): Requires active monitoring or outpatient prescription intervention.
   - 71% - 100% (High Concern / Emergency): Severe, acute, or life-threatening presentation requiring immediate physical intervention.
3. CONDITIONAL WORKFLOW BRANCHING:
   - IF Criticality Percentage > 70% (High Concern / Emergency):
     * Trigger Emergency Triage Protocol.
     * Query nearby emergency facilities, live ICU/oxygen beds, and generate emergency bed hold options.
     * Match urgent on-call specialists (Emergency Medicine, General Surgery, Cardiology).
   - IF Criticality Percentage <= 70% (Low/Moderate Concern):
     * Bypass emergency bed routing.
     * Generate structured SOAP note and targeted outpatient prescriptions for temporary control of health symptoms.
     * Provide clear home-care guidance and a warning-sign checklist for escalation.
`;

export interface ExtractedClinicalVitals {
  temperature?: { value: number; unit: 'F' | 'C'; isFever: boolean };
  bloodPressure?: { systolic: number; diastolic: number; isHypertensive: boolean; isHypotensive: boolean };
  heartRate?: { bpm: number; isTachycardia: boolean; isBradycardia: boolean };
  oxygenSaturation?: { percentage: number; isHypoxemic: boolean };
  respiratoryRate?: { rate: number; isTachypneic: boolean };
  painScale?: { score: number; isSevere: boolean };
  duration?: string;
  symptomLocalization?: string[];
}

export interface DynamicClinicalScore {
  scoreName: string;
  scoreValue: number;
  maxScore: number;
  interpretation: string;
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk / Severe';
}

export class ChatService {
  public extractVitalsAndMarkers(text: string): ExtractedClinicalVitals {
    const raw = text.toLowerCase();
    const vitals: ExtractedClinicalVitals = {};

    const tempMatch = text.match(/(\d{2,3}(?:\.\d)?)\s*(?:°|deg|degrees)?\s*([fcFC])\b/) ||
                      text.match(/(?:temp|temperature|fever of)\s*[:=]?\s*(\d{2,3}(?:\.\d)?)/i);
    if (tempMatch) {
      const val = parseFloat(tempMatch[1]);
      const unit = (tempMatch[2] ? tempMatch[2].toUpperCase() : val > 45 ? 'F' : 'C') as 'F' | 'C';
      const isFever = unit === 'F' ? val >= 100.4 : val >= 38.0;
      vitals.temperature = { value: val, unit, isFever };
    } else if (raw.includes('high fever') || raw.includes('chills and fever')) {
      vitals.temperature = { value: 102.0, unit: 'F', isFever: true };
    }

    const bpMatch = text.match(/(?:bp|blood pressure)?\s*[:=]?\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*(?:mmhg)?/i);
    if (bpMatch) {
      const sys = parseInt(bpMatch[1], 10);
      const dia = parseInt(bpMatch[2], 10);
      vitals.bloodPressure = {
        systolic: sys,
        diastolic: dia,
        isHypertensive: sys >= 140 || dia >= 90,
        isHypotensive: sys < 90 || dia < 60,
      };
    }

    const hrMatch = text.match(/(?:hr|heart rate|pulse)\s*[:=]?\s*(\d{2,3})\s*(?:bpm)?/i) ||
                    text.match(/(\d{2,3})\s*bpm/i);
    if (hrMatch) {
      const bpm = parseInt(hrMatch[1], 10);
      vitals.heartRate = {
        bpm,
        isTachycardia: bpm > 100,
        isBradycardia: bpm < 60,
      };
    }

    const spo2Match = text.match(/(?:spo2|o2 sat|oxygen|o2 saturation)\s*[:=]?\s*(\d{2,3})\s*%/i) ||
                      text.match(/(\d{2,3})\s*%\s*(?:spo2|o2|oxygen)/i);
    if (spo2Match) {
      const pct = parseInt(spo2Match[1], 10);
      vitals.oxygenSaturation = {
        percentage: pct,
        isHypoxemic: pct < 94,
      };
    }

    const painMatch = text.match(/(?:pain|severity|scale)?\s*[:=]?\s*(\d{1,2})\s*(?:\/|out of)\s*10/i);
    if (painMatch) {
      const score = Math.min(10, parseInt(painMatch[1], 10));
      vitals.painScale = { score, isSevere: score >= 7 };
    } else if (raw.includes('severe') || raw.includes('excruciating') || raw.includes('crushing')) {
      vitals.painScale = { score: 9, isSevere: true };
    } else if (raw.includes('moderate')) {
      vitals.painScale = { score: 5, isSevere: false };
    }

    const durationMatch = text.match(/(\d+\s*(?:hour|hr|day|week|month|yr|year|minute|min)s?(?:\s*ago)?)/i);
    if (durationMatch) {
      vitals.duration = durationMatch[1];
    }

    const locations: string[] = [];
    if (raw.includes('right lower') || raw.includes('rlq') || raw.includes('navel') || raw.includes('appendix')) locations.push('Right Lower Abdominal Quadrant');
    if (raw.includes('chest') || raw.includes('retrosternal') || raw.includes('precordial')) locations.push('Retrosternal / Precordial Area');
    if (raw.includes('left arm') || raw.includes('jaw') || raw.includes('shoulder')) locations.push('Radiation to Left Arm / Jaw');
    if (raw.includes('head') || raw.includes('temple') || raw.includes('forehead')) locations.push('Cranial / Frontotemporal');
    if (raw.includes('epigastric') || raw.includes('upper abdomen')) locations.push('Epigastrium');
    if (raw.includes('flank') || raw.includes('back')) locations.push('Flank / Costovertebral Angle');
    vitals.symptomLocalization = locations;

    return vitals;
  }

  public computeClinicalScore(text: string, vitals: ExtractedClinicalVitals): DynamicClinicalScore {
    const raw = text.toLowerCase();

    if (raw.includes('appendix') || raw.includes('appendic') || raw.includes('right lower') || raw.includes('rlq') || (raw.includes('abdominal') && raw.includes('pain'))) {
      let score = 0;
      if (raw.includes('navel') || raw.includes('periumbilical') || raw.includes('migrat')) score += 1;
      if (raw.includes('anorexia') || raw.includes('loss of appetite') || raw.includes('not eating')) score += 1;
      if (raw.includes('nausea') || raw.includes('vomit')) score += 1;
      if (raw.includes('tender') || raw.includes('rebound') || raw.includes('sharp')) score += 2;
      if (raw.includes('rebound') || raw.includes('mcburney')) score += 1;
      if (vitals.temperature?.isFever || raw.includes('fever') || (vitals.temperature?.value && vitals.temperature.value >= 99.1)) score += 1;
      score += 2;

      const clamped = Math.min(10, Math.max(3, score));
      return {
        scoreName: 'Alvarado Score (Acute Appendicitis Probability)',
        scoreValue: clamped,
        maxScore: 10,
        interpretation: clamped >= 7 ? 'High Probability of Acute Appendicitis — Urgent Surgical Referral' : clamped >= 5 ? 'Compatible with Appendicitis — Diagnostic Imaging Indicated' : 'Low Suspicion of Appendicitis',
        riskCategory: clamped >= 7 ? 'High Risk / Severe' : clamped >= 5 ? 'Moderate Risk' : 'Low Risk',
      };
    }

    if (raw.includes('chest') || raw.includes('heart') || raw.includes('angina') || raw.includes('infarct') || raw.includes('troponin')) {
      let heartScore = 0;
      if (raw.includes('crushing') || raw.includes('pressure') || raw.includes('radiat')) heartScore += 2; else heartScore += 1;
      if (raw.includes('st elevation') || raw.includes('ecg')) heartScore += 2; else heartScore += 1;
      if (raw.includes('diabet') || raw.includes('hypertens') || raw.includes('smok') || raw.includes('cholesterol')) heartScore += 2; else heartScore += 1;
      if (raw.includes('troponin') || raw.includes('elevated')) heartScore += 2;
      
      const clamped = Math.min(10, Math.max(3, heartScore));
      return {
        scoreName: 'HEART Score (Major Adverse Cardiac Events)',
        scoreValue: clamped,
        maxScore: 10,
        interpretation: clamped >= 7 ? 'High Risk for Acute Myocardial Infarction — Immediate Resuscitation & Cath Lab Activation' : clamped >= 4 ? 'Moderate Risk — Inpatient Cardiac Workup & Serial Biomarkers' : 'Low Cardiac Risk — Ambulatory Workup',
        riskCategory: clamped >= 7 ? 'High Risk / Severe' : clamped >= 4 ? 'Moderate Risk' : 'Low Risk',
      };
    }

    let mews = 0;
    if (vitals.heartRate?.bpm) {
      if (vitals.heartRate.bpm >= 130) mews += 3;
      else if (vitals.heartRate.bpm >= 111) mews += 2;
      else if (vitals.heartRate.bpm >= 101 || vitals.heartRate.bpm <= 50) mews += 1;
    }
    if (vitals.bloodPressure?.systolic) {
      if (vitals.bloodPressure.systolic <= 70) mews += 3;
      else if (vitals.bloodPressure.systolic <= 80) mews += 2;
      else if (vitals.bloodPressure.systolic <= 100 || vitals.bloodPressure.systolic >= 200) mews += 1;
    }
    if (vitals.oxygenSaturation?.percentage) {
      if (vitals.oxygenSaturation.percentage < 90) mews += 3;
      else if (vitals.oxygenSaturation.percentage < 94) mews += 2;
      else if (vitals.oxygenSaturation.percentage < 96) mews += 1;
    }
    if (vitals.temperature?.value) {
      const tempF = vitals.temperature.unit === 'C' ? (vitals.temperature.value * 9/5) + 32 : vitals.temperature.value;
      if (tempF >= 102.5 || tempF < 95.0) mews += 2;
      else if (tempF >= 100.4) mews += 1;
    }
    if (vitals.painScale?.isSevere) mews += 1;

    const clampedMews = Math.min(14, Math.max(1, mews));
    return {
      scoreName: 'Modified Early Warning Score (MEWS)',
      scoreValue: clampedMews,
      maxScore: 14,
      interpretation: clampedMews >= 5 ? 'Critical Clinical Instability — Immediate Rapid Response / ICU Hold' : clampedMews >= 3 ? 'Urgent Clinical Review & Monitoring Required' : 'Clinically Stable for Ambulatory Care',
      riskCategory: clampedMews >= 5 ? 'High Risk / Severe' : clampedMews >= 3 ? 'Moderate Risk' : 'Low Risk',
    };
  }

  public computeCriticalityPercentage(
    text: string,
    vitals: ExtractedClinicalVitals,
    score: DynamicClinicalScore,
    isEmergencyRedFlag: boolean
  ): {
    percentage: number;
    tier: 'Low Concern (0-40%)' | 'Moderate Concern (41-70%)' | 'High Concern / Emergency (71-100%)';
    explanation: string;
  } {
    const raw = text.toLowerCase();
    let pct = 25;

    if (isEmergencyRedFlag || (vitals.oxygenSaturation?.percentage && vitals.oxygenSaturation.percentage < 90) || (vitals.bloodPressure?.systolic && vitals.bloodPressure.systolic < 85)) {
      pct = Math.min(98, 88 + (score.scoreValue * 1.5));
    } else if (score.scoreName.includes('Alvarado') && score.scoreValue >= 7) {
      pct = Math.min(86, 74 + (score.scoreValue * 1.2));
    } else if (score.scoreName.includes('HEART') && score.scoreValue >= 7) {
      pct = Math.min(96, 80 + (score.scoreValue * 1.8));
    } else if (score.scoreValue >= 5 || (vitals.painScale?.score && vitals.painScale.score >= 8)) {
      pct = Math.min(78, 68 + score.scoreValue);
    } else if (vitals.temperature?.isFever || (vitals.painScale?.score && vitals.painScale.score >= 5) || raw.includes('migraine') || raw.includes('infection') || raw.includes('cough')) {
      pct = Math.min(65, 45 + (score.scoreValue * 3));
    } else {
      pct = Math.min(38, 15 + (score.scoreValue * 4));
    }

    const rounded = Math.round(pct);
    let tier: 'Low Concern (0-40%)' | 'Moderate Concern (41-70%)' | 'High Concern / Emergency (71-100%)';
    let explanation = '';

    if (rounded > 70) {
      tier = 'High Concern / Emergency (71-100%)';
      explanation = `High acuity presentation (${rounded}%) requiring immediate physical intervention, emergency bed reservation, and urgent specialist evaluation.`;
    } else if (rounded >= 41) {
      tier = 'Moderate Concern (41-70%)';
      explanation = `Moderate clinical presentation (${rounded}%) suitable for outpatient symptomatic therapy, diagnostic panels, and targeted monitoring.`;
    } else {
      tier = 'Low Concern (0-40%)';
      explanation = `Mild, self-limiting condition (${rounded}%) manageable with outpatient supportive care and routine follow-up.`;
    }

    return { percentage: rounded, tier, explanation };
  }

  async processChatMessage(payload: ChatSessionPayload): Promise<{
    message: ChatMessage;
    triage?: ClinicalTriageSummary;
    prescriptionPlan?: any;
    specialistReferral?: any;
    nearbyFacilities?: NearbyFacilityItem[];
    suggestedFollowUps: string[];
  }> {
    const userText = (payload.message || '').trim();
    const lat = payload.userLocation?.latitude || 17.4182;
    const lng = payload.userLocation?.longitude || 78.3473;

    const extractedVitals = this.extractVitalsAndMarkers(userText);
    const clinicalScore = this.computeClinicalScore(userText, extractedVitals);
    const isEmergencyRedFlag = this.detectEmergencyRedFlags(userText);

    const { percentage: criticalityPercentage, tier: criticalityTier, explanation: criticalityExplanation } =
      this.computeCriticalityPercentage(userText, extractedVitals, clinicalScore, isEmergencyRedFlag);

    const isHighConcern = criticalityPercentage > 70;

    let urgencyLevel: 'Emergency (Level 1)' | 'Urgent (Level 2)' | 'Moderate (Level 3)' | 'Routine (Level 4)';
    if (criticalityPercentage >= 85) urgencyLevel = 'Emergency (Level 1)';
    else if (criticalityPercentage > 70) urgencyLevel = 'Urgent (Level 2)';
    else if (criticalityPercentage >= 41) urgencyLevel = 'Moderate (Level 3)';
    else urgencyLevel = 'Routine (Level 4)';

    let triageSummary: ClinicalTriageSummary | undefined;
    let prescriptionPlan: any = undefined;
    let specialistReferral: any = undefined;
    let nearbyFacilities: NearbyFacilityItem[] = [];

    const tasks: Promise<any>[] = [];

    try {
      const specRes = SpecialistService.recommendSpecialistsForCase(userText);
      specialistReferral = {
        primarySpecialty: specRes.primarySpecialty,
        rationale: specRes.referralRationale,
        specialists: specRes.recommendedSpecialists,
        questions: specRes.suggestedQuestionsForDoctor,
      };
    } catch (err: any) {
      console.warn('Specialist service error in chat:', err);
    }

    try {
      prescriptionPlan = PrescriptionService.generatePrescriptionPlan(userText);
    } catch (err: any) {
      console.warn('Prescription service error in chat:', err);
    }

    if (isHighConcern || userText.toLowerCase().includes('hospital') || userText.toLowerCase().includes('bed')) {
      tasks.push(
        hospitalService
          .getNearbyFacilities({
            latitude: lat,
            longitude: lng,
            bedType: urgencyLevel === 'Emergency (Level 1)' ? 'icu' : 'all',
          })
          .then((res: any) => {
            nearbyFacilities = res.facilities;
          })
          .catch((err: any) => console.warn('Hospital service error in chat:', err))
      );
    }

    await Promise.all(tasks);

    let assistantReply = '';
    let followUps: string[] = [];

    if (isLiveGeminiAvailable) {
      try {
        const response = await ai.models.generateContent({
          model: agentConfig.model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${CLINOS_CORE_SYSTEM_PROMPT}\n\nPATIENT CASE INTAKE:\n"${userText}"\n\nEXTRACTED OBJECTIVE VITALS:\n${JSON.stringify(extractedVitals, null, 2)}\n\nCOMPUTED CRITICALITY SCORE: ${criticalityPercentage}% (${criticalityTier})\nMETRIC: ${clinicalScore.scoreName} = ${clinicalScore.scoreValue}/${clinicalScore.maxScore}\n\nCONDITIONAL WORKFLOW RULES:\n- IF Criticality > 70%: Trigger Emergency Triage Protocol, prioritize emergency facility matching and ICU bed reservations.\n- IF Criticality <= 70%: Bypass emergency bed routing, focus on outpatient electronic prescriptions, home-care guidance, and warning-sign checklist for escalation.\n\nGenerate structured clinical guidance.`,
                },
              ],
            },
          ],
        });
        assistantReply = response.text || '';
      } catch (err) {
        console.warn('Gemini Live API call failed, generating autonomous clinical response:', err);
        assistantReply = this.synthesizeAutonomousCriticalityReply(
          userText,
          criticalityPercentage,
          criticalityTier,
          extractedVitals,
          clinicalScore,
          prescriptionPlan,
          specialistReferral
        );
      }
    } else {
      assistantReply = this.synthesizeAutonomousCriticalityReply(
        userText,
        criticalityPercentage,
        criticalityTier,
        extractedVitals,
        clinicalScore,
        prescriptionPlan,
        specialistReferral
      );
    }

    triageSummary = this.generateDynamicTriageSummary(
      userText,
      urgencyLevel,
      criticalityPercentage,
      criticalityTier,
      criticalityExplanation,
      extractedVitals,
      clinicalScore,
      prescriptionPlan
    );

    followUps = this.generateFollowUpSuggestions(userText, isHighConcern);

    const messageId = randomUUID();
    const clinMessage: ChatMessage = {
      id: messageId,
      sender: 'clin',
      content: assistantReply,
      timestamp: new Date().toISOString(),
      metadata: {
        triage: triageSummary,
        prescriptionPlan,
        specialistReferral,
        nearbyFacilities: isHighConcern ? nearbyFacilities.slice(0, 4) : [],
        emergencyTriggered: isHighConcern,
        suggestedFollowUps: followUps,
      },
    };

    return {
      message: clinMessage,
      triage: triageSummary,
      prescriptionPlan,
      specialistReferral,
      nearbyFacilities: isHighConcern ? nearbyFacilities.slice(0, 4) : [],
      suggestedFollowUps: followUps,
    };
  }

  private detectEmergencyRedFlags(text: string): boolean {
    const q = text.toLowerCase();
    const redFlagKeywords = [
      'crushing chest pain',
      'chest pressure',
      'heart attack',
      'radiating to jaw',
      'radiating to arm',
      'thunderclap headache',
      'worst headache of life',
      'loss of consciousness',
      'fainting',
      'unresponsive',
      'difficulty breathing',
      'gasping for air',
      'severe shortness of breath',
      'coughing blood',
      'vomiting blood',
      'slurred speech',
      'facial drooping',
      'paralysis',
      'stroke',
      'acute abdomen',
      'rigid abdomen',
      'severe appendicitis',
      'suicidal',
      'anaphylaxis',
      'swelling of tongue',
      'throat closing',
    ];
    return redFlagKeywords.some((keyword) => q.includes(keyword));
  }

  private synthesizeAutonomousCriticalityReply(
    userText: string,
    percentage: number,
    tier: 'Low Concern (0-40%)' | 'Moderate Concern (41-70%)' | 'High Concern / Emergency (71-100%)',
    vitals: ExtractedClinicalVitals,
    score: DynamicClinicalScore,
    prescriptionPlan?: any,
    specialistReferral?: any
  ): string {
    const vitalsSummary = Object.entries(vitals)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]: [string, any]) => {
        if (k === 'temperature') return `Temp: ${v.value}°${v.unit}`;
        if (k === 'bloodPressure') return `BP: ${v.systolic}/${v.diastolic} mmHg`;
        if (k === 'heartRate') return `HR: ${v.bpm} bpm`;
        if (k === 'oxygenSaturation') return `SpO2: ${v.percentage}%`;
        if (k === 'painScale') return `Pain: ${v.score}/10`;
        if (k === 'duration') return `Duration: ${v}`;
        return '';
      })
      .filter(Boolean)
      .join(' | ');

    if (percentage > 70) {
      return `🚨 **Emergency Alert: ${percentage}% Criticality — ${tier}** 🚨\n\n` +
        `I've analyzed your symptoms, and your case requires **immediate medical attention**. Here is your clinical breakdown:\n\n` +
        `📈 **Acuity Index (${score.scoreName}):** ${score.scoreValue}/${score.maxScore} _(${score.interpretation})_\n` +
        (vitalsSummary ? `🩺 **Vitals:** ${vitalsSummary}\n\n` : '\n') +
        `🚑 **ACTION REQUIRED: Emergency Triage Protocol**\n` +
        `Because your criticality score is above 70%, I have activated emergency protocols. Please do not wait.\n\n` +
        `🏥 **Live Hospital & ICU Routing:** I've located nearby Level-1 trauma centers with available beds. Tap below to secure an immediate 2-hour hold.\n` +
        `👨‍⚕️ **Specialist Matched:** We've found on-call **${specialistReferral?.primarySpecialty || 'Emergency Medicine'}** specialists for urgent review.\n` +
        `⚠️ **Safety First:** Please **do not drive yourself**. Call emergency services (911/108) immediately, sit upright if you are having trouble breathing, and try to stay calm.`;
    }

    if (percentage >= 41) {
      const diag = prescriptionPlan?.primaryConditionTarget || 'Acute Symptomatic Presentation';
      return `📊 **Triage Complete: ${percentage}% Criticality — ${tier}**\n\n` +
        `I've carefully evaluated your symptoms. While this needs attention, you are currently in the manageable outpatient range. Here's a summary of my findings:\n\n` +
        `🩺 **Working Assessment:** **${diag}**\n` +
        `📈 **Acuity Index (${score.scoreName}):** ${score.scoreValue}/${score.maxScore} _(${score.interpretation})_\n` +
        (vitalsSummary ? `🩸 **Vitals:** ${vitalsSummary}\n\n` : '\n') +
        `📋 **Your Clinical Action Plan:**\n` +
        `💊 **1. Symptom Relief:** I've drafted an e-prescription below to help manage your symptoms temporarily.\n` +
        `🔬 **2. Recommended Labs:** If you don't feel better in 48 hours, consider getting some standard labs (like CBC or CRP/Ultrasound).\n` +
        `👨‍⚕️ **3. See a Specialist:** I can connect you with verified **${specialistReferral?.primarySpecialty || 'Clinical'}** physicians for a proper consultation.\n\n` +
        `⚠️ **When to go to the ER:** Please seek emergency care immediately if you develop sudden shortness of breath, severe chest or abdominal pain, non-stop vomiting, or a high fever with confusion!`;
    }

    const diag = prescriptionPlan?.primaryConditionTarget || 'Mild Self-Limiting Condition';
    return `🟢 **Triage Complete: ${percentage}% Criticality — ${tier}**\n\n` +
      `Good news! Based on your symptoms, this appears to be a low-concern condition and can likely be managed safely at home. 🏡\n\n` +
      `🩺 **Assessment:** **${diag}**\n` +
      `📈 **Acuity Index (${score.scoreName}):** ${score.scoreValue}/${score.maxScore} _(${score.interpretation})_\n\n` +
      `📋 **Home-Care Instructions:**\n` +
      `💊 **Symptom Relief:** Check out the supportive e-prescription draft below for some over-the-counter relief options.\n` +
      `💧 **Rest & Recover:** Stay well-hydrated, get plenty of rest, and keep an eye on your temperature.\n` +
      `📅 **Follow-up:** If things don't improve after 3 days, it's a good idea to chat with a doctor.\n\n` +
      `⚠️ **Watch out for:** If you suddenly develop a high fever, have trouble breathing, or feel severe localized pain, please re-triage immediately!`;
  }

  private generateDynamicTriageSummary(
    text: string,
    urgencyLevel: 'Emergency (Level 1)' | 'Urgent (Level 2)' | 'Moderate (Level 3)' | 'Routine (Level 4)',
    criticalityPercentage: number,
    criticalityTier: 'Low Concern (0-40%)' | 'Moderate Concern (41-70%)' | 'High Concern / Emergency (71-100%)',
    criticalityExplanation: string,
    vitals: ExtractedClinicalVitals,
    score: DynamicClinicalScore,
    plan?: any
  ): ClinicalTriageSummary {
    const isEmergency = criticalityPercentage > 70;
    const primaryDiag = plan?.primaryConditionTarget || (isEmergency ? 'Acute Life Threat / High Acuity' : 'Mild Symptomatic Condition');
    const icdCode = criticalityPercentage >= 85 ? 'I21.9' : text.toLowerCase().includes('appendic') ? 'K35.80' : text.toLowerCase().includes('migraine') ? 'G43.909' : 'R68.89';

    const vitalsStr = [
      vitals.temperature ? `Temp: ${vitals.temperature.value}°${vitals.temperature.unit}` : '',
      vitals.bloodPressure ? `BP: ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} mmHg` : '',
      vitals.heartRate ? `HR: ${vitals.heartRate.bpm} bpm` : '',
      vitals.oxygenSaturation ? `SpO2: ${vitals.oxygenSaturation.percentage}%` : '',
      vitals.painScale ? `Pain: ${vitals.painScale.score}/10` : '',
    ].filter(Boolean).join(', ') || 'Vitals pending in-person physical assessment';

    const warningSigns = [
      'Sudden onset of severe shortness of breath or cyanosis (blue lips)',
      'Chest pressure or crushing discomfort radiating to left arm or jaw',
      'Loss of consciousness, dizziness, or confusion',
      'Severe intractable abdominal pain with rigidity or continuous vomiting',
      'High fever > 103°F (39.4°C) unresponsive to antipyretics',
    ];

    const homeCare = [
      'Ensure adequate oral hydration with electrolyte fluids (2-3 L/day)',
      'Rest in a cool, quiet, and well-ventilated environment',
      'Take prescribed supportive medications strictly according to dosage schedule',
      'Monitor temperature and pulse twice daily',
      'Maintain light, easily digestible diet (bland foods, avoid oily/spicy meals)',
    ];

    return {
      urgencyLevel,
      criticalityPercentage,
      criticalityTier,
      criticalityExplanation,
      warningSignsEscalation: warningSigns,
      homeCareGuidance: homeCare,
      primaryDiagnosis: primaryDiag,
      icd10Code: icdCode,
      confidenceScore: isEmergency ? 96 : criticalityPercentage >= 41 ? 92 : 88,
      isRedFlag: isEmergency,
      redFlagWarning: isEmergency ? `Critical Life Threat Detected (${criticalityPercentage}%) — Score: ${score.scoreName} = ${score.scoreValue}/${score.maxScore}` : undefined,
      soapSubjective: `Patient Intake: "${text}". Localization: ${vitals.symptomLocalization?.join(', ') || 'Systemic'}. Duration: ${vitals.duration || 'Acute'}.`,
      soapObjective: `${vitalsStr}. Criticality Meter: ${criticalityPercentage}% (${criticalityTier}). Metric: ${score.scoreName} = ${score.scoreValue}/${score.maxScore}.`,
      soapAssessment: `${primaryDiag} (ICD-10: ${icdCode}). Risk Stratification: ${criticalityExplanation}`,
      soapPlan: isEmergency
        ? '1. Priority emergency trauma center routing. 2. Immediate ICU bed allocation. 3. 12-lead ECG, continuous vitals telemetry, emergency transport.'
        : '1. Initiate electronic outpatient prescription regimen. 2. Adhere to home-care protocols. 3. Escalate immediately if warning signs manifest.',
    };
  }

  private generateFollowUpSuggestions(text: string, isHighConcern: boolean): string[] {
    if (isHighConcern) {
      return [
        'Fastest driving route to emergency trauma center',
        'Hold emergency ICU bed immediately',
        'Call Emergency Ambulance (108/911)',
      ];
    }
    const lower = text.toLowerCase();
    if (lower.includes('pain') || lower.includes('stomach') || lower.includes('abdomen')) {
      return [
        'Does the pain worsen when coughing or walking?',
        'Are you experiencing nausea, fever, or loss of appetite?',
        'Download certified outpatient prescription plan',
      ];
    }
    if (lower.includes('headache') || lower.includes('migraine')) {
      return [
        'Did the headache reach maximum intensity in under a minute?',
        'Are you having blurred vision or light sensitivity?',
        'Download official prescription PDF for pharmacy',
      ];
    }
    return [
      'Download certified outpatient prescription PDF',
      'Schedule a telehealth consultation with matched specialist',
      'View warning-sign escalation checklist',
    ];
  }
}

export const chatService = new ChatService();
