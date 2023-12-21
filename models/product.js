const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }
  save() {
    const db = getDb();

    let dbOp;
    if (this._id) {
      dbOp = db.collection('products').updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        {
          $set: this,
        }
      );
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }
  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .findOne({ _id: new mongodb.ObjectId(prodId) })
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }
  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => console.log('deleted'))
      .catch((err) => console.log(err));
  }
}
// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     defaultValue:
//       'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });
module.exports = Product;
