const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue:
      'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = Product;
