const express = require('express');

const parser = require('../parser/parser');
const { models } = require('../../db');

const router = express.Router();

router.post('/', async ({ body }, res, next) => {
  let orderNumber;
  let pizzas;
  let pizzaJson;
  try {
    const parsedOrders = parser.parseOrders(body);
    orderNumber = parsedOrders.orderNumber;
    pizzas = parsedOrders.pizzas;
    pizzaJson = parser.parsePizzas(pizzas);
  } catch (e) {
    res.status(422);
    return next(e);
  }
  const response = {
    orderNumber: Number(orderNumber),
    pizzas: pizzaJson,
  };

  // TODO: refactor put in own file
  const orderExists = await models.orders.findOne({
    where: {
      id: orderNumber,
    },
  });
  if (orderExists) {
    res.status(422);
    return next(new Error('Order already exists'));
  }
  const order = await models.orders.create({
    id: response.orderNumber,
  });
  response.pizzas.forEach(async (pizza) => {
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

  res.json(response);
});

router.get('/', async (req, res) => {
  const orders = await models.orders.findAll({
    include: {
      all: true,
      nested: true,
    },
  });
  res.json(orders);
});

module.exports = router;
