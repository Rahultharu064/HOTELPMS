import { z } from 'zod';
export declare const createBookingSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
        guestId: z.ZodOptional<z.ZodNumber>;
        guestDetails: z.ZodOptional<z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodString;
            phone: z.ZodString;
            nationality: z.ZodOptional<z.ZodString>;
            idType: z.ZodOptional<z.ZodEnum<["passport", "driving_license", "national_id", "citizenship", "other"]>>;
            idNumber: z.ZodOptional<z.ZodString>;
            idProofImage: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        }, {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        }>>;
        roomId: z.ZodNumber;
        checkIn: z.ZodString;
        checkOut: z.ZodString;
        adults: z.ZodDefault<z.ZodNumber>;
        children: z.ZodDefault<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
        source: z.ZodOptional<z.ZodEnum<["direct", "ota", "walk_in", "corporate"]>>;
        specialRequests: z.ZodOptional<z.ZodString>;
        payment: z.ZodOptional<z.ZodObject<{
            amount: z.ZodNumber;
            method: z.ZodEnum<["cash", "esewa", "khalti"]>;
            transactionId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        }, {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        adults: number;
        children: number;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    }, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    }>, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        adults: number;
        children: number;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    }, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    }>, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        adults: number;
        children: number;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    }, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    }>, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        adults: number;
        children: number;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    }, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        roomId: number;
        checkOut: string;
        checkIn: string;
        adults: number;
        children: number;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    };
}, {
    body: {
        roomId: number;
        checkOut: string;
        checkIn: string;
        payment?: {
            amount: number;
            method: "cash" | "esewa" | "khalti";
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        guestId?: number | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        source?: "direct" | "ota" | "walk_in" | "corporate" | undefined;
        specialRequests?: string | undefined;
        guestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            nationality?: string | undefined;
        } | undefined;
    };
}>;
export declare const updateBookingSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        roomId: z.ZodOptional<z.ZodNumber>;
        checkIn: z.ZodOptional<z.ZodString>;
        checkOut: z.ZodOptional<z.ZodString>;
        adults: z.ZodOptional<z.ZodNumber>;
        children: z.ZodOptional<z.ZodNumber>;
        specialRequests: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        roomId?: number | undefined;
        checkOut?: string | undefined;
        checkIn?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        specialRequests?: string | undefined;
    }, {
        roomId?: number | undefined;
        checkOut?: string | undefined;
        checkIn?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        specialRequests?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        roomId?: number | undefined;
        checkOut?: string | undefined;
        checkIn?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        specialRequests?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        roomId?: number | undefined;
        checkOut?: string | undefined;
        checkIn?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        specialRequests?: string | undefined;
    };
}>;
export declare const getBookingsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        status: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
        guestId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        roomId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        status?: string | undefined;
        roomId?: number | undefined;
        guestId?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        status?: string | undefined;
        roomId?: string | undefined;
        guestId?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        status?: string | undefined;
        roomId?: number | undefined;
        guestId?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
        status?: string | undefined;
        roomId?: string | undefined;
        guestId?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
export declare const updateBookingStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<[string, ...string[]]>;
    }, "strip", z.ZodTypeAny, {
        status: string;
    }, {
        status: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        status: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: string;
    };
}>;
//# sourceMappingURL=bookingValidation.d.ts.map