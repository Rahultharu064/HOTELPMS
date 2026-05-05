"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomTypesSchema = exports.updateRoomTypeSchema = exports.createRoomTypeSchema = void 0;
const zod_1 = require("zod");
exports.createRoomTypeSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        image: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }),
});
exports.updateRoomTypeSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        image: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }),
});
exports.getRoomTypesSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        search: zod_1.z.string().optional(),
        sort: zod_1.z.enum(['name_asc', 'name_desc']).optional(),
    }),
});
//# sourceMappingURL=roomTypeValidation.js.map