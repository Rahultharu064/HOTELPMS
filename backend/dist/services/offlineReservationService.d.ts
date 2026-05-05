import { Prisma, BookingStatus, PaymentMethod, IdType } from '@prisma/client';
interface OfflineReservationData {
    existingGuestId?: number;
    newGuestDetails?: {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        address?: string;
        city?: string;
        country?: string;
        postalCode?: string;
        idType?: IdType;
        idNumber?: string;
        idProofImage?: string;
    };
    roomId: number;
    checkIn: Date;
    checkOut: Date;
    adults?: number;
    children?: number;
    status?: BookingStatus;
    specialRequests?: string;
    payment?: {
        amount: number;
        method: PaymentMethod;
        transactionId?: string;
    };
}
export declare class OfflineReservationService {
    createOfflineReservation(data: OfflineReservationData, userId?: number): Promise<{
        room: {
            roomType: {
                image: string | null;
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.RoomStatus;
            slug: string;
            roomNumber: string;
            roomTypeId: number;
            capacity: number;
            basePrice: Prisma.Decimal;
            floor: number | null;
            size: number | null;
            bedType: import(".prisma/client").$Enums.BedType | null;
            view: string | null;
            isFeatured: boolean;
        };
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
    }>;
}
export {};
//# sourceMappingURL=offlineReservationService.d.ts.map