import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Antigravity Hotel" <${config.email.user}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendOTPEmail = async (to: string, otp: string) => {
  const subject = 'Your Login OTP - Antigravity Hotel';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Antigravity Hotel</h2>
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for login is:</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4A90E2; border-radius: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Antigravity Hotel. All rights reserved.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const resetUrl = `${config.corsOrigin}/reset-password?token=${token}`;
  const subject = 'Reset Your Password - Antigravity Hotel';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Antigravity Hotel</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Please click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #4A90E2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #4A90E2;">${resetUrl}</p>
      <p>This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Antigravity Hotel. All rights reserved.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};
