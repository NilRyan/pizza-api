const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('pizza_crusts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    crust: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  });
};
