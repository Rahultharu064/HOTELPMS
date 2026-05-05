"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.createServiceSchema = exports.updateServiceCategorySchema = exports.createServiceCategorySchema = void 0;
const zod_1 = require("zod");
exports.createServiceCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        slug: zod_1.z.string().min(2).max(100),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        icon: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'inactive', 'maintenance']).default('active'),
    }),
});
exports.updateServiceCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        slug: zod_1.z.string().min(2).max(100).optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        icon: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'inactive', 'maintenance']).optional(),
    }),
});
exports.createServiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        slug: zod_1.z.string().min(2).max(100),
        categoryId: zod_1.z.number().int().positive(),
        price: zod_1.z.number().nonnegative(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        status: zod_1.z.enum(['active', 'inactive', 'maintenance']).default('active'),
    }),
});
exports.updateServiceSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        slug: zod_1.z.string().min(2).max(100).optional(),
        categoryId: zod_1.z.number().int().positive().optional(),
        price: zod_1.z.number().nonnegative().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        status: zod_1.z.enum(['active', 'inactive', 'maintenance']).optional(),
    }),
});
//# sourceMappingURL=serviceCategoryValidation.js.map