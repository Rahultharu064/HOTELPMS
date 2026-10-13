import { Router } from 'express';
import { RoomController } from '../controllers/roomController';
import { upload } from '../middlewares/uploadMiddleware';
import multer from 'multer';

const router = Router();
const roomController = new RoomController();

const roomUpload = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 3 },
]);

// Helper to handle multer errors
const handleMulterError = (req: any, res: any, next: any) => {
  roomUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
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

export default router;