import { Request, Response } from 'express';
export declare class AuthController {
    private guestUserPayload;
    private buildAuthResponse;
    private buildOtpResponse;
    private sendOtpOrFail;
    /**
     * Register a new guest (requires OTP verification)
     */
    register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Login guest (only if verified)
     */
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Verify OTP and Login (Used after registration or if requested)
     */
    verifyOTP: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Resend OTP
     */
    resendOTP: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Forgot Password
     */
    forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Reset Password
     */
    resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Professional Google Login
     */
    googleLogin: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get Current Guest Details
     */
    getMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update Profile Image
     */
    updateProfileImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update Profile Details
     */
    updateProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Passport Google Auth Callback
     */
    passportGoogleCallback: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Helper: Generate JWT
     */
    generateToken(id: number): string;
}
//# sourceMappingURL=authController.d.ts.map