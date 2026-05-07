import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import { authenticate } from '../middlewares/authMiddleware';
import { z } from 'zod';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();
const authController = new AuthController();

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

// Passport Google Routes
router.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), authController.passportGoogleCallback);

router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);
router.post('/resend-otp', validate(requestOTPSchema), authController.resendOTP);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get('/me', authenticate as any, authController.getMe);
router.put('/profile', authenticate as any, authController.updateProfile);

// Wrapper for upload middleware to catch and expose Multer/Cloudinary errors
const uploadMiddleware = (req: any, res: any, next: any) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      console.error('Upload Middleware Error:', err);
      return res.status(500).json({
        success: false,
        message: 'Image upload failed. Please check Cloudinary credentials.',
        error: err.message || err.toString()
      });
    }
    next();
  });
};

router.post('/profile-image', authenticate as any, uploadMiddleware, authController.updateProfileImage);

export default router;
