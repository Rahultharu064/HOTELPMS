import { Router } from 'express';
import { OfflineReservationController } from '../controllers/offlineReservationController';
import { validate } from '../middlewares/validateMiddleware';
import { createOfflineReservationSchema } from '../validation/offlineReservationValidation';

const router = Router();
const offlineReservationController = new OfflineReservationController();

// Route for Front-Office Offline Reservations (Walk-ins)
router.post(
  '/',
  validate(createOfflineReservationSchema),
  offlineReservationController.createOfflineReservation
);

export default router;
