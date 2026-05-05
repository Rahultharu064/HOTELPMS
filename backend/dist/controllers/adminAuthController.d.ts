import { Request, Response } from 'express';
export declare class AdminAuthController {
    /**
     * Admin Login with brute-force protection
     */
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Change Password (Staff Preference Reset)
     */
    changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update Admin Avatar
     */
    updateAvatar: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get Current Admin Details
     */
    getMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Helper: Generate JWT
     */
    private generateToken;
}
//# sourceMappingURL=adminAuthController.d.ts.map