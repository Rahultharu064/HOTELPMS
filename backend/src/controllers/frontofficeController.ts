import { Request, Response } from 'express';
import { FrontOfficeService } from '../services/frontofficeService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';
import { RoomStatus } from '@prisma/client';

const frontOfficeService = new FrontOfficeService();

export class FrontOfficeController {
  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query;
    const dateObj = date ? new Date(date as string) : new Date();
    
    const stats = await frontOfficeService.getDashboardOverview(dateObj);
    
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Dashboard statistics retrieved successfully', stats)
    );
  });

  getRoomBoard = asyncHandler(async (_req: Request, res: Response) => {
    const roomBoard = await frontOfficeService.getRoomGrid();
    
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room grid retrieved successfully', roomBoard)
    );
  });

  searchUnified = asyncHandler(async (req: Request, res: Response) => {
    const { query, limit } = req.query;
    const result = await frontOfficeService.globalSearch(
        query as string, 
        limit ? Number(limit) : 10
    );
    
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Unified search results retrieved', result)
    );
  });

  updateHousekeeping = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await frontOfficeService.updateHousekeeping(
        Number(id), 
        status as RoomStatus
    );

    const io = req.app.get('io');
    if (io) {
        io.emit('room-status-updated', updated);
    }
    
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room status updated successfully', updated)
    );
  });
}
