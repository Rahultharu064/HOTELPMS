import { z } from 'zod';
export declare const createServiceCategorySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        slug: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["active", "inactive", "maintenance"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "maintenance" | "active" | "inactive";
        slug: string;
        image?: string | undefined;
        description?: string | undefined;
        icon?: string | undefined;
    }, {
        name: string;
        slug: string;
        image?: string | undefined;
        description?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        icon?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        status: "maintenance" | "active" | "inactive";
        slug: string;
        image?: string | undefined;
        description?: string | undefined;
        icon?: string | undefined;
    };
}, {
    body: {
        name: string;
        slug: string;
        image?: string | undefined;
        description?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        icon?: string | undefined;
    };
}>;
export declare const updateServiceCategorySchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "maintenance"]>>;
    }, "strip", z.ZodTypeAny, {
        image?: string | undefined;
        description?: string | undefined;
        name?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        slug?: string | undefined;
        icon?: string | undefined;
    }, {
        image?: string | undefined;
        description?: string | undefined;
        name?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        slug?: string | undefined;
        icon?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        image?: string | undefined;
        description?: string | undefined;
        name?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        slug?: string | undefined;
        icon?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        image?: string | undefined;
        description?: string | undefined;
        name?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        slug?: string | undefined;
        icon?: string | undefined;
    };
}>;
export declare const createServiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        slug: z.ZodString;
        categoryId: z.ZodNumber;
        price: z.ZodNumber;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["active", "inactive", "maintenance"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "maintenance" | "active" | "inactive";
        slug: string;
        price: number;
        categoryId: number;
        image?: string | undefined;
        description?: string | undefined;
    }, {
        name: string;
        slug: string;
        price: number;
        categoryId: number;
        image?: string | undefined;
        description?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        status: "maintenance" | "active" | "inactive";
        slug: string;
        price: number;
        categoryId: number;
        image?: string | undefined;
        description?: string | undefined;
    };
}, {
    body: {
        name: string;
        slug: string;
        price: number;
        categoryId: number;
        image?: string | undefined;
        description?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
    };
}>;
export declare const updateServiceSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodOptional<z.ZodNumber>;
        price: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "maintenance"]>>;
    }, "strip", z.ZodTypeAny, {
        image?: string | undefined;
        description?: string | undefined;
        name?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        slug?: string | undefined;
        price?: number | undefined;
        categoryId?: number | undefined;
    }, {
        image?: string | undefined;
        description?: string | undefined;
        name?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        slug?: string | undefined;
        price?: number | undefined;
        categoryId?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        image?: string | undefined;
        description?: string | undefined;
        name?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        slug?: string | undefined;
        price?: number | undefined;
        categoryId?: number | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        image?: string | undefined;
        description?: string | undefined;
        name?: string | undefined;
        status?: "maintenance" | "active" | "inactive" | undefined;
        slug?: string | undefined;
        price?: number | undefined;
        categoryId?: number | undefined;
    };
}>;
//# sourceMappingURL=serviceCategoryValidation.d.ts.map