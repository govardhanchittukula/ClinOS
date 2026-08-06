export type UserRole = 'patient' | 'physician' | 'nurse' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  role: UserRole;
}

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ComplexityLevel = 'Routine' | 'Complex' | 'Deep Dive';
export type OutputFormat = 'Markdown' | 'JSON';

export interface WorkflowConfiguration {
  complexity: ComplexityLevel;
  enableCritic: boolean;
  outputFormat: OutputFormat;
  temperature: number;
}

export interface ClinicalWorkflow {
  id: string;
  user_id: string;
  clinical_case: string;
  status: WorkflowStatus;
  configuration: WorkflowConfiguration;
  final_output?: string | null;
  created_at: string;
  completed_at?: string | null;
}

export type AgentRole = 'planner' | 'researcher' | 'critic' | 'synthesizer' | 'system';

export interface AgentLog {
  id: string;
  workflowId: string;
  agentRole: AgentRole;
  action: string;
  payload: any;
  timestamp: string;
}

export interface WorkflowMetrics {
  totalExecutionTimeMs: number;
  criticIterations: number;
  isClinicallySafe: boolean;
  riskLevel: 'Low' | 'Moderate' | 'Critical - Retry Required';
}

export interface DoctorSpecialist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  category:
    | 'General Surgery'
    | 'Gastroenterology'
    | 'Cardiology'
    | 'Neurology'
    | 'Pulmonology'
    | 'Orthopedics'
    | 'Nephrology'
    | 'Dermatology'
    | 'Emergency Medicine'
    | 'Endocrinology'
    | 'Infectious Disease'
    | 'Internal Medicine';
  hospital: string;
  location: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  education: string;
  boardCertifications: string[];
  languages: string[];
  consultationModes: ('In-Person' | 'Telehealth' | 'Urgent Referral')[];
  matchingKeywords: string[];
  nextAvailableSlot: string;
  consultationFee: string;
  phone: string;
  email: string;
  verifiedBadge: boolean;
  avatarColor: string;
  bio: string;
}

export interface MatchedSpecialist extends DoctorSpecialist {
  matchScore: number;
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

export interface FormularyMedication {
  id: string;
  genericName: string;
  brandNames: string[];
  drugClass:
    | 'Antibiotic / Antimicrobial'
    | 'Analgesic & Antipyretic'
    | 'Cardiovascular & Antihypertensive'
    | 'Antiemetic & Gastrointestinal'
    | 'Respiratory & Bronchodilator'
    | 'Anticoagulant & Antiplatelet'
    | 'Neurological & Anticonvulsant'
    | 'Endocrine & Metabolic'
    | 'Corticosteroid & Anti-inflammatory';
  standardDosage: string;
  route: string;
  frequency: string;
  typicalDuration: string;
  indications: string[];
  matchingKeywords: string[];
  contraindications: string[];
  sideEffects: string[];
  counselingInstructions: string;
  pregnancyCategory: string;
  requiresPrescription: boolean;
  controlledSubstanceSchedule?: string;
}

export interface PrescribedItem {
  medication: FormularyMedication;
  tier: 'First-Line Therapy' | 'Second-Line / Alternative' | 'Symptomatic Relief';
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  clinicalRationale: string;
  dispenseQuantity: string;
  refillsAllowed: number;
  criticalWarning?: string;
}

export interface PrescriptionPlan {
  rxIdentifier: string;
  generatedDate: string;
  primaryConditionTarget: string;
  overallTherapeuticGoal: string;
  prescriptions: PrescribedItem[];
  safetyAlerts: string[];
  dietaryAndLifestyleInstructions: string[];
  mandatoryPhysicianDisclaimer: string;
}

export type BedType = 'general' | 'oxygen' | 'icu';

export interface Hospital {
  id: string;
  name: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  contact_number: string;
  emergency_helpline: string;
  general_beds_available: number;
  general_beds_total: number;
  oxygen_beds_available: number;
  oxygen_beds_total: number;
  icu_beds_available: number;
  icu_beds_total: number;
  ambulance_available: boolean;
  rating: number;
  distance_km: number;
  specialties?: string[];
  created_at?: string;
}

export interface BedBookingPayload {
  hospital_id: string;
  patient_id?: string;
  patient_name: string;
  patient_phone?: string;
  bed_type: BedType;
}

export interface BedBooking {
  id: string;
  booking_token: string;
  patient_id: string;
  patient_name: string;
  patient_phone?: string;
  hospital_id: string;
  hospital_name: string;
  bed_type: BedType;
  status: 'held' | 'confirmed' | 'cancelled';
  hold_duration_hours: number;
  booking_timestamp: string;
  expires_at: string;
  instructions: string;
}

export interface NearbyFacilityItem {
  id: string;
  name: string;
  address: string;
  locality: string;
  rating: number;
  userRatingsTotal?: number;
  distanceKm: number;
  distanceText: string;
  estimatedTravelTime: string;
  phoneNumber: string;
  emergencyHelpline: string;
  googleMapsUrl: string;
  specialties: string[];
  isOpenNow: boolean;
  availableBedTypes: {
    general: number;
    oxygen: number;
    icu: number;
    total: number;
  };
  totalBeds: {
    general: number;
    oxygen: number;
    icu: number;
  };
  source: 'google_places' | 'clinos_verified_registry';
}

export interface ClinicalTriageSummary {
  urgencyLevel: 'Emergency (Level 1)' | 'Urgent (Level 2)' | 'Moderate (Level 3)' | 'Routine (Level 4)';
  criticalityPercentage?: number;
  criticalityTier?: 'Low Concern (0-40%)' | 'Moderate Concern (41-70%)' | 'High Concern / Emergency (71-100%)';
  criticalityExplanation?: string;
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'clin' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    triage?: ClinicalTriageSummary;
    prescriptionPlan?: PrescriptionPlan;
    specialistReferral?: {
      primarySpecialty: string;
      rationale: string;
      specialists: MatchedSpecialist[];
      questions: string[];
    };
    nearbyFacilities?: (NearbyFacilityItem | Hospital)[];
    emergencyTriggered?: boolean;
    suggestedFollowUps?: string[];
  };
}

export interface ChatSessionResponse {
  success: boolean;
  message: ChatMessage;
  triage?: ClinicalTriageSummary;
  prescriptionPlan?: PrescriptionPlan;
  specialistReferral?: {
    primarySpecialty: string;
    rationale: string;
    specialists: MatchedSpecialist[];
    questions: string[];
  };
  nearbyFacilities?: NearbyFacilityItem[];
  suggestedFollowUps: string[];
}


