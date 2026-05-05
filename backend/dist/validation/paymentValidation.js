"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.khaltiWebhookSchema = exports.esewaWebhookSchema = exports.getPaymentsSchema = exports.processCardPaymentSchema = exports.refundPaymentSchema = exports.verifyPaymentSchema = exports.initiatePaymentSchema = void 0;
const zod_1 = require("zod");
exports.initiatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.number().int().positive(),
        amount: zod_1.z.number().positive(),
        method: zod_1.z.enum(['esewa', 'khalti', 'card', 'bank_transfer', 'cash', 'cod']),
        returnUrl: zod_1.z.string().url().optional(),
    }),
});
exports.verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentId: zod_1.z.number().int().positive(),
        transactionId: zod_1.z.string(),
        paymentData: zod_1.z.any().optional(),
    }),
});
exports.refundPaymentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        reason: zod_1.z.string().min(5).max(500),
        amount: zod_1.z.number().positive().optional(),
    }),
});
exports.processCardPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.number().int().positive(),
        amount: zod_1.z.number().positive(),
        expiryMonth: zod_1.z.string().regex(/^\d{2}$/),
        expiryYear: zod_1.z.string().regex(/^\d{2}$/),
        cvv: zod_1.z.string().regex(/^\d{3,4}$/),
        cardHolderName: zod_1.z.string().min(3).max(100),
    }),
});
exports.getPaymentsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        bookingId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        status: zod_1.z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
        method: zod_1.z.enum(['cash', 'card', 'esewa', 'khalti', 'bank_transfer']).optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
    }),
});
exports.esewaWebhookSchema = zod_1.z.object({
    body: zod_1.z.object({
        transaction_code: zod_1.z.string(),
        status: zod_1.z.string(),
        total_amount: zod_1.z.string(),
        transaction_uuid: zod_1.z.string(),
        product_code: zod_1.z.string(),
        signed_field_names: zod_1.z.string(),
        signature: zod_1.z.string(),
    }),
});
exports.khaltiWebhookSchema = zod_1.z.object({
    body: zod_1.z.object({
        idx: zod_1.z.string(),
        amount: zod_1.z.number(),
        status: zod_1.z.enum(['Completed', 'Pending', 'Failed']),
        transaction_id: zod_1.z.string(),
        product_identity: zod_1.z.string(),
        mobile: zod_1.z.string().optional(),
        user: zod_1.z.any().optional(),
    }),
});
//# sourceMappingURL=paymentValidation.js.map