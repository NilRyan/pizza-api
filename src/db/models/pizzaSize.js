const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('pizza_sizes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    size: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  });
};
