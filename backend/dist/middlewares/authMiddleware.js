"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const database_1 = require("../config/database");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Please authenticate');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        if (decoded.type && decoded.type !== 'guest') {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, 'Invalid token type. Guest access required.');
        }
        const guest = await database_1.prisma.guest.findUnique({
            where: { id: decoded.id },
        });
        if (!guest) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'User not found');
        }
        if (config_1.config.isProduction && !guest.isVerified) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.FORBIDDEN, 'Email verification required');
        }
        req.user = {
            id: guest.id,
            email: guest.email,
            role: 'guest',
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new ApiError_1.ApiError(constants_1.HttpStatus.UNAUTHORIZED, 'Invalid token'));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authMiddleware.js.map