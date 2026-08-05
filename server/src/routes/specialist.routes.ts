import { Router } from 'express';
import { SpecialistController } from '../controllers/specialist.controller';

const router = Router();

router.get('/', SpecialistController.getSpecialists);
router.get('/:id', SpecialistController.getSpecialistById);
router.post('/recommend', SpecialistController.recommendSpecialists);
router.post('/book', SpecialistController.bookAppointment);

export default router;
