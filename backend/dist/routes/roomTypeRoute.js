"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomTypeController_1 = require("../controllers/roomTypeController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const roomTypeValidation_1 = require("../validation/roomTypeValidation");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const router = (0, express_1.Router)();
const roomTypeController = new roomTypeController_1.RoomTypeController();
const adminGuard = [
    adminAuthMiddleware_1.authenticateAdmin,
    (0, adminAuthMiddleware_1.authorizeRoles)('superadmin', 'admin', 'manager'),
];
// Get all room types with pagination and filters
router.get('/', (0, validateMiddleware_1.validate)(roomTypeValidation_1.getRoomTypesSchema), roomTypeController.getAllRoomTypes);
// Get room type by ID
router.get('/:id', roomTypeController.getRoomTypeById);
// Create room type
router.post('/', ...adminGuard, uploadMiddleware_1.upload.single('image'), (0, validateMiddleware_1.validate)(roomTypeValidation_1.createRoomTypeSchema), roomTypeController.createRoomType);
// Update room type
router.put('/:id', ...adminGuard, uploadMiddleware_1.upload.single('image'), (0, validateMiddleware_1.validate)(roomTypeValidation_1.updateRoomTypeSchema), roomTypeController.updateRoomType);
// Delete room type
router.delete('/:id', ...adminGuard, roomTypeController.deleteRoomType);
exports.default = router;
//# sourceMappingURL=roomTypeRoute.js.map