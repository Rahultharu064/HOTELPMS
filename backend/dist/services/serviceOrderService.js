"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrderService = void 0;
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
class ServiceOrderService {
    async getAllOrders(filters) {
        const { page = 1, limit = 10, status, priority, roomId, bookingId, search } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        if (roomId)
            where.roomId = roomId;
        if (bookingId)
            where.bookingId = bookingId;
        if (search) {
            where.OR = [
                { orderNumber: { contains: search } },
                { room: { roomNumber: { contains: search } } },
                { guest: { firstName: { contains: search } } },
                { guest: { lastName: { contains: search } } },
                { requestedBy: { contains: search } }
            ];
        }
        const [orders, total] = await Promise.all([
            database_1.prisma.serviceOrder.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    room: true,
                    guest: true,
                    booking: { include: { guest: true } },
                    items: { include: { service: true } }
                }
            }),
            database_1.prisma.serviceOrder.count({ where })
        ]);
        return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getOrderById(id) {
        const order = await database_1.prisma.serviceOrder.findUnique({
            where: { id },
            include: { room: true, booking: { include: { guest: true } }, items: { include: { service: true } } }
        });
        if (!order)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Service order not found');
        return order;
    }
    async createOrder(data) {
        // 1. Verify existence if provided
        if (data.roomId) {
            const room = await database_1.prisma.room.findUnique({ where: { id: data.roomId } });
            if (!room)
                throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        }
        if (data.guestId) {
            const guest = await database_1.prisma.guest.findUnique({ where: { id: data.guestId } });
            if (!guest)
                throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Guest not found');
        }
        // 2. Fetch all service items to verify existence and get current prices
        const serviceIds = data.items.map(item => item.serviceId);
        const services = await database_1.prisma.service.findMany({ where: { id: { in: serviceIds }, status: 'active' } });
        if (services.length !== serviceIds.length)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Some services not found or inactive');
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
        return await database_1.prisma.$transaction(async (tx) => {
            const order = await tx.serviceOrder.create({
                data: {
                    orderNumber,
                    bookingId: data.bookingId,
                    guestId: data.guestId,
                    roomId: data.roomId,
                    totalAmount: new client_1.Prisma.Decimal(totalAmount),
                    priority: data.priority || 'normal',
                    notes: data.notes,
                    requestedBy: data.requestedBy,
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: { include: { service: true } }, room: true, guest: true }
            });
            return order;
        });
    }
    async updateOrderStatus(id, status, assignedTo) {
        const order = await database_1.prisma.serviceOrder.findUnique({ where: { id } });
        if (!order)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Service order not found');
        return await database_1.prisma.serviceOrder.update({
            where: { id },
            data: { status, assignedTo: assignedTo || order.assignedTo },
            include: { room: true, booking: { include: { guest: true } }, items: { include: { service: true } } }
        });
    }
    async deleteOrder(id) {
        const order = await database_1.prisma.serviceOrder.findUnique({ where: { id } });
        if (!order)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Service order not found');
        return await database_1.prisma.serviceOrder.delete({ where: { id } });
    }
}
exports.ServiceOrderService = ServiceOrderService;
//# sourceMappingURL=serviceOrderService.js.map