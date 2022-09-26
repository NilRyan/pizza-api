function applyAssociations(sequelize) {
  const {
    orders,
    pizzas,
    pizza_crusts,
    pizza_sizes,
    pizza_toppings,
    pizza_types,
    toppings_pizza_area,
  } = sequelize.models;

  pizzas.belongsTo(pizza_crusts);
  pizzas.belongsTo(pizza_sizes);
  pizzas.belongsTo(pizza_types);

  orders.hasMany(pizzas);

  // NOTE: Sequelize does not fetch all associations
  pizzas.belongsToMany(pizza_toppings, {
    through: { model: toppings_pizza_area, unique: false },
  });
  pizza_toppings.belongsToMany(pizzas, {
    through: { model: toppings_pizza_area, unique: false },
  });
}

module.exports = { applyAssociations };
