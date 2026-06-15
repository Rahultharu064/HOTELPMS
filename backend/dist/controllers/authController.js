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
const generateOtp_1 = require("../utils/generateOtp");
const crypto_1 = require("crypto");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthController {
    guestUserPayload(guest) {
        return {
            id: guest.id,
            email: guest.email,
            firstName: guest.firstName,
            lastName: guest.lastName,
        };
    }
    buildAuthResponse(guest, message) {
        return {
            message,
            token: this.generateToken(guest.id),
            user: this.guestUserPayload(guest),
        };
    }
    buildOtpResponse(email, otp, emailSent) {
        const payload = {
            message: emailSent
                ? 'Registration successful. Please verify your email with the OTP sent.'
                : 'Registration successful, but the verification email could not be sent. Use resend OTP or contact support.',
            email,
            emailSent,
        };
        if (config_1.config.dev.exposeOtpInResponses) {
            payload.otp = otp;
        }
        return payload;
    }
    async sendOtpOrFail(email, otp, context) {
        const sent = await (0, mail_1.sendOTPEmail)(email, otp);
        if (sent)
            return true;
        console.error(`[${context}] Failed to send OTP email to ${email}`);
        if (config_1.config.dev.helpersEnabled) {
            console.warn(`[DevMode] OTP for ${email}: ${otp}`);
            return false;
        }
        throw new ApiError_1.ApiError(constants_1.HttpStatus.SERVICE_UNAVAILABLE, 'Unable to send verification email. Please try again in a few minutes.');
    }
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
        const otp = (0, generateOtp_1.generateOtp)();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const autoVerify = config_1.config.dev.autoVerifyGuest;
        const guest = await database_1.prisma.guest.create({
            data: {
                email: normalizedEmail,
                phone,
                password: hashedPassword,
                firstName,
                lastName,
                otp: autoVerify ? null : otp,
                otpExpires: autoVerify ? null : otpExpires,
                isVerified: autoVerify,
            },
        });
        if (autoVerify) {
            return res.status(constants_1.HttpStatus.CREATED).json(this.buildAuthResponse(guest, 'Registration successful. You are logged in.'));
        }
        // Send OTP email
        const emailSent = await this.sendOtpOrFail(normalizedEmail, otp, 'RegistrationEmailError');
        return res.status(constants_1.HttpStatus.CREATED).json(this.buildOtpResponse(normalizedEmail, otp, emailSent));
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
            if (config_1.config.dev.autoVerifyGuest) {
                const isMatch = await bcryptjs_1.default.compare(password, guest.password);
                if (!isMatch) {
                    throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid credentials');
                }
                const verifiedGuest = await database_1.prisma.guest.update({
                    where: { id: guest.id },
                    data: { isVerified: true, otp: null, otpExpires: null },
                });
                return res.json(this.buildAuthResponse(verifiedGuest, 'Login successful'));
            }
            // If not verified, resend OTP and tell them to verify
            const otp = (0, generateOtp_1.generateOtp)();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await database_1.prisma.guest.update({
                where: { id: guest.id },
                data: { otp, otpExpires },
            });
            await this.sendOtpOrFail(guest.email, otp, 'LoginResendOTPError');
            throw new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, 'Account not verified. A new OTP has been sent to your email.');
        }
        const isMatch = await bcryptjs_1.default.compare(password, guest.password);
        if (!isMatch) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid credentials');
        }
        const token = this.generateToken(guest.id);
        return res.json(this.buildAuthResponse(guest, 'Login successful'));
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
        // Already verified accounts must use password login
        if (guest.isVerified) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Email already verified. Please log in with your password.');
        }
        const devBypass = config_1.config.dev.helpersEnabled && otp === config_1.config.dev.bypassOtp;
        if (!devBypass && guest.otp !== otp) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid verification code');
        }
        if (!devBypass && guest.otpExpires && guest.otpExpires < new Date()) {
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
            if (config_1.config.isProduction) {
                return res.json({ message: 'If an account exists with this email, a new OTP has been sent.' });
            }
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Guest not found');
        }
        if (guest.isVerified) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Email is already verified. Please log in.');
        }
        const otp = (0, generateOtp_1.generateOtp)();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await database_1.prisma.guest.update({
            where: { id: guest.id },
            data: { otp, otpExpires },
        });
        const emailSent = await this.sendOtpOrFail(normalizedEmail, otp, 'ResendOTPError');
        const payload = {
            message: emailSent
                ? 'A new OTP has been sent to your email'
                : 'OTP regenerated, but email delivery failed. Try again shortly.',
            emailSent,
        };
        if (config_1.config.dev.exposeOtpInResponses) {
            payload.otp = otp;
        }
        return res.json(payload);
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
            return res.json({
                message: 'If an account exists with this email, a reset link will be sent.',
            });
        }
        const resetToken = (0, crypto_1.randomUUID)();
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await database_1.prisma.guest.update({
            where: { id: guest.id },
            data: { resetToken, resetTokenExpires },
        });
        const emailSent = await (0, mail_1.sendResetPasswordEmail)(normalizedEmail, resetToken);
        if (!emailSent && config_1.config.isProduction) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.SERVICE_UNAVAILABLE, 'Unable to send password reset email. Please try again later.');
        }
        return res.json({
            message: 'If an account exists with this email, a reset link will be sent.',
            emailSent,
        });
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
     * Professional Google Login
     */
    googleLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { tokenId } = req.body;
        if (!tokenId) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Google Token is required');
        }
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: tokenId,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Invalid Google token payload');
            }
            const { email, sub: googleId, given_name, family_name, picture } = payload;
            const normalizedEmail = email.toLowerCase();
            // Find user by Google ID or Email
            let guest = await database_1.prisma.guest.findFirst({
                where: {
                    OR: [
                        { googleId },
                        { email: normalizedEmail }
                    ]
                },
            });
            if (!guest) {
                // Create new guest if doesn't exist
                guest = await database_1.prisma.guest.create({
                    data: {
                        email: normalizedEmail,
                        googleId,
                        firstName: given_name || 'Guest',
                        lastName: family_name || '',
                        profileImage: picture, // Sync profile picture from Google
                        isVerified: true,
                        // phone is now optional in schema
                    },
                });
            }
            else {
                // Update existing guest with Google ID and sync profile picture if missing
                const updateData = { isVerified: true };
                if (!guest.googleId)
                    updateData.googleId = googleId;
                if (!guest.profileImage)
                    updateData.profileImage = picture;
                guest = await database_1.prisma.guest.update({
                    where: { id: guest.id },
                    data: updateData,
                });
            }
            const token = this.generateToken(guest.id);
            res.json({
                message: 'Signed in successfully via Google',
                token,
                user: {
                    id: guest.id,
                    email: guest.email,
                    firstName: guest.firstName,
                    lastName: guest.lastName,
                    profileImage: guest.profileImage,
                },
            });
        }
        catch (error) {
            console.error('[GoogleLoginError]:', error);
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Failed to authenticate with Google');
        }
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
        const userId = req.user?.id;
        const file = req.file;
        if (!userId) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'User context missing');
        }
        if (!file) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'No image file provided or upload failed');
        }
        try {
            const profileImage = file.path; // Cloudinary URL
            await database_1.prisma.guest.update({
                where: { id: userId },
                data: { profileImage },
            });
            res.json({
                success: true,
                message: 'Profile image updated',
                profileImage
            });
        }
        catch (error) {
            console.error('[ProfileImageUpdateError]:', error);
            throw error;
        }
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
     * Passport Google Auth Callback
     */
    passportGoogleCallback = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const guest = req.user;
        if (!guest) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Authentication failed');
        }
        const token = this.generateToken(guest.id);
        // Redirect securely back to the frontend
        res.redirect(`${config_1.config.frontendUrl}/login-success?token=${token}`);
    });
    /**
     * Helper: Generate JWT
     */
    generateToken(id) {
        return jsonwebtoken_1.default.sign({ id, type: 'guest' }, config_1.config.jwt.secret, {
            expiresIn: config_1.config.jwt.expire,
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map