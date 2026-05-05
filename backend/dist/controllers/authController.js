"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const database_1 = require("../config/database");
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const asyncHandler_1 = require("../utils/asyncHandler");
const mail_1 = require("../utils/mail");
const uuid_1 = require("uuid");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthController {
    /**
     * Register a new guest (requires OTP verification)
     */
    register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, phone, password, firstName, lastName } = req.body;
        const normalizedEmail = email.toLowerCase();
        const existingUser = await database_1.prisma.guest.findFirst({
            where: { OR: [{ email: normalizedEmail }, { phone }] },
        });
        if (existingUser) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Email or phone already registered');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await database_1.prisma.guest.create({
            data: {
                email: normalizedEmail,
                phone,
                password: hashedPassword,
                firstName,
                lastName,
                otp,
                otpExpires,
                isVerified: false,
            },
        });
        // Send OTP email — non-blocking, failure does NOT crash the endpoint
        (0, mail_1.sendOTPEmail)(normalizedEmail, otp).catch(() => { });
        const isDev = process.env.NODE_ENV === 'development';
        res.status(constants_1.HttpStatus.CREATED).json({
            message: 'Registration successful. Please verify your email with the OTP sent.',
            email: normalizedEmail,
            // Expose OTP in dev mode since SMTP may not be configured
            ...(isDev && { otp }),
        });
    });
    /**
     * Login guest (only if verified)
     */
    login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();
        const guest = await database_1.prisma.guest.findUnique({
            where: { email: normalizedEmail },
        });
        if (!guest || !guest.password) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid credentials');
        }
        if (!guest.isVerified) {
            // If not verified, resend OTP and tell them to verify
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await database_1.prisma.guest.update({
                where: { id: guest.id },
                data: { otp, otpExpires },
            });
            await (0, mail_1.sendOTPEmail)(guest.email, otp);
            throw new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, 'Account not verified. A new OTP has been sent to your email.');
        }
        const isMatch = await bcryptjs_1.default.compare(password, guest.password);
        if (!isMatch) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid credentials');
        }
        const token = this.generateToken(guest.id);
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: guest.id,
                email: guest.email,
                firstName: guest.firstName,
                lastName: guest.lastName,
            },
        });
    });
    /**
     * Verify OTP and Login (Used after registration or if requested)
     */
    verifyOTP = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, otp } = req.body;
        const normalizedEmail = email.toLowerCase();
        const guest = await database_1.prisma.guest.findUnique({
            where: { email: normalizedEmail },
        });
        if (!guest) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'No account found with this email');
        }
        // If already verified, just login (handles double clicks/refreshes)
        if (guest.isVerified) {
            const token = this.generateToken(guest.id);
            return res.json({
                message: 'Email already verified',
                token,
                user: {
                    id: guest.id,
                    email: guest.email,
                    firstName: guest.firstName,
                    lastName: guest.lastName,
                },
            });
        }
        if (guest.otp !== otp) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid verification code');
        }
        if (guest.otpExpires && guest.otpExpires < new Date()) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Verification code has expired. Please request a new one.');
        }
        // Mark as verified and clear OTP
        const updatedGuest = await database_1.prisma.guest.update({
            where: { id: guest.id },
            data: { otp: null, otpExpires: null, isVerified: true },
        });
        const token = this.generateToken(updatedGuest.id);
        return res.json({
            message: 'Verification successful',
            token,
            user: {
                id: updatedGuest.id,
                email: updatedGuest.email,
                firstName: updatedGuest.firstName,
                lastName: updatedGuest.lastName,
            },
        });
    });
    /**
     * Resend OTP
     */
    resendOTP = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase();
        const guest = await database_1.prisma.guest.findUnique({
            where: { email: normalizedEmail },
        });
        if (!guest) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Guest not found');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await database_1.prisma.guest.update({
            where: { id: guest.id },
            data: { otp, otpExpires },
        });
        // Non-blocking — don't crash if SMTP is down
        (0, mail_1.sendOTPEmail)(email, otp).catch(() => { });
        const isDev = process.env.NODE_ENV === 'development';
        res.json({
            message: 'A new OTP has been sent to your email',
            ...(isDev && { otp }),
        });
    });
    /**
     * Forgot Password
     */
    forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase();
        const guest = await database_1.prisma.guest.findUnique({
            where: { email: normalizedEmail },
        });
        if (!guest) {
            // Don't reveal if user exists for security, but user requested professional code
            // and usually for guests it's better to tell them
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'If an account exists with this email, a reset link will be sent.');
        }
        const resetToken = (0, uuid_1.v4)();
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await database_1.prisma.guest.update({
            where: { id: guest.id },
            data: { resetToken, resetTokenExpires },
        });
        await (0, mail_1.sendResetPasswordEmail)(email, resetToken);
        res.json({ message: 'Password reset link sent to your email' });
    });
    /**
     * Reset Password
     */
    resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { token, newPassword } = req.body;
        const guest = await database_1.prisma.guest.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() },
            },
        });
        if (!guest) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Invalid or expired reset token');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await database_1.prisma.guest.update({
            where: { id: guest.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });
        res.json({ message: 'Password has been reset successfully' });
    });
    /**
     * Google Login
     */
    googleLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { tokenId } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Invalid Google token');
        }
        const { email, sub: googleId, given_name, family_name } = payload;
        const normalizedEmail = email.toLowerCase();
        let guest = await database_1.prisma.guest.findFirst({
            where: { OR: [{ googleId }, { email: normalizedEmail }] },
        });
        if (!guest) {
            guest = await database_1.prisma.guest.create({
                data: {
                    email: normalizedEmail,
                    googleId,
                    firstName: given_name || 'Guest',
                    lastName: family_name || '',
                    phone: '',
                    isVerified: true,
                },
            });
        }
        else if (!guest.googleId) {
            // Link Google account to existing email
            guest = await database_1.prisma.guest.update({
                where: { id: guest.id },
                data: { googleId, isVerified: true },
            });
        }
        const token = this.generateToken(guest.id);
        res.json({
            message: 'Google login successful',
            token,
            user: {
                id: guest.id,
                email: guest.email,
                firstName: guest.firstName,
                lastName: guest.lastName,
            },
        });
    });
    /**
     * Get Current Guest Details
     */
    getMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const guest = await database_1.prisma.guest.findUnique({
            where: { id: userId },
            include: {
                bookings: {
                    include: {
                        room: true,
                        payments: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!guest) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'User not found');
        }
        res.json(guest);
    });
    /**
     * Update Profile Image
     */
    updateProfileImage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const file = req.file;
        if (!file) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'No image file provided');
        }
        const profileImage = `/uploads/${file.filename}`;
        await database_1.prisma.guest.update({
            where: { id: userId },
            data: { profileImage },
        });
        res.json({ message: 'Profile image updated', profileImage });
    });
    /**
     * Update Profile Details
     */
    updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { firstName, lastName, phone, address, city, country, postalCode } = req.body;
        const guest = await database_1.prisma.guest.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
                address,
                city,
                country,
                postalCode,
            },
        });
        res.json({ message: 'Profile updated successfully', guest });
    });
    /**
     * Helper: Generate JWT
     */
    generateToken(id) {
        return jsonwebtoken_1.default.sign({ id }, config_1.config.jwt.secret, {
            expiresIn: config_1.config.jwt.expire,
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map