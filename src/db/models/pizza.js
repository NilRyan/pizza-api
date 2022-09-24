const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('pizzas', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    number: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
};
