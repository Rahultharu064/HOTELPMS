"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const paymentValidation_1 = require("../validation/paymentValidation");
const router = (0, express_1.Router)();
const paymentController = new paymentController_1.PaymentController();
// Initiate Payment (eSewa / Khalti / COD)
router.post('/initiate', (0, validateMiddleware_1.validate)(paymentValidation_1.initiatePaymentSchema), paymentController.initiatePayment);
// Verify eSewa callback
router.get('/verify-esewa', paymentController.verifyEsewa);
router.post('/verify-esewa', paymentController.verifyEsewa);
// Verify Khalti
router.post('/verify-khalti', paymentController.verifyKhalti);
router.get('/verify-khalti', paymentController.verifyKhalti);
// Get All Payments
router.get('/', (0, validateMiddleware_1.validate)(paymentValidation_1.getPaymentsSchema), paymentController.getAllPayments);
exports.default = router;
//# sourceMappingURL=paymentRoute.js.map