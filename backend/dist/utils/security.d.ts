/**
 * Encrypts a buffer using AES-256-GCM
 */
export declare const encryptFile: (data: Buffer) => Buffer;
/**
 * Decrypts a buffer using AES-256-GCM
 */
export declare const decryptFile: (data: Buffer) => Buffer;
/**
 * Validates if the string is a valid base64 image and doesn't exceed size limits
 */
export declare const validateBase64Image: (base64String: string, maxMB?: number) => {
    isValid: boolean;
    error?: string;
    mimeType?: string;
    buffer?: Buffer;
};
//# sourceMappingURL=security.d.ts.map