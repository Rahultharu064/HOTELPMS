import { config } from '../config';
import { createVerifiedSmtpTransporter, type SmtpTransportResult } from './email/smtpTransport';
import { isResendConfigured, sendViaResend } from './email/resendProvider';

export type EmailProvider = 'smtp' | 'resend';

let smtpSession: SmtpTransportResult | null = null;
let activeProvider: EmailProvider | null = null;

export const isEmailConfigured = (): boolean =>
  isResendConfigured() || Boolean(config.email.user && config.email.pass);

export const getActiveEmailProvider = (): EmailProvider | null => activeProvider;

/** Reset cached transport (e.g. after env change). */
export const resetEmailTransporter = (): void => {
  smtpSession = null;
  activeProvider = null;
};

const preferResend = (): boolean => {
  if (!isResendConfigured()) return false;
  if (config.email.provider === 'resend') return true;
  if (config.email.provider === 'smtp') return false;
  // auto: Resend in production (Render blocks SMTP), SMTP in local dev
  return config.isProduction;
};

const initializeSmtp = async (): Promise<SmtpTransportResult> => {
  if (smtpSession) return smtpSession;
  smtpSession = await createVerifiedSmtpTransporter();
  activeProvider = 'smtp';
  return smtpSession;
};

/** Verify email delivery capability on server startup. */
export const verifyEmailConfig = async (): Promise<boolean> => {
  if (!isEmailConfigured()) {
    console.warn('⚠️ Email service disabled: configure SMTP or RESEND_API_KEY in backend/.env');
    return false;
  }

  if (preferResend()) {
    activeProvider = 'resend';
    console.log('✅ Email service ready (Resend HTTP API — recommended for Render)');
    return true;
  }

  try {
    const session = await initializeSmtp();
    console.log(
      `✅ Email service ready (SMTP ${session.hostname}:${session.port} via IPv4 ${session.connectHost} as ${config.email.user})`
    );
    return true;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    console.error('❌ Email service verification failed:', error);

    if (err.code === 'ENETUNREACH' || err.code === 'ESOCKET') {
      console.error('   Cause: IPv6 route unreachable or SMTP port blocked by host.');
      console.error('   Fix: set RESEND_API_KEY + EMAIL_PROVIDER=resend on Render (free tier blocks SMTP).');
      console.error('   Or upgrade Render to a paid instance and use SMTP_PORT=465.');
    } else if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
      console.error('   Cause: SMTP port timeout — Render free tier blocks ports 25/465/587.');
      console.error('   Fix: use Resend (RESEND_API_KEY) or upgrade Render plan.');
    }

    if (isResendConfigured()) {
      activeProvider = 'resend';
      console.warn('⚠️ SMTP unavailable — falling back to Resend HTTP API');
      return true;
    }

    console.error('   Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in environment.');
    console.error('   Gmail: App Password required — https://support.google.com/accounts/answer/185833');
    return false;
  }
};

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  if (!isEmailConfigured()) {
    console.error('[EmailError] Email not configured — set SMTP or RESEND_API_KEY');
    return false;
  }

  if (activeProvider === 'resend' || (preferResend() && isResendConfigured())) {
    return sendViaResend(to, subject, html);
  }

  try {
    const session = smtpSession ?? (await initializeSmtp());
    const info = await session.transporter.sendMail({
      from: `"Itahari Namuna Hotel" <${config.email.from}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent via SMTP to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EmailError] SMTP failed for ${to}:`, error);

    if (isResendConfigured()) {
      console.warn('[Email] Retrying via Resend HTTP API...');
      const sent = await sendViaResend(to, subject, html);
      if (sent) activeProvider = 'resend';
      return sent;
    }

    return false;
  }
};

export const sendOTPEmail = async (to: string, otp: string): Promise<boolean> => {
  const subject = 'Your OTP Code - Itahari Namuna Hotel';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #14532D; text-align: center;">Itahari Namuna Hotel</h2>
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #14532D; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Itahari Namuna Hotel. All rights reserved.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendResetPasswordEmail = async (to: string, token: string): Promise<boolean> => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
  const subject = 'Reset Your Password - Itahari Namuna Hotel';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #14532D; text-align: center;">Itahari Namuna Hotel</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #14532D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>Or copy this link: <a href="${resetUrl}" style="color: #14532D;">${resetUrl}</a></p>
      <p>This link expires in <strong>1 hour</strong>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Itahari Namuna Hotel. All rights reserved.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendBookingConfirmationEmail = async (to: string, bookingDetails: any): Promise<boolean> => {
  const subject = `Booking Confirmed - ${bookingDetails.bookingNumber}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #14532D 0%, #1F7A3A 100%); padding: 40px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Booking Confirmed!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Thank you for choosing Itahari Namuna Hotel</p>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">Hello <strong>${bookingDetails.guest.firstName}</strong>,</p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Your reservation has been successfully received and confirmed. We are looking forward to welcoming you!</p>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #f1f5f9;">
          <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Reservation Summary</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Booking Number:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${bookingDetails.bookingNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Room Type:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${bookingDetails.room.roomType.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-in:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${new Date(bookingDetails.checkIn).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Check-out:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${new Date(bookingDetails.checkOut).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 16px 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 700; border-top: 1px solid #e2e8f0;">Total Amount:</td>
              <td style="padding: 16px 0 8px 0; color: #14532D; font-size: 18px; font-weight: 800; text-align: right; border-top: 1px solid #e2e8f0;">Rs. ${bookingDetails.totalAmount}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="${config.frontendUrl}/profile" style="background-color: #14532D; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">View Your Booking</a>
        </div>
      </div>
      
      <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 14px; color: #64748b;">Need help? Contact us at info@itaharinamuna.edu.np</p>
        <div style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
          &copy; 2026 Itahari Namuna Hotel. All rights reserved.
        </div>
      </div>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendStaffWelcomeEmail = async (
  to: string,
  staffName: string,
  role: string,
  temporaryPassword: string
): Promise<boolean> => {
  const loginUrl = `${config.frontendUrl}/admin/login`;
  const subject = 'Welcome to the Team - Itahari Namuna Hotel';
  const roleDisplay = role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #14532D 0%, #1F7A3A 100%); padding: 40px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Welcome to ITNAMUNA</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Staff Portal Invitation</p>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">Hello <strong>${staffName}</strong>,</p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Your staff account has been created for the <strong>${roleDisplay}</strong> department at Itahari Namuna Hotel.</p>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #f1f5f9;">
          <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Your Login Credentials</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email/Username:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${to}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Temporary Password:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right; background: #fff; border: 1px dashed #cbd5e1; padding: 4px 8px;">${temporaryPassword}</td>
            </tr>
          </table>
          <p style="margin: 16px 0 0 0; font-size: 12px; color: #ef4444; font-weight: 600;">You will be required to change this password upon your first login.</p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="${loginUrl}" style="background-color: #14532D; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">Access Staff Portal</a>
        </div>
      </div>
      
      <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 13px; color: #64748b;">This is an automated system message. Please do not reply.</p>
        <div style="margin-top: 20px; font-size: 11px; color: #94a3b8;">
          &copy; 2026 Itahari Namuna Hotel PMS &bull; Security & Performance
        </div>
      </div>
    </div>
  `;
  return sendEmail(to, subject, html);
};
