import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/roomService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const roomService = new RoomService();

export class RoomController {
  getAllRooms = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
      page,
      limit,
      status,
      roomTypeId,
      minPrice,
      maxPrice,
      adults,
      children,
      checkIn,
      checkOut,
      sort,
    } = req.query;

    const result = await roomService.getAllRooms({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as any,
      roomTypeId: roomTypeId ? Number(roomTypeId) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      adults: adults ? Number(adults) : undefined,
      children: children ? Number(children) : undefined,
      checkIn: checkIn ? new Date(checkIn as string) : undefined,
      checkOut: checkOut ? new Date(checkOut as string) : undefined,
      sort: sort as string,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Rooms retrieved successfully', result)
    );
  });

  getRoomById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const room = await roomService.getRoomById(Number(id));

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room retrieved successfully', room)
    );
  });

  checkAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;

    const result = await roomService.checkAvailability(
      Number(id),
      new Date(checkIn as string),
      new Date(checkOut as string)
    );

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room availability checked', result)
    );
  });

  createRoom = asyncHandler(async (req: Request, res: Response) => {
    const room = await roomService.createRoom(req.body);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('room-created', room);

    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Room created successfully', room)
    );
  });

  updateRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const room = await roomService.updateRoom(Number(id), req.body);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('room-updated', room);

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room updated successfully', room)
    );
  });

  deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await roomService.deleteRoom(Number(id));

    // Emit socket event
    const io = req.app.get('io');
    io.emit('room-deleted', { id: Number(id) });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room deleted successfully', result)
    );
  });

  updateRoomStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const room = await roomService.updateRoomStatus(Number(id), status);

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.emit('room-status-updated', room);

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room status updated successfully', room)
    );
  });

  addRoomImages = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { images } = req.body;
    const result = await roomService.addRoomImages(Number(id), images);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('room-images-added', { roomId: Number(id), images });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room images added successfully', result)
    );
  });

  addRoomVideos = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { videos } = req.body;
    const result = await roomService.addRoomVideos(Number(id), videos);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('room-videos-added', { roomId: Number(id), videos });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room videos added successfully', result)
    );
  });

  getSimilarRooms = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { limit } = req.query;
    const similarRooms = await roomService.getSimilarRooms(
      Number(id),
      limit ? Number(limit) : 4
    );

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Similar rooms retrieved successfully', similarRooms)
    );
  });

  getRoomStatistics = asyncHandler(async (req: Request, res: Response) => {
    const stats = await roomService.getRoomStatistics();

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Room statistics retrieved successfully', stats)
    );
  });
}