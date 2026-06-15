"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const database_1 = require("./database");
const index_1 = require("./index");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: index_1.config.google.clientId,
    clientSecret: index_1.config.google.clientSecret,
    callbackURL: '/api/auth/google/callback',
    proxy: true,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const { id: googleId, emails, name, photos } = profile;
        const email = emails?.[0].value.toLowerCase();
        if (!email) {
            return done(new Error('No email found in Google profile'));
        }
        let guest = await database_1.prisma.guest.findFirst({
            where: {
                OR: [
                    { googleId },
                    { email }
                ]
            }
        });
        if (!guest) {
            guest = await database_1.prisma.guest.create({
                data: {
                    email,
                    googleId,
                    firstName: name?.givenName || 'Guest',
                    lastName: name?.familyName || '',
                    profileImage: photos?.[0]?.value,
                    isVerified: true,
                },
            });
        }
        else {
            // Link Google ID if not present and update profile image if missing
            const updateData = { isVerified: true };
            if (!guest.googleId)
                updateData.googleId = googleId;
            if (!guest.profileImage)
                updateData.profileImage = photos?.[0]?.value;
            guest = await database_1.prisma.guest.update({
                where: { id: guest.id },
                data: updateData,
            });
        }
        return done(null, guest);
    }
    catch (error) {
        return done(error);
    }
}));
// We are using JWT, so we don't need sessions, but Passport requires these to be defined if not using sessions?
// Actually, if we use passport.authenticate('google', { session: false }), we don't need serialize/deserialize.
//# sourceMappingURL=passport.js.map