import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  body: z.object({
    bookingId: z.number().int().positive(),
    amount: z.number().positive(),
    method: z.enum(['esewa', 'khalti', 'card', 'bank_transfer', 'cash', 'cod']),
    returnUrl: z.string().url().optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    paymentId: z.number().int().positive(),
    transactionId: z.string(),
    paymentData: z.any().optional(),
  }),
});

export const refundPaymentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    reason: z.string().min(5).max(500),
    amount: z.number().positive().optional(),
  }),
});

export const processCardPaymentSchema = z.object({
  body: z.object({
    bookingId: z.number().int().positive(),
    amount: z.number().positive(),
  
    expiryMonth: z.string().regex(/^\d{2}$/),
    expiryYear: z.string().regex(/^\d{2}$/),
    cvv: z.string().regex(/^\d{3,4}$/),
    cardHolderName: z.string().min(3).max(100),
  }),
});

export const getPaymentsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    bookingId: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
    method: z.enum(['cash', 'card', 'esewa', 'khalti', 'bank_transfer']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const esewaWebhookSchema = z.object({
  body: z.object({
    transaction_code: z.string(),
    status: z.string(),
    total_amount: z.string(),
    transaction_uuid: z.string(),
    product_code: z.string(),
    signed_field_names: z.string(),
    signature: z.string(),
  }),
});

export const khaltiWebhookSchema = z.object({
  body: z.object({
    idx: z.string(),
    amount: z.number(),
    status: z.enum(['Completed', 'Pending', 'Failed']),
    transaction_id: z.string(),
    product_identity: z.string(),
    mobile: z.string().optional(),
    user: z.any().optional(),
  }),
});