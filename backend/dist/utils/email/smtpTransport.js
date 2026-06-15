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
    if (config_1.config.email.host)
        return config_1.config.email.host;
    const user = config_1.config.email.user?.toLowerCase() ?? '';
    if (user.includes('@gmail.com') || user.includes('@googlemail.com')) {
        return 'smtp.gmail.com';
    }
    throw new Error('SMTP_HOST is required (e.g. smtp.gmail.com)');
};
const resolveIpv4 = async (hostname) => {
    const { address } = await dns_1.default.promises.lookup(hostname, { family: 4 });
    return address;
};
const createTransporterForPort = async (hostname, port) => {
    const { user, pass } = config_1.config.email;
    if (!user || !pass) {
        throw new Error('SMTP_USER and SMTP_PASS are required');
    }
    const connectHost = await resolveIpv4(hostname);
    const transporter = nodemailer_1.default.createTransport({
        host: connectHost,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: {
            minVersion: 'TLSv1.2',
            servername: hostname,
        },
        family: 4,
        connectionTimeout: 20000,
        greetingTimeout: 20000,
        socketTimeout: 20000,
    });
    return { transporter, hostname, connectHost, port };
};
/**
 * Try configured port, then 465 (SSL), then 587 (STARTTLS).
 * Connects via resolved IPv4 address with TLS SNI on the original hostname.
 */
const createVerifiedSmtpTransporter = async () => {
    const hostname = resolveSmtpHostname();
    const ports = [...new Set([config_1.config.email.port, 465, 587])];
    let lastError;
    for (const port of ports) {
        try {
            const result = await createTransporterForPort(hostname, port);
            await result.transporter.verify();
            return result;
        }
        catch (error) {
            lastError = error;
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[Email] SMTP ${hostname}:${port} failed — ${message}`);
        }
    }
    throw lastError ?? new Error('SMTP connection failed on all ports');
};
exports.createVerifiedSmtpTransporter = createVerifiedSmtpTransporter;
//# sourceMappingURL=smtpTransport.js.map