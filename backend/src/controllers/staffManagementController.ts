import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import crypto from 'crypto';
import { sendStaffWelcomeEmail } from '../utils/mail';


export class StaffManagementController {
  /**
   * Create a new staff member with a random password
   */
  createStaff = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phoneNumber, role } = req.body;

    const existingUser = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new ApiError(HttpStatus.CONFLICT, 'Email is already registered for another staff member.');
    }

    // Generate a secure random password
    const temporaryPassword = crypto.randomBytes(6).toString('hex'); // 12 characters hex
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const staff = await prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase(),
        phoneNumber,
        role: role,
        password: hashedPassword,
        mustChangePassword: true, // Force reset on first login
        isActive: true
      }
    });
    // Send welcome email with credentials — non-blocking
    sendStaffWelcomeEmail(staff.email, staff.name, staff.role, temporaryPassword).catch(err => {
      console.error('[StaffWelcomeEmailError]:', err);
    });



    // In a real production app, we would send this via email.
    // For this project, we return it so the admin can copy it.
    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Staff account created successfully', {
        staff: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role
        },
        temporaryPassword // CRITICAL: Only return this once upon creation
      })
    );
  });

  /**
   * Get all staff members
   */
  getAllStaff = asyncHandler(async (req: Request, res: Response) => {
    const staff = await prisma.admin.findMany({
      where: {
        role: {
          in: ['admin', 'manager', 'front_office', 'housekeeping']
        }

      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Staff records retrieved', staff)
    );
  });

  /**
   * Toggle staff active status
   */
  toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    await prisma.admin.update({
      where: { id: Number(id) },
      data: { isActive }
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success(`Staff account ${isActive ? 'activated' : 'deactivated'} successfully`)
    );
  });

  /**
   * Update staff details
   */
  updateStaff = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phoneNumber, role } = req.body;

    const existingStaff = await prisma.admin.findUnique({
      where: { id: Number(id) }
    });

    if (!existingStaff) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Staff member not found');
    }

    // Check if email is being changed and if new email already exists
    if (email && email.toLowerCase() !== existingStaff.email) {
      const emailExists = await prisma.admin.findUnique({
        where: { email: email.toLowerCase() }
      });
      if (emailExists) {
        throw new ApiError(HttpStatus.CONFLICT, 'Email is already registered for another staff member.');
      }
    }

    const updatedStaff = await prisma.admin.update({
      where: { id: Number(id) },
      data: {
        name,
        email: email?.toLowerCase(),
        phoneNumber,
        role
      }
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Staff details updated successfully', updatedStaff)
    );
  });

  /**
   * Reset staff password and force change on next login
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existingStaff = await prisma.admin.findUnique({
      where: { id: Number(id) }
    });

    if (!existingStaff) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Staff member not found');
    }

    // Generate a secure random password
    const temporaryPassword = crypto.randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    await prisma.admin.update({
      where: { id: Number(id) },
      data: {
        password: hashedPassword,
        mustChangePassword: true
      }
    });

    // Send email with new temporary password
    sendStaffWelcomeEmail(existingStaff.email, existingStaff.name, existingStaff.role, temporaryPassword).catch(err => {
      console.error('[StaffPasswordResetEmailError]:', err);
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Password reset successfully. A new temporary password has been sent to the staff member.', {
        temporaryPassword
      })
    );
  });
}
