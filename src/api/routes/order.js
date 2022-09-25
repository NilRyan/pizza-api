/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
const express = require('express');

const parser = require('../parser/parser');

const router = express.Router();

router.post('/', ({ body }, res) => {
  const { orderNumber, pizzas } = parser.parseOrders(body);
  const pizzaJson = parser.parsePizzas(pizzas);

  res.json([
    {
      orderNumber: Number(orderNumber),
      pizzas: pizzaJson,
    },
  ]);
});

module.exports = router;
