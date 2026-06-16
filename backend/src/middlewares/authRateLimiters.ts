import rateLimit from 'express-rate-limit';
import { config } from '../config';

const rateLimitResponse = (message: string) => ({
  success: false,
  message,
});

const devMax = (productionMax: number) => (config.isProduction ? productionMax : 200);

export const authLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: devMax(10),
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many login attempts. Please try again in 15 minutes.'),
});

export const authRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: devMax(5),
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many registration attempts. Please try again later.'),
});

export const authOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: devMax(10),
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many verification attempts. Please try again in 15 minutes.'),
});

export const authResendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many OTP resend requests. Please wait before trying again.'),
});

export const authForgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many password reset requests. Please try again later.'),
});
