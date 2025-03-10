require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport-setup');
const taskRoutes = require('./routes/taskRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();

app.use(cors({ 
  origin: 'https://task-as5j.onrender.com', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions',
  ttl: 24 * 60 * 60,
});
sessionStore.on('error', (err) => {
  console.error('Session store error:', err);
});
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { 
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    path: '/'
  }
}));

app.use((req, res, next) => {
  console.log('Pre-Sync - Request Session ID:', req.sessionID);
  console.log('Pre-Sync - Request Session data:', req.session);
  console.log('Pre-Sync - Request Cookies:', req.cookies);
  console.log('Pre-Sync - Request Headers:', req.headers);
  if (req.cookies['connect.sid'] && !req.session.passport) {
    sessionStore.get(req.cookies['connect.sid'], (err, session) => {
      if (err) {
        console.error('Session store get error:', err);
        return next();
      }
      console.log('Stored session for connect.sid:', session);
      if (session) {
        req.session.passport = session.passport; 
        console.log('Session passport synced:', req.session);
      }
      next();
    });
  } else {
    next();
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('Post-Passport - Request Session ID:', req.sessionID);
  console.log('Post-Passport - Request Session data:', req.session);
  console.log('Post-Passport - Request User:', req.user ? req.user._id : 'No user');
  next();
});

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

app.get('/auth/google', passport.authenticate('google', { scope: scopes }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Callback - User:', req.user ? req.user._id : 'No user');
    console.log('Callback - Session before save:', req.session);
    req.session.passport = { user: req.user._id.toString() };
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).send('Session error');
      }
      console.log('Callback - Session after save:', req.session);
      console.log('Callback - Setting cookie connect.sid:', req.sessionID);
      res.setHeader('Set-Cookie', `connect.sid=${req.sessionID}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`);
      res.redirect('/api-docs');
    });
  }
);

app.get('/logout', (req, res) => {
  console.log('Logout - Session:', req.sessionID);
  req.logout((err) => {
    if (err) console.error('Logout error:', err);
    req.session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
      res.redirect('/');
    });
  });
});

app.get('/', (req, res) => {
  console.log('Home - Authenticated:', req.isAuthenticated());
  res.send(`
    <h1>Task Manager</h1>
    ${req.isAuthenticated() ? `<p>Welcome, ${req.user.displayName}!</p> <a href="/logout">Logout</a>` : `<a href="/auth/google">Login with Google</a>`}
  `);
});

const ensureAuthenticated = (req, res, next) => {
  console.log('ensureAuthenticated - Session:', req.sessionID, 'Authenticated:', req.isAuthenticated());
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized. Please log in with Google.' });
  }
  next();
};

app.use('/tasks', ensureAuthenticated, taskRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    withCredentials: true,
  }
}));

app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log('Response Headers:', res.getHeaders());
    originalSend.call(this, body);
  };
  next();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database!');
    await sessionStore.set('test-session', { test: 'working' });
    console.log('Session store test set successful');
  } catch (err) {
    console.error('Cannot connect to the database or session store:', err);
    process.exit(1);
  }
};

connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB error:', err);
});