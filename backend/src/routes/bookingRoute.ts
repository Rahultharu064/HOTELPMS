import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createBookingSchema,
  updateBookingSchema,
  getBookingsSchema,
  updateBookingStatusSchema,
} from '../validation/bookingValidation';

const router = Router();
const bookingController = new BookingController();

// Get booking statistics
router.get('/statistics', bookingController.getBookingStatistics);

// Get all bookings with filters
router.get(
  '/',
  validate(getBookingsSchema),
  bookingController.getAllBookings
);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Create booking
router.post(
  '/',
  validate(createBookingSchema),
  bookingController.createBooking
);

// Update booking
router.put(
  '/:id',
  validate(updateBookingSchema),
  bookingController.updateBooking
);

// Update booking status
router.patch(
  '/:id/status',
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus
);

export default router;
