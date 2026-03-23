import { Router } from 'express';
import { GuestController } from '../controllers/guestController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createGuestSchema,
  updateGuestSchema,
  getGuestsSchema,
  guestBookingsSchema,
} from '../validation/guestValidation';

const router = Router();
const guestController = new GuestController();

// Get guest statistics
router.get('/statistics', guestController.getGuestStats);

// Get all guests with filters
router.get(
  '/',
  validate(getGuestsSchema),
  guestController.getAllGuests
);

// Get guest by ID
router.get('/:id', guestController.getGuestById);

// Get guest bookings
router.get(
  '/:id/bookings',
  validate(guestBookingsSchema),
  guestController.getGuestBookings
);

// Create guest
router.post(
  '/',
  validate(createGuestSchema),
  guestController.createGuest
);

// Update guest
router.put(
  '/:id',
  validate(updateGuestSchema),
  guestController.updateGuest
);

// Delete guest
router.delete('/:id', guestController.deleteGuest);

export default router;