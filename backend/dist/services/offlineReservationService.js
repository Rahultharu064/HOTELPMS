"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineReservationService = void 0;
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const security_1 = require("../utils/security");
class OfflineReservationService {
    async createOfflineReservation(data, userId) {
        // 1. Resolve guest
        let guestId;
        if (data.existingGuestId) {
            const guest = await database_1.prisma.guest.findUnique({ where: { id: data.existingGuestId } });
            if (!guest)
                throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Existing guest not found');
            guestId = guest.id;
        }
        else if (data.newGuestDetails) {
            let idProofImagePath;
            if (data.newGuestDetails.idProofImage) {
                const validation = (0, security_1.validateBase64Image)(data.newGuestDetails.idProofImage);
                if (validation.isValid && validation.buffer) {
                    try {
                        const ext = (validation.mimeType?.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
                        // Secure document with AES-256-GCM before storage
                        const encryptedBuffer = (0, security_1.encryptFile)(validation.buffer);
                        const fileName = `id_proof_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}.enc`;
                        const uploadPath = path_1.default.join(process.cwd(), 'uploads', fileName);
                        fs_1.default.writeFileSync(uploadPath, encryptedBuffer);
                        idProofImagePath = `/uploads/${fileName}`;
                    }
                    catch (err) {
                        console.error('Error encrypting and saving offline id proof:', err);
                        throw new ApiError_1.ApiError(constants_1.HttpStatus.INTERNAL_SERVER_ERROR, 'High-security document processing failed.');
                    }
                }
                else if (data.newGuestDetails.idProofImage) {
                    throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, validation.error || 'Identity document verification failed.');
                }
            }
            // Create guest
            const existingEmail = await database_1.prisma.guest.findFirst({
                where: { OR: [{ email: data.newGuestDetails.email }, { phone: data.newGuestDetails.phone }] }
            });
            if (existingEmail) {
                guestId = existingEmail.id;
                if (data.newGuestDetails.idType || data.newGuestDetails.idNumber || idProofImagePath) {
                    await database_1.prisma.guest.update({
                        where: { id: guestId },
                        data: {
                            idType: data.newGuestDetails.idType || existingEmail.idType,
                            idNumber: data.newGuestDetails.idNumber || existingEmail.idNumber,
                            idProofImage: idProofImagePath || existingEmail.idProofImage
                        }
                    });
                }
            }
            else {
                const { idProofImage, ...restDetails } = data.newGuestDetails;
                const guestData = {
                    ...restDetails,
                    idProofImage: idProofImagePath,
                    totalBookings: 0,
                    totalSpent: new client_1.Prisma.Decimal(0)
                };
                const guest = await database_1.prisma.guest.create({
                    data: guestData
                });
                guestId = guest.id;
            }
        }
        else {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Guest information missing');
        }
        // 2. Validate room
        const room = await database_1.prisma.room.findUnique({
            where: { id: data.roomId },
        });
        if (!room)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        const totalPersons = (data.adults || 1) + (data.children || 0);
        if (room.capacity < totalPersons) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Room capacity exceeded');
        }
        const checkInDate = new Date(data.checkIn);
        const checkOutDate = new Date(data.checkOut);
        // 3. Check room availability
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
        // 4. Calculate amount
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalAmount = new client_1.Prisma.Decimal(Number(room.basePrice) * nights);
        // 5. Generate booking number
        const bookingNumber = `WALK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        // 6. Transactional creation
        return await database_1.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.create({
                data: {
                    bookingNumber,
                    guestId,
                    roomId: data.roomId,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    adults: data.adults || 1,
                    children: data.children || 0,
                    totalAmount,
                    status: data.status || 'confirmed',
                    source: 'walk_in',
                    specialRequests: data.specialRequests,
                },
                include: { guest: true, room: { include: { roomType: true } } }
            });
            // Update Guest's total bookings and spent
            await tx.guest.update({
                where: { id: guestId },
                data: {
                    totalBookings: { increment: 1 },
                    totalSpent: { increment: totalAmount }
                }
            });
            // Handle payment
            if (data.payment) {
                await tx.payment.create({
                    data: {
                        bookingId: booking.id,
                        amount: new client_1.Prisma.Decimal(data.payment.amount),
                        method: data.payment.method,
                        status: 'completed',
                        transactionId: data.payment.transactionId || `WALK-${Date.now()}`
                    }
                });
            }
            // Record logic
            await tx.bookingWorkflowLog.create({
                data: {
                    bookingId: booking.id,
                    action: 'offline_reservation_created',
                    description: `Offline reservation created for walk-in guest. Source: walk_in.`,
                    performedBy: userId ? `user_${userId}` : 'frontdesk',
                }
            });
            // Update room status if dates are overlap with today
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            if (checkInDate < endOfToday && checkOutDate > startOfToday) {
                if (data.status === 'checked_in') {
                    await tx.room.update({ where: { id: data.roomId }, data: { status: 'occupied' } });
                }
                else if (data.status === 'confirmed' || data.status === 'pending') {
                    await tx.room.update({ where: { id: data.roomId }, data: { status: 'reserved' } });
                }
            }
            return booking;
        });
    }
}
exports.OfflineReservationService = OfflineReservationService;
//# sourceMappingURL=offlineReservationService.js.map