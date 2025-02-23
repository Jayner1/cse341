require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const taskRoutes = require('./routes/taskRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

app.get('/auth/google', passport.authenticate('google', { scope: scopes }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/api-docs'); 
  }
);

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/'); 
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Task Manager</h1>
    ${req.isAuthenticated() ? `<p>Welcome, ${req.user.displayName}!</p> <a href="/logout">Logout</a>` : `<a href="/auth/google">Login with Google</a>`}
  `);
});

app.use('/tasks', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized. Please log in with Google.' });
  }
  next();
}, taskRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database!');
  } catch (err) {
    console.error('Cannot connect to the database!', err);
    process.exit(1);
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
