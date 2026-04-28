import { Router } from 'express';
import { RoomController } from '../controllers/roomController';
import multer from 'multer';
import path from 'path';

const router = Router();
const roomController = new RoomController();

// Configure Multer for multi-file uploads (images & videos)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
});

router.get('/', roomController.getAllRooms);
router.post('/', (req, res, next) => {
  const uploadHandler = upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
  ]);

  uploadHandler(req, res, (err: any): void => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ success: false, message: 'File is too large. Max size is 500MB.' });
        return;
      }
      res.status(400).json({ success: false, message: err.message });
      return;
    } else if (err) {
      res.status(500).json({ success: false, message: err.message || 'Unknown upload error' });
      return;
    }
    next();
  });
}, roomController.createRoom);

router.get('/:id', roomController.getRoomById);
router.put('/:id', (req, res, next) => {
  const uploadHandler = upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
  ]);

  uploadHandler(req, res, (err: any): void => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ success: false, message: 'File is too large. Max size is 500MB.' });
        return;
      }
      res.status(400).json({ success: false, message: err.message });
      return;
    } else if (err) {
      res.status(500).json({ success: false, message: err.message || 'Unknown upload error' });
      return;
    }
    next();
  });
}, roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

export default router;