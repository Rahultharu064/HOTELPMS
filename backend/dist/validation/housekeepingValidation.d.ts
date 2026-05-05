import { z } from 'zod';
export declare const updateRoomStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["available", "occupied", "maintenance", "cleaning", "reserved", "out_of_service"]>;
        staffId: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["general", "deep_clean", "inspection", "maintenance", "turn_down"]>>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "available" | "occupied" | "maintenance" | "cleaning" | "reserved" | "out_of_service";
        type: "maintenance" | "general" | "deep_clean" | "inspection" | "turn_down";
        notes?: string | undefined;
        staffId?: string | undefined;
    }, {
        status: "available" | "occupied" | "maintenance" | "cleaning" | "reserved" | "out_of_service";
        type?: "maintenance" | "general" | "deep_clean" | "inspection" | "turn_down" | undefined;
        notes?: string | undefined;
        staffId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: number;
    };
    body: {
        status: "available" | "occupied" | "maintenance" | "cleaning" | "reserved" | "out_of_service";
        type: "maintenance" | "general" | "deep_clean" | "inspection" | "turn_down";
        notes?: string | undefined;
        staffId?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "available" | "occupied" | "maintenance" | "cleaning" | "reserved" | "out_of_service";
        type?: "maintenance" | "general" | "deep_clean" | "inspection" | "turn_down" | undefined;
        notes?: string | undefined;
        staffId?: string | undefined;
    };
}>;
export declare const getHousekeepingLogsSchema: z.ZodObject<{
    query: z.ZodObject<{
        roomId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        staffId: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["general", "deep_clean", "inspection", "maintenance", "turn_down"]>>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        roomId?: number | undefined;
        type?: "maintenance" | "general" | "deep_clean" | "inspection" | "turn_down" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        staffId?: string | undefined;
    }, {
        roomId?: string | undefined;
        type?: "maintenance" | "general" | "deep_clean" | "inspection" | "turn_down" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        staffId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        roomId?: number | undefined;
        type?: "maintenance" | "general" | "deep_clean" | "inspection" | "turn_down" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        staffId?: string | undefined;
    };
}, {
    query: {
        roomId?: string | undefined;
        type?: "maintenance" | "general" | "deep_clean" | "inspection" | "turn_down" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        staffId?: string | undefined;
    };
}>;
//# sourceMappingURL=housekeepingValidation.d.ts.map