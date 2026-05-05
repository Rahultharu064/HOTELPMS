"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBase64Image = exports.decryptFile = exports.encryptFile = void 0;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
/**
 * Encrypts a buffer using AES-256-GCM
 */
const encryptFile = (data) => {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const key = crypto_1.default.scryptSync(config_1.config.documentEncryptionKey, 'salt', 32);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Return IV + AuthTag + Encrypted Data
    return Buffer.concat([iv, authTag, encrypted]);
};
exports.encryptFile = encryptFile;
/**
 * Decrypts a buffer using AES-256-GCM
 */
const decryptFile = (data) => {
    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const key = crypto_1.default.scryptSync(config_1.config.documentEncryptionKey, 'salt', 32);
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};
exports.decryptFile = decryptFile;
/**
 * Validates if the string is a valid base64 image and doesn't exceed size limits
 */
const validateBase64Image = (base64String, maxMB = 5) => {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return { isValid: false, error: 'Invalid document format. Please upload a valid image file.' };
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    // Validate MIME type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedMimeTypes.includes(mimeType)) {
        return { isValid: false, error: 'Unsupported file type. Please upload JPG, PNG, or WEBP images.' };
    }
    // Validate Size
    const buffer = Buffer.from(base64Data, 'base64');
    const sizeInBytes = buffer.length;
    if (sizeInBytes > maxMB * 1024 * 1024) {
        return { isValid: false, error: `File is too large. Maximum size is ${maxMB}MB.` };
    }
    return { isValid: true, mimeType, buffer };
};
exports.validateBase64Image = validateBase64Image;
//# sourceMappingURL=security.js.map