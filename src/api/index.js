const express = require('express');

const emojis = require('./emojis');
const orders = require('./routes/order');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/orders', orders);

module.exports = router;
