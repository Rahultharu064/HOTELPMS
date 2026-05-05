import { z } from 'zod';
export declare const createExtraServiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        price: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, number, string | number>;
        categoryId: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, number, string | number>;
        discountPercentage: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, number, string | number | undefined>;
        discountAllowed: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>, boolean, string | boolean | undefined>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        name: string;
        price: number;
        categoryId: number;
        discountPercentage: number;
        discountAllowed: boolean;
    }, {
        description: string;
        name: string;
        price: string | number;
        categoryId: string | number;
        discountPercentage?: string | number | undefined;
        discountAllowed?: string | boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        description: string;
        name: string;
        price: number;
        categoryId: number;
        discountPercentage: number;
        discountAllowed: boolean;
    };
}, {
    body: {
        description: string;
        name: string;
        price: string | number;
        categoryId: string | number;
        discountPercentage?: string | number | undefined;
        discountAllowed?: string | boolean | undefined;
    };
}>;
export declare const updateExtraServiceSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, number | undefined, string | number | undefined>;
        categoryId: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, number | undefined, string | number | undefined>;
        active: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>, boolean, string | boolean | undefined>;
        discountPercentage: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, number | undefined, string | number | undefined>;
        discountAllowed: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>, boolean, string | boolean | undefined>;
    }, "strip", z.ZodTypeAny, {
        active: boolean;
        discountAllowed: boolean;
        description?: string | undefined;
        name?: string | undefined;
        price?: number | undefined;
        categoryId?: number | undefined;
        discountPercentage?: number | undefined;
    }, {
        description?: string | undefined;
        name?: string | undefined;
        price?: string | number | undefined;
        active?: string | boolean | undefined;
        categoryId?: string | number | undefined;
        discountPercentage?: string | number | undefined;
        discountAllowed?: string | boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        active: boolean;
        discountAllowed: boolean;
        description?: string | undefined;
        name?: string | undefined;
        price?: number | undefined;
        categoryId?: number | undefined;
        discountPercentage?: number | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        description?: string | undefined;
        name?: string | undefined;
        price?: string | number | undefined;
        active?: string | boolean | undefined;
        categoryId?: string | number | undefined;
        discountPercentage?: string | number | undefined;
        discountAllowed?: string | boolean | undefined;
    };
}>;
export declare const addServiceToBookingSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodNumber;
        extraServiceId: z.ZodNumber;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        bookingId: number;
        quantity: number;
        extraServiceId: number;
    }, {
        bookingId: number;
        quantity: number;
        extraServiceId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        bookingId: number;
        quantity: number;
        extraServiceId: number;
    };
}, {
    body: {
        bookingId: number;
        quantity: number;
        extraServiceId: number;
    };
}>;
export declare const bookingParamsSchema: z.ZodObject<{
    params: z.ZodObject<{
        bookingId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        bookingId: number;
    }, {
        bookingId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        bookingId: number;
    };
}, {
    params: {
        bookingId: string;
    };
}>;
export declare const idParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
}, {
    params: {
        id: string;
    };
}>;
//# sourceMappingURL=extraServiceValidation.d.ts.map