import crypto from 'crypto';

/** Cryptographically secure 6-digit OTP */
export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}
