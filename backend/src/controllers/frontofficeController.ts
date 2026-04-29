import { Request, Response } from 'express';
import { FrontOfficeService } from '../services/frontofficeService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { HttpStatus } from '../constants';

const frontOfficeService = new FrontOfficeService();

export class FrontOfficeController {
  
  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query;
    const dateObj = date ? new Date(date as string) : new Date();
    const stats = await frontOfficeService.getDashboardOverview(dateObj);
    res.status(HttpStatus.OK).json(ApiResponse.success('Dashboard statistics retrieved', stats));
  });

  getRoomBoard = asyncHandler(async (_req: Request, res: Response) => {
    const roomBoard = await frontOfficeService.getRoomGrid();
    res.status(HttpStatus.OK).json(ApiResponse.success('Room grid retrieved', roomBoard));
  });

  searchUnified = asyncHandler(async (req: Request, res: Response) => {
    const { query, limit } = req.query;
    const result = await frontOfficeService.globalSearch(query as string, limit ? Number(limit) : 10);
    res.status(HttpStatus.OK).json(ApiResponse.success('Unified search results retrieved', result));
  });

  updateHousekeeping = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await frontOfficeService.updateHousekeeping(Number(id), status);
    const io = req.app.get('io');
    if (io) io.emit('room-status-updated', updated);
    res.status(HttpStatus.OK).json(ApiResponse.success('Room status updated', updated));
  });

  getAlternativeRooms = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const rooms = await frontOfficeService.getAlternativeRooms(Number(id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Alternative rooms found', rooms));
  });

  getGuestActiveBookings = asyncHandler(async (req: Request, res: Response) => {
    const { guestId, currentBookingId } = req.query;
    const bookings = await frontOfficeService.getGuestActiveBookings(Number(guestId), Number(currentBookingId));
    res.status(HttpStatus.OK).json(ApiResponse.success('Guest active bookings retrieved', bookings));
  });

  getArrivals = asyncHandler(async (_req: Request, res: Response) => {
    const arrivals = await frontOfficeService.getTodayArrivals();
    res.status(HttpStatus.OK).json(ApiResponse.success('Today arrivals retrieved', arrivals));
  });

  getDepartures = asyncHandler(async (_req: Request, res: Response) => {
    const departures = await frontOfficeService.getTodayDepartures();
    res.status(HttpStatus.OK).json(ApiResponse.success('Today departures retrieved', departures));
  });

  getFolio = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const folio = await frontOfficeService.getFolio(Number(id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Guest folio retrieved', folio));
  });
}
