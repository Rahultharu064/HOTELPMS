"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.bookingParamsSchema = exports.addServiceToBookingSchema = exports.updateExtraServiceSchema = exports.createExtraServiceSchema = void 0;
const zod_1 = require("zod");
exports.createExtraServiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').max(100),
        description: zod_1.z.string().min(1, 'Description is required'),
        price: zod_1.z.string().or(zod_1.z.number()).transform((val) => parseFloat(val.toString())),
        categoryId: zod_1.z.string().or(zod_1.z.number()).transform((val) => parseInt(val.toString())),
        discountPercentage: zod_1.z.string().or(zod_1.z.number()).optional().transform((val) => val ? parseFloat(val.toString()) : 0),
        discountAllowed: zod_1.z.string().or(zod_1.z.boolean()).optional().transform((val) => val === 'true' || val === true),
    }),
});
exports.updateExtraServiceSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100).optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.string().or(zod_1.z.number()).optional().transform((val) => val ? parseFloat(val.toString()) : undefined),
        categoryId: zod_1.z.string().or(zod_1.z.number()).optional().transform((val) => val ? parseInt(val.toString()) : undefined),
        active: zod_1.z.string().or(zod_1.z.boolean()).optional().transform((val) => val === 'true' || val === true),
        discountPercentage: zod_1.z.string().or(zod_1.z.number()).optional().transform((val) => val !== undefined ? parseFloat(val.toString()) : undefined),
        discountAllowed: zod_1.z.string().or(zod_1.z.boolean()).optional().transform((val) => val === 'true' || val === true),
    }),
});
exports.addServiceToBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.number().int(),
        extraServiceId: zod_1.z.number().int(),
        quantity: zod_1.z.number().int().min(1),
    }),
});
exports.bookingParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        bookingId: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
exports.idParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
});
//# sourceMappingURL=extraServiceValidation.js.map