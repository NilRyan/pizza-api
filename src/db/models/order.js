const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('orders', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
  });
};
