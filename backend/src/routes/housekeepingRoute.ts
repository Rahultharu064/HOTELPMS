import { Router } from 'express';
import { HousekeepingController } from '../controllers/housekeepingController';
import { validate } from '../middlewares/validateMiddleware';
import { 
  updateRoomStatusSchema, 
  getHousekeepingLogsSchema
} from '../validation/housekeepingValidation';

const router = Router();
const housekeepingController = new HousekeepingController();

// Current room statuses for housekeeping board
router.get('/rooms', housekeepingController.getRoomStatuses);

// Room stats summary
router.get('/stats', housekeepingController.getHousekeepingStats);

// Update room housekeeping status
router.patch('/room/:id', validate(updateRoomStatusSchema), housekeepingController.updateRoomStatus);

// Housekeeping history logs
router.get('/logs', validate(getHousekeepingLogsSchema), housekeepingController.getLogs);

export default router;
