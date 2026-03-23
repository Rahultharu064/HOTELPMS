import { z } from 'zod';

export const createGuestSchema = z.object({
  body: z.object({
    email: z.string().email(),
    phone: z.string().min(10).max(20),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    idType: z.enum(['passport', 'driving_license', 'national_id']).optional(),
    idNumber: z.string().optional(),
  }),
});

export const updateGuestSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    email: z.string().email().optional(),
    phone: z.string().min(10).max(20).optional(),
    firstName: z.string().min(2).max(100).optional(),
    lastName: z.string().min(2).max(100).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    idType: z.enum(['passport', 'driving_license', 'national_id']).optional(),
    idNumber: z.string().optional(),
  }),
});

export const getGuestsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    sort: z.enum(['name_asc', 'name_desc', 'bookings_desc', 'spent_desc']).optional(),
  }),
});

export const guestBookingsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show']).optional(),
  }),
});