"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const index_1 = require("../constants/index");
class RoomController {
    getAllRooms = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { status, roomTypeId, search, isFeatured } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (roomTypeId)
            where.roomTypeId = Number(roomTypeId);
        if (isFeatured)
            where.isFeatured = isFeatured === 'true';
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { roomNumber: { contains: search } },
            ];
        }
        const rooms = await database_1.prisma.room.findMany({
            where,
            include: {
                roomType: true,
                images: true,
                amenities: true,
            },
        });
        // Fetch average ratings for all rooms at once
        const ratings = await database_1.prisma.review.groupBy({
            by: ['roomTypeId'],
            where: { status: 'approved' },
            _avg: { rating: true },
            _count: { id: true },
        });
        const roomsWithRatings = rooms.map(room => {
            const rating = ratings.find(r => r.roomTypeId === room.roomTypeId);
            return {
                ...room,
                ratingSummary: {
                    averageRating: rating?._avg.rating || 0,
                    totalReviews: rating?._count.id || 0
                }
            };
        });
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Rooms retrieved successfully', roomsWithRatings));
    });
    createRoom = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        // req.body contains form-data text fields
        // req.files contains uploaded images and videos
        const { name, roomNumber, roomTypeId, floor, price, size, maxAdults, maxChildren, numBeds, allowChildren, description, status, amenities: amenitiesJson } = req.body;
        // Handle amenities if sent as JSON string
        const amenitiesList = amenitiesJson ? JSON.parse(amenitiesJson) : [];
        // Check if room number exists
        const existingRoom = await database_1.prisma.room.findUnique({ where: { roomNumber } });
        if (existingRoom) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.CONFLICT, 'Room number already exists');
        }
        const room = await database_1.prisma.room.create({
            data: {
                name,
                roomNumber,
                roomTypeId: Number(roomTypeId),
                floor: floor ? Number(floor) : undefined,
                basePrice: Number(price),
                size: size ? Number(size) : undefined,
                capacity: Number(maxAdults),
                status: status || 'available',
                description,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + roomNumber,
                // amenities are handled via relation in Prisma if using a separate model, 
                // but here the schema.prisma shows: amenities Amenity[] @relation("RoomAmenities")
                // We'll skip complex amenity linking for this quick build or use connectOrCreate
            },
        });
        // Handle Uploaded Images
        const files = req.files;
        if (files && files['images']) {
            await Promise.all(files['images'].map((file, index) => database_1.prisma.image.create({
                data: {
                    url: `/uploads/${file.filename}`,
                    roomId: room.id,
                    isPrimary: index === 0,
                },
            })));
        }
        // Handle Uploaded Videos
        if (files && files['videos']) {
            await Promise.all(files['videos'].map(file => database_1.prisma.video.create({
                data: {
                    url: `/uploads/${file.filename}`,
                    roomId: room.id,
                },
            })));
        }
        res.status(index_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Room created successfully', room));
    });
    getRoomById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: idOrSlug } = req.params;
        const isId = !isNaN(Number(idOrSlug));
        const where = isId ? { id: Number(idOrSlug) } : { slug: idOrSlug };
        const room = await database_1.prisma.room.findUnique({
            where,
            include: {
                roomType: {
                    include: {
                        reviews: {
                            where: { status: 'approved' },
                            include: { guest: true },
                            orderBy: { createdAt: 'desc' },
                            take: 5
                        }
                    }
                },
                images: true,
                videos: true,
                amenities: true,
            },
        });
        if (!room) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        // Calculate average rating
        const ratingSummary = await database_1.prisma.review.aggregate({
            where: {
                roomTypeId: room.roomTypeId,
                status: 'approved'
            },
            _avg: { rating: true },
            _count: { id: true }
        });
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room retrieved successfully', {
            ...room,
            ratingSummary: {
                averageRating: ratingSummary._avg.rating || 0,
                totalReviews: ratingSummary._count.id
            }
        }));
    });
    updateRoom = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { name, roomNumber, roomTypeId, floor, basePrice, // Accepting basePrice from frontend
        price, // Also accepting price for compatibility
        size, capacity, description, status, amenities: amenitiesJson } = req.body;
        const currentRoom = await database_1.prisma.room.findUnique({ where: { id: Number(id) } });
        if (!currentRoom) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        // Handle amenities if sent as JSON string
        const amenitiesList = amenitiesJson ? JSON.parse(amenitiesJson) : [];
        const updatedRoom = await database_1.prisma.room.update({
            where: { id: Number(id) },
            data: {
                name,
                roomNumber,
                roomTypeId: roomTypeId ? Number(roomTypeId) : undefined,
                floor: floor ? Number(floor) : undefined,
                basePrice: (basePrice || price) ? Number(basePrice || price) : undefined,
                size: size ? Number(size) : undefined,
                capacity: capacity ? Number(capacity) : undefined,
                status,
                description,
                slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + (roomNumber || currentRoom.roomNumber) : undefined,
            },
        });
        // Handle Uploaded Images
        const files = req.files;
        if (files && files['images']) {
            await Promise.all(files['images'].map((file, index) => database_1.prisma.image.create({
                data: {
                    url: `/uploads/${file.filename}`,
                    roomId: updatedRoom.id,
                    isPrimary: index === 0 && !currentRoom.id, // simplified logic
                },
            })));
        }
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room updated successfully', updatedRoom));
    });
    deleteRoom = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await database_1.prisma.room.delete({ where: { id: Number(id) } });
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room deleted successfully', null));
    });
    getGuestFavorites = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        // Algorithm: Calculate favorites based on booking count and average rating
        // 1. Get room booking counts
        const roomsWithBookingCounts = await database_1.prisma.room.findMany({
            include: {
                _count: {
                    select: { bookings: true }
                },
                roomType: true,
                images: {
                    where: { isPrimary: true }
                },
                amenities: true
            },
            orderBy: {
                bookings: {
                    _count: 'desc'
                }
            },
            take: 6
        });
        // Fetch average ratings for these rooms
        const ratings = await database_1.prisma.review.groupBy({
            by: ['roomTypeId'],
            where: { status: 'approved' },
            _avg: { rating: true },
            _count: { id: true },
        });
        const roomsWithRatings = roomsWithBookingCounts.map(room => {
            const rating = ratings.find(r => r.roomTypeId === room.roomTypeId);
            return {
                ...room,
                ratingSummary: {
                    averageRating: rating?._avg.rating || 0,
                    totalReviews: rating?._count.id || 0
                }
            };
        });
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest favorites retrieved successfully', roomsWithRatings));
    });
}
exports.RoomController = RoomController;
//# sourceMappingURL=roomController.js.map