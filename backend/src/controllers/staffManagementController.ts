import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import crypto from 'crypto';

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
          in: ['front_office', 'housekeeping', 'manager']
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
}
