const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('pizza_types', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  });
};
