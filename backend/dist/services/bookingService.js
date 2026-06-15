"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const security_1 = require("../utils/security");
const mail_1 = require("../utils/mail");
class BookingService {
    async getAllBookings(filters) {
        const { page = 1, limit = 10, status, guestId, roomId, startDate, endDate, search, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (guestId) {
            where.guestId = guestId;
        }
        if (roomId) {
            where.roomId = roomId;
        }
        if (startDate && endDate) {
            where.OR = [
                {
                    checkIn: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                {
                    checkOut: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                {
                    checkIn: { lte: startDate },
                    checkOut: { gte: endDate },
                },
            ];
        }
        else if (startDate) {
            where.checkIn = { gte: startDate };
        }
        else if (endDate) {
            where.checkOut = { lte: endDate };
        }
        if (search) {
            where.OR = [
                { bookingNumber: { contains: search } },
                { guest: { firstName: { contains: search } } },
                { guest: { lastName: { contains: search } } },
                { guest: { email: { contains: search } } },
                { guest: { phone: { contains: search } } },
            ];
        }
        const [bookings, total] = await Promise.all([
            database_1.prisma.booking.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    guest: true,
                    room: {
                        include: {
                            roomType: true,
                        },
                    },
                    payments: true,
                },
            }),
            database_1.prisma.booking.count({ where }),
        ]);
        return {
            bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getBookingById(id) {
        const booking = await database_1.prisma.booking.findUnique({
            where: { id },
            include: {
                guest: true,
                room: {
                    include: {
                        roomType: true,
                        images: {
                            where: { isPrimary: true },
                        },
                    },
                },
                payments: true,
                workflowLogs: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!booking) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Booking not found');
        }
        return booking;
    }
    async createBooking(data, userId) {
        const checkInDate = new Date(data.checkIn);
        const checkOutDate = new Date(data.checkOut);
        let finalGuestId = data.guestId;
        // Handle guest creation/finding if no guestId provided
        if (!finalGuestId && data.guestDetails) {
            let idProofImagePath;
            if (data.guestDetails.idProofImage) {
                const validation = (0, security_1.validateBase64Image)(data.guestDetails.idProofImage);
                if (validation.isValid && validation.buffer) {
                    try {
                        const ext = (validation.mimeType?.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
                        // Encrypt document before saving to disk
                        const encryptedBuffer = (0, security_1.encryptFile)(validation.buffer);
                        const fileName = `id_proof_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}.enc`;
                        const uploadPath = path_1.default.join(process.cwd(), 'uploads', fileName);
                        fs_1.default.writeFileSync(uploadPath, encryptedBuffer);
                        idProofImagePath = `/uploads/${fileName}`;
                    }
                    catch (err) {
                        console.error('Error encrypting and saving id proof:', err);
                        throw new ApiError_1.ApiError(constants_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to process sensitive identification document securely.');
                    }
                }
                else if (data.guestDetails.idProofImage) {
                    throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, validation.error || 'Invalid identification document format.');
                }
            }
            const existingGuest = await database_1.prisma.guest.findFirst({
                where: {
                    OR: [
                        { email: data.guestDetails.email },
                        { phone: data.guestDetails.phone }
                    ]
                }
            });
            if (existingGuest) {
                finalGuestId = existingGuest.id;
                if (data.guestDetails.idType || data.guestDetails.idNumber || idProofImagePath) {
                    await database_1.prisma.guest.update({
                        where: { id: existingGuest.id },
                        data: {
                            idType: data.guestDetails.idType || existingGuest.idType,
                            idNumber: data.guestDetails.idNumber || existingGuest.idNumber,
                            idProofImage: idProofImagePath || existingGuest.idProofImage,
                        }
                    });
                }
            }
            else {
                const newGuest = await database_1.prisma.guest.create({
                    data: {
                        firstName: data.guestDetails.firstName,
                        lastName: data.guestDetails.lastName,
                        email: data.guestDetails.email,
                        phone: data.guestDetails.phone,
                        country: data.guestDetails.nationality,
                        idType: data.guestDetails.idType,
                        idNumber: data.guestDetails.idNumber,
                        idProofImage: idProofImagePath,
                    }
                });
                finalGuestId = newGuest.id;
            }
        }
        if (!finalGuestId) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Guest information is required');
        }
        // Check if guest exists (double check)
        const guest = await database_1.prisma.guest.findUnique({ where: { id: finalGuestId } });
        if (!guest) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Guest not found');
        }
        const room = await database_1.prisma.room.findUnique({
            where: { id: data.roomId },
            include: { roomType: true },
        });
        if (!room) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        if (['maintenance', 'out_of_service'].includes(room.status)) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, `Room is currently under ${room.status}`);
        }
        const totalPersons = (data.adults || 1) + (data.children || 0);
        if (room.capacity < totalPersons) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Room capacity exceeded');
        }
        // Check availability
        const conflictingBookings = await database_1.prisma.booking.findMany({
            where: {
                roomId: data.roomId,
                status: { not: 'cancelled' },
                AND: [
                    { checkIn: { lt: checkOutDate } },
                    { checkOut: { gt: checkInDate } },
                ],
            },
        });
        if (conflictingBookings.length > 0) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Room is not available for requested dates');
        }
        // Calculate total amount
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalAmount = Number(room.basePrice) * nights;
        // Generate unique booking number
        const bookingNumber = `BKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        const booking = await database_1.prisma.$transaction(async (tx) => {
            // Create booking
            const newBooking = await tx.booking.create({
                data: {
                    bookingNumber,
                    guestId: finalGuestId,
                    roomId: data.roomId,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    adults: data.adults || 1,
                    children: data.children || 0,
                    totalAmount,
                    status: data.status || 'pending',
                    source: data.source || 'direct',
                    specialRequests: data.specialRequests,
                },
            });
            // Process payment if provided
            if (data.payment) {
                const isOnline = ['esewa', 'khalti'].includes(data.payment.method);
                await tx.payment.create({
                    data: {
                        bookingId: newBooking.id,
                        amount: data.payment.amount,
                        method: data.payment.method,
                        status: isOnline ? 'pending' : 'completed',
                        transactionId: data.payment.transactionId || (0, crypto_1.randomUUID)(),
                    },
                });
            }
            // Add workflow log
            await tx.bookingWorkflowLog.create({
                data: {
                    bookingId: newBooking.id,
                    action: 'booking_created',
                    description: 'Booking created',
                    performedBy: userId ? `user_${userId}` : 'system',
                },
            });
            const today = new Date();
            if (checkInDate <= today && checkOutDate > today) {
                await tx.room.update({
                    where: { id: data.roomId },
                    data: { status: 'reserved' },
                });
            }
            return newBooking;
        });
        const finalBooking = await this.getBookingById(booking.id);
        // Send confirmation email — non-blocking
        if (finalBooking.guest.email) {
            (0, mail_1.sendBookingConfirmationEmail)(finalBooking.guest.email, finalBooking).catch((err) => {
                console.error('[BookingConfirmationEmailError]:', err);
            });
        }
        return finalBooking;
    }
    async updateBooking(id, data, userId) {
        const booking = await database_1.prisma.booking.findUnique({
            where: { id },
            include: {
                room: { include: { roomType: true } },
            },
        });
        if (!booking) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Booking not found');
        }
        const targetCheckInDate = data.checkIn ? new Date(data.checkIn) : booking.checkIn;
        const targetCheckOutDate = data.checkOut ? new Date(data.checkOut) : booking.checkOut;
        // Checking dates/room changes availability
        if (data.roomId || data.checkIn || data.checkOut) {
            const targetRoomId = data.roomId || booking.roomId;
            const conflictingBookings = await database_1.prisma.booking.findMany({
                where: {
                    roomId: targetRoomId,
                    id: { not: id },
                    status: { not: 'cancelled' },
                    AND: [
                        { checkIn: { lt: targetCheckOutDate } },
                        { checkOut: { gt: targetCheckInDate } },
                    ],
                },
            });
            if (conflictingBookings.length > 0) {
                throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Room is not available for requested dates');
            }
        }
        await database_1.prisma.$transaction(async (tx) => {
            let totalAmount = booking.totalAmount;
            if (data.roomId || data.checkIn || data.checkOut) {
                const targetRoomId = data.roomId || booking.roomId;
                const room = await tx.room.findUnique({
                    where: { id: targetRoomId },
                });
                const nights = Math.ceil((targetCheckOutDate.getTime() - targetCheckInDate.getTime()) / (1000 * 60 * 60 * 24));
                totalAmount = new client_1.Prisma.Decimal(Number(room.basePrice) * nights);
            }
            const res = await tx.booking.update({
                where: { id },
                data: {
                    roomId: data.roomId,
                    checkIn: targetCheckInDate,
                    checkOut: targetCheckOutDate,
                    adults: data.adults,
                    children: data.children,
                    totalAmount: totalAmount,
                    specialRequests: data.specialRequests,
                },
            });
            await tx.bookingWorkflowLog.create({
                data: {
                    bookingId: id,
                    action: 'booking_updated',
                    description: 'Booking details updated',
                    performedBy: userId ? `user_${userId}` : 'system',
                },
            });
            return res;
        });
        return await this.getBookingById(id);
    }
    async updateBookingStatus(id, status, userId) {
        const booking = await database_1.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Booking not found');
        }
        await database_1.prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: { id },
                data: { status },
            });
            await tx.bookingWorkflowLog.create({
                data: {
                    bookingId: id,
                    action: 'status_changed',
                    description: `Status changed to ${status}`,
                    performedBy: userId ? `user_${userId}` : 'system',
                },
            });
            // Update room status based on booking status
            if (status === 'checked_in') {
                await tx.room.update({
                    where: { id: booking.roomId },
                    data: { status: 'occupied' },
                });
            }
            else if (status === 'checked_out' || status === 'cancelled') {
                await tx.room.update({
                    where: { id: booking.roomId },
                    data: { status: 'cleaning' }, // or available depending on logic
                });
            }
        });
        return await this.getBookingById(id);
    }
    async getBookingStatistics() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalBookings, pendingBookings, activeStays, todayCheckIns, todayCheckOuts, revenue,] = await Promise.all([
            database_1.prisma.booking.count(),
            database_1.prisma.booking.count({ where: { status: 'pending' } }),
            database_1.prisma.booking.count({ where: { status: 'checked_in' } }),
            database_1.prisma.booking.count({
                where: {
                    checkIn: {
                        gte: today,
                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    },
                },
            }),
            database_1.prisma.booking.count({
                where: {
                    checkOut: {
                        gte: today,
                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    },
                },
            }),
            database_1.prisma.payment.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true },
            }),
        ]);
        return {
            totalBookings,
            pendingBookings,
            activeStays,
            todayCheckIns,
            todayCheckOuts,
            totalRevenue: revenue._sum.amount || 0,
        };
    }
}
exports.BookingService = BookingService;
//# sourceMappingURL=bookingService.js.map