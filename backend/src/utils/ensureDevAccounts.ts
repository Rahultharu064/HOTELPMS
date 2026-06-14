import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { config } from '../config';

/**
 * Ensures dev guest/admin accounts exist on startup (development only).
 * Set DEV_GUEST_EMAIL / DEV_ADMIN_EMAIL in backend/.env to use your own email.
 */
export async function ensureDevAccounts(): Promise<void> {
  if (!config.dev.helpersEnabled) return;

  const { guestEmail, guestPassword, adminEmail, adminPassword } = config.dev;

  if (guestEmail) {
    const hashed = await bcrypt.hash(guestPassword, 10);
    await prisma.guest.upsert({
      where: { email: guestEmail },
      update: {
        password: hashed,
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
      create: {
        email: guestEmail,
        phone: '+9779800000000',
        password: hashed,
        firstName: 'Dev',
        lastName: 'Guest',
        isVerified: true,
      },
    });
    console.log(`[Dev] Guest account ready: ${guestEmail}`);
  }

  if (adminEmail) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: {
        password: hashed,
        isActive: true,
        role: 'superadmin',
        loginAttempts: 0,
        lockedUntil: null,
      },
      create: {
        email: adminEmail,
        password: hashed,
        name: 'Dev Super Admin',
        role: 'superadmin',
        isActive: true,
      },
    });
    console.log(`[Dev] Super admin ready: ${adminEmail}`);
  }
}
