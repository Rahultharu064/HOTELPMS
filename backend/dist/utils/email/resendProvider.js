"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isResendConfigured = void 0;
exports.sendViaResend = sendViaResend;
const config_1 = require("../../config");
const isResendConfigured = () => Boolean(config_1.config.email.resendApiKey);
exports.isResendConfigured = isResendConfigured;
async function sendViaResend(to, subject, html) {
    const apiKey = config_1.config.email.resendApiKey;
    if (!apiKey)
        return false;
    const fromAddress = config_1.config.email.from || config_1.config.email.user || 'onboarding@resend.dev';
    const from = fromAddress.includes('<')
        ? fromAddress
        : `Itahari Namuna Hotel <${fromAddress}>`;
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
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
//# sourceMappingURL=resendProvider.js.map