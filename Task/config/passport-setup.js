const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); 
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth profile received:', {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails ? profile.emails[0].value : 'N/A',
        });

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            image: profile.photos ? profile.photos[0].value : null, 
          });
          await user.save();
          console.log('New user created:', user._id);
        } else {
          console.log('Existing user found:', user._id);
        }
        return done(null, user);
      } catch (err) {
        console.error('Error in Google Strategy:', err.message);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log('User not found for ID:', id);
      return done(null, false); 
    }
    console.log('Deserialized user:', user.id);
    done(null, user);
  } catch (err) {
    console.error('Error deserializing user:', err.message);
    done(err, null);
  }
});

module.exports = passport;