import { Request, Response } from 'express';
import { OfflineReservationService } from '../services/offlineReservationService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const offlineReservationService = new OfflineReservationService();

export class OfflineReservationController {
  createOfflineReservation = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const body = req.body;

    const reservation = await offlineReservationService.createOfflineReservation(
      {
         existingGuestId: body.existingGuestId,
         newGuestDetails: body.newGuestDetails,
         roomId: body.roomId,
         checkIn: new Date(body.checkIn),
         checkOut: new Date(body.checkOut),
         adults: body.adults,
         children: body.children,
         status: body.status,
         specialRequests: body.specialRequests,
         payment: body.payment,
      },
      userId
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('booking-created', reservation);
      io.emit('offline-reservation-created', reservation);
    }

    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Offline reservation created successfully', reservation)
    );
  });
}
