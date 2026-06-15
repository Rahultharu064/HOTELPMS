import { Prisma, ReviewStatus } from '@prisma/client';
export declare class ReviewService {
    getAllReviews(filters: {
        page?: number;
        limit?: number;
        status?: ReviewStatus;
        roomTypeId?: number;
        rating?: number;
    }): Promise<{
        reviews: ({
            roomType: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            } | null;
            booking: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.BookingStatus;
                roomId: number;
                guestId: number;
                checkOut: Date;
                checkIn: Date;
                bookingNumber: string;
                adults: number;
                children: number;
                totalAmount: Prisma.Decimal;
                source: import(".prisma/client").$Enums.BookingSource;
                specialRequests: string | null;
            } | null;
            guest: {
                id: number;
                email: string;
                phone: string | null;
                password: string | null;
                firstName: string;
                lastName: string;
                address: string | null;
                city: string | null;
                country: string | null;
                postalCode: string | null;
                idType: import(".prisma/client").$Enums.IdType | null;
                idNumber: string | null;
                idProofImage: string | null;
                profileImage: string | null;
                googleId: string | null;
                otp: string | null;
                otpExpires: Date | null;
                resetToken: string | null;
                resetTokenExpires: Date | null;
                isVerified: boolean;
                totalBookings: number;
                totalSpent: Prisma.Decimal;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReviewStatus;
            roomTypeId: number | null;
            guestId: number;
            bookingId: number | null;
            rating: number;
            comment: string | null;
            proofImage: string | null;
            staffReply: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getReviewById(id: number): Promise<{
        roomType: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        } | null;
        booking: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BookingStatus;
            roomId: number;
            guestId: number;
            checkOut: Date;
            checkIn: Date;
            bookingNumber: string;
            adults: number;
            children: number;
            totalAmount: Prisma.Decimal;
            source: import(".prisma/client").$Enums.BookingSource;
            specialRequests: string | null;
        } | null;
        guest: {
            id: number;
            email: string;
            phone: string | null;
            password: string | null;
            firstName: string;
            lastName: string;
            address: string | null;
            city: string | null;
            country: string | null;
            postalCode: string | null;
            idType: import(".prisma/client").$Enums.IdType | null;
            idNumber: string | null;
            idProofImage: string | null;
            profileImage: string | null;
            googleId: string | null;
            otp: string | null;
            otpExpires: Date | null;
            resetToken: string | null;
            resetTokenExpires: Date | null;
            isVerified: boolean;
            totalBookings: number;
            totalSpent: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReviewStatus;
        roomTypeId: number | null;
        guestId: number;
        bookingId: number | null;
        rating: number;
        comment: string | null;
        proofImage: string | null;
        staffReply: string | null;
    }>;
    createReview(data: {
        guestId: number;
        bookingId?: number;
        roomTypeId?: number;
        rating: number;
        comment?: string;
        proofImage?: string;
    }): Promise<{
        roomType: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        } | null;
        guest: {
            id: number;
            email: string;
            phone: string | null;
            password: string | null;
            firstName: string;
            lastName: string;
            address: string | null;
            city: string | null;
            country: string | null;
            postalCode: string | null;
            idType: import(".prisma/client").$Enums.IdType | null;
            idNumber: string | null;
            idProofImage: string | null;
            profileImage: string | null;
            googleId: string | null;
            otp: string | null;
            otpExpires: Date | null;
            resetToken: string | null;
            resetTokenExpires: Date | null;
            isVerified: boolean;
            totalBookings: number;
            totalSpent: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReviewStatus;
        roomTypeId: number | null;
        guestId: number;
        bookingId: number | null;
        rating: number;
        comment: string | null;
        proofImage: string | null;
        staffReply: string | null;
    }>;
    updateReviewStatus(id: number, status: ReviewStatus, staffReply?: string): Promise<{
        roomType: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        } | null;
        guest: {
            id: number;
            email: string;
            phone: string | null;
            password: string | null;
            firstName: string;
            lastName: string;
            address: string | null;
            city: string | null;
            country: string | null;
            postalCode: string | null;
            idType: import(".prisma/client").$Enums.IdType | null;
            idNumber: string | null;
            idProofImage: string | null;
            profileImage: string | null;
            googleId: string | null;
            otp: string | null;
            otpExpires: Date | null;
            resetToken: string | null;
            resetTokenExpires: Date | null;
            isVerified: boolean;
            totalBookings: number;
            totalSpent: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReviewStatus;
        roomTypeId: number | null;
        guestId: number;
        bookingId: number | null;
        rating: number;
        comment: string | null;
        proofImage: string | null;
        staffReply: string | null;
    }>;
    deleteReview(id: number): Promise<{
        id: number;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReviewStatus;
        roomTypeId: number | null;
        guestId: number;
        bookingId: number | null;
        rating: number;
        comment: string | null;
        proofImage: string | null;
        staffReply: string | null;
    }>;
    getRoomTypeRating(roomTypeId: number): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
}
//# sourceMappingURL=reviewService.d.ts.map