const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) { return next(error); }
    res.redirect('/'); 
  });
});

module.exports = router;
