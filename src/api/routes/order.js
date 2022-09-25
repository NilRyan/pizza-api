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
  res.json(await getAllOrders.execute());
});

module.exports = router;
