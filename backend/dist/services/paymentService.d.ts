import { Prisma } from '@prisma/client';
export declare class PaymentService {
    initiatePayment(data: {
        bookingId?: number;
        serviceOrderId?: number;
        amount: number;
        method: string;
        returnUrl?: string;
    }): Promise<{
        payment: {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceOrderId: number | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            paymentData: Prisma.JsonValue | null;
        };
        method: string;
        message: string;
        paymentPayload?: undefined;
    } | {
        payment: {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceOrderId: number | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            paymentData: Prisma.JsonValue | null;
        };
        method: string;
        paymentPayload: {
            url: string;
            amount: number;
            tax_amount: number;
            total_amount: number;
            transaction_uuid: string;
            product_code: string;
            product_service_charge: number;
            product_delivery_charge: number;
            success_url: string;
            failure_url: string;
            signed_field_names: string;
            signature: string;
            pidx?: undefined;
        };
        message?: undefined;
    } | {
        payment: {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceOrderId: number | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            paymentData: Prisma.JsonValue | null;
        };
        method: string;
        paymentPayload: {
            url: any;
            pidx: any;
            amount?: undefined;
            tax_amount?: undefined;
            total_amount?: undefined;
            transaction_uuid?: undefined;
            product_code?: undefined;
            product_service_charge?: undefined;
            product_delivery_charge?: undefined;
            success_url?: undefined;
            failure_url?: undefined;
            signed_field_names?: undefined;
            signature?: undefined;
        };
        message?: undefined;
    }>;
    verifyEsewa(encodedData: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyKhalti(data: {
        pidx: string;
        transaction_id?: string;
        purchase_order_id?: string;
    }): Promise<{
        success: boolean;
        data: any;
    }>;
    private markPaymentCompleted;
    getAllPayments(filters: {
        page?: number;
        limit?: number;
        bookingId?: number;
        serviceOrderId?: number;
        status?: string;
        method?: string;
        startDate?: Date;
        endDate?: Date;
        type?: 'booking' | 'service';
    }): Promise<{
        payments: ({
            booking: {
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
                bookingNumber: string;
            } | null;
            serviceOrder: {
                orderNumber: string;
                requestedBy: string | null;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceOrderId: number | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            paymentData: Prisma.JsonValue | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
//# sourceMappingURL=paymentService.d.ts.map