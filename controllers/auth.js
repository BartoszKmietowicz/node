const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '85dad6385d5af0',
    pass: 'ae4ea4505eae22',
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    errorMessage: message,
  });
};
exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
    errorMessage: message,
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email,
    password = req.body.password,
    confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email already exists');

        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          if (hashedPassword) {
            const user = new User({
              email,
              password: hashedPassword,
              cart: { items: [] },
            });
            return user.save();
          }
        })
        .then((savedUser) => {
          if (savedUser) {
            res.redirect('/login');
            return transporter.sendMail({
              to: email,
              from: 'shop@node-complete.com',
              subject: 'Signup Succeeded',
              html: '<h1> signed up !</h1>',
            });
          }
        })
        .catch((err) => console.log(err));
    })

    .catch((err) => console.log(err));
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email,
    password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'invalid email or password');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'invalid email or password');
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
