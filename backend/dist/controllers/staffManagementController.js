"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffManagementController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const crypto_1 = __importDefault(require("crypto"));
const mail_1 = require("../utils/mail");
class StaffManagementController {
    /**
     * Create a new staff member with a random password
     */
    createStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { name, email, phoneNumber, role } = req.body;
        const existingUser = await database_1.prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (existingUser) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Email is already registered for another staff member.');
        }
        // Generate a secure random password
        const temporaryPassword = crypto_1.default.randomBytes(6).toString('hex'); // 12 characters hex
        const hashedPassword = await bcryptjs_1.default.hash(temporaryPassword, 10);
        const staff = await database_1.prisma.admin.create({
            data: {
                name,
                email: email.toLowerCase(),
                phoneNumber,
                role: role,
                password: hashedPassword,
                mustChangePassword: true, // Force reset on first login
                isActive: true
            }
        });
        // Send welcome email with credentials — non-blocking
        (0, mail_1.sendStaffWelcomeEmail)(staff.email, staff.name, staff.role, temporaryPassword).catch(err => {
            console.error('[StaffWelcomeEmailError]:', err);
        });
        // In a real production app, we would send this via email.
        // For this project, we return it so the admin can copy it.
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Staff account created successfully', {
            staff: {
                id: staff.id,
                name: staff.name,
                email: staff.email,
                role: staff.role
            },
            temporaryPassword // CRITICAL: Only return this once upon creation
        }));
    });
    /**
     * Get all staff members
     */
    getAllStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const staff = await database_1.prisma.admin.findMany({
            where: {
                role: {
                    in: ['admin', 'manager', 'front_office', 'housekeeping']
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Staff records retrieved', staff));
    });
    /**
     * Toggle staff active status
     */
    toggleStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { isActive } = req.body;
        await database_1.prisma.admin.update({
            where: { id: Number(id) },
            data: { isActive }
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(`Staff account ${isActive ? 'activated' : 'deactivated'} successfully`));
    });
    /**
     * Update staff details
     */
    updateStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { name, email, phoneNumber, role } = req.body;
        const existingStaff = await database_1.prisma.admin.findUnique({
            where: { id: Number(id) }
        });
        if (!existingStaff) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Staff member not found');
        }
        // Check if email is being changed and if new email already exists
        if (email && email.toLowerCase() !== existingStaff.email) {
            const emailExists = await database_1.prisma.admin.findUnique({
                where: { email: email.toLowerCase() }
            });
            if (emailExists) {
                throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Email is already registered for another staff member.');
            }
        }
        const updatedStaff = await database_1.prisma.admin.update({
            where: { id: Number(id) },
            data: {
                name,
                email: email?.toLowerCase(),
                phoneNumber,
                role
            }
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Staff details updated successfully', updatedStaff));
    });
    /**
     * Reset staff password and force change on next login
     */
    resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const existingStaff = await database_1.prisma.admin.findUnique({
            where: { id: Number(id) }
        });
        if (!existingStaff) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Staff member not found');
        }
        // Generate a secure random password
        const temporaryPassword = crypto_1.default.randomBytes(6).toString('hex');
        const hashedPassword = await bcryptjs_1.default.hash(temporaryPassword, 10);
        await database_1.prisma.admin.update({
            where: { id: Number(id) },
            data: {
                password: hashedPassword,
                mustChangePassword: true
            }
        });
        // Send email with new temporary password
        (0, mail_1.sendStaffWelcomeEmail)(existingStaff.email, existingStaff.name, existingStaff.role, temporaryPassword).catch(err => {
            console.error('[StaffPasswordResetEmailError]:', err);
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Password reset successfully. A new temporary password has been sent to the staff member.', {
            temporaryPassword
        }));
    });
}
exports.StaffManagementController = StaffManagementController;
//# sourceMappingURL=staffManagementController.js.map