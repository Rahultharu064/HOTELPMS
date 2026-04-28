import { Request, Response } from 'express';
import { HousekeepingService } from '../services/housekeepingService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';
import { RoomStatus, HousekeepingType } from '@prisma/client';

const housekeepingService = new HousekeepingService();

export class HousekeepingController {
  getRoomStatuses = asyncHandler(async (_req: Request, res: Response) => {
    const rooms = await housekeepingService.getRoomStatuses();
    res.status(HttpStatus.OK).json(ApiResponse.success('Housekeeping status retrieved successfully', rooms));
  });

  updateRoomStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, staffId, type, notes } = req.body;
    
    const result = await housekeepingService.updateRoomStatus({
        roomId: Number(id), 
        status: status as RoomStatus,
        staffId,
        type: type as HousekeepingType,
        notes
    });

    // Notify other staff of status change
    const io = req.app.get('io');
    if (io) {
        io.emit('housekeeping-status-updated', result);
    }
    
    res.status(HttpStatus.OK).json(ApiResponse.success('Room housekeeping status updated', result));
  });

  getLogs = asyncHandler(async (req: Request, res: Response) => {
    const { roomId, staffId, type, startDate, endDate } = req.query;
    const logs = await housekeepingService.getLogs({
        roomId: roomId ? Number(roomId) : undefined,
        staffId: staffId as string,
        type: type as any,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
    });

    res.status(HttpStatus.OK).json(ApiResponse.success('Housekeeping logs retrieved successfully', logs));
  });

  getHousekeepingStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await housekeepingService.getHousekeepingStats();
    res.status(HttpStatus.OK).json(ApiResponse.success('Housekeeping stats retrieved successfully', stats));
  });

  getStaff = asyncHandler(async (_req: Request, res: Response) => {
    const staff = await housekeepingService.getStaff();
    res.status(HttpStatus.OK).json(ApiResponse.success('Housekeeping staff retrieved', staff));
  });

  addStaff = asyncHandler(async (req: Request, res: Response) => {
    const staff = await housekeepingService.addStaff(req.body);
    res.status(HttpStatus.CREATED).json(ApiResponse.success('Staff added successfully', staff));
  });
}

