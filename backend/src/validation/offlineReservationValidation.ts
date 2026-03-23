import { z } from 'zod';
import { BookingStatusEnum } from '../constants';

export const createOfflineReservationSchema = z.object({
  body: z.object({
    // Guest information - either an existing guest or new guest details
    existingGuestId: z.number().int().positive().optional(),
    newGuestDetails: z.object({
      email: z.string().email(),
      phone: z.string().min(10).max(20),
      firstName: z.string().min(2).max(100),
      lastName: z.string().min(2).max(100),
      address: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      idType: z.enum(['passport', 'driving_license', 'national_id']).optional(),
      idNumber: z.string().optional(),
    }).optional(),

    // Booking information
    roomId: z.number().int().positive(),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    adults: z.number().int().min(1).default(1),
    children: z.number().int().min(0).default(0),
    status: z.enum(Object.values(BookingStatusEnum) as [string, ...string[]]).default(BookingStatusEnum.CONFIRMED),
    specialRequests: z.string().optional(),

    // Payment information
    payment: z.object({
      amount: z.number().nonnegative(),
      method: z.enum(['cash', 'esewa', 'khalti']).default('cash'),
      transactionId: z.string().optional(),
    }).optional(),
  }).refine(data => data.existingGuestId || data.newGuestDetails, {
    message: "Either existingGuestId or newGuestDetails must be provided",
    path: ["existingGuestId"],
  }),
});
