const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// API Keys
const blocknativeAPI = '8f11d3d9-b0ef-4f3b-b717-e8747477ba8a';
const bscScanAPI = '8CPZU7MA3DBAMUFHA3W8XGB5UIAC1KE7V5';
const polygonScanAPI = '6PY6KBJ26I7YI3VKXSQ87NBVDTD9CN2MFM';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Caching and History
let latestData = {
  ethereum: {},
  bnb: {},
  polygon: {}
};

const maxFeeHistory = {
  ethereum: [],
  bnb: [],
  polygon: []
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ✅ Route: Fetch gas price
app.get('/api/gas-price', async (req, res) => {
  const network = req.query.network || 'ethereum';
  try {
    let data;
    if (network === 'ethereum') {
      const response = await axios.get('https://api.blocknative.com/gasprices/blockprices', {
        headers: { Authorization: blocknativeAPI }
      });
      const price = response.data.blockPrices[0].estimatedPrices[1];
      data = {
        maxFeePerGas: +price.maxFeePerGas,
        maxPriorityFeePerGas: +price.maxPriorityFeePerGas,
        confidence: price.confidence
      };
    } else if (network === 'bnb') {
      const response = await axios.get(`https://api.bscscan.com/api?module=proxy&action=eth_gasPrice&apikey=${bscScanAPI}`);
      const gwei = parseInt(response.data.result, 16) / 1e9;
      data = {
        maxFeePerGas: gwei,
        maxPriorityFeePerGas: gwei * 0.5,
        confidence: 90
      };
    } else if (network === 'polygon') {
      const response = await axios.get(`https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice&apikey=${polygonScanAPI}`);
      const gwei = parseInt(response.data.result, 16) / 1e9;
      data = {
        maxFeePerGas: gwei,
        maxPriorityFeePerGas: gwei * 0.5,
        confidence: 90
      };
    } else {
      return res.status(400).json({ error: 'Unsupported network' });
    }

    latestData[network] = data;
    if (!maxFeeHistory[network]) maxFeeHistory[network] = [];
    maxFeeHistory[network].push(data.maxFeePerGas);
    if (maxFeeHistory[network].length > 100) maxFeeHistory[network].shift();

    res.json(data);
  } catch (err) {
    console.error('Gas price error:', err.message);
    res.status(500).json({ error: 'Failed to fetch gas price' });
  }
});

// ✅ Route: Recommend best time
app.get('/api/recommend-time', (req, res) => {
  const network = req.query.network || 'ethereum';
  const data = latestData[network];
  if (!data || !data.maxFeePerGas) {
    return res.status(400).json({ error: 'Gas data unavailable' });
  }

  const recommendation = data.maxFeePerGas < 2
    ? '✅ Good time to send transactions!'
    : '❌ Gas is high. Better to wait.';

  return res.json({ recommendation });
});

// ✅ NLP Agent
app.post('/api/nlp-agent', (req, res) => {
  const { question, network } = req.body;
  const q = (question || '').toLowerCase();
  const data = latestData[network];
  const history = maxFeeHistory[network] || [];

  if (!data || !data.maxFeePerGas) {
    return res.json({ reply: "🤖 Unable to fetch gas data at the moment." });
  }

  const { maxFeePerGas, maxPriorityFeePerGas } = data;
  const avg = ((maxFeePerGas + maxPriorityFeePerGas) / 2).toFixed(2);
  let reply = "🤖 I didn't understand the question.";

  if (
    q.includes('good time') || q.includes('send') || q.includes('cheap') ||
    q.includes('should') || q.includes('congested') || q.includes('now')
  ) {
    reply = maxFeePerGas < 2
      ? "🤖 ✅ It's a good time to send transactions!"
      : "🤖 ❌ Gas is high. Better to wait.";
  } else if ((q.includes('gas') || q.includes('fee')) && (q.includes('what') || q.includes('price'))) {
    reply = `🤖 📄 Max Fee: ${maxFeePerGas.toFixed(2)} Gwei, Priority Fee: ${maxPriorityFeePerGas.toFixed(2)} Gwei`;
  } else if (q.includes('average') || q.includes('avg')) {
    const avgHistory = history.reduce((a, b) => a + b, 0) / history.length || 0;
    reply = `🤖 📊 Average Fee: ${avgHistory.toFixed(2)} Gwei`;
  } else if (q.includes('min') || q.includes('minimum') || q.includes('lowest')) {
    const min = Math.min(...history);
    reply = `🤖 🔻 Lowest Max Fee observed: ${min.toFixed(2)} Gwei`;
  } else if (q.includes('max') || q.includes('maximum') || q.includes('highest')) {
    const max = Math.max(...history);
    reply = `🤖 🔺 Highest Max Fee observed: ${max.toFixed(2)} Gwei`;
  } else if (
    q.includes('compare') || q.includes('cheaper') || q.includes('which') || q.includes('bnb') || q.includes('polygon')
  ) {
    const eth = latestData.ethereum?.maxFeePerGas;
    const bnb = latestData.bnb?.maxFeePerGas;
    const polygon = latestData.polygon?.maxFeePerGas;
    const values = { ethereum: eth, bnb, polygon };
    const cheapest = Object.entries(values).reduce((acc, [key, val]) =>
      val && val < acc[1] ? [key, val] : acc, ['ethereum', eth]);

    reply = `🤖 🧮 ${cheapest[0].toUpperCase()} is cheapest at ${cheapest[1].toFixed(2)} Gwei`;
  }

  return res.json({ reply });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
