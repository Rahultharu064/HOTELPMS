import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export class AdminAuthController {
  /**
   * Admin Login with brute-force protection
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    if (!admin.isActive) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'Account is disabled');
    }

    // Check account lockout
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      throw new ApiError(
        HttpStatus.TOO_MANY_REQUESTS,
        'Account is temporarily locked due to too many failed attempts. Try again later.'
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      // Increment failed attempts
      const attempts = admin.loginAttempts + 1;
      let lockedUntil = admin.lockedUntil;

      // Lock account for 15 minutes after 5 failed attempts
      if (attempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: { loginAttempts: attempts, lockedUntil },
      });

      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    // Successful login - reset attempts and update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    const token = this.generateToken(admin.id, admin.role);

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        mustChangePassword: admin.mustChangePassword,
      },
    });
  });

  /**
   * Change Password (Staff Preference Reset)
   */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Current password provided is incorrect.');
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false, // Reset the flag
      },
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Password updated successfully. You can now access your workstation.')
    );
  });

  /**
   * Update Admin Avatar
   */
  updateAvatar = asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      
      if (!req.file) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'No file uploaded');
      }

      // Get the relative path for storage
      const avatarUrl = `/uploads/${req.file.filename}`;

      // Optional: Delete old avatar file
      const admin = await prisma.admin.findUnique({
        where: { id: userId },
        select: { avatar: true }
      });

      if (admin?.avatar) {
        // Remove the leading slash if it exists for path.join
        const relativePath = admin.avatar.startsWith('/') ? admin.avatar.substring(1) : admin.avatar;
        const oldPath = path.join(process.cwd(), relativePath);
        
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      await prisma.admin.update({
        where: { id: userId },
        data: { avatar: avatarUrl }
      });

      res.status(HttpStatus.OK).json(
        ApiResponse.success('Avatar updated successfully', { avatar: avatarUrl })
      );
    } catch (error) {
      console.error('Avatar Upload Error:', error);
      throw error;
    }
  });

  /**
   * Get Current Admin Details
   */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const admin = await prisma.admin.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        lastLogin: true,
        mustChangePassword: true,
      }
    });

    if (!admin) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    res.json(admin);
  });

  /**
   * Helper: Generate JWT
   */
  private generateToken(id: number, role: string): string {
    return jwt.sign({ id, role, type: 'admin' }, config.jwt.secret, {
      expiresIn: '8h', // Shorter expiration for admin
    });
  }
}
