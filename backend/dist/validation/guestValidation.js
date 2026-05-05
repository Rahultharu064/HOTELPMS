"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestBookingsSchema = exports.getGuestsSchema = exports.updateGuestSchema = exports.createGuestSchema = void 0;
const zod_1 = require("zod");
exports.createGuestSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(10).max(20),
        firstName: zod_1.z.string().min(2).max(100),
        lastName: zod_1.z.string().min(2).max(100),
        address: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        idType: zod_1.z.enum(['passport', 'driving_license', 'national_id']).optional(),
        idNumber: zod_1.z.string().optional(),
    }),
});
exports.updateGuestSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(10).max(20).optional(),
        firstName: zod_1.z.string().min(2).max(100).optional(),
        lastName: zod_1.z.string().min(2).max(100).optional(),
        address: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        idType: zod_1.z.enum(['passport', 'driving_license', 'national_id']).optional(),
        idNumber: zod_1.z.string().optional(),
    }),
});
exports.getGuestsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        search: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        sort: zod_1.z.enum(['name_asc', 'name_desc', 'bookings_desc', 'spent_desc']).optional(),
    }),
});
exports.guestBookingsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        status: zod_1.z.enum(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show']).optional(),
    }),
});
//# sourceMappingURL=guestValidation.js.map