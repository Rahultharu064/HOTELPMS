import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/database';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { asyncHandler } from '../utils/asyncHandler';
import { sendOTPEmail, sendResetPasswordEmail } from '../utils/mail';
import { v4 as uuidv4 } from 'uuid';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  private buildOtpResponse(email: string, otp: string, emailSent: boolean) {
    const payload: Record<string, unknown> = {
      message: emailSent
        ? 'Registration successful. Please verify your email with the OTP sent.'
        : 'Registration successful, but the verification email could not be sent. Use resend OTP or contact support.',
      email,
      emailSent,
    };

    if (config.nodeEnv === 'development') {
      payload.otp = otp;
    }

    return payload;
  }

  private async sendOtpOrFail(email: string, otp: string, context: string): Promise<boolean> {
    const sent = await sendOTPEmail(email, otp);
    if (sent) return true;

    console.error(`[${context}] Failed to send OTP email to ${email}`);

    if (config.nodeEnv === 'development') {
      console.warn(`[DevMode] OTP for ${email}: ${otp}`);
      return false;
    }

    throw new ApiError(
      HttpStatus.SERVICE_UNAVAILABLE,
      'Unable to send verification email. Please try again in a few minutes.'
    );
  }

  /**
   * Register a new guest (requires OTP verification)
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, phone, password, firstName, lastName } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.guest.findFirst({
      where: { OR: [{ email: normalizedEmail }, { phone }] },
    });

    if (existingUser) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Email or phone already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.guest.create({
      data: {
        email: normalizedEmail,
        phone,
        password: hashedPassword,
        firstName,
        lastName,
        otp,
        otpExpires,
        isVerified: false,
      },
    });

    // Send OTP email
    const emailSent = await this.sendOtpOrFail(normalizedEmail, otp, 'RegistrationEmailError');

    res.status(HttpStatus.CREATED).json(this.buildOtpResponse(normalizedEmail, otp, emailSent));
  });

  /**
   * Login guest (only if verified)
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const guest = await prisma.guest.findUnique({
      where: { email: normalizedEmail },
    });

    if (!guest || !guest.password) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    if (!guest.isVerified) {
      // If not verified, resend OTP and tell them to verify
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.guest.update({
        where: { id: guest.id },
        data: { otp, otpExpires },
      });

      await this.sendOtpOrFail(guest.email, otp, 'LoginResendOTPError');

      throw new ApiError(HttpStatus.FORBIDDEN, 'Account not verified. A new OTP has been sent to your email.');
    }

    const isMatch = await bcrypt.compare(password, guest.password);
    if (!isMatch) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const token = this.generateToken(guest.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: guest.id,
        email: guest.email,
        firstName: guest.firstName,
        lastName: guest.lastName,
      },
    });
  });

  /**
   * Verify OTP and Login (Used after registration or if requested)
   */
  verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase();

    const guest = await prisma.guest.findUnique({
      where: { email: normalizedEmail },
    });

    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'No account found with this email');
    }

    // If already verified, just login (handles double clicks/refreshes)
    if (guest.isVerified) {
      const token = this.generateToken(guest.id);
      return res.json({
        message: 'Email already verified',
        token,
        user: {
          id: guest.id,
          email: guest.email,
          firstName: guest.firstName,
          lastName: guest.lastName,
        },
      });
    }

    if (guest.otp !== otp) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid verification code');
    }

    if (guest.otpExpires && guest.otpExpires < new Date()) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Verification code has expired. Please request a new one.');
    }

    // Mark as verified and clear OTP
    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: { otp: null, otpExpires: null, isVerified: true },
    });

    const token = this.generateToken(updatedGuest.id);

    return res.json({
      message: 'Verification successful',
      token,
      user: {
        id: updatedGuest.id,
        email: updatedGuest.email,
        firstName: updatedGuest.firstName,
        lastName: updatedGuest.lastName,
      },
    });
  });

  /**
   * Resend OTP
   */
  resendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const guest = await prisma.guest.findUnique({
      where: { email: normalizedEmail },
    });

    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Guest not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.guest.update({
      where: { id: guest.id },
      data: { otp, otpExpires },
    });

    const emailSent = await this.sendOtpOrFail(normalizedEmail, otp, 'ResendOTPError');

    const payload: Record<string, unknown> = {
      message: emailSent
        ? 'A new OTP has been sent to your email'
        : 'OTP regenerated, but email delivery failed. Try again shortly.',
      emailSent,
    };

    if (config.nodeEnv === 'development') {
      payload.otp = otp;
    }

    res.json(payload);
  });

  /**
   * Forgot Password
   */
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const guest = await prisma.guest.findUnique({
      where: { email: normalizedEmail },
    });

    if (!guest) {
      // Don't reveal if user exists for security, but user requested professional code
      // and usually for guests it's better to tell them
      throw new ApiError(HttpStatus.NOT_FOUND, 'If an account exists with this email, a reset link will be sent.');
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.guest.update({
      where: { id: guest.id },
      data: { resetToken, resetTokenExpires },
    });

    const emailSent = await sendResetPasswordEmail(normalizedEmail, resetToken);

    if (!emailSent && config.nodeEnv !== 'development') {
      throw new ApiError(
        HttpStatus.SERVICE_UNAVAILABLE,
        'Unable to send password reset email. Please try again later.'
      );
    }

    res.json({
      message: emailSent
        ? 'Password reset link sent to your email'
        : 'Password reset prepared, but email delivery failed. Check SMTP configuration.',
      emailSent,
    });
  });

  /**
   * Reset Password
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    const guest = await prisma.guest.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!guest) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.guest.update({
      where: { id: guest.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.json({ message: 'Password has been reset successfully' });
  });

  /**
   * Professional Google Login
   */
  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { tokenId } = req.body;

    if (!tokenId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Google Token is required');
    }

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid Google token payload');
      }

      const { email, sub: googleId, given_name, family_name, picture } = payload;
      const normalizedEmail = email.toLowerCase();

      // Find user by Google ID or Email
      let guest = await prisma.guest.findFirst({
        where: {
          OR: [
            { googleId },
            { email: normalizedEmail }
          ]
        },
      });

      if (!guest) {
        // Create new guest if doesn't exist
        guest = await prisma.guest.create({
          data: {
            email: normalizedEmail,
            googleId,
            firstName: given_name || 'Guest',
            lastName: family_name || '',
            profileImage: picture, // Sync profile picture from Google
            isVerified: true,
            // phone is now optional in schema
          },
        });
      } else {
        // Update existing guest with Google ID and sync profile picture if missing
        const updateData: any = { isVerified: true };
        
        if (!guest.googleId) updateData.googleId = googleId;
        if (!guest.profileImage) updateData.profileImage = picture;

        guest = await prisma.guest.update({
          where: { id: guest.id },
          data: updateData,
        });
      }

      const token = this.generateToken(guest.id);

      res.json({
        message: 'Signed in successfully via Google',
        token,
        user: {
          id: guest.id,
          email: guest.email,
          firstName: guest.firstName,
          lastName: guest.lastName,
          profileImage: guest.profileImage,
        },
      });
    } catch (error: any) {
      console.error('[GoogleLoginError]:', error);
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Failed to authenticate with Google');
    }
  });

  /**
   * Get Current Guest Details
   */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const guest = await prisma.guest.findUnique({
      where: { id: userId },
      include: {
        bookings: {
          include: {
            room: true,
            payments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    res.json(guest);
  });

  /**
   * Update Profile Image
   */
  updateProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const file = req.file;

    if (!userId) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'User context missing');
    }

    if (!file) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'No image file provided or upload failed');
    }

    try {
      const profileImage = file.path; // Cloudinary URL

      await prisma.guest.update({
        where: { id: userId },
        data: { profileImage },
      });

      res.json({ 
        success: true,
        message: 'Profile image updated', 
        profileImage 
      });
    } catch (error) {
      console.error('[ProfileImageUpdateError]:', error);
      throw error;
    }
  });

  /**
   * Update Profile Details
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { firstName, lastName, phone, address, city, country, postalCode } = req.body;

    const guest = await prisma.guest.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        address,
        city,
        country,
        postalCode,
      },
    });

    res.json({ message: 'Profile updated successfully', guest });
  });

  /**
   * Passport Google Auth Callback
   */
  passportGoogleCallback = asyncHandler(async (req: Request, res: Response) => {
    const guest = (req as any).user;
    if (!guest) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authentication failed');
    }

    const token = this.generateToken(guest.id);
    
    // Redirect securely back to the production frontend
    const frontendUrl = 'https://hotelpms-three.vercel.app';
      
    res.redirect(`${frontendUrl}/login-success?token=${token}`);
  });

  /**
   * Helper: Generate JWT
   */
  public generateToken(id: number): string {
    return jwt.sign({ id }, config.jwt.secret as string, {
      expiresIn: config.jwt.expire,
    } as jwt.SignOptions);
  }
}

