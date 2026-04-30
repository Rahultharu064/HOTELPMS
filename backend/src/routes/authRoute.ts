import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import { authenticate } from '../middlewares/authMiddleware';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';

const router = Router();
const authController = new AuthController();

// Multer config for profile images
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    phone: z.string().min(8),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const googleLoginSchema = z.object({
  body: z.object({
    tokenId: z.string(),
  }),
});

const requestOTPSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const verifyOTPSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(6),
  }),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/google', validate(googleLoginSchema), authController.googleLogin);
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);
router.post('/resend-otp', validate(requestOTPSchema), authController.resendOTP);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get('/me', authenticate as any, authController.getMe);
router.put('/profile', authenticate as any, authController.updateProfile);
router.post('/profile-image', authenticate as any, upload.single('image'), authController.updateProfileImage);

export default router;
