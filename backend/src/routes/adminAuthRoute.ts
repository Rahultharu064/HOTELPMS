import { Router } from 'express';
import { AdminAuthController } from '../controllers/adminAuthController';
import { validate } from '../middlewares/validateMiddleware';
import { authenticateAdmin } from '../middlewares/adminAuthMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { config } from '../config';

const router = Router();
const adminAuthController = new AdminAuthController();

// Strict rate limiter for production; relaxed in development for automated testing
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isProduction ? 5 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
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
router.post('/skip-password-change', authenticateAdmin as any, adminAuthController.skipPasswordChange);
router.post('/avatar', authenticateAdmin as any, upload.single('avatar'), adminAuthController.updateAvatar);

export default router;
