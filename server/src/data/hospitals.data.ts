export interface HospitalRecord {
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
  specialties: string[];
  created_at: string;
}

export interface BedBookingRecord {
  id: string;
  booking_token: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  hospital_id: string;
  hospital_name: string;
  bed_type: 'general' | 'oxygen' | 'icu';
  status: 'held' | 'confirmed' | 'cancelled';
  hold_duration_hours: number;
  booking_timestamp: string;
  expires_at: string;
  instructions: string;
}

export const INITIAL_HOSPITALS: HospitalRecord[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Continental Hospitals',
    locality: 'Financial District, Nanakramguda (Ranga Reddy)',
    address: 'Plot No. 3, Road No. 2, IT & Financial Park, Nanakramguda, Telangana 500032',
    latitude: 17.4182,
    longitude: 78.3473,
    contact_number: '+91 40 6700 0000',
    emergency_helpline: '1066',
    general_beds_available: 18,
    general_beds_total: 50,
    oxygen_beds_available: 9,
    oxygen_beds_total: 30,
    icu_beds_available: 4,
    icu_beds_total: 15,
    ambulance_available: true,
    rating: 4.9,
    distance_km: 1.8,
    specialties: ['Trauma & Critical Care', 'Cardiology', 'Pulmonology', 'Neurosciences'],
    created_at: new Date().toISOString()
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'AIG Hospitals (Asian Institute of Gastroenterology)',
    locality: 'Gachibowli (Ranga Reddy)',
    address: '1-66/AIG/1 to 5, Mindspace Road, Gachibowli, Telangana 500032',
    latitude: 17.4416,
    longitude: 78.3615,
    contact_number: '+91 40 4244 4222',
    emergency_helpline: '040 4244 4444',
    general_beds_available: 24,
    general_beds_total: 75,
    oxygen_beds_available: 14,
    oxygen_beds_total: 40,
    icu_beds_available: 6,
    icu_beds_total: 20,
    ambulance_available: true,
    rating: 4.9,
    distance_km: 3.2,
    specialties: ['Gastroenterology', 'Emergency Medicine', 'Hepatology', 'Organ Transplant'],
    created_at: new Date().toISOString()
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    name: 'Care Hospitals - Hi-tech City',
    locality: 'Gachibowli / HITEC City (Ranga Reddy)',
    address: 'Old Mumbai Highway, Near Cyberabad Police Commissionerate, Gachibowli, Telangana 500032',
    latitude: 17.4385,
    longitude: 78.3688,
    contact_number: '+91 40 6165 6565',
    emergency_helpline: '105711',
    general_beds_available: 12,
    general_beds_total: 40,
    oxygen_beds_available: 7,
    oxygen_beds_total: 25,
    icu_beds_available: 2,
    icu_beds_total: 12,
    ambulance_available: true,
    rating: 4.7,
    distance_km: 3.9,
    specialties: ['Cardiac Sciences', 'Critical Care', 'Orthopaedics', 'Pediatrics'],
    created_at: new Date().toISOString()
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    name: 'Apollo Hospitals Jubilee Hills',
    locality: 'Jubilee Hills (Hyderabad / RR Border)',
    address: 'Road No. 72, Opposite Bharatiya Vidya Bhavan School, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500033',
    latitude: 17.4165,
    longitude: 78.4116,
    contact_number: '+91 40 2360 7777',
    emergency_helpline: '1066',
    general_beds_available: 35,
    general_beds_total: 100,
    oxygen_beds_available: 18,
    oxygen_beds_total: 60,
    icu_beds_available: 8,
    icu_beds_total: 30,
    ambulance_available: true,
    rating: 4.8,
    distance_km: 6.4,
    specialties: ['Stroke Center', 'Emergency & Trauma', 'Cardiothoracic Surgery', 'Oncology'],
    created_at: new Date().toISOString()
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    name: 'Sunrise Multi-Speciality Emergency Hospital',
    locality: 'LB Nagar / Saroornagar (Ranga Reddy)',
    address: 'NH 65, Near LB Nagar Ring Road, Mohan Nagar, Kothapet, Telangana 500035',
    latitude: 17.3512,
    longitude: 78.5524,
    contact_number: '+91 40 2404 8888',
    emergency_helpline: '040 2404 9999',
    general_beds_available: 15,
    general_beds_total: 35,
    oxygen_beds_available: 8,
    oxygen_beds_total: 20,
    icu_beds_available: 3,
    icu_beds_total: 10,
    ambulance_available: true,
    rating: 4.6,
    distance_km: 12.1,
    specialties: ['Accident & Emergency', 'Trauma Resuscitation', 'General Surgery'],
    created_at: new Date().toISOString()
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    name: 'KIMS Hospitals (Krishna Institute of Medical Sciences)',
    locality: 'Secunderabad (Telangana)',
    address: '1-8-31/1, Minister Road, Krishna Nagar Colony, Begumpet, Secunderabad, Telangana 500003',
    latitude: 17.4375,
    longitude: 78.4878,
    contact_number: '+91 40 4488 5000',
    emergency_helpline: '040 4488 5100',
    general_beds_available: 28,
    general_beds_total: 80,
    oxygen_beds_available: 15,
    oxygen_beds_total: 45,
    icu_beds_available: 5,
    icu_beds_total: 25,
    ambulance_available: true,
    rating: 4.8,
    distance_km: 14.5,
    specialties: ['Heart & Lung Transplant', 'Neuro Surgery', 'Nephrology', 'Medical ICU'],
    created_at: new Date().toISOString()
  }
];

// In-memory runtime state for bed availability and bookings
export const runtimeHospitals: HospitalRecord[] = JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
export const runtimeBookings: BedBookingRecord[] = [];
