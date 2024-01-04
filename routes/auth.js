const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);
router.post(
  '/signup',
  check('email', 'Please enter a valid email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('Email already exists');
        }
      });
    }),
  check('password', 'enter a valid password')
    .trim()
    .isLength({ min: 6 })
    .isAlphanumeric(),
  check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    }),
  authController.postSignup
);
router.post(
  '/login',
  check('email', 'invalid email or password').isEmail().normalizeEmail(),
  check('password', 'invalid email or password').trim().isLength({ min: 6 }),

  authController.postLogin
);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/newPassword', authController.postNewPassword);

module.exports = router;
