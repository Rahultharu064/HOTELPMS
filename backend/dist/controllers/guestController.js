"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestController = void 0;
const guestService_1 = require("../services/guestService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const guestService = new guestService_1.GuestService();
class GuestController {
    getAllGuests = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { page, limit, search, email, phone, sort } = req.query;
        const result = await guestService.getAllGuests({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search,
            email: email,
            phone: phone,
            sort: sort,
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guests retrieved successfully', result));
    });
    getGuestById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const guest = await guestService.getGuestById(Number(id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest retrieved successfully', guest));
    });
    createGuest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const guest = await guestService.createGuest(req.body);
        // Emit socket event
        const io = req.app.get('io');
        io.emit('guest-created', guest);
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Guest created successfully', guest));
    });
    updateGuest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const guest = await guestService.updateGuest(Number(id), req.body);
        // Emit socket event
        const io = req.app.get('io');
        io.emit('guest-updated', guest);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest updated successfully', guest));
    });
    deleteGuest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await guestService.deleteGuest(Number(id));
        // Emit socket event
        const io = req.app.get('io');
        io.emit('guest-deleted', { id: Number(id) });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest deleted successfully', result));
    });
    getGuestBookings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { page, limit, status } = req.query;
        const result = await guestService.getGuestBookings(Number(id), {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            status: status,
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest bookings retrieved successfully', result));
    });
    getGuestStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const stats = await guestService.getGuestStats();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest statistics retrieved successfully', stats));
    });
}
exports.GuestController = GuestController;
//# sourceMappingURL=guestController.js.map