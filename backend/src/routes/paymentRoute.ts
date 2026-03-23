import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { validate } from '../middlewares/validateMiddleware';
import {
  initiatePaymentSchema,
  getPaymentsSchema,
} from '../validation/paymentValidation';

const router = Router();
const paymentController = new PaymentController();

// Initiate Payment (eSewa / Khalti / COD)
router.post(
  '/initiate',
  validate(initiatePaymentSchema),
  paymentController.initiatePayment
);

// Verify eSewa callback
router.get(
  '/verify-esewa',
  paymentController.verifyEsewa
);
router.post(
  '/verify-esewa',
  paymentController.verifyEsewa
);

// Verify Khalti
router.post(
  '/verify-khalti',
  paymentController.verifyKhalti
);

// Get All Payments
router.get(
  '/',
  validate(getPaymentsSchema),
  paymentController.getAllPayments
);

export default router;
