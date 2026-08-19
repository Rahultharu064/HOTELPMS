import { Router } from 'express';
import { RoomTypeController } from '../controllers/roomTypeController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createRoomTypeSchema,
  updateRoomTypeSchema,
  getRoomTypesSchema,
} from '../validation/roomTypeValidation';
import { upload } from '../middlewares/uploadMiddleware';
import { authenticateAdmin, authorizeRoles } from '../middlewares/adminAuthMiddleware';

const router = Router();
const roomTypeController = new RoomTypeController();

const adminGuard = [
  authenticateAdmin as any,
  authorizeRoles('superadmin', 'admin', 'manager') as any,
];

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
  ...adminGuard,
  upload.single('image'),
  validate(createRoomTypeSchema),
  roomTypeController.createRoomType
);

// Update room type
router.put(
  '/:id',
  ...adminGuard,
  upload.single('image'),
  validate(updateRoomTypeSchema),
  roomTypeController.updateRoomType
);

// Delete room type
router.delete('/:id', ...adminGuard, roomTypeController.deleteRoomType);

export default router;