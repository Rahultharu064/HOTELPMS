import { z } from 'zod';
export declare const createOfflineReservationSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodObject<{
        existingGuestId: z.ZodOptional<z.ZodNumber>;
        newGuestDetails: z.ZodOptional<z.ZodObject<{
            email: z.ZodString;
            phone: z.ZodString;
            firstName: z.ZodString;
            lastName: z.ZodString;
            address: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            idType: z.ZodOptional<z.ZodEnum<["passport", "driving_license", "national_id", "citizenship", "other"]>>;
            idNumber: z.ZodOptional<z.ZodString>;
            idProofImage: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            address?: string | undefined;
            city?: string | undefined;
            country?: string | undefined;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
        }, {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            address?: string | undefined;
            city?: string | undefined;
            country?: string | undefined;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
        }>>;
        roomId: z.ZodNumber;
        checkIn: z.ZodString;
        checkOut: z.ZodString;
        adults: z.ZodDefault<z.ZodNumber>;
        children: z.ZodDefault<z.ZodNumber>;
        status: z.ZodDefault<z.ZodEnum<[string, ...string[]]>>;
        specialRequests: z.ZodOptional<z.ZodString>;
        payment: z.ZodOptional<z.ZodObject<{
            amount: z.ZodNumber;
            method: z.ZodDefault<z.ZodEnum<["cash", "esewa", "khalti"]>>;
            transactionId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            method: "cash" | "esewa" | "khalti";
            amount: number;
            transactionId?: string | undefined;
        }, {
            amount: number;
            method?: "cash" | "esewa" | "khalti" | undefined;
            transactionId?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        roomId: number;
        checkOut: string;
        checkIn: string;
        adults: number;
        children: number;
        payment?: {
            method: "cash" | "esewa" | "khalti";
            amount: number;
            transactionId?: string | undefined;
        } | undefined;
        specialRequests?: string | undefined;
        existingGuestId?: number | undefined;
        newGuestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            address?: string | undefined;
            city?: string | undefined;
            country?: string | undefined;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
        } | undefined;
    }, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        payment?: {
            amount: number;
            method?: "cash" | "esewa" | "khalti" | undefined;
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        specialRequests?: string | undefined;
        existingGuestId?: number | undefined;
        newGuestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            address?: string | undefined;
            city?: string | undefined;
            country?: string | undefined;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
        } | undefined;
    }>, {
        status: string;
        roomId: number;
        checkOut: string;
        checkIn: string;
        adults: number;
        children: number;
        payment?: {
            method: "cash" | "esewa" | "khalti";
            amount: number;
            transactionId?: string | undefined;
        } | undefined;
        specialRequests?: string | undefined;
        existingGuestId?: number | undefined;
        newGuestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            address?: string | undefined;
            city?: string | undefined;
            country?: string | undefined;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
        } | undefined;
    }, {
        roomId: number;
        checkOut: string;
        checkIn: string;
        payment?: {
            amount: number;
            method?: "cash" | "esewa" | "khalti" | undefined;
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        specialRequests?: string | undefined;
        existingGuestId?: number | undefined;
        newGuestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            address?: string | undefined;
            city?: string | undefined;
            country?: string | undefined;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status: string;
        roomId: number;
        checkOut: string;
        checkIn: string;
        adults: number;
        children: number;
        payment?: {
            method: "cash" | "esewa" | "khalti";
            amount: number;
            transactionId?: string | undefined;
        } | undefined;
        specialRequests?: string | undefined;
        existingGuestId?: number | undefined;
        newGuestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            address?: string | undefined;
            city?: string | undefined;
            country?: string | undefined;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
        } | undefined;
    };
}, {
    body: {
        roomId: number;
        checkOut: string;
        checkIn: string;
        payment?: {
            amount: number;
            method?: "cash" | "esewa" | "khalti" | undefined;
            transactionId?: string | undefined;
        } | undefined;
        status?: string | undefined;
        adults?: number | undefined;
        children?: number | undefined;
        specialRequests?: string | undefined;
        existingGuestId?: number | undefined;
        newGuestDetails?: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            address?: string | undefined;
            city?: string | undefined;
            country?: string | undefined;
            idType?: "other" | "passport" | "driving_license" | "national_id" | "citizenship" | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
        } | undefined;
    };
}>;
//# sourceMappingURL=offlineReservationValidation.d.ts.map