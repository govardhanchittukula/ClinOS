import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';
import { HospitalRecord, BedBookingRecord, runtimeHospitals, runtimeBookings } from '../data/hospitals.data';
import { randomUUID } from 'crypto';

export interface HospitalFilterOptions {
  query?: string;
  locality?: string;
  bedType?: 'general' | 'oxygen' | 'icu' | 'all';
  minAvailable?: number;
}

export interface BedBookingRequest {
  hospitalId: string;
  patientId?: string;
  patientName: string;
  patientPhone?: string;
  bedType: 'general' | 'oxygen' | 'icu';
}

export class HospitalService {
  /**
   * Fetch list of hospitals with active bed counts and filters
   */
  async getHospitals(options: HospitalFilterOptions = {}): Promise<HospitalRecord[]> {
    const { query, locality, bedType = 'all' } = options;

    let hospitals: HospitalRecord[] = [];

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('hospitals')
          .select('*')
          .order('distance_km', { ascending: true });

        if (error) {
          console.warn('Supabase hospitals query error, falling back to runtime store:', error.message);
          hospitals = runtimeHospitals;
        } else if (data && data.length > 0) {
          hospitals = data as HospitalRecord[];
        } else {
          hospitals = runtimeHospitals;
        }
      } catch (err) {
        console.warn('Supabase hospitals fetch exception, using runtime fallback:', err);
        hospitals = runtimeHospitals;
      }
    } else {
      hospitals = runtimeHospitals;
    }

    // Apply filtering in memory
    let filtered = [...hospitals];

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.locality.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q) ||
          (h.specialties && h.specialties.some((s) => s.toLowerCase().includes(q)))
      );
    }

    if (locality && locality.trim() && locality !== 'all') {
      const loc = locality.toLowerCase().trim();
      filtered = filtered.filter(
        (h) => h.locality.toLowerCase().includes(loc) || h.address.toLowerCase().includes(loc)
      );
    }

    if (bedType && bedType !== 'all') {
      if (bedType === 'icu') {
        filtered = filtered.filter((h) => h.icu_beds_available > 0);
      } else if (bedType === 'oxygen') {
        filtered = filtered.filter((h) => h.oxygen_beds_available > 0);
      } else if (bedType === 'general') {
        filtered = filtered.filter((h) => h.general_beds_available > 0);
      }
    }

    // Sort with available beds prioritized first, then closest distance
    filtered.sort((a, b) => {
      const aTotal = a.general_beds_available + a.oxygen_beds_available + a.icu_beds_available;
      const bTotal = b.general_beds_available + b.oxygen_beds_available + b.icu_beds_available;
      if (aTotal === 0 && bTotal > 0) return 1;
      if (bTotal === 0 && aTotal > 0) return -1;
      return a.distance_km - b.distance_km;
    });

    return filtered;
  }

  /**
   * Get single hospital by ID
   */
  async getHospitalById(id: string): Promise<HospitalRecord | null> {
    const hospitals = await this.getHospitals();
    return hospitals.find((h) => h.id === id) || null;
  }

  /**
   * Reserve an emergency bed hold for 2 hours with atomic decrement
   */
  async createBedBooking(request: BedBookingRequest): Promise<{ booking: BedBookingRecord; hospital: HospitalRecord }> {
    const { hospitalId, patientId, patientName, patientPhone, bedType } = request;

    // Find hospital in runtime store
    const hospital = runtimeHospitals.find((h) => h.id === hospitalId);
    if (!hospital) {
      throw new Error(`Hospital with ID ${hospitalId} not found.`);
    }

    // Verify bed availability
    let availableCount = 0;
    if (bedType === 'icu') {
      availableCount = hospital.icu_beds_available;
    } else if (bedType === 'oxygen') {
      availableCount = hospital.oxygen_beds_available;
    } else if (bedType === 'general') {
      availableCount = hospital.general_beds_available;
    } else {
      throw new Error(`Invalid bed type '${bedType}'. Must be 'icu', 'oxygen', or 'general'.`);
    }

    if (availableCount <= 0) {
      throw new Error(`No ${bedType.toUpperCase()} beds currently available at ${hospital.name}.`);
    }

    // Atomic Decrement in runtime store
    if (bedType === 'icu') {
      hospital.icu_beds_available -= 1;
    } else if (bedType === 'oxygen') {
      hospital.oxygen_beds_available -= 1;
    } else if (bedType === 'general') {
      hospital.general_beds_available -= 1;
    }

    // Generate unique emergency reservation token
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingToken = `BED-RR-${randomSuffix}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours hold

    const booking: BedBookingRecord = {
      id: randomUUID(),
      booking_token: bookingToken,
      patient_id: patientId || `patient-${Date.now()}`,
      patient_name: patientName || 'Emergency Patient',
      patient_phone: patientPhone || '+91 98765 43210',
      hospital_id: hospital.id,
      hospital_name: hospital.name,
      bed_type: bedType,
      status: 'held',
      hold_duration_hours: 2,
      booking_timestamp: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      instructions: `Please present token ${bookingToken} at the Emergency Triage Admission Desk upon arrival. Bed is reserved for 2 hours.`
    };

    runtimeBookings.unshift(booking);

    // If Supabase is connected, sync decrement and booking insert
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('bed_bookings').insert({
          id: booking.id,
          booking_token: booking.booking_token,
          patient_id: booking.patient_id,
          patient_name: booking.patient_name,
          patient_phone: booking.patient_phone,
          hospital_id: booking.hospital_id,
          bed_type: booking.bed_type,
          status: booking.status,
          hold_duration_hours: booking.hold_duration_hours,
          booking_timestamp: booking.booking_timestamp,
          expires_at: booking.expires_at
        });

        // Decrement in database
        const updatePayload: Record<string, number> = {};
        if (bedType === 'icu') updatePayload.icu_beds_available = hospital.icu_beds_available;
        if (bedType === 'oxygen') updatePayload.oxygen_beds_available = hospital.oxygen_beds_available;
        if (bedType === 'general') updatePayload.general_beds_available = hospital.general_beds_available;

        await supabaseAdmin.from('hospitals').update(updatePayload).eq('id', hospital.id);
      } catch (err) {
        console.warn('Supabase booking sync error (runtime state active):', err);
      }
    }

    return { booking, hospital };
  }

  /**
   * Get booking details by ID or Token
   */
  async getBooking(idOrToken: string): Promise<BedBookingRecord | null> {
    const booking = runtimeBookings.find(
      (b) => b.id === idOrToken || b.booking_token.toUpperCase() === idOrToken.toUpperCase()
    );
    return booking || null;
  }
}

export const hospitalService = new HospitalService();
