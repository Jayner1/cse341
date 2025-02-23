const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/userModel');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login Route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});

// Route to show user profile
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`<h1>Hello ${req.user.username}</h1><a href="/logout">Logout</a>`);
});

module.exports = router;
