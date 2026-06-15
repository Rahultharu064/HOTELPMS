"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = validateEnvironment;
const config_1 = require("../config");
const INSECURE_JWT_SECRETS = new Set([
    'default-secret-key',
    'your-super-secret-jwt-key-change-this',
    'change-me',
]);
const DEV_ONLY_ENV_KEYS = [
    'ENABLE_DEV_AUTH_HELPERS',
    'DEV_GUEST_EMAIL',
    'DEV_ADMIN_EMAIL',
    'DEV_GUEST_PASSWORD',
    'DEV_ADMIN_PASSWORD',
    'DEV_BYPASS_OTP',
    'DEV_AUTO_VERIFY_GUEST',
];
function isEmailConfigured() {
    return Boolean(config_1.config.email.resendApiKey ||
        (config_1.config.email.user && config_1.config.email.pass));
}
function validateEnvironment() {
    if (config_1.config.isProduction) {
        for (const key of DEV_ONLY_ENV_KEYS) {
            if (process.env[key]) {
                console.warn(`⚠️ Production: ignoring ${key}. Remove dev-only variables from production environment.`);
            }
        }
        if (!config_1.config.databaseUrl) {
            throw new Error('DATABASE_URL is required in production.');
        }
        const jwtSecret = config_1.config.jwt.secret;
        if (!jwtSecret || jwtSecret.length < 32 || INSECURE_JWT_SECRETS.has(jwtSecret)) {
            throw new Error('JWT_SECRET must be set to a unique random string of at least 32 characters in production.');
        }
        if (!isEmailConfigured()) {
            throw new Error('Email is required in production: set SMTP_USER/SMTP_PASS or RESEND_API_KEY.');
        }
        if (config_1.config.corsOrigin.some((origin) => /localhost|127\.0\.0\.1/.test(origin))) {
            console.warn('⚠️ CORS_ORIGIN includes localhost in production. Restrict to your live frontend URL.');
        }
        console.log('✅ Production environment validation passed');
        return;
    }
    if (INSECURE_JWT_SECRETS.has(config_1.config.jwt.secret)) {
        console.warn('⚠️ Using default JWT_SECRET. Set a strong JWT_SECRET before deploying.');
    }
    if (!isEmailConfigured()) {
        console.warn('⚠️ SMTP not configured. OTP and password reset emails will fail outside dev helpers mode.');
    }
}
//# sourceMappingURL=validateEnv.js.map