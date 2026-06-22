"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = validateEnvironment;
const config_1 = require("../config");
const INSECURE_JWT_SECRETS = new Set([
    'default-secret-key',
    'your-super-secret-jwt-key-change-this',
    'replace-with-a-long-random-secret-at-least-32-chars',
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
    if (config_1.config.isRender || config_1.config.isProduction) {
        return Boolean(config_1.config.email.resendApiKey);
    }
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
            throw new Error([
                'JWT_SECRET is missing or insecure in production.',
                'On Render: Dashboard → your service → Environment → add',
                '  JWT_SECRET=<random string, at least 32 characters>',
                'Generate one locally: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
                'Do not use placeholder values from .env.example.',
            ].join('\n'));
        }
        if (!isEmailConfigured()) {
            const hint = config_1.config.isRender || config_1.config.isProduction
                ? [
                    'Email is required in production on Render.',
                    'Gmail SMTP does NOT work on Render (ports 465/587 blocked).',
                    'Add to Render Environment:',
                    '  RESEND_API_KEY=re_xxxx  (from https://resend.com/api-keys)',
                    '  EMAIL_PROVIDER=resend',
                    '  SMTP_FROM=onboarding@resend.dev  (or your verified domain)',
                ].join('\n')
                : 'Email is required in production: set RESEND_API_KEY or SMTP_USER/SMTP_PASS.';
            throw new Error(hint);
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