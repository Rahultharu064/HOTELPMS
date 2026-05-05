export declare class ApiResponse<T> {
    readonly success: boolean;
    readonly message: string;
    readonly data: T | null;
    readonly errors?: any[];
    constructor(success: boolean, message: string, data?: T | null, errors?: any[]);
    static success<T>(message: string, data?: T | null): ApiResponse<T>;
    static error(message: string, errors?: any[]): ApiResponse<null>;
}
//# sourceMappingURL=ApiResponse.d.ts.map