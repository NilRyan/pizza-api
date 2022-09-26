const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('toppings_pizza_area', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    area: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 2,
      },
    },
  });
};
