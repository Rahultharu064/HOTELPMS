import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { HttpStatus } from '../constants';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.errors)
    );
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(HttpStatus.CONFLICT).json(
          ApiResponse.error(`Duplicate field: ${err.meta?.target}`)
        );
      case 'P2021':
        return res.status(503).json(
          ApiResponse.error(
            'Database schema is out of date. Run: npx prisma migrate deploy && npx prisma generate'
          )
        );
      case 'P2025':
        return res.status(HttpStatus.NOT_FOUND).json(
          ApiResponse.error('Record not found')
        );
      default:
        console.error('Prisma error code:', err.code, err.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
          ApiResponse.error(
            process.env.NODE_ENV === 'production'
              ? 'Database error occurred'
              : `Database error: ${err.code} — ${err.message}`
          )
        );
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(HttpStatus.BAD_REQUEST).json(
      ApiResponse.error(err.message)
    );
  }

  // Default error
  const statusCode = res.statusCode !== 200 ? res.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json(
    ApiResponse.error(
      process.env.NODE_ENV === 'production' 
        ? `Internal server error: ${err.message}` 
        : err.message
    )
  );
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(HttpStatus.NOT_FOUND, `Route ${req.originalUrl} not found`);
  next(error);
};