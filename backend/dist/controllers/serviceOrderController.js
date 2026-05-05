"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrderController = void 0;
const serviceOrderService_1 = require("../services/serviceOrderService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const serviceOrderService = new serviceOrderService_1.ServiceOrderService();
class ServiceOrderController {
    getAllOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { page, limit, status, priority, roomId, bookingId, search } = req.query;
        const result = await serviceOrderService.getAllOrders({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            status: status,
            priority: priority,
            roomId: roomId ? Number(roomId) : undefined,
            bookingId: bookingId ? Number(bookingId) : undefined,
            search: search
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Service orders retrieved successfully', result));
    });
    getOrderById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await serviceOrderService.getOrderById(Number(req.params.id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Service order retrieved successfully', order));
    });
    createOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await serviceOrderService.createOrder(req.body);
        // Emit socket event for real-time order updates
        const io = req.app.get('io');
        if (io) {
            io.emit('service-order-created', order);
        }
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Service order created successfully', order));
    });
    updateOrderStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { status, assignedTo } = req.body;
        const order = await serviceOrderService.updateOrderStatus(Number(req.params.id), status, assignedTo);
        // Emit socket event for real-time status updates
        const io = req.app.get('io');
        if (io) {
            io.emit('service-order-updated', order);
        }
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Service order status updated', order));
    });
    deleteOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await serviceOrderService.deleteOrder(Number(req.params.id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Service order deleted successfully'));
    });
}
exports.ServiceOrderController = ServiceOrderController;
//# sourceMappingURL=serviceOrderController.js.map