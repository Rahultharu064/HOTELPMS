import { Router } from 'express';
import { RoomTypeController } from '../controllers/roomTypeController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createRoomTypeSchema,
  updateRoomTypeSchema,
  getRoomTypesSchema,
} from '../validation/roomTypeValidation';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();
const roomTypeController = new RoomTypeController();

// Get all room types with pagination and filters
router.get(
  '/',
  validate(getRoomTypesSchema),
  roomTypeController.getAllRoomTypes
);

// Get room type by ID
router.get('/:id', roomTypeController.getRoomTypeById);

// Create room type
router.post(
  '/',
  upload.single('image'),
  validate(createRoomTypeSchema),
  roomTypeController.createRoomType
);

// Update room type
router.put(
  '/:id',
  upload.single('image'),
  validate(updateRoomTypeSchema),
  roomTypeController.updateRoomType
);

// Delete room type
router.delete('/:id', roomTypeController.deleteRoomType);

export default router;