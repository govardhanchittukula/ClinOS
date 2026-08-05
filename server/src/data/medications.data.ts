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
  route: 'Oral (PO)' | 'Intravenous (IV)' | 'Sublingual (SL)' | 'Inhalation' | 'Subcutaneous (SC)' | 'Topical';
  frequency: string;
  typicalDuration: string;
  indications: string[];
  matchingKeywords: string[];
  contraindications: string[];
  sideEffects: string[];
  counselingInstructions: string;
  pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X';
  requiresPrescription: boolean;
  controlledSubstanceSchedule?: 'Schedule II' | 'Schedule III' | 'Schedule IV' | 'Schedule V' | 'Non-Controlled';
}

export const CLINICAL_FORMULARY: FormularyMedication[] = [
  // 1. Pre-op / GI Antibiotics
  {
    id: 'med-cefoxitin-01',
    genericName: 'Cefoxitin Sodium',
    brandNames: ['Mefoxin'],
    drugClass: 'Antibiotic / Antimicrobial',
    standardDosage: '2 g IV single dose preoperatively (or 1-2 g IV q6-8h)',
    route: 'Intravenous (IV)',
    frequency: 'Every 6-8 hours (or 30-60 mins pre-op)',
    typicalDuration: '24-48 hours (perioperative prophylaxis)',
    indications: ['Acute Appendicitis', 'Intra-abdominal infections', 'Peritonitis', 'Colorectal surgical prophylaxis'],
    matchingKeywords: ['appendicitis', 'appendix', 'acute abdomen', 'peritonitis', 'surgical prophylaxis', 'intra-abdominal', 'mcburney'],
    contraindications: ['Documented severe cephalosporin or penicillin anaphylaxis', 'History of cephalosporin-induced hemolytic anemia'],
    sideEffects: ['Thrombophlebitis at injection site', 'Diarrhea', 'Transient elevation in liver transaminases', 'Nausea'],
    counselingInstructions: 'Administered via IV infusion under physician supervision prior to surgical intervention. Monitor for hypersensitivity.',
    pregnancyCategory: 'B',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },
  {
    id: 'med-cipro-flagyl-02',
    genericName: 'Ciprofloxacin + Metronidazole Regimen',
    brandNames: ['Cipro + Flagyl'],
    drugClass: 'Antibiotic / Antimicrobial',
    standardDosage: 'Ciprofloxacin 500 mg PO q12h + Metronidazole 500 mg PO q8h (or IV equivalent)',
    route: 'Oral (PO)',
    frequency: 'Twice to three times daily',
    typicalDuration: '7 to 10 days',
    indications: ['Complicated Diverticulitis', 'Intra-abdominal Abscess', 'Bowel Perforation', 'Infectious Colitis'],
    matchingKeywords: ['diverticulitis', 'colitis', 'abscess', 'abdominal infection', 'diarrhea', 'fever', 'lower quadrant'],
    contraindications: ['Myasthenia gravis', 'QTc prolongation', 'Concomitant alcohol intake (severe disulfiram-like reaction with Flagyl)', 'Tendon rupture history with fluoroquinolones'],
    sideEffects: ['Metallic taste', 'Nausea/vomiting', 'Peripheral neuropathy', 'Photosensitivity', 'Tendonitis'],
    counselingInstructions: 'STRICTLY avoid all alcoholic beverages during and for 72 hours after completing Metronidazole. Take with plenty of fluids.',
    pregnancyCategory: 'B',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },
  {
    id: 'med-amox-clav-03',
    genericName: 'Amoxicillin / Clavulanate Potassium',
    brandNames: ['Augmentin', 'Clavulin'],
    drugClass: 'Antibiotic / Antimicrobial',
    standardDosage: '875 / 125 mg PO twice daily',
    route: 'Oral (PO)',
    frequency: 'Every 12 hours with meals',
    typicalDuration: '7 to 10 days',
    indications: ['Bacterial Sinusitis', 'Community-Acquired Pneumonia', 'Skin and Soft Tissue Infections', 'Uncomplicated Diverticulitis'],
    matchingKeywords: ['pneumonia', 'sinusitis', 'fever', 'cough', 'bacterial infection', 'ear infection', 'cellulitis'],
    contraindications: ['Severe penicillin/amoxicillin allergy (anaphylaxis)', 'History of Augmentin-associated cholestatic jaundice/hepatic dysfunction'],
    sideEffects: ['Diarrhea (frequent)', 'Nausea', 'Abdominal cramps', 'Vaginal candidiasis'],
    counselingInstructions: 'Take with food or at the start of a meal to minimize gastrointestinal upset. Complete the entire course.',
    pregnancyCategory: 'B',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },

  // 2. Analgesics, Antipyretics & Anti-Inflammatories
  {
    id: 'med-acetaminophen-04',
    genericName: 'Acetaminophen (Paracetamol)',
    brandNames: ['Tylenol', 'Panadol', 'Ofirmev (IV)'],
    drugClass: 'Analgesic & Antipyretic',
    standardDosage: '650 mg to 1000 mg PO/IV q6h as needed for pain/fever (Max 3000 mg/24h in adults)',
    route: 'Oral (PO)',
    frequency: 'Every 4-6 hours PRN',
    typicalDuration: '3 to 5 days PRN',
    indications: ['Mild-to-Moderate Pain', 'Fever Reduction', 'Postoperative Analgesia Multimodal Step', 'Headache'],
    matchingKeywords: ['pain', 'fever', 'headache', 'temperature', 'malaise', 'muscle ache', 'post-op pain'],
    contraindications: ['Severe active hepatic impairment', 'Severe acute liver failure', 'Hypersensitivity to acetaminophen'],
    sideEffects: ['Rare in therapeutic doses', 'Hepatotoxicity with accidental supratherapeutic dosing'],
    counselingInstructions: 'Do not exceed 3,000 mg in 24 hours. Check all over-the-counter cough/cold remedies to avoid duplicate acetaminophen ingestion.',
    pregnancyCategory: 'B',
    requiresPrescription: false,
    controlledSubstanceSchedule: 'Non-Controlled',
  },
  {
    id: 'med-ketorolac-05',
    genericName: 'Ketorolac Tromethamine',
    brandNames: ['Toradol'],
    drugClass: 'Corticosteroid & Anti-inflammatory',
    standardDosage: '15 to 30 mg IV/IM single dose or q6h PRN (Max 5 days total therapy)',
    route: 'Intravenous (IV)',
    frequency: 'Every 6 hours PRN',
    typicalDuration: 'Max 5 consecutive days',
    indications: ['Moderately Severe Acute Pain', 'Renal Colic (Kidney Stones)', 'Post-Surgical Acute Inflammatory Pain', 'Musculoskeletal Trauma'],
    matchingKeywords: ['acute pain', 'kidney stone', 'renal colic', 'flank pain', 'post-op', 'trauma', 'fracture'],
    contraindications: ['Active peptic ulcer disease / GI bleeding', 'Advanced renal impairment', 'Concurrent use with other NSAIDs or ASA', 'Prior to major surgery due to platelet inhibition'],
    sideEffects: ['Gastrointestinal ulceration/bleeding', 'Acute kidney injury', 'Fluid retention', 'Platelet aggregation inhibition'],
    counselingInstructions: 'Short-term acute pain management only. Stay well hydrated. Inform nurse immediately if black tarry stools occur.',
    pregnancyCategory: 'C',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },

  // 3. Antiemetics & Gastrointestinal Support
  {
    id: 'med-ondansetron-06',
    genericName: 'Ondansetron Hydrochloride',
    brandNames: ['Zofran', 'Zuplenz'],
    drugClass: 'Antiemetic & Gastrointestinal',
    standardDosage: '4 to 8 mg PO/IV/ODT q8h PRN for nausea/vomiting',
    route: 'Oral (PO)',
    frequency: 'Every 8 hours PRN',
    typicalDuration: '2 to 5 days',
    indications: ['Acute Nausea and Vomiting', 'Postoperative Nausea & Vomiting', 'Gastroenteritis', 'Chemotherapy-induced Nausea'],
    matchingKeywords: ['nausea', 'vomiting', 'emesis', 'gastroenteritis', 'food poisoning', 'queasiness'],
    contraindications: ['Congenital long QT syndrome', 'Concurrent use with apomorphine (causes profound hypotension)'],
    sideEffects: ['Headache', 'Constipation', 'Fatigue/drowsiness', 'Transient QTc prolongation'],
    counselingInstructions: 'Dissolve orally disintegrating tablet (ODT) on tongue without chewing. Can be taken with or without food.',
    pregnancyCategory: 'B',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },
  {
    id: 'med-pantoprazole-07',
    genericName: 'Pantoprazole Sodium',
    brandNames: ['Protonix'],
    drugClass: 'Antiemetic & Gastrointestinal',
    standardDosage: '40 mg PO/IV once daily',
    route: 'Oral (PO)',
    frequency: 'Once daily in the morning (30 mins before breakfast)',
    typicalDuration: '4 to 8 weeks',
    indications: ['Gastroesophageal Reflux Disease (GERD)', 'Erosive Esophagitis', 'Peptic Ulcer Disease', 'GI Bleed Prophylaxis in ICU'],
    matchingKeywords: ['gerd', 'acid reflux', 'heartburn', 'ulcer', 'epigastric pain', 'stomach burning', 'gastritis'],
    contraindications: ['Known hypersensitivity to substituted benzimidazoles'],
    sideEffects: ['Headache', 'Diarrhea', 'Abdominal pain', 'Decreased magnesium/B12 absorption with prolonged multi-year use'],
    counselingInstructions: 'Swallow whole with water 30 to 60 minutes before morning breakfast. Do not crush or chew delayed-release tablet.',
    pregnancyCategory: 'B',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },

  // 4. Cardiovascular, Chest Pain & Anticoagulants
  {
    id: 'med-aspirin-08',
    genericName: 'Aspirin (Chewable / Enteric Coated)',
    brandNames: ['Bayer Aspirin', 'Ecotrin'],
    drugClass: 'Anticoagulant & Antiplatelet',
    standardDosage: '324 mg (4 x 81 mg chewable tablets) chewed immediately for Acute Coronary Syndrome, followed by 81 mg PO daily',
    route: 'Oral (PO)',
    frequency: 'Once stat loading dose, then once daily',
    typicalDuration: 'Indefinite for secondary cardiovascular prevention',
    indications: ['Acute Myocardial Infarction / ACS', 'Unstable Angina', 'Secondary Ischemic Stroke Prevention', 'Peripheral Artery Disease'],
    matchingKeywords: ['chest pain', 'heart attack', 'myocardial infarction', 'angina', 'coronary', 'troponin', 'stroke'],
    contraindications: ['Active gastrointestinal hemorrhage', 'Known severe bleeding diathesis', 'Aspirin-induced asthma / triad disease'],
    sideEffects: ['Dyspepsia', 'Increased bleeding time / easy bruising', 'Gastrointestinal erosion'],
    counselingInstructions: 'For emergency chest pain triage: Chew four 81mg chewable tablets immediately before swallowing. Take daily maintenance doses with food.',
    pregnancyCategory: 'D',
    requiresPrescription: false,
    controlledSubstanceSchedule: 'Non-Controlled',
  },
  {
    id: 'med-apixaban-09',
    genericName: 'Apixaban (DOAC)',
    brandNames: ['Eliquis'],
    drugClass: 'Anticoagulant & Antiplatelet',
    standardDosage: '10 mg PO twice daily for 7 days, then 5 mg PO twice daily',
    route: 'Oral (PO)',
    frequency: 'Twice daily with or without food',
    typicalDuration: '3 to 6 months for provoked DVT/PE',
    indications: ['Acute Deep Vein Thrombosis (DVT)', 'Pulmonary Embolism (PE)', 'Non-valvular Atrial Fibrillation Stroke Prevention'],
    matchingKeywords: ['pulmonary embolism', 'pe', 'dvt', 'deep vein thrombosis', 'blood clot', 'atrial fibrillation', 'pleuritic chest pain', 'leg swelling'],
    contraindications: ['Active pathological major bleeding', 'Severe hypersensitivity', 'Prosthetic mechanical heart valves', 'Severe hepatic impairment (Child-Pugh C)'],
    sideEffects: ['Bleeding (epistaxis, hematuria, bruising)', 'Gastrointestinal hemorrhage'],
    counselingInstructions: 'Take exactly on schedule twice daily with or without food. Do not skip doses. Report unusual bruising, dark urine, or red/black stools immediately.',
    pregnancyCategory: 'B',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },
  {
    id: 'med-nitroglycerin-10',
    genericName: 'Nitroglycerin Sublingual',
    brandNames: ['Nitrostat', 'Nitrolingual'],
    drugClass: 'Cardiovascular & Antihypertensive',
    standardDosage: '0.4 mg SL tablet dissolved under tongue every 5 mins PRN chest pain (Max 3 tablets in 15 mins)',
    route: 'Sublingual (SL)',
    frequency: 'Every 5 minutes PRN (Max 3 doses)',
    typicalDuration: 'Acute symptomatic relief',
    indications: ['Acute Angina Pectoris', 'Ischemic Cardiac Chest Pain', 'Coronary Vasospasm'],
    matchingKeywords: ['angina', 'chest pain', 'coronary artery disease', 'substernal', 'pressure'],
    contraindications: ['Concurrent use of PDE-5 inhibitors (Sildenafil/Tadalafil within 24-48h) -> severe refractory hypotension', 'Severe aortic stenosis', 'Right ventricular infarction', 'Hypotension (SBP < 90 mmHg)'],
    sideEffects: ['Throbbing headache', 'Dizziness / postural hypotension', 'Flushing', 'Reflex tachycardia'],
    counselingInstructions: 'Sit down before taking medication to prevent fainting. Place under tongue and allow to dissolve completely. Call 911 if pain persists after 1 dose.',
    pregnancyCategory: 'C',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },

  // 5. Respiratory & Bronchodilators
  {
    id: 'med-albuterol-11',
    genericName: 'Albuterol Sulfate (Salbutamol) Inhalation',
    brandNames: ['ProAir HFA', 'Ventolin HFA', 'Proventil'],
    drugClass: 'Respiratory & Bronchodilator',
    standardDosage: '2 puffs inhaled every 4 to 6 hours as needed for bronchospasm (or nebulizer 2.5 mg q20m x 3 for acute exacerbation)',
    route: 'Inhalation',
    frequency: 'Every 4-6 hours PRN',
    typicalDuration: 'As needed for acute exacerbations',
    indications: ['Acute Bronchospasm', 'Asthma Exacerbation', 'COPD Bronchoconstriction', 'Exercise-Induced Bronchospasm'],
    matchingKeywords: ['asthma', 'wheezing', 'shortness of breath', 'dyspnea', 'copd', 'bronchospasm', 'cough'],
    contraindications: ['Severe hypersensitivity to albuterol or milk proteins (dry powder formulations)'],
    sideEffects: ['Tremor / shakiness', 'Tachycardia / palpitations', 'Nervousness', 'Hypokalemia (high doses)'],
    counselingInstructions: 'Prime the inhaler before first use. Exhale fully, place mouthpiece in mouth, breathe in deeply while pressing canister, and hold breath for 10 seconds.',
    pregnancyCategory: 'C',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  },
  {
    id: 'med-prednisone-12',
    genericName: 'Prednisone (Oral Corticosteroid)',
    brandNames: ['Deltasone', 'Rayos'],
    drugClass: 'Corticosteroid & Anti-inflammatory',
    standardDosage: '40 to 60 mg PO once daily for 5 days (Asthma/COPD burst therapy)',
    route: 'Oral (PO)',
    frequency: 'Once daily with breakfast',
    typicalDuration: '5 days (Short burst - no taper required)',
    indications: ['Acute Asthma Exacerbation', 'COPD Flare', 'Severe Allergic Reactions', 'Inflammatory Flare-ups'],
    matchingKeywords: ['asthma exacerbation', 'copd flare', 'severe inflammation', 'allergy', 'hives', 'wheezing'],
    contraindications: ['Systemic fungal infections', 'Live virus vaccines during immunosuppressive doses'],
    sideEffects: ['Insomnia / mood elevation', 'Increased appetite', 'Hyperglycemia', 'Transient fluid retention', 'Gastric irritation'],
    counselingInstructions: 'Take entire daily dose in the morning with breakfast to prevent sleep disturbances and stomach upset.',
    pregnancyCategory: 'C',
    requiresPrescription: true,
    controlledSubstanceSchedule: 'Non-Controlled',
  }
];
