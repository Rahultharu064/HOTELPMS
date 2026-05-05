"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facilityVideosSchema = exports.facilityImagesSchema = exports.getFacilitiesSchema = exports.updateFacilitySchema = exports.createFacilitySchema = void 0;
const zod_1 = require("zod");
exports.createFacilitySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        slug: zod_1.z.string().min(2).max(100),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'maintenance', 'closed']).optional(),
        openingHours: zod_1.z.string().optional(),
        category: zod_1.z.enum(['restaurant', 'pool', 'gym', 'spa', 'business_center', 'parking', 'other']),
        location: zod_1.z.string().optional(),
    }),
});
exports.updateFacilitySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        slug: zod_1.z.string().min(2).max(100).optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'maintenance', 'closed']).optional(),
        openingHours: zod_1.z.string().optional(),
        category: zod_1.z.enum(['restaurant', 'pool', 'gym', 'spa', 'business_center', 'parking', 'other']).optional(),
        location: zod_1.z.string().optional(),
    }),
});
exports.getFacilitiesSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        status: zod_1.z.enum(['active', 'maintenance', 'closed']).optional(),
        category: zod_1.z.enum(['restaurant', 'pool', 'gym', 'spa', 'business_center', 'parking', 'other']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.facilityImagesSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        images: zod_1.z.array(zod_1.z.object({
            url: zod_1.z.string().url(),
            alt: zod_1.z.string().optional(),
            isPrimary: zod_1.z.boolean().optional(),
            sortOrder: zod_1.z.number().int().min(0).optional(),
        })),
    }),
});
exports.facilityVideosSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        videos: zod_1.z.array(zod_1.z.object({
            url: zod_1.z.string().url(),
            title: zod_1.z.string().optional(),
            thumbnail: zod_1.z.string().url().optional(),
        })),
    }),
});
//# sourceMappingURL=facilityValidation.js.map