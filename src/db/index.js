/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
const { Sequelize } = require('sequelize');
const { applyAssociations } = require('./associations');
const dbConfig = require('../config/db.config');

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  port: dbConfig.PORT,
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  benchmark: true,
  logging: false,
});

const modelDefiners = [
  require('./models/order'),
  require('./models/pizza'),
  require('./models/pizzaCrust'),
  require('./models/pizzaSize'),
  require('./models/pizzaToppings'),
  require('./models/pizzaType'),
  require('./models/toppingsPizzaArea'),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyAssociations(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
