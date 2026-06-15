"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
class AdminAuthController {
    /**
     * Admin Login with brute-force protection
     */
    login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();
        const admin = await database_1.prisma.admin.findUnique({
            where: { email: normalizedEmail },
        });
        if (!admin) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid credentials');
        }
        if (!admin.isActive) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, 'Account is disabled');
        }
        // Check account lockout
        if (admin.lockedUntil && admin.lockedUntil > new Date()) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.TOO_MANY_REQUESTS, 'Account is temporarily locked due to too many failed attempts. Try again later.');
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            // Increment failed attempts
            const attempts = admin.loginAttempts + 1;
            let lockedUntil = admin.lockedUntil;
            // Lock account for 15 minutes after 5 failed attempts
            if (attempts >= 5) {
                lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }
            await database_1.prisma.admin.update({
                where: { id: admin.id },
                data: { loginAttempts: attempts, lockedUntil },
            });
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid credentials');
        }
        // Successful login - reset attempts and update last login
        await database_1.prisma.admin.update({
            where: { id: admin.id },
            data: {
                loginAttempts: 0,
                lockedUntil: null,
                lastLogin: new Date(),
            },
        });
        const token = this.generateToken(admin.id, admin.role);
        res.json({
            message: 'Admin login successful',
            token,
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                mustChangePassword: admin.mustChangePassword,
            },
        });
    });
    /**
     * Change Password (Staff Preference Reset)
     */
    changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const admin = await database_1.prisma.admin.findUnique({
            where: { id: userId },
        });
        if (!admin) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'User not found');
        }
        // Verify current password
        const isMatch = await bcryptjs_1.default.compare(currentPassword, admin.password);
        if (!isMatch) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Current password provided is incorrect.');
        }
        // Hash and save new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await database_1.prisma.admin.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                mustChangePassword: false, // Reset the flag
            },
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Password updated successfully. You can now access your workstation.'));
    });
    /**
     * Skip forced password change
     */
    skipPasswordChange = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        await database_1.prisma.admin.update({
            where: { id: userId },
            data: {
                mustChangePassword: false,
            },
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Security requirement bypassed for this session.'));
    });
    /**
     * Update Admin Avatar
     */
    updateAvatar = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        if (!req.file) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'No file uploaded');
        }
        const avatarUrl = req.file.path; // Cloudinary URL
        await database_1.prisma.admin.update({
            where: { id: userId },
            data: { avatar: avatarUrl }
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Avatar updated successfully', { avatar: avatarUrl }));
    });
    /**
     * Get Current Admin Details
     */
    getMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const admin = await database_1.prisma.admin.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                lastLogin: true,
                mustChangePassword: true,
            }
        });
        if (!admin) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'User not found');
        }
        res.json(admin);
    });
    /**
     * Helper: Generate JWT
     */
    generateToken(id, role) {
        return jsonwebtoken_1.default.sign({ id, role, type: 'admin' }, config_1.config.jwt.secret, {
            expiresIn: '8h', // Shorter expiration for admin
        });
    }
}
exports.AdminAuthController = AdminAuthController;
//# sourceMappingURL=adminAuthController.js.map