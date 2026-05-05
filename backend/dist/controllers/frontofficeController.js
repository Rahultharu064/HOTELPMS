"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontOfficeController = void 0;
const frontofficeService_1 = require("../services/frontofficeService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const constants_1 = require("../constants");
const frontOfficeService = new frontofficeService_1.FrontOfficeService();
class FrontOfficeController {
    getDashboardStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { date } = req.query;
        const dateObj = date ? new Date(date) : new Date();
        const stats = await frontOfficeService.getDashboardOverview(dateObj);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Dashboard statistics retrieved', stats));
    });
    getRoomBoard = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const roomBoard = await frontOfficeService.getRoomGrid();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room grid retrieved', roomBoard));
    });
    searchUnified = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { query, limit } = req.query;
        const result = await frontOfficeService.globalSearch(query, limit ? Number(limit) : 10);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Unified search results retrieved', result));
    });
    updateHousekeeping = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await frontOfficeService.updateHousekeeping(Number(id), status);
        const io = req.app.get('io');
        if (io)
            io.emit('room-status-updated', updated);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room status updated', updated));
    });
    getAlternativeRooms = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const rooms = await frontOfficeService.getAlternativeRooms(Number(id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Alternative rooms found', rooms));
    });
    getGuestActiveBookings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { guestId, currentBookingId } = req.query;
        const bookings = await frontOfficeService.getGuestActiveBookings(Number(guestId), Number(currentBookingId));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest active bookings retrieved', bookings));
    });
    getArrivals = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const arrivals = await frontOfficeService.getTodayArrivals();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Today arrivals retrieved', arrivals));
    });
    getDepartures = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const departures = await frontOfficeService.getTodayDepartures();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Today departures retrieved', departures));
    });
    getFolio = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const folio = await frontOfficeService.getFolio(Number(id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Guest folio retrieved', folio));
    });
}
exports.FrontOfficeController = FrontOfficeController;
//# sourceMappingURL=frontofficeController.js.map