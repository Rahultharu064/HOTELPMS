import nodemailer from 'nodemailer';
export type SmtpTransportResult = {
    transporter: nodemailer.Transporter;
    hostname: string;
    connectHost: string;
    port: number;
};
/**
 * Try configured port, then 465 (SSL), then 587 (STARTTLS).
 * Connects via resolved IPv4 address with TLS SNI on the original hostname.
 */
export declare const createVerifiedSmtpTransporter: () => Promise<SmtpTransportResult>;
//# sourceMappingURL=smtpTransport.d.ts.map