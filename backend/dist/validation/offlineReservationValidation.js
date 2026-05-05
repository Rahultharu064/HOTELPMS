"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOfflineReservationSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.createOfflineReservationSchema = zod_1.z.object({
    body: zod_1.z.object({
        // Guest information - either an existing guest or new guest details
        existingGuestId: zod_1.z.number().int().positive().optional(),
        newGuestDetails: zod_1.z.object({
            email: zod_1.z.string().email(),
            phone: zod_1.z.string().min(10).max(20),
            firstName: zod_1.z.string().min(2).max(100),
            lastName: zod_1.z.string().min(2).max(100),
            address: zod_1.z.string().optional(),
            city: zod_1.z.string().optional(),
            country: zod_1.z.string().optional(),
            idType: zod_1.z.enum(['passport', 'driving_license', 'national_id', 'citizenship', 'other']).optional(),
            idNumber: zod_1.z.string().optional(),
            idProofImage: zod_1.z.string().regex(/^data:image\/(jpeg|png|webp);base64,/, 'Identification must be a valid image (JPG, PNG, WEBP)').optional(),
        }).optional(),
        // Booking information
        roomId: zod_1.z.number().int().positive(),
        checkIn: zod_1.z.string().datetime(),
        checkOut: zod_1.z.string().datetime(),
        adults: zod_1.z.number().int().min(1).default(1),
        children: zod_1.z.number().int().min(0).default(0),
        status: zod_1.z.enum(Object.values(constants_1.BookingStatusEnum)).default(constants_1.BookingStatusEnum.CONFIRMED),
        specialRequests: zod_1.z.string().optional(),
        // Payment information
        payment: zod_1.z.object({
            amount: zod_1.z.number().nonnegative(),
            method: zod_1.z.enum(['cash', 'esewa', 'khalti']).default('cash'),
            transactionId: zod_1.z.string().optional(),
        }).optional(),
    }).refine(data => data.existingGuestId || data.newGuestDetails, {
        message: "Either existingGuestId or newGuestDetails must be provided",
        path: ["existingGuestId"],
    }),
});
//# sourceMappingURL=offlineReservationValidation.js.map