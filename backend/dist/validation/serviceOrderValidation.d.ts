import { z } from 'zod';
export declare const createServiceOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodOptional<z.ZodNumber>;
        roomId: z.ZodNumber;
        notes: z.ZodOptional<z.ZodString>;
        priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high", "urgent"]>>;
        requestedBy: z.ZodOptional<z.ZodString>;
        items: z.ZodArray<z.ZodObject<{
            serviceId: z.ZodNumber;
            quantity: z.ZodDefault<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            serviceId: number;
            quantity: number;
            notes?: string | undefined;
        }, {
            serviceId: number;
            notes?: string | undefined;
            quantity?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        roomId: number;
        priority: "low" | "normal" | "high" | "urgent";
        items: {
            serviceId: number;
            quantity: number;
            notes?: string | undefined;
        }[];
        bookingId?: number | undefined;
        notes?: string | undefined;
        requestedBy?: string | undefined;
    }, {
        roomId: number;
        items: {
            serviceId: number;
            notes?: string | undefined;
            quantity?: number | undefined;
        }[];
        bookingId?: number | undefined;
        priority?: "low" | "normal" | "high" | "urgent" | undefined;
        notes?: string | undefined;
        requestedBy?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        roomId: number;
        priority: "low" | "normal" | "high" | "urgent";
        items: {
            serviceId: number;
            quantity: number;
            notes?: string | undefined;
        }[];
        bookingId?: number | undefined;
        notes?: string | undefined;
        requestedBy?: string | undefined;
    };
}, {
    body: {
        roomId: number;
        items: {
            serviceId: number;
            notes?: string | undefined;
            quantity?: number | undefined;
        }[];
        bookingId?: number | undefined;
        priority?: "low" | "normal" | "high" | "urgent" | undefined;
        notes?: string | undefined;
        requestedBy?: string | undefined;
    };
}>;
export declare const updateServiceOrderStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["pending", "confirmed", "in_progress", "completed", "cancelled"]>;
        assignedTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress";
        assignedTo?: string | undefined;
    }, {
        status: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress";
        assignedTo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        status: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress";
        assignedTo?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress";
        assignedTo?: string | undefined;
    };
}>;
export declare const getServiceOrdersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        status: z.ZodOptional<z.ZodEnum<["pending", "confirmed", "in_progress", "completed", "cancelled"]>>;
        priority: z.ZodOptional<z.ZodEnum<["low", "normal", "high", "urgent"]>>;
        roomId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        bookingId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        status?: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress" | undefined;
        roomId?: number | undefined;
        bookingId?: number | undefined;
        priority?: "low" | "normal" | "high" | "urgent" | undefined;
    }, {
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        status?: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress" | undefined;
        roomId?: string | undefined;
        bookingId?: string | undefined;
        priority?: "low" | "normal" | "high" | "urgent" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        status?: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress" | undefined;
        roomId?: number | undefined;
        bookingId?: number | undefined;
        priority?: "low" | "normal" | "high" | "urgent" | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        status?: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress" | undefined;
        roomId?: string | undefined;
        bookingId?: string | undefined;
        priority?: "low" | "normal" | "high" | "urgent" | undefined;
    };
}>;
//# sourceMappingURL=serviceOrderValidation.d.ts.map