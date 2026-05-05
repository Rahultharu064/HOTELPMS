import { z } from 'zod';
export declare const createReviewSchema: z.ZodObject<{
    body: z.ZodObject<{
        guestId: z.ZodNumber;
        bookingId: z.ZodOptional<z.ZodNumber>;
        roomTypeId: z.ZodOptional<z.ZodNumber>;
        rating: z.ZodNumber;
        comment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        guestId: number;
        rating: number;
        roomTypeId?: number | undefined;
        bookingId?: number | undefined;
        comment?: string | undefined;
    }, {
        guestId: number;
        rating: number;
        roomTypeId?: number | undefined;
        bookingId?: number | undefined;
        comment?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        guestId: number;
        rating: number;
        roomTypeId?: number | undefined;
        bookingId?: number | undefined;
        comment?: string | undefined;
    };
}, {
    body: {
        guestId: number;
        rating: number;
        roomTypeId?: number | undefined;
        bookingId?: number | undefined;
        comment?: string | undefined;
    };
}>;
export declare const updateReviewStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["approved", "rejected", "hidden"]>;
        staffReply: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "approved" | "rejected" | "hidden";
        staffReply?: string | undefined;
    }, {
        status: "approved" | "rejected" | "hidden";
        staffReply?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        status: "approved" | "rejected" | "hidden";
        staffReply?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "approved" | "rejected" | "hidden";
        staffReply?: string | undefined;
    };
}>;
export declare const getReviewsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>>;
        status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected", "hidden"]>>;
        roomTypeId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        rating: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        status?: "pending" | "approved" | "rejected" | "hidden" | undefined;
        roomTypeId?: number | undefined;
        rating?: number | undefined;
    }, {
        page?: string | undefined;
        limit?: string | undefined;
        status?: "pending" | "approved" | "rejected" | "hidden" | undefined;
        roomTypeId?: string | undefined;
        rating?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        limit: number;
        status?: "pending" | "approved" | "rejected" | "hidden" | undefined;
        roomTypeId?: number | undefined;
        rating?: number | undefined;
    };
}, {
    query: {
        page?: string | undefined;
        limit?: string | undefined;
        status?: "pending" | "approved" | "rejected" | "hidden" | undefined;
        roomTypeId?: string | undefined;
        rating?: string | undefined;
    };
}>;
//# sourceMappingURL=reviewValidation.d.ts.map