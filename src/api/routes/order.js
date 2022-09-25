const express = require('express');

const router = express.Router();

router.post('/', ({ body }, res) => {
  const pml = body;
  const { orderNumber, pizzas } = parseOrders(body);
  const pizzaJson = parsePizzas(pizzas);

  res.json([
    {
      orderNumber: Number(orderNumber),
      pizzas: [
        {
          number: 1,
          size: 'large',
          crust: 'hand-tossed',
          type: 'custom',
          toppings: [
            {
              area: 0,
              items: ['pepperoni', 'extra cheese'],
            },
            {
              area: 1,
              items: ['sausage'],
            },
            {
              area: 2,
              items: ['mushrooms'],
            },
          ],
        },
        {
          number: 2,
          size: 'medium',
          crust: 'deep dish',
          type: 'pepperoni feast',
          toppings: [],
        },
      ],
    },
  ]);
});

function parseOrders(pml) {
  const orderNumberRegex = /^{order number="(.+?)"}(.+?){\\order}$/ms;
  const match = pml.match(orderNumberRegex);
  if (match === null) {
    return {
      orderNumber: null,
      pizzas: null,
    };
  }
  return {
    orderNumber: match[1],
    pizzas: match[2],
  };
}
function parsePizzas(pizzas) {
  const pizzaRegex = /{pizza number="(.+?)"}(.+?){\\pizza}/gms;
  const pizzaDetailsList = [];
  for (const match of pizzas.matchAll(pizzaRegex)) {
    pizzaDetailsList.push({
      pizzaNumber: Number(match[1]),
      pizzaDetails: match[2],
    });
  }
  parsePizzaElements(pizzaDetailsList[0].pizzaDetails);

  const pizzaJson = pizzaDetailsList.map(({ pizzaNumber, pizzaDetails }) => {
    const pizzaElements = parsePizzaElements(pizzaDetails);
    return {
      pizzaNumber,
      ...pizzaElements,
    };
  });
  console.log(pizzaJson)
  // TODO: Add validation pizza numbers must be 1-24 only
  return pizzaJson;
}

function parsePizzaElements(pizza) {
  const pizzaElementsRegex =
    /{size}(.+?){\\size}\s*{crust}(.+?){\\crust}\s*{type}(.+?){\\type}/m;
  const match = pizza.match(pizzaElementsRegex);
  if (match === null) {
    return {
      size: null,
      crust: null,
      type: null,
    };
  }
  return {
    size: match[1],
    crust: match[2],
    type: match[3],
  };
}
module.exports = router;
