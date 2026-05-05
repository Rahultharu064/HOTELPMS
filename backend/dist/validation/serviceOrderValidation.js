"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceOrdersSchema = exports.updateServiceOrderStatusSchema = exports.createServiceOrderSchema = void 0;
const zod_1 = require("zod");
exports.createServiceOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.number().int().positive().optional(),
        roomId: zod_1.z.number().int().positive(),
        notes: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
        requestedBy: zod_1.z.string().optional(),
        items: zod_1.z.array(zod_1.z.object({
            serviceId: zod_1.z.number().int().positive(),
            quantity: zod_1.z.number().int().min(1).default(1),
            notes: zod_1.z.string().optional(),
        })).min(1),
    }),
});
exports.updateServiceOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
        assignedTo: zod_1.z.string().optional(),
    }),
});
exports.getServiceOrdersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        status: zod_1.z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional(),
        priority: zod_1.z.enum(['low', 'normal', 'high', 'urgent']).optional(),
        roomId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        bookingId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        search: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=serviceOrderValidation.js.map