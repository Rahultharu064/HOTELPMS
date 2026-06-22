/** Render free/paid web services block outbound SMTP (ports 25, 465, 587). */
export declare const isSmtpBlockedHost: () => boolean;
export declare const isResendConfigured: () => boolean;
export declare const shouldUseResend: () => boolean;
export declare const canAttemptSmtp: () => boolean;
export declare function sendViaResend(to: string, subject: string, html: string): Promise<boolean>;
/**
 * Startup check for Resend.
 * Sending-only API keys return 401 on /domains — that is normal and valid.
 */
export declare function verifyResendConfig(): Promise<boolean>;
//# sourceMappingURL=resendProvider.d.ts.map