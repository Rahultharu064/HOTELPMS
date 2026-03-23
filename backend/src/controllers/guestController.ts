import { Request, Response } from 'express';
import { GuestService } from '../services/guestService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const guestService = new GuestService();

export class GuestController {
  getAllGuests = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search, email, phone, sort } = req.query;

    const result = await guestService.getAllGuests({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      email: email as string,
      phone: phone as string,
      sort: sort as string,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Guests retrieved successfully', result)
    );
  });

  getGuestById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const guest = await guestService.getGuestById(Number(id));

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Guest retrieved successfully', guest)
    );
  });

  createGuest = asyncHandler(async (req: Request, res: Response) => {
    const guest = await guestService.createGuest(req.body);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('guest-created', guest);

    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Guest created successfully', guest)
    );
  });

  updateGuest = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const guest = await guestService.updateGuest(Number(id), req.body);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('guest-updated', guest);

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Guest updated successfully', guest)
    );
  });

  deleteGuest = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await guestService.deleteGuest(Number(id));

    // Emit socket event
    const io = req.app.get('io');
    io.emit('guest-deleted', { id: Number(id) });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Guest deleted successfully', result)
    );
  });

  getGuestBookings = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page, limit, status } = req.query;

    const result = await guestService.getGuestBookings(Number(id), {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Guest bookings retrieved successfully', result)
    );
  });

  getGuestStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await guestService.getGuestStats();

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Guest statistics retrieved successfully', stats)
    );
  });
}