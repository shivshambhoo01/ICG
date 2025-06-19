const express = require('express');
const cors = require('cors');
const { Low, JSONFile } = require('lowdb');
const path = require('path'); // Import path module

const app = express();
const PORT = process.env.PORT || 4000;

// Define the path for the data file within the persistent disk mount path (if configured on Render)
// If not using a persistent disk, this file will be ephemeral.
const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, 'data', 'icg_data.json');
const adapter = new JSONFile(dbFilePath);
const db = new Low(adapter);

// Ensure the data directory exists on startup (especially important for persistent disks)
const fs = require('fs');
const dataDir = path.dirname(dbFilePath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

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

// Initialize the database on server start
async function initializeDb() {
    try {
        await db.read();
        db.data = db.data || defaultData; // Set default data if db is empty
        await db.write();
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
        // Optionally exit or handle more gracefully if DB is critical
    }
}

// API Endpoints
app.get('/api/investment-opportunities', async (req, res) => {
    await db.read(); // Read the latest data from disk
    res.json(db.data.investmentOpportunities || {});
});

app.get('/api/market-trends', async (req, res) => {
    await db.read(); // Read the latest data from disk
    res.json(db.data.marketTrends || []);
});

app.get('/api/stock-analysis/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    // This is mock data; in a real app, you'd fetch from a live API here.
    const mockData = {
        'RELIANCE.NS': {
            name: 'Reliance Industries',
            price: '₹2,987.50',
            change: '+25.30 (+0.86%)',
            cap: '₹20.12 L Cr',
            pe: '29.5',
            growth: '15-20% p.a.',
            high52: '₹3,029.00',
            low52: '₹2,180.00',
            dividendYield: '0.35%',
            founded: '1973',
            summary: 'Reliance Industries Limited is an Indian multinational conglomerate company, with its headquarters in Mumbai, Maharashtra. It has diverse businesses including energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.'
        },
        'TCS.NS': {
            name: 'Tata Consultancy Services',
            price: '₹3,850.20',
            change: '-10.50 (-0.27%)',
            cap: '₹14.15 L Cr',
            pe: '32.1',
            growth: '10-12% p.a.',
            high52: '₹4,050.00',
            low52: '₹3,100.00',
            dividendYield: '1.10%',
            founded: '1968',
            summary: 'Tata Consultancy Services is an Indian multinational information technology (IT) services and consulting company headquartered in Mumbai. It is a subsidiary of the Tata Group and operates in 150 locations across 46 countries.'
        },
        'INFY.NS': {
            name: 'Infosys',
            price: '₹1,580.10',
            change: '+5.80 (+0.37%)',
            cap: '₹6.5 L Cr',
            pe: '28.9',
            growth: '9-11% p.a.',
            high52: '₹1,700.00',
            low52: '₹1,350.00',
            dividendYield: '1.50%',
            founded: '1981',
            summary: 'Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services. The company is headquartered in Bangalore.'
        },
        'HDFCBANK.NS': {
            name: 'HDFC Bank',
            price: '₹1,540.00',
            change: '-3.50 (-0.23%)',
            cap: '₹11.5 L Cr',
            pe: '18.7',
            growth: '8-10% p.a.',
            high52: '₹1,750.00',
            low52: '₹1,300.00',
            dividendYield: '0.90%',
            founded: '1994',
            summary: 'HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It is India\'s largest private sector bank by assets and world\'s 10th largest bank by market capitalisation as of April 2023.'
        },
        'DEFAULT': {
            name: ticker,
            price: '₹1,234.50',
            change: '+10.20 (+0.83%)',
            cap: '₹1.23 L Cr',
            pe: '22.0',
            growth: '10-15% p.a.',
            high52: '₹1,300.00',
            low52: '₹1,000.00',
            dividendYield: '0.50%',
            founded: '2000',
            summary: `This is mock data for ${ticker}. In a real application, this information would be fetched from a live stock market API.`
        }
    };
    res.json(mockData[ticker] || mockData.DEFAULT);
});

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await initializeDb();
});

