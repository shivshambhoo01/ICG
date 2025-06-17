const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { Low, JSONFile } = require('lowdb');

const app = express();
const PORT = process.env.PORT || 4000;

const adapter = new JSONFile('icg_data.json');
const db = new Low(adapter);

const defaultData = {
    investmentOpportunities: {
        IPOs: [],
        Stocks: [],
        Funds: []
    },
    marketTrends: [],
    lastUpdated: null
};

app.use(cors());
app.use(express.json());

async function refreshDataJob() {
    console.log('--- Running Daily Data Refresh Job ---');
    try {
        const enrichedOpportunities = {
            IPOs: [
                {
                    name: "NextGen Robotics",
                    growth: "25-30% p.a.",
                    rationale: "Leader in warehouse automation, benefiting from the e-commerce boom.",
                    details: {
                        date: "Jul 08 - Jul 10, 2025",
                        size: "₹750 Cr",
                        price: "₹450-465",
                        lot: "32 Shares",
                        registrar: "Link Intime India"
                    }
                }
            ],
            Stocks: [],
            Funds: []
        };

        await db.read();
        db.data = db.data || defaultData;
        db.data.investmentOpportunities = enrichedOpportunities;
        db.data.lastUpdated = new Date().toISOString();
        await db.write();

        console.log('✅ Data Refresh Job Completed');
    } catch (error) {
        console.error('❌ Data Refresh Job Failed', error);
    }
}

app.get('/api/investment-opportunities', async (req, res) => {
    await db.read();
    res.json(db.data.investmentOpportunities || {});
});

app.get('/api/market-trends', async (req, res) => {
    const trends = [
        { name: 'Renewable Energy', rationale: 'Green push', score: 85 },
        { name: 'IT', rationale: 'Digitization trend', score: 75 }
    ];
    res.json(trends);
});

app.get('/api/stock-analysis/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    const mockData = {
        'RELIANCE.NS': {
            name: 'Reliance',
            price: '₹2,800',
            summary: 'Diversified giant'
        },
        'DEFAULT': {
            name: ticker,
            price: '₹1,234',
            summary: 'Mock data'
        }
    };
    res.json(mockData[ticker] || mockData.DEFAULT);
});

cron.schedule('0 8 * * *', refreshDataJob, { timezone: "Asia/Kolkata" });

app.listen(PORT, async () => {
    await db.read();
    db.data = db.data || defaultData;
    await db.write();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
