"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendOTPEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const transporter = nodemailer_1.default.createTransport({
    host: config_1.config.email.host,
    port: config_1.config.email.port,
    secure: config_1.config.email.port === 465,
    auth: {
        user: config_1.config.email.user,
        pass: config_1.config.email.pass,
    },
    // Shorter connection timeout so a bad network doesn't block the request for >30s
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
});
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Itahari Namuna Hotel" <${config_1.config.email.user}>`,
            to,
            subject,
            html,
        });
        console.log('Email sent: %s', info.messageId);
    }
    catch (error) {
        // Log but DO NOT rethrow — email failures should never crash the API
        console.error('Error sending email (non-fatal):', error);
    }
};
exports.sendEmail = sendEmail;
const sendOTPEmail = async (to, otp) => {
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
    await (0, exports.sendEmail)(to, subject, html);
};
exports.sendOTPEmail = sendOTPEmail;
const sendResetPasswordEmail = async (to, token) => {
    const origin = Array.isArray(config_1.config.corsOrigin) ? config_1.config.corsOrigin[0] : config_1.config.corsOrigin;
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
    await (0, exports.sendEmail)(to, subject, html);
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
//# sourceMappingURL=mail.js.map