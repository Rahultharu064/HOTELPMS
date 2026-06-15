"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryVenueSlugSchema = exports.galleryVenueIdSchema = exports.updateGalleryVenueSchema = exports.createGalleryVenueSchema = void 0;
const zod_1 = require("zod");
const venueLayoutEnum = zod_1.z.enum(['featured', 'compact', 'wide']);
const venueBodySchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(150),
    slug: zod_1.z.string().min(2).max(180).optional(),
    description: zod_1.z.string().min(10),
    image: zod_1.z.string().optional(),
    icon: zod_1.z.string().min(2).max(50).optional(),
    layout: venueLayoutEnum.optional(),
    sortOrder: zod_1.z.coerce.number().int().min(0).optional(),
    isActive: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(['true', 'false'])])
        .optional()
        .transform((val) => {
        if (val === undefined)
            return undefined;
        if (typeof val === 'boolean')
            return val;
        return val === 'true';
    }),
});
exports.createGalleryVenueSchema = zod_1.z.object({
    body: venueBodySchema,
});
exports.updateGalleryVenueSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: venueBodySchema.partial(),
});
exports.galleryVenueIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
exports.galleryVenueSlugSchema = zod_1.z.object({
    params: zod_1.z.object({
        slug: zod_1.z.string().min(1).max(180),
    }),
});
//# sourceMappingURL=galleryVenueValidation.js.map