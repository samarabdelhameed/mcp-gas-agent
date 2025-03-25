const express = require('express');
const router = express.Router();
const { getGasPrice } = require('../model/gasPriceFetcher');

router.get('/', async (req, res) => {
  try {
    const gasData = await getGasPrice();
    res.json(gasData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gas price" });
  }
});

module.exports = router;