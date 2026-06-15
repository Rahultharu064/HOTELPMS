import { Prisma, BookingStatus, PaymentMethod } from '@prisma/client';
export declare class BookingService {
    getAllBookings(filters: {
        page?: number;
        limit?: number;
        status?: BookingStatus;
        guestId?: number;
        roomId?: number;
        startDate?: Date;
        endDate?: Date;
        search?: string;
    }): Promise<{
        bookings: ({
            room: {
                roomType: {
                    image: string | null;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
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
            payments: {
                id: number;
                createdAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                bookingId: number | null;
                method: import(".prisma/client").$Enums.PaymentMethod;
                serviceOrderId: number | null;
                amount: Prisma.Decimal;
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
    getBookingById(id: number): Promise<{
        room: {
            roomType: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
        payments: {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceOrderId: number | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            paymentData: Prisma.JsonValue | null;
        }[];
        workflowLogs: {
            id: number;
            createdAt: Date;
            description: string | null;
            bookingId: number;
            action: string;
            performedBy: string | null;
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
    }>;
    createBooking(data: {
        guestId?: number;
        guestDetails?: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            nationality?: string;
            idType?: string;
            idNumber?: string;
            idProofImage?: string;
        };
        roomId: number;
        checkIn: Date | string;
        checkOut: Date | string;
        adults?: number;
        children?: number;
        status?: BookingStatus;
        source?: any;
        specialRequests?: string;
        payment?: {
            amount: number;
            method: PaymentMethod;
            transactionId?: string;
        };
    }, userId?: number): Promise<{
        room: {
            roomType: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
        payments: {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceOrderId: number | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            paymentData: Prisma.JsonValue | null;
        }[];
        workflowLogs: {
            id: number;
            createdAt: Date;
            description: string | null;
            bookingId: number;
            action: string;
            performedBy: string | null;
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
    }>;
    updateBooking(id: number, data: {
        roomId?: number;
        checkIn?: Date | string;
        checkOut?: Date | string;
        adults?: number;
        children?: number;
        specialRequests?: string;
    }, userId?: number): Promise<{
        room: {
            roomType: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
        payments: {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceOrderId: number | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            paymentData: Prisma.JsonValue | null;
        }[];
        workflowLogs: {
            id: number;
            createdAt: Date;
            description: string | null;
            bookingId: number;
            action: string;
            performedBy: string | null;
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
    }>;
    updateBookingStatus(id: number, status: BookingStatus, userId?: number): Promise<{
        room: {
            roomType: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
        payments: {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceOrderId: number | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            paymentData: Prisma.JsonValue | null;
        }[];
        workflowLogs: {
            id: number;
            createdAt: Date;
            description: string | null;
            bookingId: number;
            action: string;
            performedBy: string | null;
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
    }>;
    getBookingStatistics(): Promise<{
        totalBookings: number;
        pendingBookings: number;
        activeStays: number;
        todayCheckIns: number;
        todayCheckOuts: number;
        totalRevenue: number | Prisma.Decimal;
    }>;
}
//# sourceMappingURL=bookingService.d.ts.map