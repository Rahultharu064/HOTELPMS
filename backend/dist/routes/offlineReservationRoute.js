"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offlineReservationController_1 = require("../controllers/offlineReservationController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const offlineReservationValidation_1 = require("../validation/offlineReservationValidation");
const router = (0, express_1.Router)();
const offlineReservationController = new offlineReservationController_1.OfflineReservationController();
// Route for Front-Office Offline Reservations (Walk-ins)
router.post('/', (0, validateMiddleware_1.validate)(offlineReservationValidation_1.createOfflineReservationSchema), offlineReservationController.createOfflineReservation);
exports.default = router;
//# sourceMappingURL=offlineReservationRoute.js.map