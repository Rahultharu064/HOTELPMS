import { z } from 'zod';
import { BookingStatusEnum } from '../constants';

export const createBookingSchema = z.object({
  body: z.object({
    guestId: z.number().int().positive(),
    roomId: z.number().int().positive(),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    adults: z.number().int().min(1).optional(),
    children: z.number().int().min(0).optional(),
    status: z.enum(Object.values(BookingStatusEnum) as [string, ...string[]]).optional(),
    source: z.enum(['direct', 'ota', 'walk_in', 'corporate']).optional(),
    specialRequests: z.string().optional(),
    payment: z.object({
      amount: z.number().positive(),
      method: z.enum(['cash', 'esewa', 'khalti']),
      transactionId: z.string().optional(),
    }).optional(),
  }),
});

export const updateBookingSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    roomId: z.number().int().positive().optional(),
    checkIn: z.string().datetime().optional(),
    checkOut: z.string().datetime().optional(),
    adults: z.number().int().min(1).optional(),
    children: z.number().int().min(0).optional(),
    specialRequests: z.string().optional(),
  }),
});

export const getBookingsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(Object.values(BookingStatusEnum) as [string, ...string[]]).optional(),
    guestId: z.string().regex(/^\d+$/).transform(Number).optional(),
    roomId: z.string().regex(/^\d+$/).transform(Number).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    status: z.enum(Object.values(BookingStatusEnum) as [string, ...string[]]),
  }),
});
