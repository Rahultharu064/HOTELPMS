import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { config } from '../config';

const SEED_ADMIN = {
  email: 'admin@hotelpms.com',
  password: 'admin123',
  name: 'Super Admin',
};

const SEED_GUEST = {
  email: 'john.doe@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
};

async function ensureSeedAdmin(): Promise<void> {
  const hashed = await bcrypt.hash(SEED_ADMIN.password, 10);
  await prisma.admin.upsert({
    where: { email: SEED_ADMIN.email },
    update: {
      password: hashed,
      isActive: true,
      role: 'superadmin',
      loginAttempts: 0,
      lockedUntil: null,
    },
    create: {
      email: SEED_ADMIN.email,
      password: hashed,
      name: SEED_ADMIN.name,
      role: 'superadmin',
      isActive: true,
    },
  });
  console.log(`[Dev] Seed admin ready: ${SEED_ADMIN.email}`);
}

async function ensureSeedGuest(): Promise<void> {
  const hashed = await bcrypt.hash(SEED_GUEST.password, 10);
  await prisma.guest.upsert({
    where: { email: SEED_GUEST.email },
    update: {
      password: hashed,
      isVerified: true,
      otp: null,
      otpExpires: null,
    },
    create: {
      email: SEED_GUEST.email,
      phone: SEED_GUEST.phone,
      password: hashed,
      firstName: SEED_GUEST.firstName,
      lastName: SEED_GUEST.lastName,
      isVerified: true,
    },
  });
  console.log(`[Dev] Seed guest ready: ${SEED_GUEST.email}`);
}

/**
 * Ensures dev/test accounts exist on startup (development only).
 * Always provisions seed accounts used by TestSprite and local QA.
 * Optional DEV_* env accounts are added when ENABLE_DEV_AUTH_HELPERS=true.
 */
export async function ensureDevAccounts(): Promise<void> {
  if (config.isProduction) return;

  try {
    await ensureSeedAdmin();
    await ensureSeedGuest();

    if (!config.dev.helpersEnabled) return;

    const { guestEmail, guestPassword, adminEmail, adminPassword } = config.dev;

    if (guestEmail && guestEmail !== SEED_GUEST.email) {
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

    if (adminEmail && adminEmail !== SEED_ADMIN.email) {
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
  } catch (error) {
    console.warn('[Dev] Could not provision test accounts:', error instanceof Error ? error.message : error);
  }
}
