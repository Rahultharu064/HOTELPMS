import { z } from 'zod';
export declare const dashboardOverviewSchema: z.ZodObject<{
    query: z.ZodObject<{
        date: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date?: string | undefined;
    }, {
        date?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        date?: string | undefined;
    };
}, {
    query: {
        date?: string | undefined;
    };
}>;
export declare const frontOfficeSearchSchema: z.ZodObject<{
    query: z.ZodObject<{
        query: z.ZodString;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        query: string;
        limit?: number | undefined;
    }, {
        query: string;
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        query: string;
        limit?: number | undefined;
    };
}, {
    query: {
        query: string;
        limit?: string | undefined;
    };
}>;
export declare const updateRoomHousekeepingSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["available", "occupied", "cleaning", "maintenance", "out_of_service"]>;
    }, "strip", z.ZodTypeAny, {
        status: "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";
    }, {
        status: "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        status: "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";
    };
}>;
export declare const checkInSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        guestData: z.ZodOptional<z.ZodObject<{
            idType: z.ZodOptional<z.ZodString>;
            idNumber: z.ZodOptional<z.ZodString>;
            idProofImage: z.ZodOptional<z.ZodString>;
            forceCheckIn: z.ZodOptional<z.ZodBoolean>;
            address: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            phone?: string | undefined;
            address?: string | undefined;
            idType?: string | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            forceCheckIn?: boolean | undefined;
        }, {
            phone?: string | undefined;
            address?: string | undefined;
            idType?: string | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            forceCheckIn?: boolean | undefined;
        }>>;
        newRoomId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        guestData?: {
            phone?: string | undefined;
            address?: string | undefined;
            idType?: string | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            forceCheckIn?: boolean | undefined;
        } | undefined;
        newRoomId?: number | undefined;
    }, {
        guestData?: {
            phone?: string | undefined;
            address?: string | undefined;
            idType?: string | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            forceCheckIn?: boolean | undefined;
        } | undefined;
        newRoomId?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        guestData?: {
            phone?: string | undefined;
            address?: string | undefined;
            idType?: string | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            forceCheckIn?: boolean | undefined;
        } | undefined;
        newRoomId?: number | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        guestData?: {
            phone?: string | undefined;
            address?: string | undefined;
            idType?: string | undefined;
            idNumber?: string | undefined;
            idProofImage?: string | undefined;
            forceCheckIn?: boolean | undefined;
        } | undefined;
        newRoomId?: number | undefined;
    };
}>;
export declare const checkOutSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        force: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        force?: boolean | undefined;
    }, {
        force?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        force?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        force?: boolean | undefined;
    };
}>;
//# sourceMappingURL=frontofficeValidation.d.ts.map