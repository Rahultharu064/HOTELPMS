"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const extraServiceController_1 = require("../controllers/extraServiceController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const extraServiceValidation_1 = require("../validation/extraServiceValidation");
const router = (0, express_1.Router)();
const extraServiceController = new extraServiceController_1.ExtraServiceController();
// Management Routes
router.get('/', extraServiceController.getExtraServices);
router.post('/', uploadMiddleware_1.upload.single('image'), (0, validateMiddleware_1.validate)(extraServiceValidation_1.createExtraServiceSchema), extraServiceController.createExtraService);
router.put('/:id', uploadMiddleware_1.upload.single('image'), (0, validateMiddleware_1.validate)(extraServiceValidation_1.updateExtraServiceSchema), extraServiceController.updateExtraService);
router.delete('/:id', (0, validateMiddleware_1.validate)(extraServiceValidation_1.idParamSchema), extraServiceController.deleteExtraService);
// Booking Association Routes
router.get('/booking/:bookingId', (0, validateMiddleware_1.validate)(extraServiceValidation_1.bookingParamsSchema), extraServiceController.getBookingExtraServices);
router.post('/booking', (0, validateMiddleware_1.validate)(extraServiceValidation_1.addServiceToBookingSchema), extraServiceController.addExtraServiceToBooking);
router.delete('/booking/:id', (0, validateMiddleware_1.validate)(extraServiceValidation_1.idParamSchema), extraServiceController.removeExtraServiceFromBooking);
exports.default = router;
//# sourceMappingURL=extraServiceRoute.js.map