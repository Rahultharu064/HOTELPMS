import { prisma } from '../config/database';
import { Prisma, ReviewStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class ReviewService {
  async getAllReviews(filters: {
    page?: number;
    limit?: number;
    status?: ReviewStatus;
    roomTypeId?: number;
    rating?: number;
  }) {
    const { page = 1, limit = 10, status, roomTypeId, rating } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};
    if (status) where.status = status;
    if (roomTypeId) where.roomTypeId = roomTypeId;
    if (rating) where.rating = rating;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { guest: true, roomType: true, booking: true }
      }),
      prisma.review.count({ where })
    ]);

    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getReviewById(id: number) {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { guest: true, roomType: true, booking: true }
    });
    if (!review) throw new ApiError(HttpStatus.NOT_FOUND, 'Review not found');
    return review;
  }

  async createReview(data: {
    guestId: number;
    bookingId?: number;
    roomTypeId?: number;
    rating: number;
    comment?: string;
    proofImage?: string;
  }) {
    // 1. If bookingId is provided, check if it's already reviewed
    if (data.bookingId) {
      const existing = await prisma.review.findUnique({ where: { bookingId: data.bookingId } });
      if (existing) throw new ApiError(HttpStatus.CONFLICT, 'Booking already reviewed');
      
      const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
      if (!booking) throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');
      if (booking.guestId !== data.guestId) throw new ApiError(HttpStatus.FORBIDDEN, 'Reviewer is not the guest of this booking');
    }

    return await prisma.review.create({
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


  async updateReviewStatus(id: number, status: ReviewStatus, staffReply?: string) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw new ApiError(HttpStatus.NOT_FOUND, 'Review not found');

    return await prisma.review.update({
      where: { id },
      data: { status, staffReply: staffReply || review.staffReply },
      include: { guest: true, roomType: true }
    });
  }

  async deleteReview(id: number) {
    return await prisma.review.delete({ where: { id } });
  }

  async getRoomTypeRating(roomTypeId: number) {
    const aggregate = await prisma.review.aggregate({
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
