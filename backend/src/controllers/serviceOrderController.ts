import { Request, Response } from 'express';
import { ServiceOrderService } from '../services/serviceOrderService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const serviceOrderService = new ServiceOrderService();

export class ServiceOrderController {
  getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, priority, roomId, bookingId, search } = req.query;
    const result = await serviceOrderService.getAllOrders({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as any,
      priority: priority as any,
      roomId: roomId ? Number(roomId) : undefined,
      bookingId: bookingId ? Number(bookingId) : undefined,
      search: search as string
    });
    res.status(HttpStatus.OK).json(ApiResponse.success('Service orders retrieved successfully', result));
  });

  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const order = await serviceOrderService.getOrderById(Number(req.params.id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Service order retrieved successfully', order));
  });

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await serviceOrderService.createOrder(req.body);

    // Emit socket event for real-time order updates
    const io = req.app.get('io');
    if (io) {
      io.emit('service-order-created', order);
    }

    res.status(HttpStatus.CREATED).json(ApiResponse.success('Service order created successfully', order));
  });

  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status, assignedTo } = req.body;
    const order = await serviceOrderService.updateOrderStatus(Number(req.params.id), status, assignedTo);

    // Emit socket event for real-time status updates
    const io = req.app.get('io');
    if (io) {
      io.emit('service-order-updated', order);
    }

    res.status(HttpStatus.OK).json(ApiResponse.success('Service order status updated', order));
  });

  deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    await serviceOrderService.deleteOrder(Number(req.params.id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Service order deleted successfully'));
  });
}
