import { CLINICAL_FORMULARY, FormularyMedication } from '../data/medications.data';

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

export class PrescriptionService {
  /**
   * Search and filter formulary
   */
  public static getFormulary(query?: {
    drugClass?: string;
    search?: string;
  }): FormularyMedication[] {
    let list = [...CLINICAL_FORMULARY];

    if (query?.drugClass && query.drugClass !== 'All') {
      list = list.filter((m) =>
        m.drugClass.toLowerCase().includes(query.drugClass!.toLowerCase())
      );
    }

    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.genericName.toLowerCase().includes(q) ||
          m.brandNames.some((b) => b.toLowerCase().includes(q)) ||
          m.indications.some((ind) => ind.toLowerCase().includes(q)) ||
          m.matchingKeywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    return list;
  }

  /**
   * Generate evidence-based prescription plan for a clinical case
   */
  public static generatePrescriptionPlan(
    clinicalCase: string,
    differentialDiagnoses: string[] = []
  ): PrescriptionPlan {
    const textToAnalyze = `${clinicalCase} ${differentialDiagnoses.join(' ')}`.toLowerCase();
    const rxIdentifier = `RX-CLN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const matchedItems: PrescribedItem[] = [];
    const safetyAlerts: string[] = [];

    // Check specific condition profiles
    const isAppendicitis =
      textToAnalyze.includes('appendic') ||
      textToAnalyze.includes('right lower quadrant') ||
      textToAnalyze.includes('rlq') ||
      textToAnalyze.includes('mcburney');

    const isChestPainACS =
      textToAnalyze.includes('chest pain') ||
      textToAnalyze.includes('infarct') ||
      textToAnalyze.includes('troponin') ||
      textToAnalyze.includes('angina') ||
      textToAnalyze.includes('coronary');

    const isPulmonaryEmbolism =
      textToAnalyze.includes('pulmonary embolism') ||
      textToAnalyze.includes('pe') ||
      textToAnalyze.includes('dvt') ||
      textToAnalyze.includes('thrombosis');

    const isAsthmaCOPD =
      textToAnalyze.includes('asthma') ||
      textToAnalyze.includes('wheezing') ||
      textToAnalyze.includes('bronchospasm') ||
      textToAnalyze.includes('copd');

    const isGIInfection =
      textToAnalyze.includes('diverticulitis') ||
      textToAnalyze.includes('colitis') ||
      textToAnalyze.includes('gastroenteritis');

    let primaryConditionTarget = 'Acute Clinical Evaluation';
    let overallTherapeuticGoal = 'Provide multimodal symptom relief, infectious coverage, and clinical stabilization.';

    if (isAppendicitis) {
      primaryConditionTarget = 'Suspected Acute Appendicitis / Acute Abdomen';
      overallTherapeuticGoal = 'Broad-spectrum intra-abdominal perioperative antimicrobial coverage with safe multimodal analgesia and antiemetic stabilization pending surgical evaluation.';

      const cefoxitin = CLINICAL_FORMULARY.find((m) => m.id === 'med-cefoxitin-01')!;
      matchedItems.push({
        medication: cefoxitin,
        tier: 'First-Line Therapy',
        dosage: cefoxitin.standardDosage,
        route: cefoxitin.route,
        frequency: cefoxitin.frequency,
        duration: 'Single pre-operative dose or q6-8h until surgical intervention',
        clinicalRationale: 'Second-generation cephalosporin with excellent anaerobic and Gram-negative coverage against enteric pathogens in acute appendicitis.',
        dispenseQuantity: '2 Vials (2g IV)',
        refillsAllowed: 0,
        criticalWarning: 'Verify patient has no severe IgE-mediated beta-lactam anaphylaxis history prior to infusion.',
      });

      const ondansetron = CLINICAL_FORMULARY.find((m) => m.id === 'med-ondansetron-06')!;
      matchedItems.push({
        medication: ondansetron,
        tier: 'Symptomatic Relief',
        dosage: '4 mg to 8 mg IV/ODT q8h PRN',
        route: 'Oral (PO)',
        frequency: 'Every 8 hours as needed for nausea',
        duration: '3 days PRN',
        clinicalRationale: 'Rapidly controls visceral nausea and emesis, preventing dehydration and electrolyte shifts.',
        dispenseQuantity: '#10 Disintegrating Tablets',
        refillsAllowed: 1,
      });

      const acetaminophen = CLINICAL_FORMULARY.find((m) => m.id === 'med-acetaminophen-04')!;
      matchedItems.push({
        medication: acetaminophen,
        tier: 'Symptomatic Relief',
        dosage: '1000 mg IV or PO q6h PRN fever/pain (Max 3g/24h)',
        route: 'Oral (PO)',
        frequency: 'Every 6 hours PRN',
        duration: '3 days PRN',
        clinicalRationale: 'Centrally-acting antipyretic and non-opioid analgesic that does not interfere with surgical platelet aggregation.',
        dispenseQuantity: '#20 Tablets (500mg)',
        refillsAllowed: 0,
      });

      safetyAlerts.push('⚠️ AVOID ORAL NSAIDs / Aspirin until acute surgical consultation is finalized to prevent increased perioperative bleeding risks.');
      safetyAlerts.push('⚠️ Patient MUST maintain NPO (Nothing by mouth) status if urgent surgical appendectomy is scheduled.');
    } else if (isChestPainACS) {
      primaryConditionTarget = 'Suspected Acute Coronary Syndrome / Ischemic Chest Pain';
      overallTherapeuticGoal = 'Immediate platelet inhibition, coronary vasodilation, and hemodynamic stabilization.';

      const aspirin = CLINICAL_FORMULARY.find((m) => m.id === 'med-aspirin-08')!;
      matchedItems.push({
        medication: aspirin,
        tier: 'First-Line Therapy',
        dosage: '324 mg (4 x 81 mg chewable tablets) chewed immediately STAT, then 81 mg daily',
        route: 'Oral (PO)',
        frequency: 'Stat loading dose, then once daily',
        duration: 'Indefinite secondary cardioprotection',
        clinicalRationale: 'Irreversible COX-1 inhibition producing rapid antiplatelet aggregation to halt intracoronary thrombus propagation.',
        dispenseQuantity: '#30 Tablets (81mg Chewable)',
        refillsAllowed: 2,
        criticalWarning: 'Chew tablets before swallowing for maximum bioavailability within 15 minutes.',
      });

      const nitro = CLINICAL_FORMULARY.find((m) => m.id === 'med-nitroglycerin-10')!;
      matchedItems.push({
        medication: nitro,
        tier: 'Symptomatic Relief',
        dosage: '0.4 mg sublingually dissolved every 5 minutes PRN chest pain (Max 3 doses in 15 mins)',
        route: 'Sublingual (SL)',
        frequency: 'Every 5 minutes PRN (Max 3 doses)',
        duration: 'PRN acute angina episodes',
        clinicalRationale: 'Venous and coronary vasodilation reducing myocardial preload and ischemic myocardial oxygen demand.',
        dispenseQuantity: '#25 Sublingual Tablets',
        refillsAllowed: 1,
        criticalWarning: 'CONTRAINDICATED if PDE-5 inhibitors (Sildenafil/Tadalafil) used within last 24-48 hours. Risk of fatal hypotension.',
      });

      safetyAlerts.push('🚨 EMERGENCY WARNING: If chest pain persists > 5 minutes after 1st Nitroglycerin dose, call emergency 911 immediately.');
      safetyAlerts.push('⚠️ Verify blood pressure (SBP must be > 90 mmHg) before each dose of sublingual Nitroglycerin.');
    } else if (isPulmonaryEmbolism) {
      primaryConditionTarget = 'Suspected Pulmonary Embolism / Deep Vein Thrombosis';
      overallTherapeuticGoal = 'Rapid therapeutic anticoagulation to arrest clot expansion and facilitate endogenous fibrinolysis.';

      const apixaban = CLINICAL_FORMULARY.find((m) => m.id === 'med-apixaban-09')!;
      matchedItems.push({
        medication: apixaban,
        tier: 'First-Line Therapy',
        dosage: '10 mg PO twice daily with food for 7 days, then 5 mg PO twice daily',
        route: 'Oral (PO)',
        frequency: 'Twice daily at consistent 12-hour intervals',
        duration: '3 to 6 months maintenance',
        clinicalRationale: 'Direct factor Xa inhibitor providing predictable oral anticoagulation without requiring routine INR monitoring.',
        dispenseQuantity: '#74 Tablets (Starter Pack)',
        refillsAllowed: 1,
        criticalWarning: 'Do NOT discontinue abruptly without physician oversight due to rebound thrombosis risk.',
      });

      const acetaminophen = CLINICAL_FORMULARY.find((m) => m.id === 'med-acetaminophen-04')!;
      matchedItems.push({
        medication: acetaminophen,
        tier: 'Symptomatic Relief',
        dosage: '650 mg PO q6h PRN pleuritic discomfort',
        route: 'Oral (PO)',
        frequency: 'Every 6 hours PRN',
        duration: '5 days PRN',
        clinicalRationale: 'Analgesic of choice for pleuritic chest pain in patients receiving active DOAC anticoagulation.',
        dispenseQuantity: '#20 Tablets (325mg)',
        refillsAllowed: 0,
      });

      safetyAlerts.push('⚠️ STRICTLY AVOID concomitant NSAIDs (Ibuprofen, Naproxen, Ketorolac) while on Apixaban due to amplified hemorrhage risk.');
    } else if (isAsthmaCOPD) {
      primaryConditionTarget = 'Acute Asthma / Bronchospasm Exacerbation';
      overallTherapeuticGoal = 'Rapid bronchodilation and systemic suppression of airway mucosal inflammation.';

      const albuterol = CLINICAL_FORMULARY.find((m) => m.id === 'med-albuterol-11')!;
      matchedItems.push({
        medication: albuterol,
        tier: 'First-Line Therapy',
        dosage: '2 inhalations (90 mcg/puff) inhaled every 4 to 6 hours PRN wheezing/shortness of breath',
        route: 'Inhalation',
        frequency: 'Every 4-6 hours PRN',
        duration: '1 Inhaler (200 actuations)',
        clinicalRationale: 'Short-acting selective beta-2 adrenergic agonist providing immediate airway smooth muscle relaxation.',
        dispenseQuantity: '1 Inhaler Canister',
        refillsAllowed: 2,
      });

      const prednisone = CLINICAL_FORMULARY.find((m) => m.id === 'med-prednisone-12')!;
      matchedItems.push({
        medication: prednisone,
        tier: 'Second-Line / Alternative',
        dosage: '50 mg PO once daily with morning breakfast for 5 days (Short burst)',
        route: 'Oral (PO)',
        frequency: 'Once daily in the morning',
        duration: '5 consecutive days (No taper required for ≤ 5 days)',
        clinicalRationale: 'Systemic corticosteroid to resolve eosinophilic airway inflammation and prevent relapsing exacerbation.',
        dispenseQuantity: '#5 Tablets (50mg)',
        refillsAllowed: 0,
        criticalWarning: 'Take with breakfast to minimize GI irritation and avoid nighttime insomnia.',
      });

      safetyAlerts.push('⚠️ If breathing difficulty worsens despite 6 puffs of rescue albuterol within 1 hour, proceed to Emergency Department.');
    } else {
      // Default / General Case: Multimodal Supportive Formulary
      const amoxClav = CLINICAL_FORMULARY.find((m) => m.id === 'med-amox-clav-03')!;
      const ondansetron = CLINICAL_FORMULARY.find((m) => m.id === 'med-ondansetron-06')!;
      const acetaminophen = CLINICAL_FORMULARY.find((m) => m.id === 'med-acetaminophen-04')!;

      matchedItems.push({
        medication: amoxClav,
        tier: 'First-Line Therapy',
        dosage: amoxClav.standardDosage,
        route: amoxClav.route,
        frequency: amoxClav.frequency,
        duration: amoxClav.typicalDuration,
        clinicalRationale: 'Empiric broad-spectrum coverage for standard bacterial etiology.',
        dispenseQuantity: '#14 Tablets',
        refillsAllowed: 0,
      });

      matchedItems.push({
        medication: acetaminophen,
        tier: 'Symptomatic Relief',
        dosage: acetaminophen.standardDosage,
        route: acetaminophen.route,
        frequency: acetaminophen.frequency,
        duration: '3 to 5 days PRN',
        clinicalRationale: 'Antipyretic and mild-to-moderate analgesic relief.',
        dispenseQuantity: '#20 Tablets (500mg)',
        refillsAllowed: 1,
      });

      matchedItems.push({
        medication: ondansetron,
        tier: 'Symptomatic Relief',
        dosage: ondansetron.standardDosage,
        route: ondansetron.route,
        frequency: ondansetron.frequency,
        duration: '3 days PRN',
        clinicalRationale: 'Symptomatic management of nausea and vomiting.',
        dispenseQuantity: '#10 Tablets (4mg ODT)',
        refillsAllowed: 0,
      });
    }

    const dietaryAndLifestyleInstructions = [
      'Maintain generous oral hydration (2-3 Liters water/electrolyte fluids daily unless restricted for heart/renal failure).',
      'Take oral antibiotic and anti-inflammatory doses with a meal or snack to minimize gastric intolerance.',
      'Refrain from alcohol consumption while taking prescription antimicrobial and analgesic regimens.',
      'Monitor body temperature and symptom progression twice daily; log in ClinOS clinical portal.'
    ];

    const mandatoryPhysicianDisclaimer =
      'CONFIDENTIAL MEDICAL PRESCRIPTION GUIDELINE — GENERATED FOR CLINICAL DECISION SUPPORT ONLY. All proposed pharmacological regimens require formal review and digital co-signature by a board-certified licensed physician prior to dispensing in accordance with State & Federal Pharmacy Acts.';

    return {
      rxIdentifier,
      generatedDate: new Date().toISOString(),
      primaryConditionTarget,
      overallTherapeuticGoal,
      prescriptions: matchedItems,
      safetyAlerts,
      dietaryAndLifestyleInstructions,
      mandatoryPhysicianDisclaimer,
    };
  }
}
