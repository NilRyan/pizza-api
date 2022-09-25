const express = require('express');

const orders = require('./routes/order');

const router = express.Router();
router.use('/orders', orders);

module.exports = router;
