import { Prisma, RoomStatus } from '@prisma/client';
export declare class RoomService {
    getAllRooms(filters: {
        page?: number;
        limit?: number;
        status?: RoomStatus;
        roomTypeId?: number;
        minPrice?: number;
        maxPrice?: number;
        adults?: number;
        children?: number;
        checkIn?: Date;
        checkOut?: Date;
        sort?: string;
    }): Promise<{
        rooms: {
            primaryImage: {
                id: number;
                createdAt: Date;
                isPrimary: boolean;
                url: string;
                alt: string | null;
                roomId: number | null;
                sortOrder: number;
            };
            currentOccupancy: number;
            roomType: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
            _count: {
                bookings: number;
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
            videos: {
                id: number;
                createdAt: Date;
                url: string;
                roomId: number | null;
                title: string | null;
                thumbnail: string | null;
            }[];
            amenities: {
                id: number;
                createdAt: Date;
                name: string;
                description: string | null;
                icon: string | null;
                category: import(".prisma/client").$Enums.AmenityCategory;
            }[];
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRoomById(id: number): Promise<{
        statistics: {
            totalBookings: number;
            totalRevenue: number | Prisma.Decimal;
            averageRating: number;
        };
        roomType: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
        bookings: ({
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
        images: {
            id: number;
            createdAt: Date;
            isPrimary: boolean;
            url: string;
            alt: string | null;
            roomId: number | null;
            sortOrder: number;
        }[];
        videos: {
            id: number;
            createdAt: Date;
            url: string;
            roomId: number | null;
            title: string | null;
            thumbnail: string | null;
        }[];
        amenities: {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            icon: string | null;
            category: import(".prisma/client").$Enums.AmenityCategory;
        }[];
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
    }>;
    checkAvailability(id: number, checkIn: Date, checkOut: Date): Promise<{
        available: boolean;
        room: {
            id: number;
            name: string;
            roomNumber: string;
            roomType: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
        };
        price: {
            perNight: Prisma.Decimal;
            nights: number;
            total: number;
        };
        conflictingBookings: {
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
        }[];
    }>;
    createRoom(data: {
        name: string;
        roomNumber: string;
        roomTypeId: number;
        capacity: number;
        basePrice: number;
        floor?: number;
        status?: RoomStatus;
        description?: string;
        size?: number;
        bedType?: string;
        view?: string;
    }): Promise<{
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
    }>;
    updateRoom(id: number, data: {
        name?: string;
        roomNumber?: string;
        roomTypeId?: number;
        capacity?: number;
        basePrice?: number;
        floor?: number;
        status?: RoomStatus;
        description?: string;
        size?: number;
        bedType?: string;
        view?: string;
    }): Promise<{
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
        videos: {
            id: number;
            createdAt: Date;
            url: string;
            roomId: number | null;
            title: string | null;
            thumbnail: string | null;
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
    }>;
    deleteRoom(id: number): Promise<{
        message: string;
    }>;
    updateRoomStatus(id: number, status: RoomStatus): Promise<{
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
    }>;
    addRoomImages(id: number, images: Array<{
        url: string;
        alt?: string;
        isPrimary?: boolean;
        sortOrder?: number;
    }>): Promise<Prisma.BatchPayload>;
    addRoomVideos(id: number, videos: Array<{
        url: string;
        title?: string;
        thumbnail?: string;
    }>): Promise<Prisma.BatchPayload>;
    getSimilarRooms(roomId: number, limit?: number): Promise<({
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
    })[]>;
    getRoomStatistics(): Promise<{
        total: number;
        available: number;
        occupied: number;
        maintenance: number;
        cleaning: number;
        occupancyRate: number;
        roomTypeDistribution: {
            id: number;
            name: string;
            count: number;
        }[];
    }>;
}
//# sourceMappingURL=roomService.d.ts.map