"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const bookingService_1 = require("../services/bookingService");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const bookingService = new bookingService_1.BookingService();
class BookingController {
    getAllBookings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { page, limit, status, guestId, roomId, startDate, endDate, search, } = req.query;
        const result = await bookingService.getAllBookings({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            status: status,
            guestId: guestId ? Number(guestId) : undefined,
            roomId: roomId ? Number(roomId) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            search: search,
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Bookings retrieved successfully', result));
    });
    getBookingById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const bookingId = Number(id);
        if (isNaN(bookingId)) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Invalid booking ID format');
        }
        const booking = await bookingService.getBookingById(bookingId);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Booking retrieved successfully', booking));
    });
    createBooking = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const booking = await bookingService.createBooking(req.body, userId);
        const io = req.app.get('io');
        if (io) {
            io.emit('booking-created', booking);
        }
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Booking created successfully', booking));
    });
    updateBooking = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userId = req.user?.id;
        const booking = await bookingService.updateBooking(Number(id), req.body, userId);
        const io = req.app.get('io');
        if (io) {
            io.emit('booking-updated', booking);
        }
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Booking updated successfully', booking));
    });
    updateBookingStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        const booking = await bookingService.updateBookingStatus(Number(id), status, userId);
        const io = req.app.get('io');
        if (io) {
            io.emit('booking-status-updated', booking);
        }
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Booking status updated successfully', booking));
    });
    getBookingStatistics = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const stats = await bookingService.getBookingStatistics();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Booking statistics retrieved successfully', stats));
    });
}
exports.BookingController = BookingController;
//# sourceMappingURL=bookingController.js.map