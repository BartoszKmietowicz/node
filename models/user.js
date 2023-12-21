const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, id) {
    this.username = username;
    this.email = email;
    this._id = id;
  }

  save() {
    const db = getDb();
    dbOp = db.collection('users').createOne(this);
    return dbOp
      .then(() => console.log('created user'))
      .catch((err) => console.log(err));
  }
  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = User;
