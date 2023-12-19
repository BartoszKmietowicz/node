const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('node-complete', 'root', 'Bartimos1', {
  dialect: 'mysql',
  host: 'localhost',
});
module.exports = sequelize;
