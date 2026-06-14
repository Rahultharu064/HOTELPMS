import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import { authenticate } from '../middlewares/authMiddleware';
import {
  authForgotPasswordLimiter,
  authLoginLimiter,
  authOtpLimiter,
  authRegisterLimiter,
  authResendOtpLimiter,
} from '../middlewares/authRateLimiters';
import { z } from 'zod';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();
const authController = new AuthController();

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    phone: z.string().min(8),
    password: passwordSchema,
    firstName: z.string().min(2),
    lastName: z.string().min(2),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
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
    newPassword: passwordSchema,
  }),
});


router.post('/register', authRegisterLimiter, validate(registerSchema), authController.register);
router.post('/login', authLoginLimiter, validate(loginSchema), authController.login);
router.post('/google', authLoginLimiter, validate(googleLoginSchema), authController.googleLogin);

// Passport Google Routes
router.get('/google/login', (req, res, next) => {
  const state = req.query.state ? String(req.query.state) : 'production';
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    session: false, 
    state,
    prompt: 'select_account'
  })(req, res, next);
});
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), authController.passportGoogleCallback);

router.post('/verify-otp', authOtpLimiter, validate(verifyOTPSchema), authController.verifyOTP);
router.post('/resend-otp', authResendOtpLimiter, validate(requestOTPSchema), authController.resendOTP);
router.post('/forgot-password', authForgotPasswordLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authForgotPasswordLimiter, validate(resetPasswordSchema), authController.resetPassword);

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
