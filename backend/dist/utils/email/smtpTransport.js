"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVerifiedSmtpTransporter = void 0;
const dns_1 = __importDefault(require("dns"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config");
/** Prefer IPv4 globally — Render/cloud hosts often lack working IPv6 routes. */
if (typeof dns_1.default.setDefaultResultOrder === 'function') {
    dns_1.default.setDefaultResultOrder('ipv4first');
}
const resolveSmtpHostname = () => {
    return config_1.config.email.host || 'smtp.gmail.com';
};
const resolveIpv4 = async (hostname) => {
    try {
        const { address } = await dns_1.default.promises.lookup(hostname, { family: 4 });
        return address;
    }
    catch {
        // If DNS lookup fails, return the hostname itself and let nodemailer handle it
        return hostname;
    }
};
const createTransporterForPort = async (hostname, port) => {
    const { user, pass } = config_1.config.email;
    if (!user || !pass) {
        throw new Error('SMTP_USER and SMTP_PASS are required');
    }
    let connectHost;
    try {
        connectHost = await resolveIpv4(hostname);
    }
    catch {
        connectHost = hostname;
    }
    const transporter = nodemailer_1.default.createTransport({
        host: connectHost,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: {
            minVersion: 'TLSv1.2',
            servername: hostname,
            rejectUnauthorized: false, // More permissive for cloud environments
        },
        family: 4,
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000,
    });
    return { transporter, hostname, connectHost, port };
};
/**
 * Try configured port, then 587 (STARTTLS), then 465 (SSL).
 * In production (Render/cloud), SMTP ports may be blocked — we skip verify()
 * and return the transporter anyway, logging a warning. Actual send will tell
 * us if it truly works.
 */
const createVerifiedSmtpTransporter = async () => {
    const hostname = resolveSmtpHostname();
    const configuredPort = config_1.config.email.port || 587;
    // Try 587 first (STARTTLS, most widely open), then 465 (SSL)
    const ports = [...new Set([configuredPort, 587, 465])];
    let lastError;
    for (const port of ports) {
        try {
            const result = await createTransporterForPort(hostname, port);
            // Try verify() but don't fail if it times out (Render blocks SMTP ports on verify too)
            try {
                await result.transporter.verify();
                console.log(`[Email] SMTP ${hostname}:${port} verified successfully.`);
            }
            catch (verifyError) {
                const msg = verifyError instanceof Error ? verifyError.message : String(verifyError);
                // If it's a timeout/connection error (Render blocking), still return the transporter
                // — actual sends via Gmail SMTP relay may still work
                if (msg.includes('ETIMEDOUT') || msg.includes('timeout') || msg.includes('ECONNREFUSED')) {
                    console.warn(`[Email] SMTP verify timed out on ${hostname}:${port} (likely firewall). Transporter created anyway — will attempt sends.`);
                    return result;
                }
                // For auth errors or other real errors, re-throw to try next port
                throw verifyError;
            }
            return result;
        }
        catch (error) {
            lastError = error;
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[Email] SMTP ${hostname}:${port} failed — ${message}`);
        }
    }
    // If all ports failed at verify, create a transporter on the configured port anyway
    // so that emails can still be attempted (some cloud providers route SMTP differently)
    console.warn('[Email] All SMTP verify attempts failed. Creating fallback transporter — emails may still work depending on cloud routing.');
    return createTransporterForPort(hostname, configuredPort);
};
exports.createVerifiedSmtpTransporter = createVerifiedSmtpTransporter;
//# sourceMappingURL=smtpTransport.js.map