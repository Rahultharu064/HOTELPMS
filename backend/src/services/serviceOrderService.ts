import { prisma } from '../config/database';
import { Prisma, ServiceOrderStatus, ServicePriority } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class ServiceOrderService {
  async getAllOrders(filters: {
    page?: number;
    limit?: number;
    status?: ServiceOrderStatus;
    priority?: ServicePriority;
    roomId?: number;
    bookingId?: number;
    search?: string;
  }) {
    const { page = 1, limit = 10, status, priority, roomId, bookingId, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ServiceOrderWhereInput = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (roomId) where.roomId = roomId;
    if (bookingId) where.bookingId = bookingId;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { room: { roomNumber: { contains: search } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.serviceOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { room: true, booking: { include: { guest: true } }, items: { include: { service: true } } }
      }),
      prisma.serviceOrder.count({ where })
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getOrderById(id: number) {
    const order = await prisma.serviceOrder.findUnique({
      where: { id },
      include: { room: true, booking: { include: { guest: true } }, items: { include: { service: true } } }
    });
    if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Service order not found');
    return order;
  }

  async createOrder(data: {
    bookingId?: number;
    roomId: number;
    notes?: string;
    priority?: ServicePriority;
    requestedBy?: string;
    items: Array<{ serviceId: number; quantity: number; notes?: string }>;
  }) {
    // 1. Verify availability: room must exist
    const room = await prisma.room.findUnique({ where: { id: data.roomId } });
    if (!room) throw new ApiError(HttpStatus.NOT_FOUND, 'Room not found');

    // 2. Fetch all service items to verify existence and get current prices
    const serviceIds = data.items.map(item => item.serviceId);
    const services = await prisma.service.findMany({ where: { id: { in: serviceIds }, status: 'active' } });
    if (services.length !== serviceIds.length) throw new ApiError(HttpStatus.NOT_FOUND, 'Some services not found or inactive');

    // Map current prices
    const servicePriceMap = new Map(services.map(s => [s.id, Number(s.price)]));
    let totalAmount = 0;
    const orderItemsData = data.items.map(item => {
      const price = servicePriceMap.get(item.serviceId) || 0;
      totalAmount += price * item.quantity;
      return {
        serviceId: item.serviceId,
        quantity: item.quantity,
        price,
        notes: item.notes
      };
    });

    const orderNumber = `SER-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    return await prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.create({
        data: {
          orderNumber,
          bookingId: data.bookingId,
          roomId: data.roomId,
          totalAmount: new Prisma.Decimal(totalAmount),
          priority: data.priority || 'normal',
          notes: data.notes,
          requestedBy: data.requestedBy,
          items: {
            create: orderItemsData
          }
        },
        include: { items: { include: { service: true } }, room: true }
      });

      return order;
    });
  }

  async updateOrderStatus(id: number, status: ServiceOrderStatus, assignedTo?: string) {
    const order = await prisma.serviceOrder.findUnique({ where: { id } });
    if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Service order not found');

    return await prisma.serviceOrder.update({
      where: { id },
      data: { status, assignedTo: assignedTo || order.assignedTo },
      include: { room: true, booking: { include: { guest: true } }, items: { include: { service: true } } }
    });
  }

  async deleteOrder(id: number) {
     const order = await prisma.serviceOrder.findUnique({ where: { id } });
     if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Service order not found');
     return await prisma.serviceOrder.delete({ where: { id } });
  }
}
