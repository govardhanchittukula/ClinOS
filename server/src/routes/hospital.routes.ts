import { Router } from 'express';
import { hospitalController } from '../controllers/hospital.controller';

const router = Router();

// Hospital Bed Tracking & Query routes
router.get('/hospitals', (req, res, next) => hospitalController.getHospitals(req, res, next));

// Bed Reservation & Booking routes
router.post('/bookings', (req, res, next) => hospitalController.createBedBooking(req, res, next));
router.get('/bookings/:id', (req, res, next) => hospitalController.getBookingById(req, res, next));

export default router;
