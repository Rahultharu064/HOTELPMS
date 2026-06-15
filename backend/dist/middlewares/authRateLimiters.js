"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authForgotPasswordLimiter = exports.authResendOtpLimiter = exports.authOtpLimiter = exports.authRegisterLimiter = exports.authLoginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rateLimitResponse = (message) => ({
    success: false,
    message,
});
exports.authLoginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitResponse('Too many login attempts. Please try again in 15 minutes.'),
});
exports.authRegisterLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitResponse('Too many registration attempts. Please try again later.'),
});
exports.authOtpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitResponse('Too many verification attempts. Please try again in 15 minutes.'),
});
exports.authResendOtpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitResponse('Too many OTP resend requests. Please wait before trying again.'),
});
exports.authForgotPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitResponse('Too many password reset requests. Please try again later.'),
});
//# sourceMappingURL=authRateLimiters.js.map