"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInOutController = void 0;
const checkInOutService_1 = require("../services/checkInOutService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const constants_1 = require("../constants");
const checkInOutService = new checkInOutService_1.CheckInOutService();
class CheckInOutController {
    checkIn = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { guestData, newRoomId } = req.body;
        const userId = req.user?.id ? `user_${req.user.id}` : 'system';
        const booking = await checkInOutService.checkIn(Number(id), guestData, userId, newRoomId ? Number(newRoomId) : undefined);
        // Emit live status updates
        const io = req.app.get('io');
        if (io) {
            io.emit('room-status-updated', { id: booking.roomId, status: 'occupied' });
            io.emit('booking-status-updated', booking);
            io.emit('stats-updated');
        }
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest successfully checked in', booking));
    });
    checkOut = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { force, paymentMethod } = req.body;
        const userId = req.user?.id ? `user_${req.user.id}` : 'system';
        const booking = await checkInOutService.checkOut(Number(id), userId, force, paymentMethod);
        const io = req.app.get('io');
        if (io) {
            io.emit('room-status-updated', { id: booking.roomId, status: 'cleaning' });
            io.emit('booking-status-updated', booking);
            io.emit('stats-updated');
        }
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest successfully checked out', booking));
    });
    markNoShow = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userId = req.user?.id ? `user_${req.user.id}` : 'system';
        const booking = await checkInOutService.markNoShow(Number(id), userId);
        const io = req.app.get('io');
        if (io) {
            io.emit('room-status-updated', { id: booking.roomId, status: 'available' });
            io.emit('booking-status-updated', booking);
            io.emit('stats-updated');
        }
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Booking marked as No-Show', booking));
    });
    verifyIdentity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { formData } = req.body;
        const result = await checkInOutService.verifyGuestIdentity(Number(id), formData);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result.message, result));
    });
    getFolio = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const folio = await checkInOutService.getFolio(Number(id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Folio retrieved successfully', folio));
    });
}
exports.CheckInOutController = CheckInOutController;
//# sourceMappingURL=checkInOutController.js.map