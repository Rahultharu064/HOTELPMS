export declare class CheckInOutService {
    /**
     * Complete Check-in Logic
     * Includes: Identity updates, Room status transition, Audit logging, Room swap support
     */
    checkIn(bookingId: number, guestData?: any, performedBy?: string, newRoomId?: number): Promise<{
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
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        source: import(".prisma/client").$Enums.BookingSource;
        specialRequests: string | null;
    }>;
    /**
     * Complete Check-out Logic
     * Includes: Folio balance verification, pending service orders, room cleaning transition
     */
    checkOut(bookingId: number, performedBy?: string, force?: boolean, paymentMethod?: string): Promise<{
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
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        source: import(".prisma/client").$Enums.BookingSource;
        specialRequests: string | null;
    }>;
    getFolio(bookingId: number): Promise<{
        bookingNumber: string;
        guestName: string;
        roomNumber: string;
        roomType: string;
        checkIn: Date;
        checkOut: Date;
        stayCharges: number;
        extraServices: ({
            extraService: {
                image: string | null;
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                active: boolean;
                categoryId: number;
                discountPercentage: number;
                discountAllowed: boolean;
            };
        } & {
            id: number;
            createdAt: Date;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            bookingId: number;
            quantity: number;
            extraServiceId: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            serviceChargeAmount: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
        extraServicesTotal: number;
        posServiceOrders: ({
            items: ({
                service: {
                    image: string | null;
                    description: string | null;
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    status: import(".prisma/client").$Enums.ServiceStatus;
                    slug: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    categoryId: number;
                };
            } & {
                id: number;
                price: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                orderId: number;
                serviceId: number;
                quantity: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ServiceOrderStatus;
            roomId: number | null;
            guestId: number | null;
            bookingId: number | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            orderNumber: string;
            priority: import(".prisma/client").$Enums.ServicePriority;
            notes: string | null;
            requestedBy: string | null;
            assignedTo: string | null;
        })[];
        posServiceCharges: number;
        totalCharges: number;
        totalPayments: number;
        balance: number;
        isSettled: boolean;
        paymentHistory: {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            serviceOrderId: number | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            paymentData: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    /**
     * No-Show Logic
     * Releases the room back into inventory
     */
    markNoShow(bookingId: number, performedBy?: string): Promise<{
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
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        source: import(".prisma/client").$Enums.BookingSource;
        specialRequests: string | null;
    }>;
    /**
     * Identity Verification Logic
     * Compares provided details with the database record to ensure the guest is 'Real'
     */
    verifyGuestIdentity(bookingId: number, verificationData: any): Promise<{
        matched: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=checkInOutService.d.ts.map