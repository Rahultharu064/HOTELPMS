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
                    in: ['front_office', 'housekeeping', 'manager']
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
}
exports.StaffManagementController = StaffManagementController;
//# sourceMappingURL=staffManagementController.js.map