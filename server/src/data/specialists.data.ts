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

export const VERIFIED_SPECIALISTS: DoctorSpecialist[] = [
  {
    id: 'doc-surg-01',
    name: 'Dr. Jennifer Hayes, MD, FACS',
    title: 'Chief of Acute Care & Minimally Invasive Surgery',
    specialty: 'General & Gastrointestinal Surgery',
    category: 'General Surgery',
    hospital: 'Johns Hopkins Medicine • Surgical Pavilion',
    location: 'Baltimore, MD (Available for Telehealth Nationwide)',
    rating: 4.95,
    reviewsCount: 248,
    experienceYears: 17,
    education: 'Harvard Medical School (MD) • Johns Hopkins (Residency/Fellowship)',
    boardCertifications: ['American Board of Surgery (ABS)', 'Fellow of the American College of Surgeons (FACS)'],
    languages: ['English', 'Spanish'],
    consultationModes: ['In-Person', 'Telehealth', 'Urgent Referral'],
    matchingKeywords: [
      'appendicitis', 'appendix', 'acute appendicitis', 'abdominal pain', 'right lower quadrant', 'rlq',
      'mcburney', 'nausea', 'vomiting', 'rebound tenderness', 'guarding', 'peritonitis', 'acute abdomen',
      'hernia', 'cholecystitis', 'gallbladder', 'bowel obstruction', 'abscess', 'surgical consult'
    ],
    nextAvailableSlot: 'Today at 3:30 PM (Telehealth) or Tomorrow 8:30 AM',
    consultationFee: '$150 (Covered by major insurances & Medicare)',
    phone: '+1 (410) 555-0192',
    email: 'j.hayes.surgery@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-blue-600 to-indigo-600',
    bio: 'Specializes in urgent abdominal emergencies, laparoscopic appendectomy, complex gastrointestinal pathology, and second opinions on surgical indications.',
  },
  {
    id: 'doc-gastro-01',
    name: 'Dr. Robert Chen, MD, FACG',
    title: 'Senior Attending Gastroenterologist & Hepatologist',
    specialty: 'Gastroenterology & Inflammatory Bowel Disease',
    category: 'Gastroenterology',
    hospital: 'Massachusetts General Hospital • Digestive Healthcare Center',
    location: 'Boston, MA',
    rating: 4.92,
    reviewsCount: 195,
    experienceYears: 15,
    education: 'Stanford University School of Medicine • Mass General Hospital',
    boardCertifications: ['American Board of Internal Medicine - Gastroenterology'],
    languages: ['English', 'Mandarin'],
    consultationModes: ['In-Person', 'Telehealth'],
    matchingKeywords: [
      'abdominal pain', 'colitis', 'crohns', 'ulcerative colitis', 'mesenteric adenitis', 'gastroenteritis',
      'diarrhea', 'nausea', 'vomiting', 'gerd', 'acid reflux', 'diverticulitis', 'jaundice', 'elevated liver enzymes',
      'peptic ulcer', 'gi bleeding', 'celiac'
    ],
    nextAvailableSlot: 'Tomorrow at 10:15 AM (Telehealth)',
    consultationFee: '$140 (In-network accepted)',
    phone: '+1 (617) 555-0144',
    email: 'r.chen.gi@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-teal-600 to-emerald-600',
    bio: 'Expert in acute and chronic gastrointestinal disorders, endoscopy, differential diagnosis of abdominal pain, and mesenteric inflammatory conditions.',
  },
  {
    id: 'doc-cardio-01',
    name: 'Dr. Marcus Vance, MD, FACC',
    title: 'Director of Interventional Cardiology & Acute Coronary Care',
    specialty: 'Cardiovascular Disease & Interventional Cardiology',
    category: 'Cardiology',
    hospital: 'Cleveland Clinic • Heart, Vascular & Thoracic Institute',
    location: 'Cleveland, OH',
    rating: 4.98,
    reviewsCount: 310,
    experienceYears: 20,
    education: 'Columbia University Vagelos College of Physicians and Surgeons • Cleveland Clinic',
    boardCertifications: ['American Board of Internal Medicine - Cardiovascular Disease', 'Interventional Cardiology'],
    languages: ['English'],
    consultationModes: ['In-Person', 'Telehealth', 'Urgent Referral'],
    matchingKeywords: [
      'chest pain', 'angina', 'myocardial infarction', 'heart attack', 'shortness of breath', 'dyspnea',
      'palpitations', 'arrhythmia', 'atrial fibrillation', 'syncope', 'dizziness', 'hypertension', 'troponin',
      'coronary artery disease', 'heart failure', 'edema', 'orthopnea'
    ],
    nextAvailableSlot: 'Today at 4:45 PM (Telehealth)',
    consultationFee: '$165 (Covered by major insurances)',
    phone: '+1 (216) 555-0188',
    email: 'm.vance.cardiology@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-rose-600 to-pink-600',
    bio: 'Pioneer in rapid coronary triage, non-invasive cardiac diagnostics, post-infarct rehabilitation, and acute chest pain evaluation.',
  },
  {
    id: 'doc-neuro-01',
    name: 'Dr. Elena Rostova, MD, PhD, FAAN',
    title: 'Associate Professor of Vascular Neurology & Comprehensive Stroke Care',
    specialty: 'Vascular Neurology & Acute Stroke Intervention',
    category: 'Neurology',
    hospital: 'Mount Sinai Hospital • Cerebrovascular Center',
    location: 'New York, NY',
    rating: 4.94,
    reviewsCount: 172,
    experienceYears: 14,
    education: 'Yale School of Medicine • NewYork-Presbyterian / Weill Cornell',
    boardCertifications: ['American Board of Psychiatry and Neurology - Vascular Neurology'],
    languages: ['English', 'Russian', 'French'],
    consultationModes: ['In-Person', 'Telehealth', 'Urgent Referral'],
    matchingKeywords: [
      'stroke', 'ischemic stroke', 'transient ischemic attack', 'tia', 'facial droop', 'arm weakness',
      'slurred speech', 'aphasia', 'numbness', 'hemiparesis', 'ataxia', 'vertigo', 'loss of balance',
      'thunderclap headache', 'migraine', 'seizure', 'altered mental status'
    ],
    nextAvailableSlot: 'Today at 2:00 PM (Emergency Telehealth Slot)',
    consultationFee: '$175 (Covered by Medicare & Commercial Payers)',
    phone: '+1 (212) 555-0173',
    email: 'e.rostova.neuro@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-purple-600 to-indigo-600',
    bio: 'Specialist in acute neurovascular triage, hyperacute stroke management, post-TIA risk stratification, and complex neurological diagnostics.',
  },
  {
    id: 'doc-pulm-01',
    name: 'Dr. David O’Connor, MD, FCCP',
    title: 'Director of Pulmonary Vascular Disease & Critical Care',
    specialty: 'Pulmonology & Respiratory Medicine',
    category: 'Pulmonology',
    hospital: 'Mayo Clinic • Division of Pulmonary and Critical Care Medicine',
    location: 'Rochester, MN',
    rating: 4.91,
    reviewsCount: 160,
    experienceYears: 16,
    education: 'University of Pennsylvania Perelman School of Medicine • Mayo Clinic',
    boardCertifications: ['American Board of Internal Medicine - Pulmonary Disease & Critical Care Medicine'],
    languages: ['English'],
    consultationModes: ['In-Person', 'Telehealth', 'Urgent Referral'],
    matchingKeywords: [
      'pulmonary embolism', 'pe', 'dvt', 'deep vein thrombosis', 'pleuritic chest pain', 'shortness of breath',
      'dyspnea', 'hemoptysis', 'coughing blood', 'hypoxia', 'low oxygen', 'tachycardia', 'asthma', 'copd',
      'pneumonia', 'infiltrate', 'pleural effusion', 'stridor', 'wheezing'
    ],
    nextAvailableSlot: 'Tomorrow at 9:30 AM (Telehealth)',
    consultationFee: '$150 (Covered by major insurances)',
    phone: '+1 (507) 555-0112',
    email: 'd.oconnor.pulm@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-cyan-600 to-blue-600',
    bio: 'Recognized authority in pulmonary embolism diagnostics, thromboprophylaxis, acute respiratory failure, and interstitial lung disease.',
  },
  {
    id: 'doc-ortho-01',
    name: 'Dr. Sarah Al-Mansoor, MD, FAAOS',
    title: 'Chief of Orthopedic Trauma & Joint Reconstruction',
    specialty: 'Orthopedic Surgery & Musculoskeletal Trauma',
    category: 'Orthopedics',
    hospital: 'Hospital for Special Surgery (HSS) • Orthopedic Trauma Service',
    location: 'New York, NY',
    rating: 4.96,
    reviewsCount: 220,
    experienceYears: 18,
    education: 'Duke University School of Medicine • Hospital for Special Surgery',
    boardCertifications: ['American Board of Orthopaedic Surgery (ABOS)'],
    languages: ['English', 'Arabic'],
    consultationModes: ['In-Person', 'Telehealth'],
    matchingKeywords: [
      'fracture', 'bone pain', 'joint pain', 'knee pain', 'hip pain', 'shoulder dislocation', 'sprain', 'ligament tear',
      'acl', 'meniscus', 'inability to bear weight', 'deformity', 'swelling', 'compartment syndrome', 'osteoarthritis',
      'back pain', 'sciatica', 'lumbar strain'
    ],
    nextAvailableSlot: 'Thursday at 11:00 AM (In-Person / Virtual)',
    consultationFee: '$160 (Major insurances accepted)',
    phone: '+1 (212) 555-0199',
    email: 's.almansoor.ortho@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-amber-600 to-orange-600',
    bio: 'Focuses on acute fracture management, sports injuries, joint preservation, and rapid musculoskeletal trauma recovery.',
  },
  {
    id: 'doc-nephro-01',
    name: 'Dr. Vikram Malhotra, MD, FASN',
    title: 'Senior Clinical Nephrologist & Renal Care Lead',
    specialty: 'Nephrology & Hypertension',
    category: 'Nephrology',
    hospital: 'Stanford Health Care • Division of Nephrology',
    location: 'Palo Alto, CA',
    rating: 4.89,
    reviewsCount: 135,
    experienceYears: 13,
    education: 'UCSF School of Medicine • Stanford Health Care',
    boardCertifications: ['American Board of Internal Medicine - Nephrology'],
    languages: ['English', 'Hindi'],
    consultationModes: ['In-Person', 'Telehealth'],
    matchingKeywords: [
      'kidney', 'renal', 'acute kidney injury', 'aki', 'creatinine', 'bun', 'flank pain', 'costovertebral angle tenderness',
      'hematuria', 'blood in urine', 'proteinuria', 'kidney stone', 'nephrolithiasis', 'electrolyte imbalance',
      'hyperkalemia', 'edema', 'glomerulonephritis'
    ],
    nextAvailableSlot: 'Tomorrow at 1:30 PM (Telehealth)',
    consultationFee: '$145 (Covered by major insurers)',
    phone: '+1 (650) 555-0165',
    email: 'v.malhotra.nephro@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-emerald-600 to-teal-600',
    bio: 'Dedicated to renal function preservation, complex metabolic and electrolyte disturbances, nephrolithiasis management, and acute renal insufficiency.',
  },
  {
    id: 'doc-derm-01',
    name: 'Dr. Camille Fontaine, MD, FAAD',
    title: 'Director of Cutaneous Oncology & Medical Dermatology',
    specialty: 'Dermatology & Skin Lesion Analysis',
    category: 'Dermatology',
    hospital: 'Memorial Sloan Kettering Cancer Center • Dermatology Service',
    location: 'New York, NY',
    rating: 4.97,
    reviewsCount: 280,
    experienceYears: 15,
    education: 'Johns Hopkins University School of Medicine • NYU Langone Health',
    boardCertifications: ['American Board of Dermatology (ABD)'],
    languages: ['English', 'French'],
    consultationModes: ['In-Person', 'Telehealth'],
    matchingKeywords: [
      'rash', 'skin lesion', 'mole', 'melanoma', 'erythema', 'pruritus', 'itching', 'hives', 'urticaria',
      'petechiae', 'purpura', 'cellulitis', 'shingles', 'herpes zoster', 'dermatitis', 'psoriasis', 'eczema',
      'skin ulcer', 'blister', 'bullous'
    ],
    nextAvailableSlot: 'Today at 5:15 PM (Tele-Derm Slot)',
    consultationFee: '$135 (Accepts Medicare & Commercial plans)',
    phone: '+1 (212) 555-0142',
    email: 'c.fontaine.derm@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-rose-500 to-amber-600',
    bio: 'Specialist in rapid tele-dermatology triage, atypical pigmented lesions, inflammatory skin eruptions, and dermatologic emergencies.',
  },
  {
    id: 'doc-em-01',
    name: 'Dr. Gregory House-Taylor, MD, FACEP',
    title: 'Chief Medical Officer of Emergency Medicine & Acute Triage',
    specialty: 'Emergency Medicine & Disaster Preparedness',
    category: 'Emergency Medicine',
    hospital: 'Northwestern Memorial Hospital • Department of Emergency Medicine',
    location: 'Chicago, IL',
    rating: 4.93,
    reviewsCount: 340,
    experienceYears: 22,
    education: 'Northwestern University Feinberg School of Medicine • Cook County Health',
    boardCertifications: ['American Board of Emergency Medicine (ABEM)'],
    languages: ['English', 'Spanish'],
    consultationModes: ['In-Person', 'Telehealth', 'Urgent Referral'],
    matchingKeywords: [
      'emergency', 'acute pain', 'trauma', 'high fever', 'altered mental status', 'sepsis', 'anaphylaxis',
      'severe hemorrhage', 'uncontrolled bleeding', 'poisoning', 'overdose', 'syncope', 'tachycardia', 'hypotension',
      'shock', 'critical', 'resuscitation', 'sudden onset'
    ],
    nextAvailableSlot: 'Immediate Virtual Triage on Demand (24/7)',
    consultationFee: '$110 (Emergency triage triage benefit)',
    phone: '+1 (312) 555-0190',
    email: 'g.housetaylor.em@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-red-600 to-rose-700',
    bio: 'Over two decades directing Level-1 trauma centers and high-acuity emergency triage, specializing in rapid stabilization and multisystem clinical decision making.',
  },
  {
    id: 'doc-endo-01',
    name: 'Dr. Maya Patel, MD, FACE',
    title: 'Senior Consultant Endocrinologist',
    specialty: 'Endocrinology, Diabetes & Metabolism',
    category: 'Endocrinology',
    hospital: 'Brigham and Women’s Hospital • Division of Endocrinology',
    location: 'Boston, MA',
    rating: 4.90,
    reviewsCount: 155,
    experienceYears: 14,
    education: 'Harvard Medical School • Brigham and Women’s Hospital',
    boardCertifications: ['American Board of Internal Medicine - Endocrinology, Diabetes, and Metabolism'],
    languages: ['English', 'Gujarati'],
    consultationModes: ['In-Person', 'Telehealth'],
    matchingKeywords: [
      'diabetes', 'hyperglycemia', 'hypoglycemia', 'dka', 'ketoacidosis', 'thyroid', 'hyperthyroidism', 'hypothyroidism',
      'adrenal', 'cortisol', 'cushings', 'addisons', 'weight loss', 'fatigue', 'polyuria', 'polydipsia', 'calcium', 'hypercalcemia'
    ],
    nextAvailableSlot: 'Friday at 2:00 PM (Telehealth)',
    consultationFee: '$140 (In-network accepted)',
    phone: '+1 (617) 555-0177',
    email: 'm.patel.endo@clinos-network.org',
    verifiedBadge: true,
    avatarColor: 'from-violet-600 to-purple-700',
    bio: 'Focuses on complex endocrine pathology, uncontrolled glycemic management, thyroid nodules, and hormonal dysregulation.',
  }
];
