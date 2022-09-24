const express = require('express');

const router = express.Router();

router.post('/order', (req, res) => {
  res.json(['{}']);
});

module.exports = router;
