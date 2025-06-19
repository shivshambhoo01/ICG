const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node'); // Correct import for JSONFile
const path = require('path');
const fs = require('fs');

// Define the path for the data file. It should be the same as in server.js
const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, 'data', 'icg_data.json');
const adapter = new JSONFile(dbFilePath);
const db = new Low(adapter);

// Ensure the data directory exists
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

async function refreshData() {
    console.log('--- Running Data Refresh Job ---');
    try {
        // Crucial fix: Set default data BEFORE trying to read.
        // This ensures db.data always has a valid structure.
        db.data = defaultData;
        await db.read(); // Read existing data from the file (if it exists and is valid JSON)

        // --- Simulate fetching live data ---
        const fetchedIPOs = [
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
        ];

        const fetchedStocks = [
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
        ];

        const fetchedFunds = [
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
        ];

        const fetchedMarketTrends = [
            { name: 'Renewable Energy', rationale: 'Global push for clean energy, supportive government policies, and falling costs of solar and wind power are driving significant investment and innovation in this sector.', score: 85 },
            { name: 'Artificial Intelligence', rationale: 'Rapid advancements in AI and its widespread adoption across various industries (healthcare, finance, automotive) are creating vast opportunities for companies developing AI-driven solutions and infrastructure.', score: 90 },
            { name: 'E-commerce & Logistics', rationale: 'Continued growth of online retail necessitates robust logistics and fulfillment infrastructure, leading to increased demand for automation, warehousing, and last-mile delivery solutions.', score: 78 },
            { name: 'Cybersecurity', rationale: 'With increasing digital transformation and rising cyber threats, robust cybersecurity solutions are critical for businesses and individuals, driving sustained demand for security software and services.', score: 82 },
            { name: 'Biotechnology & Pharma', rationale: 'Breakthroughs in genetic research, drug discovery, and personalized medicine, coupled with an aging global population, are fueling innovation and investment in the biotech and pharmaceutical sectors.', score: 80 },
            { name: 'Traditional Finance (Banks)', rationale: 'Facing increasing competition from fintech and regulatory pressures, traditional banking struggles with innovation and growth. High interest rates can help margins, but long-term digital disruption poses challenges.', score: -10 },
            { name: 'Fossil Fuels', rationale: 'Global efforts to transition to clean energy, environmental regulations, and volatility in oil prices are creating headwinds for the fossil fuel industry, leading to declining long-term prospects.', score: -20 }
        ];

        // Update the data in memory
        db.data.investmentOpportunities.IPOs = fetchedIPOs; // These lines update the data currently in db.data (either default or loaded)
        db.data.investmentOpportunities.Stocks = fetchedStocks;
        db.data.investmentOpportunities.Funds = fetchedFunds;
        db.data.marketTrends = fetchedMarketTrends;
        db.data.lastUpdated = new Date().toISOString();

        await db.write(); // Persist the updated data to the file
        console.log('✅ Data Refresh Job Completed and data saved.');
    } catch (error) {
        console.error('❌ Data Refresh Job Failed:', error);
    }
}

// Execute the refresh function when this script is run
// This script is primarily intended for use as a Render Cron Job,
// where Render itself manages the schedule.
refreshData();
