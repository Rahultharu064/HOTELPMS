"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAttemptSmtp = exports.shouldUseResend = exports.isResendConfigured = exports.isSmtpBlockedHost = void 0;
exports.sendViaResend = sendViaResend;
exports.verifyResendConfig = verifyResendConfig;
const config_1 = require("../../config");
const RESEND_USER_AGENT = 'HOTELPMS/1.0 (https://hotelpms-three.vercel.app)';
/** Render free/paid web services block outbound SMTP (ports 25, 465, 587). */
const isSmtpBlockedHost = () => config_1.config.isRender || config_1.config.isProduction;
exports.isSmtpBlockedHost = isSmtpBlockedHost;
const isResendConfigured = () => Boolean(config_1.config.email.resendApiKey);
exports.isResendConfigured = isResendConfigured;
const shouldUseResend = () => {
    if (!(0, exports.isResendConfigured)())
        return false;
    if (config_1.config.email.provider === 'resend')
        return true;
    if (config_1.config.email.provider === 'smtp' && !(0, exports.isSmtpBlockedHost)())
        return false;
    return true;
};
exports.shouldUseResend = shouldUseResend;
const canAttemptSmtp = () => !(0, exports.isSmtpBlockedHost)()
    && config_1.config.email.provider !== 'resend'
    && Boolean(config_1.config.email.user && config_1.config.email.pass);
exports.canAttemptSmtp = canAttemptSmtp;
const isValidResendKeyFormat = (apiKey) => /^re_[A-Za-z0-9_]+$/.test(apiKey) && apiKey.length >= 20;
const resendHeaders = (apiKey) => ({
    Authorization: `Bearer ${apiKey}`,
    'User-Agent': RESEND_USER_AGENT,
});
/** Resend sandbox sender — works without domain verification (testing only). */
const RESEND_SANDBOX_FROM = 'Itahari Namuna Hotel <onboarding@resend.dev>';
const resolveResendFrom = () => {
    const fromAddress = (config_1.config.email.from || '').trim();
    if (!fromAddress)
        return RESEND_SANDBOX_FROM;
    if (fromAddress.includes('<'))
        return fromAddress;
    // Gmail/Yahoo etc. cannot be used as Resend "from" until you verify that domain in Resend
    const domain = fromAddress.split('@')[1]?.toLowerCase() ?? '';
    const freeMailDomains = ['gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    if (freeMailDomains.includes(domain)) {
        return RESEND_SANDBOX_FROM;
    }
    return `Itahari Namuna Hotel <${fromAddress}>`;
};
async function sendViaResend(to, subject, html) {
    const apiKey = config_1.config.email.resendApiKey;
    if (!apiKey)
        return false;
    const from = resolveResendFrom();
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                ...resendHeaders(apiKey),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [to],
                subject,
                html,
            }),
        });
        if (!response.ok) {
            const body = await response.text();
            console.error(`[ResendError] ${response.status}: ${body}`);
            if (response.status === 403 && body.includes('verify')) {
                console.error('[Resend] Tip: set SMTP_FROM=onboarding@resend.dev or verify your domain at https://resend.com/domains');
            }
            return false;
        }
        const data = (await response.json());
        console.log(`📧 Email sent via Resend to ${to}: ${data.id ?? 'ok'}`);
        return true;
    }
    catch (error) {
        console.error(`[ResendError] Failed to send to ${to}:`, error);
        return false;
    }
}
/**
 * Startup check for Resend.
 * Sending-only API keys return 401 on /domains — that is normal and valid.
 */
async function verifyResendConfig() {
    const apiKey = config_1.config.email.resendApiKey;
    if (!apiKey)
        return false;
    if (!isValidResendKeyFormat(apiKey)) {
        console.error('❌ RESEND_API_KEY format is invalid.');
        console.error('   Keys must start with re_ and come from https://resend.com/api-keys');
        console.error('   On Render: paste the key with no quotes or spaces.');
        return false;
    }
    try {
        const response = await fetch('https://api.resend.com/domains', {
            headers: resendHeaders(apiKey),
        });
        if (response.ok) {
            return true;
        }
        const body = await response.text();
        // Sending-only keys are valid — they cannot list domains (401 restricted_api_key)
        if (response.status === 401 &&
            (body.includes('restricted') || body.includes('only send') || body.includes('missing_api_key') === false)) {
            console.log('✅ Resend API key OK (sending permission — correct for OTP emails)');
            return true;
        }
        if (response.status === 401 && body.includes('missing_api_key')) {
            console.error('❌ RESEND_API_KEY missing in Authorization. Check Render Environment variable name.');
            return false;
        }
        if (response.status === 401) {
            // Unknown 401 — still allow if format valid (key may be new/restricted)
            console.warn('⚠️ Resend domains check returned 401 — treating sending-only key as valid.');
            console.warn(`   Detail: ${body.slice(0, 200)}`);
            return true;
        }
        if (response.status === 403) {
            console.log('✅ Resend API key accepted');
            return true;
        }
        console.warn(`⚠️ Resend probe returned ${response.status} — continuing with configured key.`);
        return true;
    }
    catch (error) {
        console.warn('⚠️ Could not reach Resend API at startup — emails will retry on send:', error);
        return true;
    }
}
//# sourceMappingURL=resendProvider.js.map