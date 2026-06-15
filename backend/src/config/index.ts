import dotenv from 'dotenv';

dotenv.config();

// Sanitize CLOUDINARY_URL if it's invalid or if we have individual credentials
if (process.env.CLOUDINARY_URL) {
  if (!process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
    console.warn('⚠️ Invalid CLOUDINARY_URL detected. Removing from environment to prevent crash.');
    delete process.env.CLOUDINARY_URL;
  } else if (process.env.CLOUDINARY_CLOUD_NAME) {
    // If we have both, prefer individual vars to avoid confusion in production
    console.log('ℹ️ Individual Cloudinary variables provided. Using them instead of CLOUDINARY_URL.');
    delete process.env.CLOUDINARY_URL;
  }
}


export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  databaseUrl: process.env.DATABASE_URL || '',
  frontendUrl: (process.env.FRONTEND_URL || process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173').trim(),
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
    /** smtp | resend | auto (auto tries SMTP, falls back to Resend) */
    provider: (process.env.EMAIL_PROVIDER || 'auto').trim().toLowerCase() as 'smtp' | 'resend' | 'auto',
    host: process.env.SMTP_HOST?.trim(),
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    user: process.env.SMTP_USER?.trim().replace(/^["']|["']$/g, ''),
    pass: process.env.SMTP_PASS?.trim().replace(/^["']|["']$/g, '').replace(/\s+/g, ''),
    from: (process.env.SMTP_FROM || process.env.SMTP_USER)?.trim().replace(/^["']|["']$/g, ''),
    resendApiKey: process.env.RESEND_API_KEY?.trim(),
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
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    apiKey: process.env.CLOUDINARY_API_KEY?.trim(),
    apiSecret: process.env.CLOUDINARY_API_SECRET?.trim(),
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  },
  dev: {
    /** Dev shortcuts are opt-in and never run in production */
    helpersEnabled:
      process.env.NODE_ENV !== 'production'
      && process.env.ENABLE_DEV_AUTH_HELPERS === 'true',
    autoVerifyGuest:
      process.env.NODE_ENV !== 'production'
      && process.env.ENABLE_DEV_AUTH_HELPERS === 'true'
      && process.env.DEV_AUTO_VERIFY_GUEST !== 'false',
    exposeOtpInResponses:
      process.env.NODE_ENV !== 'production'
      && process.env.ENABLE_DEV_AUTH_HELPERS === 'true'
      && process.env.DEV_EXPOSE_OTP === 'true',
    bypassOtp: process.env.DEV_BYPASS_OTP || '000000',
    guestEmail: process.env.DEV_GUEST_EMAIL?.toLowerCase(),
    guestPassword: process.env.DEV_GUEST_PASSWORD || 'password123',
    adminEmail: process.env.DEV_ADMIN_EMAIL?.toLowerCase(),
    adminPassword: process.env.DEV_ADMIN_PASSWORD || 'admin123',
  },
} as const;