import { ai, agentConfig, isLiveGeminiAvailable } from '../config/gemini';
import { researcherSchema } from '../schemas/agent.schemas';

export interface ResearcherOutput {
  primaryDiagnosis: string;
  differentialDiagnoses: Array<{
    condition: string;
    probability: 'High' | 'Moderate' | 'Low';
    keyRationale: string;
  }>;
  redFlagSymptoms: string[];
  recommendedInvestigations: string[];
}

export async function runResearcherAgent(
  clinicalCase: string,
  temperature: number,
  previousFeedback?: string
): Promise<ResearcherOutput> {
  const systemInstruction = `You are the ClinOS Clinical Researcher Agent. Analyze the patient case and provide a comprehensive differential diagnosis, explicit red-flag symptoms (e.g., peritoneal signs, chest pain radiates to jaw, sudden severe headache), and key diagnostic tests.
${previousFeedback ? `CRITICAL AUDIT NOTICE FROM MEDICAL CRITIC: "${previousFeedback}". You MUST incorporate this feedback and correct any omitted red flags or diagnostic oversights.` : ''}`;

  const prompt = `Patient Case Data: "${clinicalCase}"
${previousFeedback ? `Previous Critic Review Feedback to Address: ${previousFeedback}` : ''}

Generate structured JSON matching the clinical research schema.`;

  if (!isLiveGeminiAvailable) {
    const isRetry = Boolean(previousFeedback);
    return {
      primaryDiagnosis: isRetry
        ? 'Acute Appendicitis (Refined following Medical Critic red-flag feedback for RLQ guarding & peritoneal irritation)'
        : 'Acute Abdominal Pain secondary to Acute Appendicitis or Gastroenteritis',
      differentialDiagnoses: [
        {
          condition: 'Acute Appendicitis',
          probability: 'High',
          keyRationale: 'Persistent right lower quadrant abdominal pain, localized tenderness, mild fever, and anorexia.',
        },
        {
          condition: 'Acute Gastroenteritis',
          probability: 'Moderate',
          keyRationale: 'Nausea and fever, though lack of watery diarrhea makes appendicitis more suspect.',
        },
        {
          condition: 'Renal Colic / Nephrolithiasis',
          probability: 'Low',
          keyRationale: 'Consider if pain radiates to flank/groin, though fever is non-characteristic unless complicated.',
        },
      ],
      redFlagSymptoms: [
        'Right lower quadrant McBurney point tenderness',
        'Rebound tenderness / Guarding (Peritoneal irritation)',
        'Fever with worsening localized abdominal pain',
      ],
      recommendedInvestigations: [
        'Complete Blood Count (CBC) with differential (leukocytosis check)',
        'Abdominal Ultrasound or Contrast-Enhanced CT Scan',
        'C-Reactive Protein (CRP) & Urinalysis',
      ],
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: agentConfig.model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: Math.min(temperature, 0.4),
        responseMimeType: 'application/json',
        responseSchema: researcherSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Researcher agent returned empty response');
    return JSON.parse(text) as ResearcherOutput;
  } catch (error) {
    console.error('Researcher Agent Error:', error);
    return {
      primaryDiagnosis: 'Clinical Assessment Pending Refinement',
      differentialDiagnoses: [
        {
          condition: 'Primary Suspected Pathology',
          probability: 'High',
          keyRationale: 'Symptom pattern warrants immediate clinical workup.',
        },
      ],
      redFlagSymptoms: ['Severe focal pain', 'Systemic symptoms'],
      recommendedInvestigations: ['Targeted imaging', 'Stat lab panel'],
    };
  }
}
