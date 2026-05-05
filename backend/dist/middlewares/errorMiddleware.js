"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const constants_1 = require("../constants");
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json(ApiResponse_1.ApiResponse.error(err.message, err.errors));
    }
    // Handle Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return res.status(constants_1.HttpStatus.CONFLICT).json(ApiResponse_1.ApiResponse.error(`Duplicate field: ${err.meta?.target}`));
            case 'P2025':
                return res.status(constants_1.HttpStatus.NOT_FOUND).json(ApiResponse_1.ApiResponse.error('Record not found'));
            default:
                return res.status(constants_1.HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse_1.ApiResponse.error('Database error occurred'));
        }
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(constants_1.HttpStatus.BAD_REQUEST).json(ApiResponse_1.ApiResponse.error(err.message));
    }
    // Default error
    const statusCode = res.statusCode !== 200 ? res.statusCode : constants_1.HttpStatus.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json(ApiResponse_1.ApiResponse.error(process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message));
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    const error = new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, `Route ${req.originalUrl} not found`);
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=errorMiddleware.js.map