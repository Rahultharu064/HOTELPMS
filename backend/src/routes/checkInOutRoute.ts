import { Router } from 'express';
import { CheckInOutController } from '../controllers/checkInOutController';

const router = Router();
const controller = new CheckInOutController();

router.post('/booking/:id/checkin', controller.checkIn);
router.post('/booking/:id/checkout', controller.checkOut);
router.post('/booking/:id/no-show', controller.markNoShow);
router.post('/booking/:id/verify-identity', controller.verifyIdentity);
router.get('/booking/:id/folio', controller.getFolio);

export default router;
