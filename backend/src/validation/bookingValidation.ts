import { z } from 'zod';
import { BookingStatusEnum } from '../constants';

export const createBookingSchema = z.object({
  body: z.object({
    guestId: z.number().int().positive().optional(),
    guestDetails: z.object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(8, 'Phone number is too short'),
      nationality: z.string().optional(),
      idType: z.enum(['passport', 'driving_license', 'national_id', 'citizenship', 'other']).optional(),
      idNumber: z.string().optional(),
      idProofImage: z.string().regex(/^data:image\/(jpeg|png|webp);base64,/, 'Identification must be a valid image (JPG, PNG, WEBP)').optional(),
    }).optional(),
    roomId: z.number().int().positive(),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    adults: z.number().int().min(1).default(1),
    children: z.number().int().min(0).default(0),
    status: z.enum(Object.values(BookingStatusEnum) as [string, ...string[]]).optional(),
    source: z.enum(['direct', 'ota', 'walk_in', 'corporate']).optional(),
    specialRequests: z.string().optional(),
    payment: z.object({
      amount: z.number().positive(),
      method: z.enum(['cash', 'esewa', 'khalti']),
      transactionId: z.string().optional(),
    }).optional(),
  })
  .refine(data => data.guestId || data.guestDetails, {
    message: "Either guestId or guestDetails must be provided",
    path: ["guestId"]
  })
  .refine(data => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkIn < checkOut;
  }, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"]
  })
  .refine(data => {
    const checkIn = new Date(data.checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkIn >= today;
  }, {
    message: "Check-in date cannot be in the past",
    path: ["checkIn"]
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
