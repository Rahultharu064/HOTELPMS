import { z } from 'zod';
export declare const createFacilitySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        slug: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "maintenance", "closed"]>>;
        openingHours: z.ZodOptional<z.ZodString>;
        category: z.ZodEnum<["restaurant", "pool", "gym", "spa", "business_center", "parking", "other"]>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        slug: string;
        category: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking";
        description?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        openingHours?: string | undefined;
        location?: string | undefined;
    }, {
        name: string;
        slug: string;
        category: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking";
        description?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        openingHours?: string | undefined;
        location?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        slug: string;
        category: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking";
        description?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        openingHours?: string | undefined;
        location?: string | undefined;
    };
}, {
    body: {
        name: string;
        slug: string;
        category: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking";
        description?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        openingHours?: string | undefined;
        location?: string | undefined;
    };
}>;
export declare const updateFacilitySchema: z.ZodObject<{
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
        status: z.ZodOptional<z.ZodEnum<["active", "maintenance", "closed"]>>;
        openingHours: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodEnum<["restaurant", "pool", "gym", "spa", "business_center", "parking", "other"]>>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        slug?: string | undefined;
        category?: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking" | undefined;
        openingHours?: string | undefined;
        location?: string | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        slug?: string | undefined;
        category?: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking" | undefined;
        openingHours?: string | undefined;
        location?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        slug?: string | undefined;
        category?: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking" | undefined;
        openingHours?: string | undefined;
        location?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        slug?: string | undefined;
        category?: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking" | undefined;
        openingHours?: string | undefined;
        location?: string | undefined;
    };
}>;
export declare const getFacilitiesSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        status: z.ZodOptional<z.ZodEnum<["active", "maintenance", "closed"]>>;
        category: z.ZodOptional<z.ZodEnum<["restaurant", "pool", "gym", "spa", "business_center", "parking", "other"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        category?: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking" | undefined;
    }, {
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        category?: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        category?: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking" | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        status?: "maintenance" | "active" | "closed" | undefined;
        category?: "other" | "restaurant" | "pool" | "gym" | "spa" | "business_center" | "parking" | undefined;
    };
}>;
export declare const facilityImagesSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        images: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            alt: z.ZodOptional<z.ZodString>;
            isPrimary: z.ZodOptional<z.ZodBoolean>;
            sortOrder: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            isPrimary?: boolean | undefined;
            alt?: string | undefined;
            sortOrder?: number | undefined;
        }, {
            url: string;
            isPrimary?: boolean | undefined;
            alt?: string | undefined;
            sortOrder?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        images: {
            url: string;
            isPrimary?: boolean | undefined;
            alt?: string | undefined;
            sortOrder?: number | undefined;
        }[];
    }, {
        images: {
            url: string;
            isPrimary?: boolean | undefined;
            alt?: string | undefined;
            sortOrder?: number | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        images: {
            url: string;
            isPrimary?: boolean | undefined;
            alt?: string | undefined;
            sortOrder?: number | undefined;
        }[];
    };
}, {
    params: {
        id: string;
    };
    body: {
        images: {
            url: string;
            isPrimary?: boolean | undefined;
            alt?: string | undefined;
            sortOrder?: number | undefined;
        }[];
    };
}>;
export declare const facilityVideosSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        videos: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            thumbnail: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            title?: string | undefined;
            thumbnail?: string | undefined;
        }, {
            url: string;
            title?: string | undefined;
            thumbnail?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        videos: {
            url: string;
            title?: string | undefined;
            thumbnail?: string | undefined;
        }[];
    }, {
        videos: {
            url: string;
            title?: string | undefined;
            thumbnail?: string | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        videos: {
            url: string;
            title?: string | undefined;
            thumbnail?: string | undefined;
        }[];
    };
}, {
    params: {
        id: string;
    };
    body: {
        videos: {
            url: string;
            title?: string | undefined;
            thumbnail?: string | undefined;
        }[];
    };
}>;
//# sourceMappingURL=facilityValidation.d.ts.map