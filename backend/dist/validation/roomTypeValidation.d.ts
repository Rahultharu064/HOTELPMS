import { z } from 'zod';
export declare const createRoomTypeSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        image: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        image?: string | undefined;
        description?: string | undefined;
    }, {
        name: string;
        image?: string | undefined;
        description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        image?: string | undefined;
        description?: string | undefined;
    };
}, {
    body: {
        name: string;
        image?: string | undefined;
        description?: string | undefined;
    };
}>;
export declare const updateRoomTypeSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        image?: string | undefined;
        name?: string | undefined;
        description?: string | undefined;
    }, {
        image?: string | undefined;
        name?: string | undefined;
        description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        image?: string | undefined;
        name?: string | undefined;
        description?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        image?: string | undefined;
        name?: string | undefined;
        description?: string | undefined;
    };
}>;
export declare const getRoomTypesSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        search: z.ZodOptional<z.ZodString>;
        sort: z.ZodOptional<z.ZodEnum<["name_asc", "name_desc"]>>;
    }, "strip", z.ZodTypeAny, {
        search?: string | undefined;
        sort?: "name_asc" | "name_desc" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    }, {
        search?: string | undefined;
        sort?: "name_asc" | "name_desc" | undefined;
        page?: string | undefined;
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        search?: string | undefined;
        sort?: "name_asc" | "name_desc" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        sort?: "name_asc" | "name_desc" | undefined;
        page?: string | undefined;
        limit?: string | undefined;
    };
}>;
//# sourceMappingURL=roomTypeValidation.d.ts.map