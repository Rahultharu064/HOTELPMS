"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
class RoomService {
    async getAllRooms(filters) {
        const { page = 1, limit = 10, status, roomTypeId, minPrice, maxPrice, adults = 1, children = 0, checkIn, checkOut, sort = 'createdAt_desc', } = filters;
        const skip = (page - 1) * limit;
        // Build where conditions
        const where = {};
        if (status) {
            where.status = status;
        }
        if (roomTypeId) {
            where.roomTypeId = roomTypeId;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.basePrice = {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
            };
        }
        // Check availability if dates provided
        if (checkIn && checkOut) {
            where.bookings = {
                none: {
                    AND: [
                        { checkIn: { lt: checkOut } },
                        { checkOut: { gt: checkIn } },
                        { status: { not: 'cancelled' } },
                    ],
                },
            };
        }
        // Get rooms with capacity check
        const totalPersons = adults + children;
        where.capacity = { gte: totalPersons };
        // Build sort order
        let orderBy = {};
        switch (sort) {
            case 'price_asc':
                orderBy = { basePrice: 'asc' };
                break;
            case 'price_desc':
                orderBy = { basePrice: 'desc' };
                break;
            case 'name_asc':
                orderBy = { name: 'asc' };
                break;
            case 'name_desc':
                orderBy = { name: 'desc' };
                break;
            case 'roomNumber_asc':
                orderBy = { roomNumber: 'asc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }
        const [rooms, total] = await Promise.all([
            database_1.prisma.room.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    roomType: true,
                    images: {
                        orderBy: { sortOrder: 'asc' },
                    },
                    videos: true,
                    amenities: true,
                    _count: {
                        select: {
                            bookings: {
                                where: {
                                    status: { not: 'cancelled' },
                                },
                            },
                        },
                    },
                },
            }),
            database_1.prisma.room.count({ where }),
        ]);
        // Enhance rooms with additional data
        const enhancedRooms = rooms.map(room => ({
            ...room,
            primaryImage: room.images.find(img => img.isPrimary) || room.images[0],
            currentOccupancy: room._count.bookings,
        }));
        return {
            rooms: enhancedRooms,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getRoomById(id) {
        const room = await database_1.prisma.room.findUnique({
            where: { id },
            include: {
                roomType: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                videos: true,
                amenities: true,
                bookings: {
                    where: {
                        status: { not: 'cancelled' },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        guest: true,
                        payments: true,
                    },
                },
            },
        });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        // Calculate room statistics
        const totalBookings = await database_1.prisma.booking.count({
            where: {
                roomId: id,
                status: { not: 'cancelled' },
            },
        });
        const totalRevenue = await database_1.prisma.payment.aggregate({
            where: {
                booking: {
                    roomId: id,
                },
                status: 'completed',
            },
            _sum: {
                amount: true,
            },
        });
        return {
            ...room,
            statistics: {
                totalBookings,
                totalRevenue: totalRevenue._sum.amount || 0,
                averageRating: 4.5, // Placeholder
            },
        };
    }
    async checkAvailability(id, checkIn, checkOut) {
        const room = await database_1.prisma.room.findUnique({
            where: { id },
            include: {
                roomType: true,
                bookings: {
                    where: {
                        AND: [
                            { checkIn: { lt: checkOut } },
                            { checkOut: { gt: checkIn } },
                            { status: { not: 'cancelled' } },
                        ],
                    },
                },
            },
        });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        const isAvailable = room.bookings.length === 0 && room.status === 'available';
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = Number(room.basePrice) * nights;
        return {
            available: isAvailable,
            room: {
                id: room.id,
                name: room.name,
                roomNumber: room.roomNumber,
                roomType: room.roomType,
            },
            price: {
                perNight: room.basePrice,
                nights,
                total: totalPrice,
            },
            conflictingBookings: room.bookings,
        };
    }
    async createRoom(data) {
        // Check if room type exists
        const roomType = await database_1.prisma.roomType.findUnique({
            where: { id: data.roomTypeId },
        });
        if (!roomType) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room type not found');
        }
        // Check if room number exists
        const existingRoom = await database_1.prisma.room.findUnique({
            where: { roomNumber: data.roomNumber },
        });
        if (existingRoom) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Room number already exists');
        }
        const room = await database_1.prisma.room.create({
            data: {
                name: data.name,
                roomNumber: data.roomNumber,
                roomTypeId: data.roomTypeId,
                capacity: data.capacity,
                basePrice: data.basePrice,
                floor: data.floor,
                status: data.status || 'available',
                description: data.description,
                size: data.size,
                bedType: data.bedType,
                view: data.view,
                slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + data.roomNumber,
            },
            include: {
                roomType: true,
            },
        });
        return room;
    }
    async updateRoom(id, data) {
        const room = await database_1.prisma.room.findUnique({ where: { id } });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        // If updating room type, check if it exists
        if (data.roomTypeId && data.roomTypeId !== room.roomTypeId) {
            const roomType = await database_1.prisma.roomType.findUnique({
                where: { id: data.roomTypeId },
            });
            if (!roomType) {
                throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room type not found');
            }
        }
        // If updating room number, check for duplicates
        if (data.roomNumber && data.roomNumber !== room.roomNumber) {
            const existingRoom = await database_1.prisma.room.findUnique({
                where: { roomNumber: data.roomNumber },
            });
            if (existingRoom) {
                throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Room number already exists');
            }
        }
        const updatedRoom = await database_1.prisma.room.update({
            where: { id },
            data: {
                name: data.name,
                roomNumber: data.roomNumber,
                roomTypeId: data.roomTypeId,
                capacity: data.capacity,
                basePrice: data.basePrice,
                floor: data.floor,
                status: data.status,
                description: data.description,
                size: data.size,
                bedType: data.bedType,
                view: data.view,
            },
            include: {
                roomType: true,
                images: true,
                videos: true,
            },
        });
        return updatedRoom;
    }
    async deleteRoom(id) {
        const room = await database_1.prisma.room.findUnique({
            where: { id },
            include: {
                bookings: {
                    where: {
                        status: { not: 'cancelled' },
                    },
                },
            },
        });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        if (room.bookings.length > 0) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Cannot delete room with active bookings');
        }
        // Delete associated images and videos first
        await database_1.prisma.image.deleteMany({ where: { roomId: id } });
        await database_1.prisma.video.deleteMany({ where: { roomId: id } });
        await database_1.prisma.room.delete({ where: { id } });
        return { message: 'Room deleted successfully' };
    }
    async updateRoomStatus(id, status) {
        const room = await database_1.prisma.room.findUnique({ where: { id } });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        const updatedRoom = await database_1.prisma.room.update({
            where: { id },
            data: { status },
            include: {
                roomType: true,
            },
        });
        return updatedRoom;
    }
    async addRoomImages(id, images) {
        const room = await database_1.prisma.room.findUnique({ where: { id } });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        // If any image is set as primary, remove primary flag from others
        const hasPrimary = images.some(img => img.isPrimary);
        if (hasPrimary) {
            await database_1.prisma.image.updateMany({
                where: { roomId: id },
                data: { isPrimary: false },
            });
        }
        const createdImages = await database_1.prisma.image.createMany({
            data: images.map(img => ({
                ...img,
                roomId: id,
            })),
        });
        return createdImages;
    }
    async addRoomVideos(id, videos) {
        const room = await database_1.prisma.room.findUnique({ where: { id } });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        const createdVideos = await database_1.prisma.video.createMany({
            data: videos.map(video => ({
                ...video,
                roomId: id,
            })),
        });
        return createdVideos;
    }
    async getSimilarRooms(roomId, limit = 4) {
        const room = await database_1.prisma.room.findUnique({
            where: { id: roomId },
        });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        const similarRooms = await database_1.prisma.room.findMany({
            where: {
                roomTypeId: room.roomTypeId,
                id: { not: roomId },
                status: 'available',
            },
            take: limit,
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
                roomType: true,
            },
            orderBy: {
                basePrice: 'asc',
            },
        });
        return similarRooms;
    }
    async getRoomStatistics() {
        const totalRooms = await database_1.prisma.room.count();
        const availableRooms = await database_1.prisma.room.count({
            where: { status: 'available' },
        });
        const occupiedRooms = await database_1.prisma.room.count({
            where: { status: 'occupied' },
        });
        const maintenanceRooms = await database_1.prisma.room.count({
            where: { status: 'maintenance' },
        });
        const cleaningRooms = await database_1.prisma.room.count({
            where: { status: 'cleaning' },
        });
        const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
        // Get room type distribution
        const roomTypeDistribution = await database_1.prisma.roomType.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: { rooms: true },
                },
            },
        });
        return {
            total: totalRooms,
            available: availableRooms,
            occupied: occupiedRooms,
            maintenance: maintenanceRooms,
            cleaning: cleaningRooms,
            occupancyRate,
            roomTypeDistribution: roomTypeDistribution.map(rt => ({
                id: rt.id,
                name: rt.name,
                count: rt._count.rooms,
            })),
        };
    }
}
exports.RoomService = RoomService;
//# sourceMappingURL=roomService.js.map