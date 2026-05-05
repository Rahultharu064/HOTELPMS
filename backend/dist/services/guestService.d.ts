import { Prisma } from '@prisma/client';
export declare class GuestService {
    getAllGuests(filters: {
        page?: number;
        limit?: number;
        search?: string;
        email?: string;
        phone?: string;
        sort?: string;
    }): Promise<{
        guests: ({
            _count: {
                bookings: number;
            };
            bookings: ({
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
            })[];
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getGuestById(id: number): Promise<{
        statistics: {
            totalSpent: Prisma.Decimal;
            totalBookings: number;
            completedBookings: number;
            cancelledBookings: number;
            activeBookings: number;
            lastVisitDate: Date | null;
            avgStayDuration: number;
        };
        bookings: ({
            room: {
                roomType: {
                    image: string | null;
                    description: string | null;
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                };
                images: {
                    id: number;
                    createdAt: Date;
                    isPrimary: boolean;
                    url: string;
                    alt: string | null;
                    roomId: number | null;
                    sortOrder: number;
                }[];
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
            payments: {
                id: number;
                createdAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                bookingId: number | null;
                serviceOrderId: number | null;
                amount: Prisma.Decimal;
                method: import(".prisma/client").$Enums.PaymentMethod;
                transactionId: string | null;
                paymentData: Prisma.JsonValue | null;
            }[];
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
        })[];
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
    }>;
    createGuest(data: {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        address?: string;
        city?: string;
        country?: string;
        postalCode?: string;
        idType?: string;
        idNumber?: string;
    }): Promise<{
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
    }>;
    updateGuest(id: number, data: {
        email?: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        country?: string;
        postalCode?: string;
        idType?: string;
        idNumber?: string;
    }): Promise<{
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
    }>;
    deleteGuest(id: number): Promise<{
        message: string;
    }>;
    getGuestBookings(id: number, filters: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        bookings: ({
            room: {
                roomType: {
                    image: string | null;
                    description: string | null;
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                };
                images: {
                    id: number;
                    createdAt: Date;
                    isPrimary: boolean;
                    url: string;
                    alt: string | null;
                    roomId: number | null;
                    sortOrder: number;
                }[];
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
            payments: {
                id: number;
                createdAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                bookingId: number | null;
                serviceOrderId: number | null;
                amount: Prisma.Decimal;
                method: import(".prisma/client").$Enums.PaymentMethod;
                transactionId: string | null;
                paymentData: Prisma.JsonValue | null;
            }[];
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getGuestStats(): Promise<{
        totalGuests: number;
        newGuestsThisMonth: number;
        totalRevenue: number | Prisma.Decimal;
        avgBookingsPerGuest: number;
        topGuests: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            totalBookings: number;
            totalSpent: Prisma.Decimal;
        }[];
        countryDistribution: {
            country: string | null;
            count: number;
        }[];
    }>;
}
//# sourceMappingURL=guestService.d.ts.map