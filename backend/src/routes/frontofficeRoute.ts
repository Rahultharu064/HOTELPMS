import { Router } from 'express';
import { FrontOfficeController } from '../controllers/frontofficeController';
import { validate } from '../middlewares/validateMiddleware';
import { 
  dashboardOverviewSchema, 
  frontOfficeSearchSchema,
  updateRoomHousekeepingSchema
} from '../validation/frontofficeValidation';

const router = Router();
const frontOfficeController = new FrontOfficeController();

// Dashboard Summary Stats
router.get(
  '/dashboard', 
  validate(dashboardOverviewSchema), 
  frontOfficeController.getDashboardStats
);

// Room board (grid/grid-info)
router.get(
  '/room-board', 
  frontOfficeController.getRoomBoard
);

// Unified global search (Guset, Booking, Room)
router.get(
  '/search', 
  validate(frontOfficeSearchSchema), 
  frontOfficeController.searchUnified
);

// Housekeeping status update
router.patch(
  '/room/:id/status', 
  validate(updateRoomHousekeepingSchema), 
  frontOfficeController.updateHousekeeping
);

export default router;
