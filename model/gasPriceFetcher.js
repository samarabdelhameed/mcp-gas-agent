const axios = require('axios');
const API_KEY = '8f11d3d9-b0ef-4f3b-b717-e8747477ba8a';

async function getGasPrice() {
  const response = await axios.get('https://api.blocknative.com/gasprices/blockprices', {
    headers: { 'Authorization': API_KEY }
  });
  const prices = response.data.blockPrices[0].estimatedPrices[1];
  return {
    maxFeePerGas: prices.maxFeePerGas,
    maxPriorityFeePerGas: prices.maxPriorityFeePerGas,
    confidence: prices.confidence
  };
}

module.exports = { getGasPrice };