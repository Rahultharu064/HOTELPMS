import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const bookingService = new BookingService();

export class BookingController {
  getAllBookings = asyncHandler(async (req: Request, res: Response) => {
    const {
      page,
      limit,
      status,
      guestId,
      roomId,
      startDate,
      endDate,
      search,
    } = req.query;

    const result = await bookingService.getAllBookings({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as any,
      guestId: guestId ? Number(guestId) : undefined,
      roomId: roomId ? Number(roomId) : undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      search: search as string,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Bookings retrieved successfully', result)
    );
  });

  getBookingById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookingId = Number(id);

    if (isNaN(bookingId)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid booking ID format');
    }

    const booking = await bookingService.getBookingById(bookingId);

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Booking retrieved successfully', booking)
    );
  });

  createBooking = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const booking = await bookingService.createBooking(req.body, userId);

    const io = req.app.get('io');
    if (io) {
      io.emit('booking-created', booking);
    }

    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Booking created successfully', booking)
    );
  });

  updateBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const booking = await bookingService.updateBooking(Number(id), req.body, userId);

    const io = req.app.get('io');
    if (io) {
      io.emit('booking-updated', booking);
    }

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Booking updated successfully', booking)
    );
  });

  updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?.id;
    const booking = await bookingService.updateBookingStatus(Number(id), status, userId);

    const io = req.app.get('io');
    if (io) {
      io.emit('booking-status-updated', booking);
    }

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Booking status updated successfully', booking)
    );
  });

  getBookingStatistics = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await bookingService.getBookingStatistics();

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Booking statistics retrieved successfully', stats)
    );
  });
}
