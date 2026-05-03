import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { prisma } from '../config/database';

export interface AdminAuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    type: string;
  };
}

export const authenticateAdmin = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as { id: number, type: string, role: string };

    if (decoded.type !== 'admin') {
       throw new ApiError(HttpStatus.FORBIDDEN, 'Invalid token type. Admin access required.');
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin || !admin.isActive) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Admin user not found or inactive');
    }

    req.user = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'admin'
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid or expired admin token'));
    } else {
      next(error);
    }
  }
};

export const requireSuperAdmin = (req: AdminAuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'superadmin') {
    return next(new ApiError(HttpStatus.FORBIDDEN, 'SuperAdmin privileges required'));
  }
  next();
};

/**
 * Authorize multiple roles
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: AdminAuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(HttpStatus.FORBIDDEN, `Access denied. Requires one of these roles: ${roles.join(', ')}`));
    }
    next();
  };
};
