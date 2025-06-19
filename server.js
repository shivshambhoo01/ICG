const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node'); // Correct import for JSONFile
const path = require('path');
const fs = require('fs');
const cron = require('node-cron'); // Ensure cron is imported for scheduling


const app = express();
const PORT = process.env.PORT || 4000;

// Define the path for the data file, relying on DB_FILE_PATH env var for Render persistent disk
const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, 'data', 'icg_data.json');
const adapter = new JSONFile(dbFilePath);
const db = new Low(adapter);

// Ensure the data directory exists before trying to read/write
const dataDir = path.dirname(dbFilePath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Default data structure for the database
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
        // Crucial fix: Set default data BEFORE trying to read.
        // If the file is empty or doesn't exist, db.data will be defaultData.
        // If it exists and is valid, db.data will be overwritten with file content.
        db.data = defaultData;
        await db.read();
        await db.write(); // Write back to ensure file is correctly initialized if it was empty/missing
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
        // This catch block might still trigger if there are severe file system issues.
    }
}

// --- API Endpoints ---
app.get('/api/investment-opportunities', async (req, res) => {
    // Before serving, always ensure data is fresh from disk
    // In a production app with high traffic, consider caching this data in memory
    // and only re-reading from disk periodically or after a write.
    await db.read();
    res.json(db.data.investmentOpportunities || {});
});

app.get('/api/market-trends', async (req, res) => {
    await db.read(); // Read the latest data from disk before responding
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

// --- Data Refresh Job ---
async function refreshDataJob() {
    console.log('--- Running Daily Data Refresh Job ---');
    try {
        const enrichedOpportunities = {
            IPOs: [
                {
                    name: "NextGen Robotics",
                    growth: "25-30% p.a.",
                    rationale: "Leader in warehouse automation, benefiting from the e-commerce boom and increasing demand for automated logistics solutions. Strong pipeline of new products.",
                    details: {
                        date: "Jul 08 - Jul 10, 2025",
                        size: "₹750 Cr",
                        price: "₹450-465",
                        lot: "32 Shares",
                        registrar: "Link Intime India",
                        listingDate: "Jul 18, 2025"
                    }
                },
                {
                    name: "GreenChem Solutions",
                    growth: "20-25% p.a.",
                    rationale: "Pioneering sustainable chemical production with patented eco-friendly processes. Poised for significant growth as industries shift towards greener alternatives.",
                    details: {
                        date: "Aug 01 - Aug 05, 2025",
                        size: "₹500 Cr",
                        price: "₹300-320",
                        lot: "45 Shares",
                        registrar: "KFin Technologies",
                        listingDate: "Aug 13, 2025"
                    }
                }
            ],
            Stocks: [
                {
                    name: "TechInnovate Inc.",
                    growth: "22% p.a.",
                    rationale: "Leading innovator in AI-driven software solutions with consistent revenue growth and strong market adoption. Recently secured major contracts.",
                    details: {
                        marketCap: "₹50,000 Cr",
                        pe: "45.2",
                        dividendYield: "0%",
                        founded: "2010",
                        sector: "Technology"
                    }
                },
                {
                    name: "HealthConnect Global",
                    growth: "18% p.a.",
                    rationale: "Provider of cutting-edge telehealth platforms and digital health records. Benefiting from the accelerating digital transformation in healthcare.",
                    details: {
                        marketCap: "₹35,000 Cr",
                    pe: "38.5",
                        dividendYield: "0.5%",
                        founded: "2015",
                        sector: "Healthcare"
                    }
                },
                {
                    name: "EcoMaterials Ltd.",
                    growth: "20% p.a.",
                    rationale: "Specializes in sustainable construction materials, addressing growing environmental concerns in the building industry. Strong R&D pipeline.",
                    details: {
                        marketCap: "₹28,000 Cr",
                        pe: "30.1",
                        dividendYield: "0.8%",
                        founded: "2012",
                        sector: "Materials"
                    }
                }
            ],
            Funds: [
                {
                    name: "Innovate Growth Fund",
                    growth: "16% p.a.",
                    rationale: "Actively managed fund focusing on emerging technology companies and disruptive innovations globally. Diversified portfolio with strong track record.",
                    details: {
                        aum: "₹15,000 Cr",
                        expenseRatio: "0.8%",
                        fundManager: "Global Asset Management",
                        riskLevel: "High",
                        topHoldings: "NVIDIA, Tesla, Alphabet"
                    }
                },
                {
                    name: "Sustainable Equity Fund",
                    growth: "14% p.a.",
                    rationale: "Invests in companies with strong ESG (Environmental, Social, Governance) practices and sustainable business models. Ideal for long-term ethical investing.",
                    details: {
                        aum: "₹10,000 Cr",
                        expenseRatio: "0.6%",
                        fundManager: "GreenVest Capital",
                        riskLevel: "Medium",
                        topHoldings: "NextEra Energy, Waste Management, Ecolab"
                    }
                },
                {
                    name: "Small Cap Advantage",
                    growth: "19% p.a.",
                    rationale: "Targets high-potential small-cap companies poised for significant expansion. Offers higher growth potential but also higher risk.",
                    details: {
                        aum: "₹7,500 Cr",
                        expenseRatio: "1.0%",
                        fundManager: "Alpha Returns",
                        riskLevel: "Very High",
                        topHoldings: "Various emerging Indian small-caps"
                    }
                }
            ]
        };

        const fetchedMarketTrends = [
            { name: 'Renewable Energy', rationale: 'Global push for clean energy, supportive government policies, and falling costs of solar and wind power are driving significant investment and innovation in this sector.', score: 85 },
            { name: 'Artificial Intelligence', rationale: 'Rapid advancements in AI and its widespread adoption across various industries (healthcare, finance, automotive) are creating vast opportunities for companies developing AI-driven solutions and infrastructure.', score: 90 },
            { name: 'E-commerce & Logistics', rationale: 'Continued growth of online retail necessitates robust logistics and fulfillment infrastructure, leading to increased demand for automation, warehousing, and last-mile delivery solutions.', score: 78 },
            { name: 'Cybersecurity', rationale: 'With increasing digital transformation and rising cyber threats, robust cybersecurity solutions are critical for businesses and individuals, driving sustained demand for security software and services.', score: 82 },
            { name: 'Biotechnology & Pharma', rationale: 'Breakthroughs in genetic research, drug discovery, and personalized medicine, coupled with an aging global population, are fueling innovation and investment in the biotech and pharmaceutical sectors.', score: 80 },
            { name: 'Traditional Finance (Banks)', rationale: 'Facing increasing competition from fintech and regulatory pressures, traditional banking struggles with innovation and growth. High interest rates can help margins, but long-term digital disruption poses challenges.', score: -10 },
            { name: 'Fossil Fuels', rationale: 'Global efforts to transition to clean energy, environmental regulations, and volatility in oil prices are creating headwinds for the fossil fuel industry, leading to declining long-term prospects.', score: -20 }
        ];

        // Before updating, ensure db.data is either loaded or set to default
        db.data = defaultData; // This line ensures a fallback if read fails or if first run
        await db.read(); // Read existing data if available (will overwrite db.data if file exists and is valid)

        // Update the data in memory
        db.data.investmentOpportunities = enrichedOpportunities;
        db.data.investmentOpportunities.Stocks = fetchedStocks;
        db.data.investmentOpportunities.Funds = fetchedFunds;
        db.data.marketTrends = fetchedMarketTrends;
        db.data.lastUpdated = new Date().toISOString();

        await db.write(); // Persist the updated data to the file
        console.log('✅ Data Refresh Job Completed and data saved.');
    } catch (error) {
        console.error('❌ Data Refresh Job Failed', error);
    }
}

// Schedule the data refresh job to run daily at 8:00 AM UTC (1:30 PM IST)
// Render Cron Jobs usually run in UTC. If you want 8:00 AM IST, that's 2:30 AM UTC: '30 2 * * *'
// This schedule will run daily at 8 AM UTC.
cron.schedule('0 8 * * *', refreshDataJob, { timezone: "Asia/Kolkata" });


app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await initializeDb();
    // Optional: Trigger an immediate refresh if data looks empty on first start
    // This is useful for populating data immediately after deployment.
    if (!db.data || !db.data.lastUpdated || db.data.marketTrends.length === 0) {
        console.log('No initial data found or last updated time missing, running first data refresh...');
        await refreshDataJob();
    }
});
