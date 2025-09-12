const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

// Serialize/Deserialize (not using sessions but kept for completeness)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/ecocollect/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find existing user by googleId or email
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: email,
            name: profile.displayName,
            avatar: profile.photos && profile.photos[0] && profile.photos[0].value,
          });
        } else if (!user.googleId) {
          // Link google account if existing email user
            user.googleId = profile.id;
            if (!user.name) user.name = profile.displayName;
            if (!user.avatar && profile.photos && profile.photos[0]) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
