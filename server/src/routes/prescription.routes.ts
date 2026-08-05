import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescription.controller';

const router = Router();

// GET /api/prescriptions/formulary
router.get('/formulary', PrescriptionController.getFormulary);

// POST /api/prescriptions/generate
router.post('/generate', PrescriptionController.generatePrescriptions);

export default router;
