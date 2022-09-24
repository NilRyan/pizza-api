function applyAssociations(sequelize) {
  const {
    orders, pizzas, pizza_crusts, pizza_sizes, pizza_toppings, pizza_types, toppings_pizza_area,
  } = sequelize.models;

  pizzas.belongsTo(pizza_crusts);
  pizzas.belongsTo(pizza_sizes);
  pizzas.belongsTo(pizza_types);

  orders.hasMany(pizzas);
  pizzas.belongsToMany(pizza_toppings, { through: toppings_pizza_area });
}

module.exports = { applyAssociations };
