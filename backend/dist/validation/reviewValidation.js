"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsSchema = exports.updateReviewStatusSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        guestId: zod_1.z.number().int().positive(),
        bookingId: zod_1.z.number().int().positive().optional(),
        roomTypeId: zod_1.z.number().int().positive().optional(),
        rating: zod_1.z.number().int().min(1).max(5),
        comment: zod_1.z.string().optional(),
    }),
});
exports.updateReviewStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['approved', 'rejected', 'hidden']),
        staffReply: zod_1.z.string().optional(),
    }),
});
exports.getReviewsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
        status: zod_1.z.enum(['pending', 'approved', 'rejected', 'hidden']).optional(),
        roomTypeId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        rating: zod_1.z.string().regex(/^[1-5]$/).transform(Number).optional(),
    }),
});
//# sourceMappingURL=reviewValidation.js.map