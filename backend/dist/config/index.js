"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
    corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(o => o.trim()),
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-key',
        expire: process.env.JWT_EXPIRE || '7d',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
    },
    documentEncryptionKey: process.env.DOCUMENT_ENCRYPTION_KEY || 'default-enc-key',
    email: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    payment: {
        esewa: {
            merchantCode: process.env.ESEWA_MERCHANT_CODE || process.env.ESEWA_MERCHANT_ID,
            secretKey: process.env.ESEWA_SECRET_KEY,
        },
        khalti: {
            secretKey: process.env.KHALTI_SECRET_KEY,
        },
    },
};
//# sourceMappingURL=index.js.map