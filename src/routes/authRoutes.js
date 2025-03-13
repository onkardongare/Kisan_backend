const express = require('express');
const { checkAuth, loginUser, createUser, logout } = require('../controllers/auth');
const passport = require('passport');

const router = express.Router();

// /auth is already added in the base path
router
    .post('/signup', createUser)
    .post('/login', loginUser) 
    .get('/check', passport.authenticate('jwt', { session: false }), checkAuth)  // Disable session
    .get('/logout', logout);

exports.router = router;