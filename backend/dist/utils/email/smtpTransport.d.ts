import nodemailer from 'nodemailer';
export type SmtpTransportResult = {
    transporter: nodemailer.Transporter;
    hostname: string;
    connectHost: string;
    port: number;
};
/**
 * Try configured port, then 587 (STARTTLS), then 465 (SSL).
 * In production (Render/cloud), SMTP ports may be blocked — we skip verify()
 * and return the transporter anyway, logging a warning. Actual send will tell
 * us if it truly works.
 */
export declare const createVerifiedSmtpTransporter: () => Promise<SmtpTransportResult>;
//# sourceMappingURL=smtpTransport.d.ts.map