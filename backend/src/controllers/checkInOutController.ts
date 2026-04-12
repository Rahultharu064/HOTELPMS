import { Request, Response } from 'express';
import { CheckInOutService } from '../services/checkInOutService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { HttpStatus } from '../constants';

const checkInOutService = new CheckInOutService();

export class CheckInOutController {
  
  checkIn = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { guestData, newRoomId } = req.body;
    const userId = (req as any).user?.id ? `user_${(req as any).user.id}` : 'system';

    const booking = await checkInOutService.checkIn(
      Number(id), 
      guestData, 
      userId, 
      newRoomId ? Number(newRoomId) : undefined
    );

    // Emit live status updates
    const io = req.app.get('io');
    if (io) {
        io.emit('room-status-updated', { id: booking.roomId, status: 'occupied' });
        io.emit('booking-status-updated', booking);
        io.emit('stats-updated');
    }

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Guest successfully checked in', booking)
    );
  });

  checkOut = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { force } = req.body;
    const userId = (req as any).user?.id ? `user_${(req as any).user.id}` : 'system';

    const booking = await checkInOutService.checkOut(Number(id), userId, force);

    const io = req.app.get('io');
    if (io) {
        io.emit('room-status-updated', { id: booking.roomId, status: 'cleaning' });
        io.emit('booking-status-updated', booking);
        io.emit('stats-updated');
    }

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Guest successfully checked out', booking)
    );
  });

  markNoShow = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id ? `user_${(req as any).user.id}` : 'system';

    const booking = await checkInOutService.markNoShow(Number(id), userId);

    const io = req.app.get('io');
    if (io) {
        io.emit('room-status-updated', { id: booking.roomId, status: 'available' });
        io.emit('booking-status-updated', booking);
        io.emit('stats-updated');
    }

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Booking marked as No-Show', booking)
    );
  });

  verifyIdentity = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { formData } = req.body;
    
    const result = await checkInOutService.verifyGuestIdentity(Number(id), formData);
    
    res.status(HttpStatus.OK).json(
      ApiResponse.success(result.message, result)
    );
  });
}
