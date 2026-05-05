import { Request, Response, NextFunction } from 'express';
export interface AdminAuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
        type: string;
    };
}
export declare const authenticateAdmin: (req: AdminAuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireSuperAdmin: (req: AdminAuthRequest, res: Response, next: NextFunction) => void;
/**
 * Authorize multiple roles
 */
export declare const authorizeRoles: (...roles: string[]) => (req: AdminAuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=adminAuthMiddleware.d.ts.map