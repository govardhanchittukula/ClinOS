import { Request, Response } from 'express';
import { SpecialistService } from '../services/specialist.service';

export class SpecialistController {
  /**
   * GET /api/specialists
   */
  public static async getSpecialists(req: Request, res: Response): Promise<void> {
    try {
      const { specialty, search, telehealthOnly } = req.query;
      const specialists = SpecialistService.getAllSpecialists({
        specialty: specialty as string,
        search: search as string,
        telehealthOnly: telehealthOnly === 'true',
      });

      res.status(200).json({
        success: true,
        count: specialists.length,
        specialists,
      });
    } catch (error) {
      console.error('Error fetching specialists:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve specialists directory.',
      });
    }
  }

  /**
   * GET /api/specialists/:id
   */
  public static async getSpecialistById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const specialist = SpecialistService.getSpecialistById(id);

      if (!specialist) {
        res.status(404).json({
          success: false,
          error: `Specialist with ID ${id} was not found.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        specialist,
      });
    } catch (error) {
      console.error('Error fetching specialist by id:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve specialist details.',
      });
    }
  }

  /**
   * POST /api/specialists/recommend
   */
  public static async recommendSpecialists(req: Request, res: Response): Promise<void> {
    try {
      const { clinicalCase, differentialDiagnoses } = req.body;

      if (!clinicalCase || typeof clinicalCase !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Missing required field: clinicalCase',
        });
        return;
      }

      const recommendation = SpecialistService.recommendSpecialistsForCase(
        clinicalCase,
        differentialDiagnoses || []
      );

      res.status(200).json({
        success: true,
        recommendation,
      });
    } catch (error) {
      console.error('Error recommending specialists:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate specialist recommendations.',
      });
    }
  }

  /**
   * POST /api/specialists/book
   */
  public static async bookAppointment(req: Request, res: Response): Promise<void> {
    try {
      const {
        specialistId,
        patientName,
        patientEmail,
        patientPhone,
        preferredDate,
        preferredTime,
        consultationMode,
        reasonForVisit,
        clinicalCaseSummary,
      } = req.body;

      if (!specialistId || !patientName || !patientEmail) {
        res.status(400).json({
          success: false,
          error: 'Missing required appointment fields: specialistId, patientName, patientEmail.',
        });
        return;
      }

      const confirmation = SpecialistService.bookAppointment({
        specialistId,
        patientName,
        patientEmail,
        patientPhone: patientPhone || '+1 (555) 000-0000',
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: preferredTime || '10:00 AM',
        consultationMode: consultationMode || 'Telehealth',
        reasonForVisit: reasonForVisit || 'Clinical Referral Review',
        clinicalCaseSummary,
      });

      res.status(201).json({
        success: true,
        message: 'Appointment successfully requested and confirmed.',
        confirmation,
      });
    } catch (error) {
      console.error('Error booking specialist appointment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process appointment booking request.',
      });
    }
  }
}
