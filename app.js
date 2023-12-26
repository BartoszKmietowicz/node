const path = require('path');

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopData = require('./routes/shop');

const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('658a4a8f1b0c3e040f36a4d5')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopData.routes);
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://Bartosz:Bartimos1@cluster0.ktuikdn.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Bartosz',
          email: 'test@test.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });


