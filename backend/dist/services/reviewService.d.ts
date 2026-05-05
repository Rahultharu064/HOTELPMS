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
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
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
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                email: string;
                phone: string;
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
                totalBookings: number;
                totalSpent: Prisma.Decimal;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReviewStatus;
            roomTypeId: number | null;
            guestId: number;
            bookingId: number | null;
            rating: number;
            comment: string | null;
            staffReply: string | null;
            isVerified: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getReviewById(id: number): Promise<{
        roomType: {
            image: string | null;
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string;
            phone: string;
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
            totalBookings: number;
            totalSpent: Prisma.Decimal;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReviewStatus;
        roomTypeId: number | null;
        guestId: number;
        bookingId: number | null;
        rating: number;
        comment: string | null;
        staffReply: string | null;
        isVerified: boolean;
    }>;
    createReview(data: {
        guestId: number;
        bookingId?: number;
        roomTypeId?: number;
        rating: number;
        comment?: string;
    }): Promise<{
        roomType: {
            image: string | null;
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        guest: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string;
            phone: string;
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
            totalBookings: number;
            totalSpent: Prisma.Decimal;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReviewStatus;
        roomTypeId: number | null;
        guestId: number;
        bookingId: number | null;
        rating: number;
        comment: string | null;
        staffReply: string | null;
        isVerified: boolean;
    }>;
    updateReviewStatus(id: number, status: ReviewStatus, staffReply?: string): Promise<{
        roomType: {
            image: string | null;
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        guest: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string;
            phone: string;
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
            totalBookings: number;
            totalSpent: Prisma.Decimal;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReviewStatus;
        roomTypeId: number | null;
        guestId: number;
        bookingId: number | null;
        rating: number;
        comment: string | null;
        staffReply: string | null;
        isVerified: boolean;
    }>;
    deleteReview(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReviewStatus;
        roomTypeId: number | null;
        guestId: number;
        bookingId: number | null;
        rating: number;
        comment: string | null;
        staffReply: string | null;
        isVerified: boolean;
    }>;
    getRoomTypeRating(roomTypeId: number): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
}
//# sourceMappingURL=reviewService.d.ts.map