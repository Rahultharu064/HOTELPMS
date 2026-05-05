"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkInOutController_1 = require("../controllers/checkInOutController");
const router = (0, express_1.Router)();
const controller = new checkInOutController_1.CheckInOutController();
router.post('/booking/:id/checkin', controller.checkIn);
router.post('/booking/:id/checkout', controller.checkOut);
router.post('/booking/:id/no-show', controller.markNoShow);
router.post('/booking/:id/verify-identity', controller.verifyIdentity);
router.get('/booking/:id/folio', controller.getFolio);
exports.default = router;
//# sourceMappingURL=checkInOutRoute.js.map