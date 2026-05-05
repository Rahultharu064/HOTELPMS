"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOutSchema = exports.checkInSchema = exports.updateRoomHousekeepingSchema = exports.frontOfficeSearchSchema = exports.dashboardOverviewSchema = void 0;
const zod_1 = require("zod");
exports.dashboardOverviewSchema = zod_1.z.object({
    query: zod_1.z.object({
        date: zod_1.z.string().optional(),
    }),
});
exports.frontOfficeSearchSchema = zod_1.z.object({
    query: zod_1.z.object({
        query: zod_1.z.string().min(1),
        limit: zod_1.z.string().transform(Number).optional(),
    }),
});
exports.updateRoomHousekeepingSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['available', 'occupied', 'cleaning', 'maintenance', 'out_of_service']),
    }),
});
exports.checkInSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        guestData: zod_1.z.object({
            idType: zod_1.z.string().optional(),
            idNumber: zod_1.z.string().optional(),
            idProofImage: zod_1.z.string().optional(),
            forceCheckIn: zod_1.z.boolean().optional(),
            address: zod_1.z.string().optional(),
            phone: zod_1.z.string().optional()
        }).optional(),
        newRoomId: zod_1.z.number().optional()
    })
});
exports.checkOutSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        force: zod_1.z.boolean().optional()
    })
});
//# sourceMappingURL=frontofficeValidation.js.map