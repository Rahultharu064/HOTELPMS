export type EmailProvider = 'smtp' | 'resend';
export declare const isEmailConfigured: () => boolean;
export declare const getActiveEmailProvider: () => EmailProvider | null;
/** Reset cached transport (e.g. after env change). */
export declare const resetEmailTransporter: () => void;
/** Verify email delivery capability on server startup. */
export declare const verifyEmailConfig: () => Promise<boolean>;
export declare const sendEmail: (to: string, subject: string, html: string) => Promise<boolean>;
export declare const sendOTPEmail: (to: string, otp: string) => Promise<boolean>;
export declare const sendResetPasswordEmail: (to: string, token: string) => Promise<boolean>;
export declare const sendBookingConfirmationEmail: (to: string, bookingDetails: any) => Promise<boolean>;
export declare const sendStaffWelcomeEmail: (to: string, staffName: string, role: string, temporaryPassword: string) => Promise<boolean>;
//# sourceMappingURL=mail.d.ts.map