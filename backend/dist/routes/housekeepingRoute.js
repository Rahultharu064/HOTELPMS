"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const housekeepingController_1 = require("../controllers/housekeepingController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const housekeepingValidation_1 = require("../validation/housekeepingValidation");
const router = (0, express_1.Router)();
const housekeepingController = new housekeepingController_1.HousekeepingController();
// Current room statuses for housekeeping board
router.get('/rooms', housekeepingController.getRoomStatuses);
// Room stats summary
router.get('/stats', housekeepingController.getHousekeepingStats);
// Update room housekeeping status
router.patch('/room/:id', (0, validateMiddleware_1.validate)(housekeepingValidation_1.updateRoomStatusSchema), housekeepingController.updateRoomStatus);
// Housekeeping history logs
router.get('/logs', (0, validateMiddleware_1.validate)(housekeepingValidation_1.getHousekeepingLogsSchema), housekeepingController.getLogs);
// Staff management
router.get('/staff', housekeepingController.getStaff);
router.post('/staff', housekeepingController.addStaff);
exports.default = router;
//# sourceMappingURL=housekeepingRoute.js.map