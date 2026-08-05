import { ai, agentConfig, isLiveGeminiAvailable } from '../config/gemini';
import { plannerSchema } from '../schemas/agent.schemas';

export interface PlannerOutput {
  clinicalSummary: string;
  executionSteps: Array<{
    stepNumber: number;
    agentRequired: 'ClinicalResearcher' | 'CareSynthesizer';
    actionDescription: string;
  }>;
}

export async function runPlannerAgent(
  clinicalCase: string,
  complexity: string
): Promise<PlannerOutput> {
  const systemInstruction = `You are the ClinOS Triage Planner Agent. Your objective is to decompose raw patient case data into structured diagnostic steps. Focus on high-signal medical facts, vitals, and chief complaints. Complexity setting: ${complexity}.`;

  const prompt = `Decompose the following patient clinical case:
Case Data: "${clinicalCase}"

Produce a structured JSON response matching the required schema.`;

  if (!isLiveGeminiAvailable) {
    // High-fidelity fallback simulation if GEMINI_API_KEY is not set
    return {
      clinicalSummary: `Patient presented with raw symptoms: "${clinicalCase.slice(0, 120)}..." Evaluated under ${complexity} complexity protocol.`,
      executionSteps: [
        {
          stepNumber: 1,
          agentRequired: 'ClinicalResearcher',
          actionDescription: 'Evaluate symptom cluster, rank differential diagnoses, and audit for emergency red-flag conditions.',
        },
        {
          stepNumber: 2,
          agentRequired: 'CareSynthesizer',
          actionDescription: 'Compile validated clinical reasoning, safety critic audit, and triage care plan into final deliverable.',
        },
      ],
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: agentConfig.model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: agentConfig.temperature,
        responseMimeType: 'application/json',
        responseSchema: plannerSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Planner agent returned empty response');
    return JSON.parse(text) as PlannerOutput;
  } catch (error) {
    console.error('Planner Agent Error:', error);
    // Robust fallback if API call errors out
    return {
      clinicalSummary: `Summary of case: ${clinicalCase.slice(0, 100)}...`,
      executionSteps: [
        {
          stepNumber: 1,
          agentRequired: 'ClinicalResearcher',
          actionDescription: 'Conduct differential analysis and identify potential red flags.',
        },
        {
          stepNumber: 2,
          agentRequired: 'CareSynthesizer',
          actionDescription: 'Synthesize final triage assessment.',
        },
      ],
    };
  }
}
