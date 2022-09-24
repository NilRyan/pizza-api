const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('pizza_toppings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    topping: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  });
};
