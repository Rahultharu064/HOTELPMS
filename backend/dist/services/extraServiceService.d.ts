import { Prisma } from '@prisma/client';
export declare class ExtraServiceService {
    createExtraService(data: {
        name: string;
        description: string;
        price: number;
        categoryId: number;
        image?: string | null;
        discountPercentage?: number;
        discountAllowed?: boolean;
    }): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        active: boolean;
        categoryId: number;
        discountPercentage: number;
        discountAllowed: boolean;
    }>;
    getExtraServices(): Promise<({
        category: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: import(".prisma/client").$Enums.ServiceStatus;
            slug: string;
            icon: string | null;
        };
    } & {
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        active: boolean;
        categoryId: number;
        discountPercentage: number;
        discountAllowed: boolean;
    })[]>;
    updateExtraService(id: number, data: Partial<{
        name: string;
        description: string;
        price: number;
        categoryId: number;
        active: boolean;
        discountPercentage: number;
        discountAllowed: boolean;
        image: string;
    }>): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        active: boolean;
        categoryId: number;
        discountPercentage: number;
        discountAllowed: boolean;
    }>;
    deleteExtraService(id: number): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        active: boolean;
        categoryId: number;
        discountPercentage: number;
        discountAllowed: boolean;
    }>;
    addExtraServiceToBooking(data: {
        bookingId: number;
        extraServiceId: number;
        quantity: number;
        paymentMethod?: string;
    }): Promise<{
        extraService: {
            category: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: import(".prisma/client").$Enums.ServiceStatus;
                slug: string;
                icon: string | null;
            };
        } & {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: Prisma.Decimal;
            active: boolean;
            categoryId: number;
            discountPercentage: number;
            discountAllowed: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        basePrice: Prisma.Decimal;
        bookingId: number;
        quantity: number;
        extraServiceId: number;
        unitPrice: Prisma.Decimal;
        discountAmount: Prisma.Decimal;
        serviceChargeAmount: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
    }>;
    removeExtraServiceFromBooking(id: number): Promise<[{
        id: number;
        createdAt: Date;
        basePrice: Prisma.Decimal;
        bookingId: number;
        quantity: number;
        extraServiceId: number;
        unitPrice: Prisma.Decimal;
        discountAmount: Prisma.Decimal;
        serviceChargeAmount: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
    }, {
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
    }]>;
    getBookingExtraServices(bookingId: number): Promise<({
        extraService: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: Prisma.Decimal;
            active: boolean;
            categoryId: number;
            discountPercentage: number;
            discountAllowed: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        basePrice: Prisma.Decimal;
        bookingId: number;
        quantity: number;
        extraServiceId: number;
        unitPrice: Prisma.Decimal;
        discountAmount: Prisma.Decimal;
        serviceChargeAmount: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
    })[]>;
}
//# sourceMappingURL=extraServiceService.d.ts.map