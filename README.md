# 🚀 MCP Gas Price Agent Dashboard 🛰️

An MCP-compatible AI-ready gas price agent built with Node.js, Express, and TailwindCSS.  
This dashboard enables users to monitor real-time gas prices on **Ethereum**, **BNB**, and **Polygon**, ask natural language questions, and receive smart recommendations on when to transact.

---

## 🧠 What This Project Delivers

From initial goals to full implementation, here's what has been achieved:

- ✅ **Multi-network support** for Ethereum, BNB, and Polygon
- ✅ **Live gas price API** for each network
- ✅ **Dashboard with interactive charts** (Max Fee & Priority Fee over time)
- ✅ **Natural Language Processing Agent** to interpret human questions like:
  - “Is now a good time?”
  - “What’s the max gas fee?”
  - “Compare between networks”
- ✅ **Real-time alerts** when gas fee is extremely low
- ✅ **Export to CSV** of gas history
- ✅ **Auto-refreshing UI** (adjustable refresh rate)
- ✅ **Stylish dark-themed UI** using Tailwind CSS
- ✅ **MCP-compatible plugin (`mcp.json`)** so it can be connected directly to Claude or GPT

---

## 🔧 Features

| Endpoint         | Description                                      |
| ---------------- | ------------------------------------------------ |
| `/api/gas-price` | Returns live gas prices for selected network     |
| `/api/nlp-agent` | Returns intelligent replies to natural questions |
| `/dashboard`     | Displays live gas charts, NLP, export tools, etc |
| `/`              | Tailwind-based landing page                      |
| `mcp.json`       | Plugin schema for AI agents                      |

---

## 📸 Preview

![Dashboard Screenshot](./screenshots/dashboard.png)  
_(Shows live chart, network selector, NLP agent input, CSV export)_

---

## 📦 Tech Stack

- `Node.js + Express`
- `TailwindCSS`
- `Chart.js`
- `Blocknative, BscScan, PolygonScan APIs`
- MCP Plugin (Claude/GPT ready)

---

## 🚀 How to Run Locally

1. **Install dependencies**

```bash
npm install
```

````

2. **Build Tailwind CSS**

```bash
npm run build:css
```

3. **Start server**

```bash
npm start
```

4. **Visit the app**
   Open your browser at:
   [http://localhost:3000](http://localhost:3000)

---

## 🤖 Ask Anything!

The AI Agent supports questions like:

- "Is now a good time?"
- "What’s the gas fee?"
- "What's the average gas price?"
- "What’s the highest gas today?"
- "Which network is cheaper?"
- "Is BNB cheaper than Ethereum?"

---

## 🔌 AI Plugin (MCP)

You can connect this project directly to Claude/GPT via the `mcp.json` file.
Example usage:

```json
{
  "schema_version": "v1",
  "name_for_model": "mcp_gas_agent",
  ...
}
```

---

## 📁 Folder Structure

```
📦 MCP-Gas-Agent
├── public/
│   ├── index.html
│   ├── dashboard.html
│   └── styles.css
├── server.js
├── mcp.json
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 📝 License

MIT © 2025 - MCP Gas Price Agent Team

---

````
