"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomVideosSchema = exports.roomImagesSchema = exports.roomAvailabilitySchema = exports.getRoomsSchema = exports.updateRoomSchema = exports.createRoomSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.createRoomSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        roomNumber: zod_1.z.string().min(1).max(20),
        roomTypeId: zod_1.z.number().int().positive(),
        floor: zod_1.z.number().int().min(0).optional(),
        status: zod_1.z.enum(Object.values(constants_1.RoomStatusEnum)).optional(),
        description: zod_1.z.string().optional(),
        size: zod_1.z.number().int().positive().optional(),
        bedType: zod_1.z.enum(['single', 'double', 'queen', 'king', 'twin']).optional(),
        view: zod_1.z.string().max(100).optional(),
        capacity: zod_1.z.number().int().min(1).default(2),
        basePrice: zod_1.z.number().positive(),
    }),
});
exports.updateRoomSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        roomNumber: zod_1.z.string().min(1).max(20).optional(),
        roomTypeId: zod_1.z.number().int().positive().optional(),
        floor: zod_1.z.number().int().min(0).optional(),
        status: zod_1.z.enum(Object.values(constants_1.RoomStatusEnum)).optional(),
        description: zod_1.z.string().optional(),
        size: zod_1.z.number().int().positive().optional(),
        bedType: zod_1.z.enum(['single', 'double', 'queen', 'king', 'twin']).optional(),
        view: zod_1.z.string().max(100).optional(),
        capacity: zod_1.z.number().int().min(1).optional(),
        basePrice: zod_1.z.number().positive().optional(),
    }),
});
exports.getRoomsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        status: zod_1.z.enum(Object.values(constants_1.RoomStatusEnum)).optional(),
        roomTypeId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        minPrice: zod_1.z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
        maxPrice: zod_1.z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
        beds: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        adults: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        children: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        checkIn: zod_1.z.string().datetime().optional(),
        checkOut: zod_1.z.string().datetime().optional(),
        sort: zod_1.z.string().optional(),
    }),
});
exports.roomAvailabilitySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    query: zod_1.z.object({
        checkIn: zod_1.z.string().datetime(),
        checkOut: zod_1.z.string().datetime(),
    }),
});
exports.roomImagesSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        images: zod_1.z.array(zod_1.z.object({
            url: zod_1.z.string().url(),
            alt: zod_1.z.string().optional(),
            isPrimary: zod_1.z.boolean().optional(),
            sortOrder: zod_1.z.number().int().min(0).optional(),
        })),
    }),
});
exports.roomVideosSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/).transform(Number),
    }),
    body: zod_1.z.object({
        videos: zod_1.z.array(zod_1.z.object({
            url: zod_1.z.string().url(),
            title: zod_1.z.string().optional(),
            thumbnail: zod_1.z.string().url().optional(),
        })),
    }),
});
//# sourceMappingURL=roomValidation.js.map