"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusSchema = exports.getBookingsSchema = exports.updateBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        guestId: zod_1.z.number().int().positive().optional(),
        guestDetails: zod_1.z.object({
            firstName: zod_1.z.string().min(1, 'First name is required'),
            lastName: zod_1.z.string().min(1, 'Last name is required'),
            email: zod_1.z.string().email('Invalid email address'),
            phone: zod_1.z.string().min(8, 'Phone number is too short'),
            nationality: zod_1.z.string().optional(),
            idType: zod_1.z.enum(['passport', 'driving_license', 'national_id', 'citizenship', 'other']).optional(),
            idNumber: zod_1.z.string().optional(),
            idProofImage: zod_1.z.string().regex(/^data:image\/(jpeg|png|webp);base64,/, 'Identification must be a valid image (JPG, PNG, WEBP)').optional(),
        }).optional(),
        roomId: zod_1.z.number().int().positive(),
        checkIn: zod_1.z.string().datetime(),
        checkOut: zod_1.z.string().datetime(),
        adults: zod_1.z.number().int().min(1).default(1),
        children: zod_1.z.number().int().min(0).default(0),
        status: zod_1.z.enum(Object.values(constants_1.BookingStatusEnum)).optional(),
        source: zod_1.z.enum(['direct', 'ota', 'walk_in', 'corporate']).optional(),
        specialRequests: zod_1.z.string().optional(),
        payment: zod_1.z.object({
            amount: zod_1.z.number().positive(),
            method: zod_1.z.enum(['cash', 'esewa', 'khalti']),
            transactionId: zod_1.z.string().optional(),
        }).optional(),
    })
        .refine(data => data.guestId || data.guestDetails, {
        message: "Either guestId or guestDetails must be provided",
        path: ["guestId"]
    })
        .refine(data => {
        const checkIn = new Date(data.checkIn);
        const checkOut = new Date(data.checkOut);
        return checkIn < checkOut;
    }, {
        message: "Check-out date must be after check-in date",
        path: ["checkOut"]
    })
        .refine(data => {
        const checkIn = new Date(data.checkIn);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return checkIn >= today;
    }, {
        message: "Check-in date cannot be in the past",
        path: ["checkIn"]
    }),
});
exports.updateBookingSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        roomId: zod_1.z.number().int().positive().optional(),
        checkIn: zod_1.z.string().datetime().optional(),
        checkOut: zod_1.z.string().datetime().optional(),
        adults: zod_1.z.number().int().min(1).optional(),
        children: zod_1.z.number().int().min(0).optional(),
        specialRequests: zod_1.z.string().optional(),
    }),
});
exports.getBookingsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        status: zod_1.z.enum(Object.values(constants_1.BookingStatusEnum)).optional(),
        guestId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        roomId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.updateBookingStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(Object.values(constants_1.BookingStatusEnum)),
    }),
});
//# sourceMappingURL=bookingValidation.js.map