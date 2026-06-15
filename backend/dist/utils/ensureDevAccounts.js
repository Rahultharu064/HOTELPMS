"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDevAccounts = ensureDevAccounts;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const config_1 = require("../config");
/**
 * Ensures dev guest/admin accounts exist on startup (development only).
 * Set DEV_GUEST_EMAIL / DEV_ADMIN_EMAIL in backend/.env to use your own email.
 */
async function ensureDevAccounts() {
    if (!config_1.config.dev.helpersEnabled)
        return;
    const { guestEmail, guestPassword, adminEmail, adminPassword } = config_1.config.dev;
    if (guestEmail) {
        const hashed = await bcryptjs_1.default.hash(guestPassword, 10);
        await database_1.prisma.guest.upsert({
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
        const hashed = await bcryptjs_1.default.hash(adminPassword, 10);
        await database_1.prisma.admin.upsert({
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
//# sourceMappingURL=ensureDevAccounts.js.map