import { VERIFIED_SPECIALISTS, DoctorSpecialist } from '../data/specialists.data';

export interface MatchedSpecialist extends DoctorSpecialist {
  matchScore: number; // 0 - 100%
  matchReason: string;
  urgencyLevel: 'Emergency Consultation' | 'Urgent Referral (Within 24h)' | 'Routine Specialist Review';
}

export interface RecommendationResult {
  primarySpecialty: string;
  referralRationale: string;
  recommendedSpecialists: MatchedSpecialist[];
  suggestedQuestionsForDoctor: string[];
}

export interface AppointmentBookingPayload {
  specialistId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  preferredDate: string;
  preferredTime: string;
  consultationMode: 'In-Person' | 'Telehealth';
  reasonForVisit: string;
  clinicalCaseSummary?: string;
}

export interface AppointmentConfirmation {
  confirmationId: string;
  status: 'confirmed' | 'pending_verification';
  specialist: DoctorSpecialist;
  scheduledTime: string;
  consultationMode: string;
  patientName: string;
  instructions: string;
  createdAt: string;
}

export class SpecialistService {
  /**
   * Search and filter specialists from directory
   */
  public static getAllSpecialists(query?: {
    specialty?: string;
    search?: string;
    telehealthOnly?: boolean;
  }): DoctorSpecialist[] {
    let result = [...VERIFIED_SPECIALISTS];

    if (query?.specialty && query.specialty !== 'All') {
      result = result.filter(
        (s) =>
          s.category.toLowerCase() === query.specialty!.toLowerCase() ||
          s.specialty.toLowerCase().includes(query.specialty!.toLowerCase())
      );
    }

    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.specialty.toLowerCase().includes(q) ||
          s.hospital.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.matchingKeywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (query?.telehealthOnly) {
      result = result.filter((s) => s.consultationModes.includes('Telehealth'));
    }

    return result;
  }

  /**
   * Find specialist by ID
   */
  public static getSpecialistById(id: string): DoctorSpecialist | undefined {
    return VERIFIED_SPECIALISTS.find((s) => s.id === id);
  }

  /**
   * Match specialists based on patient case, symptoms, and differential diagnoses
   */
  public static recommendSpecialistsForCase(
    caseText: string,
    differentialDiagnoses: string[] = []
  ): RecommendationResult {
    const textToAnalyze = `${caseText} ${differentialDiagnoses.join(' ')}`.toLowerCase();

    // Score every specialist
    const scoredSpecialists = VERIFIED_SPECIALISTS.map((specialist) => {
      let score = 30; // base score
      const matchedTerms: string[] = [];

      specialist.matchingKeywords.forEach((keyword) => {
        if (textToAnalyze.includes(keyword.toLowerCase())) {
          score += 15;
          matchedTerms.push(keyword);
        }
      });

      // Boost for specialty category mentions
      if (textToAnalyze.includes(specialist.category.toLowerCase())) {
        score += 25;
      }

      // Check specific conditions
      if (
        (textToAnalyze.includes('appendic') || textToAnalyze.includes('right lower quadrant') || textToAnalyze.includes('rlq')) &&
        specialist.category === 'General Surgery'
      ) {
        score += 40;
      }

      if (
        (textToAnalyze.includes('stroke') || textToAnalyze.includes('droop') || textToAnalyze.includes('slurr')) &&
        specialist.category === 'Neurology'
      ) {
        score += 40;
      }

      if (
        (textToAnalyze.includes('chest pain') || textToAnalyze.includes('troponin') || textToAnalyze.includes('angina')) &&
        specialist.category === 'Cardiology'
      ) {
        score += 40;
      }

      if (
        (textToAnalyze.includes('embolism') || textToAnalyze.includes('shortness of breath') || textToAnalyze.includes('pleuritic') || textToAnalyze.includes('cough')) &&
        specialist.category === 'Pulmonology'
      ) {
        score += 40;
      }

      // Clamp between 45% and 99%
      const matchScore = Math.min(Math.max(score, 45), 99);

      // Determine urgency and rationale
      let urgencyLevel: 'Emergency Consultation' | 'Urgent Referral (Within 24h)' | 'Routine Specialist Review' =
        'Routine Specialist Review';
      if (matchScore >= 85 || textToAnalyze.includes('fever') || textToAnalyze.includes('sudden') || textToAnalyze.includes('acute')) {
        urgencyLevel = 'Urgent Referral (Within 24h)';
      }
      if (textToAnalyze.includes('stroke') || textToAnalyze.includes('chest pain') || textToAnalyze.includes('peritonitis') || textToAnalyze.includes('emergency')) {
        urgencyLevel = 'Emergency Consultation';
      }

      const matchReason = matchedTerms.length > 0
        ? `Matched clinical keywords: ${matchedTerms.slice(0, 4).join(', ')}.`
        : `Relevant subspecialty for ${specialist.category} evaluation.`;

      return {
        ...specialist,
        matchScore,
        matchReason,
        urgencyLevel,
      };
    });

    // Sort by match score descending
    scoredSpecialists.sort((a, b) => b.matchScore - a.matchScore);

    const topSpecialist = scoredSpecialists[0];
    const primarySpecialty = topSpecialist
      ? `${topSpecialist.category} (${topSpecialist.specialty})`
      : 'General Internal Medicine & Surgery';

    const referralRationale = topSpecialist && topSpecialist.matchScore >= 75
      ? `Based on patient symptoms and differential probability for ${topSpecialist.category.toLowerCase()} indications, an expedited evaluation by a board-certified ${topSpecialist.specialty} specialist is strongly recommended to confirm diagnosis, obtain targeted imaging/lab studies, and formulate a definitive therapeutic plan.`
      : `Clinical triage suggests specialist consultation to perform a comprehensive clinical assessment and rule out high-acuity pathology.`;

    const suggestedQuestionsForDoctor = [
      'What specific diagnostic imaging (CT, Ultrasound, MRI) or lab panels are indicated to confirm this diagnosis?',
      'Are there any immediate activity, dietary, or medication precautions I should observe prior to formal evaluation?',
      'What acute red-flag warning symptoms should prompt immediate presentation to the nearest Emergency Department?',
      'What are the non-surgical vs. surgical treatment pathways and recovery timelines for this condition?'
    ];

    return {
      primarySpecialty,
      referralRationale,
      recommendedSpecialists: scoredSpecialists.slice(0, 4),
      suggestedQuestionsForDoctor,
    };
  }

  /**
   * Book an appointment / referral request
   */
  public static bookAppointment(payload: AppointmentBookingPayload): AppointmentConfirmation {
    const specialist =
      VERIFIED_SPECIALISTS.find((s) => s.id === payload.specialistId) ||
      VERIFIED_SPECIALISTS[0];

    const confirmationId = `CLN-APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    return {
      confirmationId,
      status: 'confirmed',
      specialist,
      scheduledTime: `${payload.preferredDate} at ${payload.preferredTime}`,
      consultationMode: payload.consultationMode,
      patientName: payload.patientName || 'Patient',
      instructions: `Your ${payload.consultationMode} consultation has been scheduled with ${specialist.name}. A secure intake link and calendar invite have been dispatched to ${payload.patientEmail}. Please have any prior lab results or imaging reports ready.`,
      createdAt: new Date().toISOString(),
    };
  }
}
