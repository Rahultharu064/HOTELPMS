import { z } from 'zod';

export const createRoomTypeSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    image: z.string().url().optional().or(z.string().length(0)), // Allow URL or empty string
    description: z.string().optional(),
  }),
});

export const updateRoomTypeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    image: z.string().url().optional().or(z.string().length(0)),
    description: z.string().optional(),
  }),
});

export const getRoomTypesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    sort: z.enum(['name_asc', 'name_desc']).optional(),
  }),
});