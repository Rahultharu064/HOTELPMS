"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomTypeController_1 = require("../controllers/roomTypeController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const roomTypeValidation_1 = require("../validation/roomTypeValidation");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
const roomTypeController = new roomTypeController_1.RoomTypeController();
// Get all room types with pagination and filters
router.get('/', (0, validateMiddleware_1.validate)(roomTypeValidation_1.getRoomTypesSchema), roomTypeController.getAllRoomTypes);
// Get room type by ID
router.get('/:id', roomTypeController.getRoomTypeById);
// Create room type
router.post('/', uploadMiddleware_1.upload.single('image'), (0, validateMiddleware_1.validate)(roomTypeValidation_1.createRoomTypeSchema), roomTypeController.createRoomType);
// Update room type
router.put('/:id', uploadMiddleware_1.upload.single('image'), (0, validateMiddleware_1.validate)(roomTypeValidation_1.updateRoomTypeSchema), roomTypeController.updateRoomType);
// Delete room type
router.delete('/:id', roomTypeController.deleteRoomType);
exports.default = router;
//# sourceMappingURL=roomTypeRoute.js.map