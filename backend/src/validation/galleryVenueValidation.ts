import { z } from 'zod';

const venueLayoutEnum = z.enum(['featured', 'compact', 'wide']);

const venueBodySchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().min(2).max(180).optional(),
  description: z.string().min(10),
  image: z.string().optional(),
  icon: z.string().min(2).max(50).optional(),
  layout: venueLayoutEnum.optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (typeof val === 'boolean') return val;
      return val === 'true';
    }),
});

export const createGalleryVenueSchema = z.object({
  body: venueBodySchema,
});

export const updateGalleryVenueSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: venueBodySchema.partial(),
});

export const galleryVenueIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const galleryVenueSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1).max(180),
  }),
});
