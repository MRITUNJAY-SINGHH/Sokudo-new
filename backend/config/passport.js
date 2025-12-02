import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Customer from '../models/customerModel.js';

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
         try {
            const email = profile.emails?.[0]?.value;
            let user = await Customer.findOne({
               $or: [{ googleId: profile.id }, { email }],
            });
            if (!user) {
               user = await Customer.create({
                  name: profile.displayName || email,
                  email,

                  password: Math.random().toString(36).slice(-12),
                  googleId: profile.id,
                  provider: 'google',
                  avatar: profile.photos?.[0]?.value,
                  isVerify: true,
               });
            } else if (!user.googleId) {
               user.googleId = profile.id;
               user.provider = 'google';
               user.avatar = profile.photos?.[0]?.value;
               user.isVerify = true;
               await user.save();
            }
            done(null, user);
         } catch (err) {
            done(err, null);
         }
      }
   )
);

export default passport;
