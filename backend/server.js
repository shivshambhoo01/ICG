import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
const PORT = process.env.PORT || 4000;

const adapter = new JSONFile('icg_data.json');
const defaultData = {
  investmentOpportunities: {
    IPOs: [],
    Stocks: [],
    Funds: [],
  },
  marketTrends: [],
  lastUpdated: null,
};

const db = new Low(adapter, defaultData);

app.use(cors());
app.use(express.json());

async function refreshDataJob() {
  console.log('--- Running Daily Data Refresh Job ---');
  try {
    const enrichedOpportunities = {
      IPOs: [/* same IPO data */],
      Stocks: [/* same stock data */],
      Funds: [/* same fund data */],
    };

    db.data.investmentOpportunities = enrichedOpportunities;
    db.data.lastUpdated = new Date().toISOString();
    await db.write();

    console.log('--- Data Refresh Job Completed Successfully ---');
  } catch (error) {
    console.error('--- Data Refresh Job Failed ---', error);
  }
}

app.get('/api/investment-opportunities', async (req, res) => {
  await db.read();
  res.json(db.data.investmentOpportunities);
});

app.get('/api/market-trends', (req, res) => {
  const trends = [
    { name: 'Renewable Energy', rationale: '...', score: 85 },
    { name: 'IT & SaaS', rationale: '...', score: 75 },
    { name: 'Infrastructure', rationale: '...', score: 70 },
    { name: 'FMCG', rationale: '...', score: -30 },
    { name: 'Metals', rationale: '...', score: -50 }
  ];
  res.json(trends);
});

app.get('/api/stock-analysis/:ticker', (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const mockData = {
    'RELIANCE.NS': { name: 'Reliance Industries', price: '2890.50', ... },
    'DEFAULT': { name: ticker.split('.')[0], price: '1234.56', ... }
  };
  const data = mockData[ticker] || mockData['DEFAULT'];
  res.json(data);
});

cron.schedule('0 8 * * *', refreshDataJob, { timezone: 'Asia/Kolkata' });

app.listen(PORT, async () => {
  await db.read();
  if (!db.data || !db.data.lastUpdated) {
    console.log('Database is empty. Running initial data refresh job...');
    await refreshDataJob();
  }
  console.log(`✅ ICG Backend running on http://localhost:${PORT}`);
  console.log(`Data last updated at: ${db.data.lastUpdated}`);
});
