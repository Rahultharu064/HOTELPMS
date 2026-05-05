"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTypeService = void 0;
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const index_1 = require("../constants/index");
class RoomTypeService {
    async getAllRoomTypes(filters) {
        const { page = 1, limit = 10, search, sort = 'name_asc', } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }
        let orderBy = {};
        switch (sort) {
            case 'name_asc':
                orderBy = { name: 'asc' };
                break;
            case 'name_desc':
                orderBy = { name: 'desc' };
                break;
            default:
                orderBy = { name: 'asc' };
        }
        const [roomTypes, total] = await Promise.all([
            database_1.prisma.roomType.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    rooms: {
                        where: { status: 'available' },
                        select: {
                            id: true,
                            roomNumber: true,
                            status: true,
                        },
                    },
                    _count: {
                        select: {
                            rooms: true,
                        },
                    },
                },
            }),
            database_1.prisma.roomType.count({ where }),
        ]);
        // Calculate statistics for each room type
        const roomTypesWithStats = roomTypes.map(roomType => ({
            ...roomType,
            availableRooms: roomType.rooms.length,
            totalRooms: roomType._count.rooms,
            occupancyRate: roomType._count.rooms > 0
                ? (roomType.rooms.length / roomType._count.rooms) * 100
                : 0,
        }));
        return {
            roomTypes: roomTypesWithStats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getRoomTypeById(id) {
        const roomType = await database_1.prisma.roomType.findUnique({
            where: { id },
            include: {
                rooms: {
                    include: {
                        images: {
                            where: { isPrimary: true },
                            take: 1,
                        },
                    },
                },
                _count: {
                    select: {
                        rooms: true,
                    },
                },
            },
        });
        if (!roomType) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Room type not found');
        }
        // Calculate statistics
        const availableRooms = roomType.rooms.filter(room => room.status === 'available').length;
        return {
            ...roomType,
            availableRooms,
            occupancyRate: roomType._count.rooms > 0
                ? (availableRooms / roomType._count.rooms) * 100
                : 0,
        };
    }
    async createRoomType(data) {
        // Check if name exists
        const existingName = await database_1.prisma.roomType.findUnique({
            where: { name: data.name },
        });
        if (existingName) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.CONFLICT, 'Room type name already exists');
        }
        const roomType = await database_1.prisma.roomType.create({
            data: {
                name: data.name,
                image: data.image,
                description: data.description,
            },
        });
        return roomType;
    }
    async updateRoomType(id, data) {
        const roomType = await database_1.prisma.roomType.findUnique({ where: { id } });
        if (!roomType) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Room type not found');
        }
        // Check name uniqueness if updating
        if (data.name && data.name !== roomType.name) {
            const existingName = await database_1.prisma.roomType.findUnique({
                where: { name: data.name },
            });
            if (existingName) {
                throw new ApiError_1.ApiError(index_1.HttpStatus.CONFLICT, 'Room type name already exists');
            }
        }
        const updatedRoomType = await database_1.prisma.roomType.update({
            where: { id },
            data: {
                name: data.name,
                image: data.image,
                description: data.description,
            },
            include: {
                rooms: {
                    include: {
                        images: {
                            where: { isPrimary: true },
                            take: 1,
                        },
                    },
                },
            },
        });
        return updatedRoomType;
    }
    async deleteRoomType(id) {
        const roomType = await database_1.prisma.roomType.findUnique({
            where: { id },
            include: {
                rooms: {
                    take: 1,
                },
            },
        });
        if (!roomType) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Room type not found');
        }
        if (roomType.rooms.length > 0) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.BAD_REQUEST, 'Cannot delete room type with existing rooms');
        }
        await database_1.prisma.roomType.delete({
            where: { id },
        });
        return { message: 'Room type deleted successfully' };
    }
}
exports.RoomTypeService = RoomTypeService;
//# sourceMappingURL=roomTypeService.js.map