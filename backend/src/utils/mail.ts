import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  // Shorter connection timeout so a bad network doesn't block the request for >30s
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"Itahari Namuna Hotel" <${config.email.user}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    // Log but DO NOT rethrow — email failures should never crash the API
    console.error('Error sending email (non-fatal):', error);
  }
};

export const sendOTPEmail = async (to: string, otp: string): Promise<void> => {
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
  await sendEmail(to, subject, html);
};

export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const origin = Array.isArray(config.corsOrigin) ? config.corsOrigin[0] : config.corsOrigin;
  const resetUrl = `${origin}/reset-password?token=${token}`;
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
  await sendEmail(to, subject, html);
};
