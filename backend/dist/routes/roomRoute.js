"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controllers/roomController");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const roomController = new roomController_1.RoomController();
const adminGuard = [
    adminAuthMiddleware_1.authenticateAdmin,
    (0, adminAuthMiddleware_1.authorizeRoles)('superadmin', 'admin', 'manager'),
];
const roomUpload = uploadMiddleware_1.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
]);
// Helper to handle multer errors
const handleMulterError = (req, res, next) => {
    roomUpload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
        }
        else if (err) {
            return res.status(500).json({ success: false, message: err.message || 'Unknown upload error' });
        }
        next();
    });
};
// Public — browsing
router.get('/', roomController.getAllRooms);
router.get('/guest-favorites', roomController.getGuestFavorites);
router.get('/:id', roomController.getRoomById);
// Admin — CRUD
router.post('/', ...adminGuard, handleMulterError, roomController.createRoom);
router.put('/:id', ...adminGuard, handleMulterError, roomController.updateRoom);
router.delete('/:id', ...adminGuard, roomController.deleteRoom);
router.delete('/:roomId/images/:imageId', ...adminGuard, roomController.deleteImage);
exports.default = router;
//# sourceMappingURL=roomRoute.js.map