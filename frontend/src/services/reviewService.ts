import { api } from './api';
import type { ApiResponse } from './api';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface Review {
    id: number;
    guestId: number;
    bookingId?: number;
    roomTypeId?: number;
    rating: number;
    comment?: string;
    proofImage?: string;

    staffReply?: string;
    status: ReviewStatus;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    guest?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    roomType?: {
        name: string;
    };
}

export interface ReviewFilters {
    page?: number;
    limit?: number;
    status?: ReviewStatus;
    roomTypeId?: number;
    rating?: number;
}

export interface ReviewSummary {
    averageRating: number;
    totalReviews: number;
}

export const reviewService = {
    async getAllReviews(filters?: ReviewFilters): Promise<ApiResponse<{ reviews: Review[]; total: number; totalPages: number }>> {
        return api.get<ApiResponse<{ reviews: Review[]; total: number; totalPages: number }>>('/reviews', { params: filters });
    },

    async getReviewById(id: number): Promise<ApiResponse<Review>> {
        return api.get<ApiResponse<Review>>(`/reviews/${id}`);
    },

    async createReview(data: FormData): Promise<ApiResponse<Review>> {
        return api.post<ApiResponse<Review>>('/reviews', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },


    async updateReviewStatus(id: number, status: ReviewStatus, staffReply?: string): Promise<ApiResponse<Review>> {
        return api.patch<ApiResponse<Review>>(`/reviews/${id}/status`, { status, staffReply });
    },

    async getRoomTypeRatingSummary(roomTypeId: number): Promise<ApiResponse<ReviewSummary>> {
        return api.get<ApiResponse<ReviewSummary>>(`/reviews/summary/room-type/${roomTypeId}`);
    },

    async deleteReview(id: number): Promise<ApiResponse<null>> {
        return api.delete(`/reviews/${id}`) as any;
    }
};
