"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const frontofficeController_1 = require("../controllers/frontofficeController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const frontofficeValidation_1 = require("../validation/frontofficeValidation");
const router = (0, express_1.Router)();
const frontOfficeController = new frontofficeController_1.FrontOfficeController();
// Dashboard Summary Stats
router.get('/dashboard', (0, validateMiddleware_1.validate)(frontofficeValidation_1.dashboardOverviewSchema), frontOfficeController.getDashboardStats);
// Room board (grid/grid-info)
router.get('/room-board', frontOfficeController.getRoomBoard);
// Unified global search (Guest, Booking, Room)
router.get('/search', (0, validateMiddleware_1.validate)(frontofficeValidation_1.frontOfficeSearchSchema), frontOfficeController.searchUnified);
// Housekeeping status update
router.patch('/room/:id/status', (0, validateMiddleware_1.validate)(frontofficeValidation_1.updateRoomHousekeepingSchema), frontOfficeController.updateHousekeeping);
// Helper endpoints for UI components
router.get('/booking/:id/alternatives', frontOfficeController.getAlternativeRooms);
router.get('/guest/active-bookings', frontOfficeController.getGuestActiveBookings);
router.get('/arrivals', frontOfficeController.getArrivals);
router.get('/departures', frontOfficeController.getDepartures);
router.get('/booking/:id/folio', frontOfficeController.getFolio);
exports.default = router;
//# sourceMappingURL=frontofficeRoute.js.map