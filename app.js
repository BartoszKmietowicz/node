const path = require('path');

const express = require('express');
const app = express();

const mongoConnect = require('./util/database').mongoConnect;

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopData = require('./routes/shop');

const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('658277b07b7e5b4126ebc028')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopData.routes);
app.use(errorController.get404);
mongoConnect(() => {
  app.listen(3000);
});


