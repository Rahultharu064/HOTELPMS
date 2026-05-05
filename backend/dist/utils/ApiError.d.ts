export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly errors?: any[];
    constructor(statusCode: number, message: string, isOperational?: boolean, errors?: any[]);
}
//# sourceMappingURL=ApiError.d.ts.map