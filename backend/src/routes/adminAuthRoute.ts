import { Router } from 'express';
import { AdminAuthController } from '../controllers/adminAuthController';
import { validate } from '../middlewares/validateMiddleware';
import { authenticateAdmin } from '../middlewares/adminAuthMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const router = Router();
const adminAuthController = new AdminAuthController();

// Strict rate limiter specifically for admin logins to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per IP
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  }
});

const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password is required"),
  }),
});

router.post('/login', loginLimiter, validate(adminLoginSchema), adminAuthController.login);

// Protected routes
router.get('/me', authenticateAdmin as any, adminAuthController.getMe);
router.post('/change-password', authenticateAdmin as any, adminAuthController.changePassword);
router.post('/avatar', authenticateAdmin as any, upload.single('avatar'), adminAuthController.updateAvatar);

export default router;
