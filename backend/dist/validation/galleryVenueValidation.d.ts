import { z } from 'zod';
export declare const createGalleryVenueSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        slug: z.ZodOptional<z.ZodString>;
        description: z.ZodString;
        image: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        layout: z.ZodOptional<z.ZodEnum<["featured", "compact", "wide"]>>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>>, boolean | undefined, boolean | "true" | "false" | undefined>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        title: string;
        image?: string | undefined;
        slug?: string | undefined;
        sortOrder?: number | undefined;
        icon?: string | undefined;
        isActive?: boolean | undefined;
        layout?: "featured" | "compact" | "wide" | undefined;
    }, {
        description: string;
        title: string;
        image?: string | undefined;
        slug?: string | undefined;
        sortOrder?: number | undefined;
        icon?: string | undefined;
        isActive?: boolean | "true" | "false" | undefined;
        layout?: "featured" | "compact" | "wide" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        description: string;
        title: string;
        image?: string | undefined;
        slug?: string | undefined;
        sortOrder?: number | undefined;
        icon?: string | undefined;
        isActive?: boolean | undefined;
        layout?: "featured" | "compact" | "wide" | undefined;
    };
}, {
    body: {
        description: string;
        title: string;
        image?: string | undefined;
        slug?: string | undefined;
        sortOrder?: number | undefined;
        icon?: string | undefined;
        isActive?: boolean | "true" | "false" | undefined;
        layout?: "featured" | "compact" | "wide" | undefined;
    };
}>;
export declare const updateGalleryVenueSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        layout: z.ZodOptional<z.ZodOptional<z.ZodEnum<["featured", "compact", "wide"]>>>;
        sortOrder: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        isActive: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>>, boolean | undefined, boolean | "true" | "false" | undefined>>;
    }, "strip", z.ZodTypeAny, {
        image?: string | undefined;
        description?: string | undefined;
        slug?: string | undefined;
        sortOrder?: number | undefined;
        icon?: string | undefined;
        title?: string | undefined;
        isActive?: boolean | undefined;
        layout?: "featured" | "compact" | "wide" | undefined;
    }, {
        image?: string | undefined;
        description?: string | undefined;
        slug?: string | undefined;
        sortOrder?: number | undefined;
        icon?: string | undefined;
        title?: string | undefined;
        isActive?: boolean | "true" | "false" | undefined;
        layout?: "featured" | "compact" | "wide" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        image?: string | undefined;
        description?: string | undefined;
        slug?: string | undefined;
        sortOrder?: number | undefined;
        icon?: string | undefined;
        title?: string | undefined;
        isActive?: boolean | undefined;
        layout?: "featured" | "compact" | "wide" | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        image?: string | undefined;
        description?: string | undefined;
        slug?: string | undefined;
        sortOrder?: number | undefined;
        icon?: string | undefined;
        title?: string | undefined;
        isActive?: boolean | "true" | "false" | undefined;
        layout?: "featured" | "compact" | "wide" | undefined;
    };
}>;
export declare const galleryVenueIdSchema: z.ZodObject<{
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
export declare const galleryVenueSlugSchema: z.ZodObject<{
    params: z.ZodObject<{
        slug: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        slug: string;
    }, {
        slug: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        slug: string;
    };
}, {
    params: {
        slug: string;
    };
}>;
//# sourceMappingURL=galleryVenueValidation.d.ts.map