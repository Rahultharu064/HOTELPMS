import { z } from 'zod';

export const updateRoomStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    status: z.enum(['available', 'occupied', 'maintenance', 'cleaning', 'reserved', 'out_of_service']),
    staffId: z.string().optional(),
    type: z.enum(['general', 'deep_clean', 'inspection', 'maintenance', 'turn_down']).default('general'),
    notes: z.string().optional(),
  }),
});

export const getHousekeepingLogsSchema = z.object({
  query: z.object({
    roomId: z.string().regex(/^\d+$/).transform(Number).optional(),
    staffId: z.string().optional(),
    type: z.enum(['general', 'deep_clean', 'inspection', 'maintenance', 'turn_down']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});
