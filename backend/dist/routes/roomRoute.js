"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controllers/roomController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const roomController = new roomController_1.RoomController();
// Configure Multer for multi-file uploads (images & videos)
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
});
router.get('/', roomController.getAllRooms);
router.post('/', (req, res, next) => {
    const uploadHandler = upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 3 },
    ]);
    uploadHandler(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({ success: false, message: 'File is too large. Max size is 500MB.' });
                return;
            }
            res.status(400).json({ success: false, message: err.message });
            return;
        }
        else if (err) {
            res.status(500).json({ success: false, message: err.message || 'Unknown upload error' });
            return;
        }
        next();
    });
}, roomController.createRoom);
router.get('/guest-favorites', roomController.getGuestFavorites);
router.get('/:id', roomController.getRoomById);
router.put('/:id', (req, res, next) => {
    const uploadHandler = upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 3 },
    ]);
    uploadHandler(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({ success: false, message: 'File is too large. Max size is 500MB.' });
                return;
            }
            res.status(400).json({ success: false, message: err.message });
            return;
        }
        else if (err) {
            res.status(500).json({ success: false, message: err.message || 'Unknown upload error' });
            return;
        }
        next();
    });
}, roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);
exports.default = router;
//# sourceMappingURL=roomRoute.js.map