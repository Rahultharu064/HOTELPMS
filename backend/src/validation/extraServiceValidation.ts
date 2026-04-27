import { z } from 'zod';

export const createExtraServiceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().min(1, 'Description is required'),
    price: z.string().or(z.number()).transform((val) => parseFloat(val.toString())),
    categoryId: z.string().or(z.number()).transform((val) => parseInt(val.toString())),
    discountPercentage: z.string().or(z.number()).optional().transform((val) => val ? parseFloat(val.toString()) : 0),
    discountAllowed: z.string().or(z.boolean()).optional().transform((val) => val === 'true' || val === true),
  }),
});

export const updateExtraServiceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    price: z.string().or(z.number()).optional().transform((val) => val ? parseFloat(val.toString()) : undefined),
    categoryId: z.string().or(z.number()).optional().transform((val) => val ? parseInt(val.toString()) : undefined),
    active: z.string().or(z.boolean()).optional().transform((val) => val === 'true' || val === true),
    discountPercentage: z.string().or(z.number()).optional().transform((val) => val !== undefined ? parseFloat(val.toString()) : undefined),
    discountAllowed: z.string().or(z.boolean()).optional().transform((val) => val === 'true' || val === true),
  }),
});

export const addServiceToBookingSchema = z.object({
  body: z.object({
    bookingId: z.number().int(),
    extraServiceId: z.number().int(),
    quantity: z.number().int().min(1),
  }),
});

export const bookingParamsSchema = z.object({
  params: z.object({
    bookingId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});
