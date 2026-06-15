import { z } from 'zod';
export declare const initiatePaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodNumber;
        amount: z.ZodNumber;
        method: z.ZodEnum<["esewa", "khalti", "card", "bank_transfer", "cash", "cod"]>;
        returnUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        bookingId: number;
        method: "cash" | "esewa" | "khalti" | "cod" | "card" | "bank_transfer";
        amount: number;
        returnUrl?: string | undefined;
    }, {
        bookingId: number;
        method: "cash" | "esewa" | "khalti" | "cod" | "card" | "bank_transfer";
        amount: number;
        returnUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        bookingId: number;
        method: "cash" | "esewa" | "khalti" | "cod" | "card" | "bank_transfer";
        amount: number;
        returnUrl?: string | undefined;
    };
}, {
    body: {
        bookingId: number;
        method: "cash" | "esewa" | "khalti" | "cod" | "card" | "bank_transfer";
        amount: number;
        returnUrl?: string | undefined;
    };
}>;
export declare const verifyPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        paymentId: z.ZodNumber;
        transactionId: z.ZodString;
        paymentData: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        transactionId: string;
        paymentId: number;
        paymentData?: any;
    }, {
        transactionId: string;
        paymentId: number;
        paymentData?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        transactionId: string;
        paymentId: number;
        paymentData?: any;
    };
}, {
    body: {
        transactionId: string;
        paymentId: number;
        paymentData?: any;
    };
}>;
export declare const refundPaymentSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        reason: z.ZodString;
        amount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        amount?: number | undefined;
    }, {
        reason: string;
        amount?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        reason: string;
        amount?: number | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        reason: string;
        amount?: number | undefined;
    };
}>;
export declare const processCardPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodNumber;
        amount: z.ZodNumber;
        expiryMonth: z.ZodString;
        expiryYear: z.ZodString;
        cvv: z.ZodString;
        cardHolderName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        bookingId: number;
        amount: number;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        cardHolderName: string;
    }, {
        bookingId: number;
        amount: number;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        cardHolderName: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        bookingId: number;
        amount: number;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        cardHolderName: string;
    };
}, {
    body: {
        bookingId: number;
        amount: number;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        cardHolderName: string;
    };
}>;
export declare const getPaymentsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        bookingId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        status: z.ZodOptional<z.ZodEnum<["pending", "completed", "failed", "refunded"]>>;
        method: z.ZodOptional<z.ZodEnum<["cash", "card", "esewa", "khalti", "bank_transfer"]>>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page?: number | undefined;
        limit?: number | undefined;
        status?: "pending" | "completed" | "failed" | "refunded" | undefined;
        bookingId?: number | undefined;
        method?: "cash" | "esewa" | "khalti" | "card" | "bank_transfer" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        page?: string | undefined;
        limit?: string | undefined;
        status?: "pending" | "completed" | "failed" | "refunded" | undefined;
        bookingId?: string | undefined;
        method?: "cash" | "esewa" | "khalti" | "card" | "bank_transfer" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page?: number | undefined;
        limit?: number | undefined;
        status?: "pending" | "completed" | "failed" | "refunded" | undefined;
        bookingId?: number | undefined;
        method?: "cash" | "esewa" | "khalti" | "card" | "bank_transfer" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        page?: string | undefined;
        limit?: string | undefined;
        status?: "pending" | "completed" | "failed" | "refunded" | undefined;
        bookingId?: string | undefined;
        method?: "cash" | "esewa" | "khalti" | "card" | "bank_transfer" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
export declare const esewaWebhookSchema: z.ZodObject<{
    body: z.ZodObject<{
        transaction_code: z.ZodString;
        status: z.ZodString;
        total_amount: z.ZodString;
        transaction_uuid: z.ZodString;
        product_code: z.ZodString;
        signed_field_names: z.ZodString;
        signature: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        transaction_code: string;
        total_amount: string;
        transaction_uuid: string;
        product_code: string;
        signed_field_names: string;
        signature: string;
    }, {
        status: string;
        transaction_code: string;
        total_amount: string;
        transaction_uuid: string;
        product_code: string;
        signed_field_names: string;
        signature: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status: string;
        transaction_code: string;
        total_amount: string;
        transaction_uuid: string;
        product_code: string;
        signed_field_names: string;
        signature: string;
    };
}, {
    body: {
        status: string;
        transaction_code: string;
        total_amount: string;
        transaction_uuid: string;
        product_code: string;
        signed_field_names: string;
        signature: string;
    };
}>;
export declare const khaltiWebhookSchema: z.ZodObject<{
    body: z.ZodObject<{
        idx: z.ZodString;
        amount: z.ZodNumber;
        status: z.ZodEnum<["Completed", "Pending", "Failed"]>;
        transaction_id: z.ZodString;
        product_identity: z.ZodString;
        mobile: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        status: "Completed" | "Failed" | "Pending";
        amount: number;
        idx: string;
        transaction_id: string;
        product_identity: string;
        user?: any;
        mobile?: string | undefined;
    }, {
        status: "Completed" | "Failed" | "Pending";
        amount: number;
        idx: string;
        transaction_id: string;
        product_identity: string;
        user?: any;
        mobile?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status: "Completed" | "Failed" | "Pending";
        amount: number;
        idx: string;
        transaction_id: string;
        product_identity: string;
        user?: any;
        mobile?: string | undefined;
    };
}, {
    body: {
        status: "Completed" | "Failed" | "Pending";
        amount: number;
        idx: string;
        transaction_id: string;
        product_identity: string;
        user?: any;
        mobile?: string | undefined;
    };
}>;
//# sourceMappingURL=paymentValidation.d.ts.map