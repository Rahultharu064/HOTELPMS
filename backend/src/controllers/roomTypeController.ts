import type { Request, Response, NextFunction } from 'express';
import { RoomTypeService } from '../services/roomTypeService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants/index';

const roomTypeService = new RoomTypeService();

export class RoomTypeController {
  getAllRoomTypes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, search, sort } = req.query;

    const result = await roomTypeService.getAllRoomTypes({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      sort: sort as string,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room types retrieved successfully', result)
    );
  });

  getRoomTypeById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const roomType = await roomTypeService.getRoomTypeById(Number(id));

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room type retrieved successfully', roomType)
    );
  });

  createRoomType = asyncHandler(async (req: Request, res: Response) => {
    // req.body will contain form-data text fields
    // req.file will contain the uploaded image
    const data = {
      ...req.body,
      image: req.file ? (req.file as any).path : undefined,
    };

    const roomType = await roomTypeService.createRoomType(data);

    // Emit socket event
    const io = req.app.get('io');
    if (io) io.emit('room-type-created', roomType);

    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Room type created successfully', roomType)
    );
  });

  updateRoomType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = {
      ...req.body,
      image: req.file ? (req.file as any).path : undefined,
    };

    const roomType = await roomTypeService.updateRoomType(Number(id), data);

    // Emit socket event
    const io = req.app.get('io');
    if (io) io.emit('room-type-updated', roomType);

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room type updated successfully', roomType)
    );
  });

  deleteRoomType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await roomTypeService.deleteRoomType(Number(id));

    // Emit socket event
    const io = req.app.get('io');
    if (io) io.emit('room-type-deleted', { id: Number(id) });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room type deleted successfully', result)
    );
  });
}