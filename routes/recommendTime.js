const express = require('express');
const router = express.Router();
const { getGasPrice } = require('../model/gasPriceFetcher');

router.get('/', async (req, res) => {
  try {
    const gasData = await getGasPrice();
    let message = "❗ Gas price is a bit high, you may wait.";
    if (gasData.maxFeePerGas < 1.2) {
      message = "✅ It's a good time to send transactions!";
    }
    res.json({ recommendation: message, ...gasData });
  } catch (err) {
    res.status(500).json({ error: "Recommendation failed." });
  }
});

module.exports = router;