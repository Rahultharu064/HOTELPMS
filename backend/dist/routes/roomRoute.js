"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controllers/roomController");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const roomController = new roomController_1.RoomController();
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
router.get('/', roomController.getAllRooms);
router.post('/', handleMulterError, roomController.createRoom);
router.get('/guest-favorites', roomController.getGuestFavorites);
router.get('/:id', roomController.getRoomById);
router.put('/:id', handleMulterError, roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);
exports.default = router;
//# sourceMappingURL=roomRoute.js.map