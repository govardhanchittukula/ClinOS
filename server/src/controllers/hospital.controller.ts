import { Request, Response, NextFunction } from 'express';
import { hospitalService } from '../services/hospital.service';

export class HospitalController {
  /**
   * GET /api/hospitals
   * Fetch all hospitals with optional query, locality, and bedType filters
   */
  async getHospitals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, locality, bedType } = req.query;

      const hospitals = await hospitalService.getHospitals({
        query: query ? String(query) : undefined,
        locality: locality ? String(locality) : undefined,
        bedType: bedType ? (String(bedType) as 'general' | 'oxygen' | 'icu' | 'all') : 'all'
      });

      res.status(200).json({
        success: true,
        count: hospitals.length,
        region: 'Ranga Reddy District & Telangana Region',
        hospitals
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET/POST /api/hospitals/nearby
   * Query nearby hospitals using Google Places API or coordinate-based hospital registry
   */
  async getNearbyFacilities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lat = req.body?.latitude ?? req.query?.latitude ?? req.query?.lat;
      const lng = req.body?.longitude ?? req.query?.longitude ?? req.query?.lng;
      const radius = req.body?.radiusMeters ?? req.query?.radiusMeters ?? req.query?.radius;
      const type = req.body?.type ?? req.query?.type;
      const query = req.body?.query ?? req.query?.query;
      const bedType = req.body?.bedType ?? req.query?.bedType;

      const result = await hospitalService.getNearbyFacilities({
        latitude: lat !== undefined ? Number(lat) : undefined,
        longitude: lng !== undefined ? Number(lng) : undefined,
        radiusMeters: radius !== undefined ? Number(radius) : undefined,
        type: type ? String(type) as any : undefined,
        query: query ? String(query) : undefined,
        bedType: bedType ? String(bedType) as any : undefined,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/bookings
   * Reserve an emergency bed hold for 2 hours
   */
  async createBedBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { hospitalId, hospital_id, patientId, patient_id, patientName, patient_name, patientPhone, patient_phone, bedType, bed_type } = req.body;

      const targetHospitalId = hospitalId || hospital_id;
      const targetBedType = bedType || bed_type;
      const targetPatientName = patientName || patient_name || 'Emergency Patient';
      const targetPatientId = patientId || patient_id;
      const targetPatientPhone = patientPhone || patient_phone;

      if (!targetHospitalId) {
        res.status(400).json({
          success: false,
          error: 'hospital_id is required.'
        });
        return;
      }

      if (!targetBedType || !['general', 'oxygen', 'icu'].includes(targetBedType)) {
        res.status(400).json({
          success: false,
          error: "bed_type must be either 'general', 'oxygen', or 'icu'."
        });
        return;
      }

      const result = await hospitalService.createBedBooking({
        hospitalId: targetHospitalId,
        patientId: targetPatientId,
        patientName: targetPatientName,
        patientPhone: targetPatientPhone,
        bedType: targetBedType
      });

      res.status(201).json({
        success: true,
        message: `Successfully secured 2-hour emergency hold for ${targetBedType.toUpperCase()} bed.`,
        booking: result.booking,
        updated_hospital: result.hospital
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to complete bed booking.'
      });
    }
  }

  /**
   * GET /api/bookings/:id
   * Get booking reservation details by ID or token
   */
  async getBookingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const booking = await hospitalService.getBooking(id);

      if (!booking) {
        res.status(404).json({
          success: false,
          error: `Booking with ID or Token '${id}' not found.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        booking
      });
    } catch (error) {
      next(error);
    }
  }
}

export const hospitalController = new HospitalController();
