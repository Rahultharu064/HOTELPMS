import { Router } from 'express';
import { RoomController } from '../controllers/roomController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createRoomSchema,
  updateRoomSchema,
  getRoomsSchema,
  roomAvailabilitySchema,
  roomImagesSchema,
  roomVideosSchema,
} from '../validation/roomValidation';

const router = Router();
const roomController = new RoomController();

// Get room statistics
router.get('/statistics', roomController.getRoomStatistics);

// Get all rooms with filters
router.get(
  '/',
  validate(getRoomsSchema),
  roomController.getAllRooms
);

// Check room availability
router.get(
  '/:id/availability',
  validate(roomAvailabilitySchema),
  roomController.checkAvailability
);

// Get similar rooms
router.get('/:id/similar', roomController.getSimilarRooms);

// Get room by ID
router.get('/:id', roomController.getRoomById);

// Create room
router.post(
  '/',
  validate(createRoomSchema),
  roomController.createRoom
);

// Update room
router.put(
  '/:id',
  validate(updateRoomSchema),
  roomController.updateRoom
);

// Delete room
router.delete('/:id', roomController.deleteRoom);

// Update room status
router.patch('/:id/status', roomController.updateRoomStatus);

// Add room images
router.post(
  '/:id/images',
  validate(roomImagesSchema),
  roomController.addRoomImages
);

// Add room videos
router.post(
  '/:id/videos',
  validate(roomVideosSchema),
  roomController.addRoomVideos
);

export default router;