import { Request, Response } from 'express';
import { PrescriptionService } from '../services/prescription.service';

export class PrescriptionController {
  /**
   * GET /api/prescriptions/formulary
   * Returns list of formulary medications with optional filtering
   */
  public static getFormulary(req: Request, res: Response): void {
    try {
      const { drugClass, search } = req.query;
      const formulary = PrescriptionService.getFormulary({
        drugClass: drugClass ? String(drugClass) : undefined,
        search: search ? String(search) : undefined,
      });

      res.status(200).json({
        success: true,
        count: formulary.length,
        formulary,
      });
    } catch (error: any) {
      console.error('Error fetching formulary:', error);
      res.status(500).json({
        success: false,
        errorType: 'ServerError',
        message: error.message || 'Failed to retrieve drug formulary',
      });
    }
  }

  /**
   * POST /api/prescriptions/generate
   * Generates a comprehensive prescription plan for a clinical case
   */
  public static generatePrescriptions(req: Request, res: Response): void {
    try {
      const { clinicalCase, differentialDiagnoses } = req.body;

      if (!clinicalCase) {
        res.status(400).json({
          success: false,
          errorType: 'ValidationError',
          message: 'clinicalCase is required to generate prescription recommendations',
        });
        return;
      }

      const plan = PrescriptionService.generatePrescriptionPlan(
        clinicalCase,
        Array.isArray(differentialDiagnoses) ? differentialDiagnoses : []
      );

      res.status(200).json({
        success: true,
        plan,
      });
    } catch (error: any) {
      console.error('Error generating prescription plan:', error);
      res.status(500).json({
        success: false,
        errorType: 'ServerError',
        message: error.message || 'Failed to generate prescription plan',
      });
    }
  }
}
