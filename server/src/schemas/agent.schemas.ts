import { Type, Schema } from '@google/genai';

// Triage Planner Agent Schema
export const plannerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    clinicalSummary: { type: Type.STRING, description: "Brief summary of the patient's chief complaint and core history." },
    executionSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          agentRequired: { type: Type.STRING, enum: ["ClinicalResearcher", "CareSynthesizer"] },
          actionDescription: { type: Type.STRING }
        },
        required: ["stepNumber", "agentRequired", "actionDescription"]
      }
    }
  },
  required: ["clinicalSummary", "executionSteps"]
};

// Clinical Researcher Agent Schema
export const researcherSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    primaryDiagnosis: { type: Type.STRING, description: "Most probable clinical diagnosis based on evidence." },
    differentialDiagnoses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          probability: { type: Type.STRING, enum: ["High", "Moderate", "Low"] },
          keyRationale: { type: Type.STRING }
        },
        required: ["condition", "probability", "keyRationale"]
      }
    },
    redFlagSymptoms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Critical red-flag symptoms identified or suspected."
    },
    recommendedInvestigations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Recommended lab tests, imaging, or physical exam maneuvers."
    }
  },
  required: ["primaryDiagnosis", "differentialDiagnoses", "redFlagSymptoms", "recommendedInvestigations"]
};

// Medical Critic (Validator) Agent Schema
export const criticSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isClinicallySafe: { type: Type.BOOLEAN, description: "True if the data meets clinical safety guidelines without missing red flags." },
    feedback: { type: Type.STRING, description: "Constructive clinical feedback if unsafe, or approval reasoning." },
    riskLevel: { type: Type.STRING, enum: ["Low", "Moderate", "Critical - Retry Required"] }
  },
  required: ["isClinicallySafe", "feedback", "riskLevel"]
};
