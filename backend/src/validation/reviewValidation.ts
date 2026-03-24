import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    guestId: z.number().int().positive(),
    bookingId: z.number().int().positive().optional(),
    roomTypeId: z.number().int().positive().optional(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});

export const updateReviewStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    status: z.enum(['approved', 'rejected', 'hidden']),
    staffReply: z.string().optional(),
  }),
});

export const getReviewsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    status: z.enum(['pending', 'approved', 'rejected', 'hidden']).optional(),
    roomTypeId: z.string().regex(/^\d+$/).transform(Number).optional(),
    rating: z.string().regex(/^[1-5]$/).transform(Number).optional(),
  }),
});
