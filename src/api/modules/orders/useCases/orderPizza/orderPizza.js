const { models } = require('../../../../../db');

async function execute(parsedPml) {
  const orderExists = await models.orders.findOne({
    where: {
      id: parsedPml.orderNumber,
    },
  });
  if (orderExists) {
    throw new Error('Order already exists');
  }
  const order = await models.orders.create({
    id: parsedPml.orderNumber,
  });
  parsedPml.pizzas.forEach(async (pizza) => {
    const [size] = await models.pizza_sizes.findOrCreate({
      where: {
        size: pizza.size,
      },
    });
    const [crust] = await models.pizza_crusts.findOrCreate({
      where: {
        crust: pizza.crust,
      },
    });

    const [type] = await models.pizza_types.findOrCreate({
      where: {
        type: pizza.type,
      },
    });
    const pizzaModel = await models.pizzas.create({
      orderId: order.getDataValue('id'),
      number: pizza.pizzaNumber,
      pizzaSizeId: size.getDataValue('id'),
      pizzaCrustId: crust.getDataValue('id'),
      pizzaTypeId: type.getDataValue('id'),
    });

    if (type.getDataValue('type') === 'custom') {
      pizza.toppings.forEach(async ({ area, items }) => {
        items.forEach(async (item) => {
          const [toppings] = await models.pizza_toppings.findOrCreate({
            where: {
              topping: item,
            },
          });

          await models.toppings_pizza_area.create({
            area,
            pizzaId: pizzaModel.getDataValue('id'),
            pizzaToppingId: toppings.getDataValue('id'),
          });
        });
      });
    }
  });
}

module.exports = {
  execute,
};
