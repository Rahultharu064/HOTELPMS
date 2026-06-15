"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
const cloudinary_1 = require("../config/cloudinary");
const fileFilter = (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage: cloudinary_1.cloudinaryStorage,
    fileFilter,
    limits: {
        fileSize: config_1.config.maxFileSize,
    },
});
//# sourceMappingURL=uploadMiddleware.js.map