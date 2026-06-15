import { z } from 'zod';
export declare const createGuestSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        phone: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        idType: z.ZodOptional<z.ZodEnum<["passport", "driving_license", "national_id"]>>;
        idNumber: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        address?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        postalCode?: string | undefined;
        idType?: "passport" | "driving_license" | "national_id" | undefined;
        idNumber?: string | undefined;
    }, {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        address?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        postalCode?: string | undefined;
        idType?: "passport" | "driving_license" | "national_id" | undefined;
        idNumber?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        address?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        postalCode?: string | undefined;
        idType?: "passport" | "driving_license" | "national_id" | undefined;
        idNumber?: string | undefined;
    };
}, {
    body: {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        address?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        postalCode?: string | undefined;
        idType?: "passport" | "driving_license" | "national_id" | undefined;
        idNumber?: string | undefined;
    };
}>;
export declare const updateGuestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        idType: z.ZodOptional<z.ZodEnum<["passport", "driving_license", "national_id"]>>;
        idNumber: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        phone?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        postalCode?: string | undefined;
        idType?: "passport" | "driving_license" | "national_id" | undefined;
        idNumber?: string | undefined;
    }, {
        email?: string | undefined;
        phone?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        postalCode?: string | undefined;
        idType?: "passport" | "driving_license" | "national_id" | undefined;
        idNumber?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        email?: string | undefined;
        phone?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        postalCode?: string | undefined;
        idType?: "passport" | "driving_license" | "national_id" | undefined;
        idNumber?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        phone?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        postalCode?: string | undefined;
        idType?: "passport" | "driving_license" | "national_id" | undefined;
        idNumber?: string | undefined;
    };
}>;
export declare const getGuestsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        search: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        sort: z.ZodOptional<z.ZodEnum<["name_asc", "name_desc", "bookings_desc", "spent_desc"]>>;
    }, "strip", z.ZodTypeAny, {
        search?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        sort?: "name_asc" | "name_desc" | "bookings_desc" | "spent_desc" | undefined;
    }, {
        search?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        sort?: "name_asc" | "name_desc" | "bookings_desc" | "spent_desc" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        search?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        sort?: "name_asc" | "name_desc" | "bookings_desc" | "spent_desc" | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        sort?: "name_asc" | "name_desc" | "bookings_desc" | "spent_desc" | undefined;
    };
}>;
export declare const guestBookingsSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        status: z.ZodOptional<z.ZodEnum<["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"]>>;
    }, "strip", z.ZodTypeAny, {
        page?: number | undefined;
        limit?: number | undefined;
        status?: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show" | undefined;
    }, {
        page?: string | undefined;
        limit?: string | undefined;
        status?: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page?: number | undefined;
        limit?: number | undefined;
        status?: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show" | undefined;
    };
    params: {
        id: number;
    };
}, {
    query: {
        page?: string | undefined;
        limit?: string | undefined;
        status?: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show" | undefined;
    };
    params: {
        id: string;
    };
}>;
//# sourceMappingURL=guestValidation.d.ts.map