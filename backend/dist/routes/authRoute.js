"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authRateLimiters_1 = require("../middlewares/authRateLimiters");
const zod_1 = require("zod");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
const passwordSchema = zod_1.z.string().min(8, 'Password must be at least 8 characters');
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(8),
        password: passwordSchema,
        firstName: zod_1.z.string().min(2),
        lastName: zod_1.z.string().min(2),
    }),
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(1),
    }),
});
const googleLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        tokenId: zod_1.z.string(),
    }),
});
const requestOTPSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
});
const verifyOTPSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        otp: zod_1.z.string().length(6),
    }),
});
const forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
});
const resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string(),
        newPassword: passwordSchema,
    }),
});
router.post('/register', authRateLimiters_1.authRegisterLimiter, (0, validateMiddleware_1.validate)(registerSchema), authController.register);
router.post('/login', authRateLimiters_1.authLoginLimiter, (0, validateMiddleware_1.validate)(loginSchema), authController.login);
router.post('/google', authRateLimiters_1.authLoginLimiter, (0, validateMiddleware_1.validate)(googleLoginSchema), authController.googleLogin);
// Passport Google Routes
router.get('/google/login', (req, res, next) => {
    const state = req.query.state ? String(req.query.state) : 'production';
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state,
        prompt: 'select_account'
    })(req, res, next);
});
router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: '/login' }), authController.passportGoogleCallback);
router.post('/verify-otp', authRateLimiters_1.authOtpLimiter, (0, validateMiddleware_1.validate)(verifyOTPSchema), authController.verifyOTP);
router.post('/resend-otp', authRateLimiters_1.authResendOtpLimiter, (0, validateMiddleware_1.validate)(requestOTPSchema), authController.resendOTP);
router.post('/forgot-password', authRateLimiters_1.authForgotPasswordLimiter, (0, validateMiddleware_1.validate)(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authRateLimiters_1.authForgotPasswordLimiter, (0, validateMiddleware_1.validate)(resetPasswordSchema), authController.resetPassword);
// Protected routes
router.get('/me', authMiddleware_1.authenticate, authController.getMe);
router.put('/profile', authMiddleware_1.authenticate, authController.updateProfile);
// Wrapper for upload middleware to catch and expose Multer/Cloudinary errors
const uploadMiddleware = (req, res, next) => {
    uploadMiddleware_1.upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Upload Middleware Error:', err);
            return res.status(500).json({
                success: false,
                message: 'Image upload failed. Please check Cloudinary credentials.',
                error: err.message || err.toString()
            });
        }
        next();
    });
};
router.post('/profile-image', authMiddleware_1.authenticate, uploadMiddleware, authController.updateProfileImage);
exports.default = router;
//# sourceMappingURL=authRoute.js.map