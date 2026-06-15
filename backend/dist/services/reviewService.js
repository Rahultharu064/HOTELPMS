"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
class ReviewService {
    async getAllReviews(filters) {
        const { page = 1, limit = 10, status, roomTypeId, rating } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (roomTypeId)
            where.roomTypeId = roomTypeId;
        if (rating)
            where.rating = rating;
        const [reviews, total] = await Promise.all([
            database_1.prisma.review.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { guest: true, roomType: true, booking: true }
            }),
            database_1.prisma.review.count({ where })
        ]);
        return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getReviewById(id) {
        const review = await database_1.prisma.review.findUnique({
            where: { id },
            include: { guest: true, roomType: true, booking: true }
        });
        if (!review)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Review not found');
        return review;
    }
    async createReview(data) {
        // 1. If bookingId is provided, check if it's already reviewed
        if (data.bookingId) {
            const existing = await database_1.prisma.review.findUnique({ where: { bookingId: data.bookingId } });
            if (existing)
                throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Booking already reviewed');
            const booking = await database_1.prisma.booking.findUnique({ where: { id: data.bookingId } });
            if (!booking)
                throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Booking not found');
            if (booking.guestId !== data.guestId)
                throw new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, 'Reviewer is not the guest of this booking');
        }
        return await database_1.prisma.review.create({
            data: {
                guestId: data.guestId,
                bookingId: data.bookingId,
                roomTypeId: data.roomTypeId,
                rating: data.rating,
                comment: data.comment,
                proofImage: data.proofImage,
                isVerified: !!data.bookingId, // Verified if linked to a booking
                status: 'pending'
            },
            include: { guest: true, roomType: true }
        });
    }
    async updateReviewStatus(id, status, staffReply) {
        const review = await database_1.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Review not found');
        return await database_1.prisma.review.update({
            where: { id },
            data: { status, staffReply: staffReply || review.staffReply },
            include: { guest: true, roomType: true }
        });
    }
    async deleteReview(id) {
        return await database_1.prisma.review.delete({ where: { id } });
    }
    async getRoomTypeRating(roomTypeId) {
        const aggregate = await database_1.prisma.review.aggregate({
            where: { roomTypeId, status: 'approved' },
            _avg: { rating: true },
            _count: { id: true }
        });
        return {
            averageRating: aggregate._avg.rating || 0,
            totalReviews: aggregate._count.id
        };
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=reviewService.js.map