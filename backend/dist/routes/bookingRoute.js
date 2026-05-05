"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const bookingValidation_1 = require("../validation/bookingValidation");
const router = (0, express_1.Router)();
const bookingController = new bookingController_1.BookingController();
// Get booking statistics
router.get('/statistics', bookingController.getBookingStatistics);
// Get all bookings with filters
router.get('/', (0, validateMiddleware_1.validate)(bookingValidation_1.getBookingsSchema), bookingController.getAllBookings);
// Get booking by ID
router.get('/:id', bookingController.getBookingById);
// Create booking
router.post('/', (0, validateMiddleware_1.validate)(bookingValidation_1.createBookingSchema), bookingController.createBooking);
// Update booking
router.put('/:id', (0, validateMiddleware_1.validate)(bookingValidation_1.updateBookingSchema), bookingController.updateBooking);
// Update booking status
router.patch('/:id/status', (0, validateMiddleware_1.validate)(bookingValidation_1.updateBookingStatusSchema), bookingController.updateBookingStatus);
exports.default = router;
//# sourceMappingURL=bookingRoute.js.map