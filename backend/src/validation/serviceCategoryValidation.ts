import { z } from 'zod';

export const createServiceCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(100),
    description: z.string().optional(),
    image: z.string().url().optional(),
    icon: z.string().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  }),
});

export const updateServiceCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    slug: z.string().min(2).max(100).optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    icon: z.string().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  }),
});

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(100),
    categoryId: z.number().int().positive(),
    price: z.number().nonnegative(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  }),
});

export const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    slug: z.string().min(2).max(100).optional(),
    categoryId: z.number().int().positive().optional(),
    price: z.number().nonnegative().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  }),
});
