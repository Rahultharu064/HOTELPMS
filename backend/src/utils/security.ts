import crypto from 'crypto';
import { config } from '../config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a buffer using AES-256-GCM
 */
export const encryptFile = (data: Buffer): Buffer => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.scryptSync(config.documentEncryptionKey, 'salt', 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  // Return IV + AuthTag + Encrypted Data
  return Buffer.concat([iv, authTag, encrypted]);
};

/**
 * Decrypts a buffer using AES-256-GCM
 */
export const decryptFile = (data: Buffer): Buffer => {
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const key = crypto.scryptSync(config.documentEncryptionKey, 'salt', 32);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};

/**
 * Validates if the string is a valid base64 image and doesn't exceed size limits
 */
export const validateBase64Image = (base64String: string, maxMB: number = 5): { isValid: boolean; error?: string; mimeType?: string; buffer?: Buffer } => {
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
