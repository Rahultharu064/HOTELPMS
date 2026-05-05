"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.requireSuperAdmin = exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const database_1 = require("../config/database");
const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Authentication required');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        if (decoded.type !== 'admin') {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, 'Invalid token type. Admin access required.');
        }
        const admin = await database_1.prisma.admin.findUnique({
            where: { id: decoded.id },
        });
        if (!admin || !admin.isActive) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Admin user not found or inactive');
        }
        req.user = {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            type: 'admin'
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid or expired admin token'));
        }
        else {
            next(error);
        }
    }
};
exports.authenticateAdmin = authenticateAdmin;
const requireSuperAdmin = (req, res, next) => {
    if (req.user?.role !== 'superadmin') {
        return next(new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, 'SuperAdmin privileges required'));
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
/**
 * Authorize multiple roles
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, `Access denied. Requires one of these roles: ${roles.join(', ')}`));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=adminAuthMiddleware.js.map