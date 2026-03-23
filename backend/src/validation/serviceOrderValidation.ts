import { z } from 'zod';

export const createServiceOrderSchema = z.object({
  body: z.object({
    bookingId: z.number().int().positive().optional(),
    roomId: z.number().int().positive(),
    notes: z.string().optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
    requestedBy: z.string().optional(),
    items: z.array(z.object({
      serviceId: z.number().int().positive(),
      quantity: z.number().int().min(1).default(1),
      notes: z.string().optional(),
    })).min(1),
  }),
});

export const updateServiceOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
    assignedTo: z.string().optional(),
  }),
});

export const getServiceOrdersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
    roomId: z.string().regex(/^\d+$/).transform(Number).optional(),
    bookingId: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
  }),
});
