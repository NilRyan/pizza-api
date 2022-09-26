const express = require('express');

const parser = require('../parser/parser');
const getAllOrders = require('../modules/orders/useCases/getAllOrders/getAllOrders');
const orderPizza = require('../modules/orders/useCases/orderPizza/orderPizza');

const router = express.Router();

router.post('/', async ({ body }, res, next) => {
  let parsedPml;

  try {
    parsedPml = parser.parseToJson(body);
    await orderPizza.execute(parsedPml);
  } catch (e) {
    res.status(422);
    return next(e);
  }

  res.json(parsedPml);
});

router.get('/', async (req, res) => {
  const response = await getAllOrders.execute();
  res.json(mapper(response));
});

function mapper(response) {
  return response.map((order) => ({
    orderNumber: order.id,
    pizzas: order.pizzas.map((pizza) => {
      const toppings = [];
      if (pizza.pizza_type.type === 'custom') {
        console.log(pizza.pizza_toppings)
        for (let index = 0; index < 3; index++) {
          const items = pizza.pizza_toppings
            .filter(
              ({ toppings_pizza_area }) => toppings_pizza_area.area === index,
            )
            .map(({ topping }) => topping);
          toppings.push({
            area: index,
            items,
          });
        }
      }

      return {
        number: pizza.number,
        crust: pizza.pizza_crust.crust,
        size: pizza.pizza_size.size,
        type: pizza.pizza_type.type,
        toppings,
        toppingsTotal: pizza.pizza_toppings.length,
      };
    }),
  }));
}

module.exports = router;
