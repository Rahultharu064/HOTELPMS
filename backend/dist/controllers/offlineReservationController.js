"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineReservationController = void 0;
const offlineReservationService_1 = require("../services/offlineReservationService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const offlineReservationService = new offlineReservationService_1.OfflineReservationService();
class OfflineReservationController {
    createOfflineReservation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const body = req.body;
        const reservation = await offlineReservationService.createOfflineReservation({
            existingGuestId: body.existingGuestId,
            newGuestDetails: body.newGuestDetails,
            roomId: body.roomId,
            checkIn: new Date(body.checkIn),
            checkOut: new Date(body.checkOut),
            adults: body.adults,
            children: body.children,
            status: body.status,
            specialRequests: body.specialRequests,
            payment: body.payment,
        }, userId);
        const io = req.app.get('io');
        if (io) {
            io.emit('booking-created', reservation);
            io.emit('offline-reservation-created', reservation);
        }
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Offline reservation created successfully', reservation));
    });
}
exports.OfflineReservationController = OfflineReservationController;
//# sourceMappingURL=offlineReservationController.js.map