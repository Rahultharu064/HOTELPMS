import { z } from 'zod';
import { RoomStatusEnum } from '../constants';

export const updateRoomHousekeepingSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    status: z.enum(Object.values(RoomStatusEnum) as [string, ...string[]]),
    notes: z.string().optional(),
  }),
});

export const frontOfficeSearchSchema = z.object({
  query: z.object({
    query: z.string().min(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  }),
});

export const dashboardOverviewSchema = z.object({
  query: z.object({
    date: z.string().datetime().optional(),
  }),
});
