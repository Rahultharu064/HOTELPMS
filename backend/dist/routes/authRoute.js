"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const zod_1 = require("zod");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
// Multer config for profile images
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
        cb(null, `profile-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(8),
        password: zod_1.z.string().min(6),
        firstName: zod_1.z.string().min(2),
        lastName: zod_1.z.string().min(2),
    }),
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
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
        newPassword: zod_1.z.string().min(6),
    }),
});
router.post('/register', (0, validateMiddleware_1.validate)(registerSchema), authController.register);
router.post('/login', (0, validateMiddleware_1.validate)(loginSchema), authController.login);
router.post('/google', (0, validateMiddleware_1.validate)(googleLoginSchema), authController.googleLogin);
router.post('/verify-otp', (0, validateMiddleware_1.validate)(verifyOTPSchema), authController.verifyOTP);
router.post('/resend-otp', (0, validateMiddleware_1.validate)(requestOTPSchema), authController.resendOTP);
router.post('/forgot-password', (0, validateMiddleware_1.validate)(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', (0, validateMiddleware_1.validate)(resetPasswordSchema), authController.resetPassword);
// Protected routes
router.get('/me', authMiddleware_1.authenticate, authController.getMe);
router.put('/profile', authMiddleware_1.authenticate, authController.updateProfile);
router.post('/profile-image', authMiddleware_1.authenticate, upload.single('image'), authController.updateProfileImage);
exports.default = router;
//# sourceMappingURL=authRoute.js.map