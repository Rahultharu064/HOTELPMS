"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuthController_1 = require("../controllers/adminAuthController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const zod_1 = require("zod");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../config");
const router = (0, express_1.Router)();
const adminAuthController = new adminAuthController_1.AdminAuthController();
// Strict rate limiter for production; relaxed in development for automated testing
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: config_1.config.isProduction ? 5 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes',
    },
});
const adminLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8, "Password is required"),
    }),
});
router.post('/login', loginLimiter, (0, validateMiddleware_1.validate)(adminLoginSchema), adminAuthController.login);
// Protected routes
router.get('/me', adminAuthMiddleware_1.authenticateAdmin, adminAuthController.getMe);
router.post('/change-password', adminAuthMiddleware_1.authenticateAdmin, adminAuthController.changePassword);
router.post('/skip-password-change', adminAuthMiddleware_1.authenticateAdmin, adminAuthController.skipPasswordChange);
router.post('/avatar', adminAuthMiddleware_1.authenticateAdmin, uploadMiddleware_1.upload.single('avatar'), adminAuthController.updateAvatar);
exports.default = router;
//# sourceMappingURL=adminAuthRoute.js.map