import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './database';
import { config } from './index';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId as string,
      clientSecret: config.google.clientSecret as string,
      callbackURL: config.google.callbackUrl,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, emails, name, photos } = profile;
        const email = emails?.[0].value.toLowerCase();

        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        let guest = await prisma.guest.findFirst({
          where: {
            OR: [
              { googleId },
              { email }
            ]
          }
        });

        if (!guest) {
          guest = await prisma.guest.create({
            data: {
              email,
              googleId,
              firstName: name?.givenName || 'Guest',
              lastName: name?.familyName || '',
              profileImage: photos?.[0]?.value,
              isVerified: true,
            },
          });
        } else {
          // Link Google ID if not present and update profile image if missing
          const updateData: any = { isVerified: true };
          if (!guest.googleId) updateData.googleId = googleId;
          if (!guest.profileImage) updateData.profileImage = photos?.[0]?.value;

          guest = await prisma.guest.update({
            where: { id: guest.id },
            data: updateData,
          });
        }

        return done(null, guest);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// We are using JWT, so we don't need sessions, but Passport requires these to be defined if not using sessions?
// Actually, if we use passport.authenticate('google', { session: false }), we don't need serialize/deserialize.
