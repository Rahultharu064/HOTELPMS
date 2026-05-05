"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHousekeepingLogsSchema = exports.updateRoomStatusSchema = void 0;
const zod_1 = require("zod");
exports.updateRoomStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['available', 'occupied', 'maintenance', 'cleaning', 'reserved', 'out_of_service']),
        staffId: zod_1.z.string().optional(),
        type: zod_1.z.enum(['general', 'deep_clean', 'inspection', 'maintenance', 'turn_down']).default('general'),
        notes: zod_1.z.string().optional(),
    }),
});
exports.getHousekeepingLogsSchema = zod_1.z.object({
    query: zod_1.z.object({
        roomId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        staffId: zod_1.z.string().optional(),
        type: zod_1.z.enum(['general', 'deep_clean', 'inspection', 'maintenance', 'turn_down']).optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
    }),
});
//# sourceMappingURL=housekeepingValidation.js.map