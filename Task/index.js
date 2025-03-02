require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport-setup');
const taskRoutes = require('./routes/taskRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();

// Middleware
app.use(cors({ 
  origin: 'https://task-as5j.onrender.com', 
  credentials: true 
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 24 hours in seconds
  }),
  cookie: { 
    secure: true, // HTTPS on Render
    sameSite: 'lax', // For OAuth redirects
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // Prevent JS access
    path: '/' // Site-wide
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Debug Middleware: Log session and cookies
app.use((req, res, next) => {
  console.log('Request Session ID:', req.sessionID);
  console.log('Request Session data:', req.session);
  console.log('Request Cookies:', req.cookies);
  next();
});

// Authentication Routes
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

app.get('/auth/google', passport.authenticate('google', { scope: scopes }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Callback - User authenticated:', req.user ? req.user._id : 'No user');
    console.log('Callback - Session before regen:', req.session);
    // Regenerate session to ensure cookie is set
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regen error:', err);
        return res.status(500).send('Session error');
      }
      req.session.passport = { user: req.user._id }; // Explicitly set passport data
      console.log('Callback - Session after regen:', req.session);
      console.log('Callback - Setting cookie connect.sid:', req.sessionID);
      res.redirect('/api-docs');
    });
  }
);

app.get('/logout', (req, res) => {
  console.log('Logout - Session:', req.sessionID);
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    req.session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
      res.redirect('/');
    });
  });
});

// Home Route
app.get('/', (req, res) => {
  console.log('Home - Authenticated:', req.isAuthenticated());
  res.send(`
    <h1>Task Manager</h1>
    ${req.isAuthenticated() ? `<p>Welcome, ${req.user.displayName}!</p> <a href="/logout">Logout</a>` : `<a href="/auth/google">Login with Google</a>`}
  `);
});

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  console.log('ensureAuthenticated - Session:', req.sessionID, 'Authenticated:', req.isAuthenticated());
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized. Please log in with Google.' });
  }
  next();
};

// Task Routes
app.use('/tasks', ensureAuthenticated, taskRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    withCredentials: true,
  }
}));

// Debug Response Headers
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log('Response Headers:', res.getHeaders());
    originalSend.call(this, body);
  };
  next();
});

// Database Connection
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

// Start Server
connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB error:', err);
});