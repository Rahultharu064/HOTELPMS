import { z } from 'zod';
export declare const createRoomSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        roomNumber: z.ZodString;
        roomTypeId: z.ZodNumber;
        floor: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
        description: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        bedType: z.ZodOptional<z.ZodEnum<["single", "double", "queen", "king", "twin"]>>;
        view: z.ZodOptional<z.ZodString>;
        capacity: z.ZodDefault<z.ZodNumber>;
        basePrice: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        roomNumber: string;
        roomTypeId: number;
        capacity: number;
        basePrice: number;
        description?: string | undefined;
        status?: string | undefined;
        floor?: number | undefined;
        size?: number | undefined;
        bedType?: "single" | "double" | "queen" | "king" | "twin" | undefined;
        view?: string | undefined;
    }, {
        name: string;
        roomNumber: string;
        roomTypeId: number;
        basePrice: number;
        description?: string | undefined;
        status?: string | undefined;
        capacity?: number | undefined;
        floor?: number | undefined;
        size?: number | undefined;
        bedType?: "single" | "double" | "queen" | "king" | "twin" | undefined;
        view?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        roomNumber: string;
        roomTypeId: number;
        capacity: number;
        basePrice: number;
        description?: string | undefined;
        status?: string | undefined;
        floor?: number | undefined;
        size?: number | undefined;
        bedType?: "single" | "double" | "queen" | "king" | "twin" | undefined;
        view?: string | undefined;
    };
}, {
    body: {
        name: string;
        roomNumber: string;
        roomTypeId: number;
        basePrice: number;
        description?: string | undefined;
        status?: string | undefined;
        capacity?: number | undefined;
        floor?: number | undefined;
        size?: number | undefined;
        bedType?: "single" | "double" | "queen" | "king" | "twin" | undefined;
        view?: string | undefined;
    };
}>;
export declare const updateRoomSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        roomNumber: z.ZodOptional<z.ZodString>;
        roomTypeId: z.ZodOptional<z.ZodNumber>;
        floor: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
        description: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        bedType: z.ZodOptional<z.ZodEnum<["single", "double", "queen", "king", "twin"]>>;
        view: z.ZodOptional<z.ZodString>;
        capacity: z.ZodOptional<z.ZodNumber>;
        basePrice: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        name?: string | undefined;
        status?: string | undefined;
        roomNumber?: string | undefined;
        roomTypeId?: number | undefined;
        capacity?: number | undefined;
        basePrice?: number | undefined;
        floor?: number | undefined;
        size?: number | undefined;
        bedType?: "single" | "double" | "queen" | "king" | "twin" | undefined;
        view?: string | undefined;
    }, {
        description?: string | undefined;
        name?: string | undefined;
        status?: string | undefined;
        roomNumber?: string | undefined;
        roomTypeId?: number | undefined;
        capacity?: number | undefined;
        basePrice?: number | undefined;
        floor?: number | undefined;
        size?: number | undefined;
        bedType?: "single" | "double" | "queen" | "king" | "twin" | undefined;
        view?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        description?: string | undefined;
        name?: string | undefined;
        status?: string | undefined;
        roomNumber?: string | undefined;
        roomTypeId?: number | undefined;
        capacity?: number | undefined;
        basePrice?: number | undefined;
        floor?: number | undefined;
        size?: number | undefined;
        bedType?: "single" | "double" | "queen" | "king" | "twin" | undefined;
        view?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        description?: string | undefined;
        name?: string | undefined;
        status?: string | undefined;
        roomNumber?: string | undefined;
        roomTypeId?: number | undefined;
        capacity?: number | undefined;
        basePrice?: number | undefined;
        floor?: number | undefined;
        size?: number | undefined;
        bedType?: "single" | "double" | "queen" | "king" | "twin" | undefined;
        view?: string | undefined;
    };
}>;
export declare const getRoomsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        status: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
        roomTypeId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        minPrice: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        maxPrice: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        beds: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        adults: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        children: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        checkIn: z.ZodOptional<z.ZodString>;
        checkOut: z.ZodOptional<z.ZodString>;
        sort: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page?: number | undefined;
        limit?: number | undefined;
        sort?: string | undefined;
        status?: string | undefined;
        roomTypeId?: number | undefined;
        checkOut?: string | undefined;
        checkIn?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        minPrice?: number | undefined;
        maxPrice?: number | undefined;
        beds?: number | undefined;
    }, {
        page?: string | undefined;
        limit?: string | undefined;
        sort?: string | undefined;
        status?: string | undefined;
        roomTypeId?: string | undefined;
        checkOut?: string | undefined;
        checkIn?: string | undefined;
        adults?: string | undefined;
        children?: string | undefined;
        minPrice?: string | undefined;
        maxPrice?: string | undefined;
        beds?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page?: number | undefined;
        limit?: number | undefined;
        sort?: string | undefined;
        status?: string | undefined;
        roomTypeId?: number | undefined;
        checkOut?: string | undefined;
        checkIn?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        minPrice?: number | undefined;
        maxPrice?: number | undefined;
        beds?: number | undefined;
    };
}, {
    query: {
        page?: string | undefined;
        limit?: string | undefined;
        sort?: string | undefined;
        status?: string | undefined;
        roomTypeId?: string | undefined;
        checkOut?: string | undefined;
        checkIn?: string | undefined;
        adults?: string | undefined;
        children?: string | undefined;
        minPrice?: string | undefined;
        maxPrice?: string | undefined;
        beds?: string | undefined;
    };
}>;
export declare const roomAvailabilitySchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    query: z.ZodObject<{
        checkIn: z.ZodString;
        checkOut: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        checkOut: string;
        checkIn: string;
    }, {
        checkOut: string;
        checkIn: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        checkOut: string;
        checkIn: string;
    };
    params: {
        id: number;
    };
}, {
    query: {
        checkOut: string;
        checkIn: string;
    };
    params: {
        id: string;
    };
}>;
export declare const roomImagesSchema: z.ZodObject<{
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
export declare const roomVideosSchema: z.ZodObject<{
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
//# sourceMappingURL=roomValidation.d.ts.map