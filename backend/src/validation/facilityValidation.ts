import { z } from 'zod';

export const createFacilitySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'maintenance', 'closed']).optional(),
    openingHours: z.string().optional(),
    category: z.enum(['restaurant', 'pool', 'gym', 'spa', 'business_center', 'parking', 'other']),
    location: z.string().optional(),
  }),
});

export const updateFacilitySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    slug: z.string().min(2).max(100).optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'maintenance', 'closed']).optional(),
    openingHours: z.string().optional(),
    category: z.enum(['restaurant', 'pool', 'gym', 'spa', 'business_center', 'parking', 'other']).optional(),
    location: z.string().optional(),
  }),
});

export const getFacilitiesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(['active', 'maintenance', 'closed']).optional(),
    category: z.enum(['restaurant', 'pool', 'gym', 'spa', 'business_center', 'parking', 'other']).optional(),
    search: z.string().optional(),
  }),
});

export const facilityImagesSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    images: z.array(z.object({
      url: z.string().url(),
      alt: z.string().optional(),
      isPrimary: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })),
  }),
});

export const facilityVideosSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    videos: z.array(z.object({
      url: z.string().url(),
      title: z.string().optional(),
      thumbnail: z.string().url().optional(),
    })),
  }),
});