<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stellar Stocks</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1/plugin/relativeTime.js"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #1a1b26; /* Deep purple-blue */
        }
        .theme-purple {
            --color-primary: #8A2BE2; /* BlueViolet */
            --color-primary-hover: #7B1FA2; /* Darker Violet */
            --color-secondary: #4B0082; /* Indigo */
            --color-background: #1a1b26;
            --color-surface: #2a2d3e;
            --color-text-primary: #f0f0f0;
            --color-text-secondary: #a0a0b0;
            --color-border: #40405c;
            --color-success: #28a745;
            --color-danger: #dc3545;
        }
        .glass-effect {
            background: rgba(42, 45, 62, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--color-border);
        }
        .shimmer {
            background: linear-gradient(90deg, var(--color-surface) 25%, rgba(64, 64, 92, 0.5) 50%, var(--color-surface) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
</head>
<body class="theme-purple text-[var(--color-text-primary)]">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="p-4 shadow-md sticky top-0 z-50 glass-effect">
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-2xl font-bold tracking-wider" style="color: var(--color-primary);">
                    StellarStocks
                </h1>
                <div class="hidden md:block">
                    <p class="text-sm text-[var(--color-text-secondary)]">Your AI-Powered Market Edge</p>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto p-4 md:p-8">
            
            <!-- WhatsApp Briefing Section -->
            <section id="whatsapp-briefing" class="mb-8">
                <h2 class="text-xl font-semibold mb-2">Your Daily WhatsApp Briefing</h2>
                <p class="text-sm text-[var(--color-text-secondary)] mb-4">An auto-generated summary of hyped IPOs and top news. Click to copy and share with your group!</p>
                <div class="glass-effect rounded-xl p-6">
                    <div id="whatsapp-message-content" class="text-sm leading-relaxed whitespace-pre-wrap">
                        <!-- Generated message will appear here -->
                        <div class="shimmer rounded-lg w-full h-40"></div>
                    </div>
                    <button id="copy-button" class="mt-4 w-full md:w-auto bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--color-primary-hover)] transition-all flex items-center justify-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                        </svg>
                        <span>Copy Message</span>
                    </button>
                </div>
            </section>

            <!-- Market Mood Section -->
            <section id="market-mood" class="mb-8 p-6 rounded-xl glass-effect">
                <h2 class="text-xl font-semibold mb-4">Global Market Mood</h2>
                <div class="flex items-center space-x-4">
                    <div id="mood-indicator" class="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-gray-700 animate-pulse"></div>
                    <div>
                        <p id="mood-text" class="font-medium text-lg text-[var(--color-text-primary)]">Analyzing market sentiment...</p>
                        <p id="mood-reason" class="text-sm text-[var(--color-text-secondary)]">Fetching latest global news and events.</p>
                    </div>
                </div>
            </section>
            
            <!-- Top Stock Suggestions -->
            <section id="stock-suggestions">
                <h2 class="text-xl font-semibold mb-4">Top Stock Suggestions</h2>
                <div id="suggestions-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="shimmer rounded-xl p-4 h-48"></div>
                    <div class="shimmer rounded-xl p-4 h-48"></div>
                    <div class="shimmer rounded-xl p-4 h-48"></div>
                </div>
            </section>

            <!-- Modal for Stock Details -->
            <div id="stock-modal" class="fixed inset-0 bg-black bg-opacity-70 z-50 hidden flex items-center justify-center p-4">
                <div id="modal-content" class="rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-effect relative"></div>
            </div>

        </main>
    </div>

    <script>
        dayjs.extend(dayjs_plugin_relativeTime);

        // --- Mock Data & Placeholders ---
        // In a real application, these would be fetched from live APIs.
        // IPO GMP data is especially hard to find via free APIs and would likely require a custom backend scraper.
        const mockHypedIPOs = [
            { name: "FutureTech AI", gmp: 150, gmp_percent: 50, dates: "June 20 - June 24", price_band: "290 - 300" },
            { name: "GreenEnergy Innovations", gmp: 95, gmp_percent: 35, dates: "June 25 - June 28", price_band: "260 - 270" }
        ];

        const mockTopNews = [
            "RBI announces unexpected 0.25% rate cut to boost growth.",
            "SEBI introduces new regulations for small-cap funds, causing market volatility.",
            "Major tech partnership announced between Reliance and Google, shares surge."
        ];

        // --- Element Selectors ---
        const moodIndicator = document.getElementById('mood-indicator');
        const moodText = document.getElementById('mood-text');
        const moodReason = document.getElementById('mood-reason');
        const suggestionsGrid = document.getElementById('suggestions-grid');
        const stockModal = document.getElementById('stock-modal');
        const modalContent = document.getElementById('modal-content');
        const whatsappMessageContent = document.getElementById('whatsapp-message-content');
        const copyButton = document.getElementById('copy-button');

        const defensiveSectors = ['HEALTHCARE', 'UTILITIES', 'CONSUMER_STAPLES'];
        let selectedStocks = [];

        const mockStocks = [
            { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
            { symbol: 'NEE', name: 'NextEra Energy', sector: 'Utilities' },
            { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples' },
            { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
            { symbol: 'DUK', name: 'Duke Energy', sector: 'Utilities' },
            { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples' }
        ];

        const mockNews = {
            'JNJ': { sentiment: 0.6, title: 'J&J Announces Breakthrough Drug Trial Results' },
            'NEE': { sentiment: 0.8, title: 'NextEra Energy praised for its green energy initiatives.' },
            'PG': { sentiment: 0.5, title: 'P&G reports steady growth in Q2 amidst market volatility.' },
            'UNH': { sentiment: 0.7, title: 'UnitedHealth expands its services to new markets.' },
            'DUK': { sentiment: 0.4, title: 'Duke Energy faces regulatory hurdles for new plant.' },
            'KO': { sentiment: 0.9, title: 'Coca-Cola sees record sales in emerging markets.' }
        };
        
        const mockPrice = {
             price: (150 + Math.random() * 50).toFixed(2),
             change: (Math.random() * 10 - 5).toFixed(2),
             changePercent: (Math.random() * 2 - 1).toFixed(2) + '%'
        };
        
        // --- WhatsApp Briefing Logic ---
        function generateWhatsappMessage() {
            // Fetch IPO and News data (using mocks for now)
            const hypedIPOs = mockHypedIPOs; // In real app: await getHypedIPOs();
            const topNews = mockTopNews; // In real app: await getTopNews();

            let message = "🔥 *IPO ALERTS* 🔥\n";
            message += "Here's the latest buzz on upcoming IPOs:\n\n";

            hypedIPOs.forEach(ipo => {
                message += `*${ipo.name}*\n`;
                message += `🚀 GMP: *₹${ipo.gmp} (+${ipo.gmp_percent}%)*\n`;
                message += `🗓️ Dates: ${ipo.dates}\n`;
                message += `💰 Price: ₹${ipo.price_band}\n\n`;
            });

            message += "⚡ *Top Market News* ⚡\n";
            topNews.forEach((news, index) => {
                message += `${index + 1}️⃣ ${news}\n`;
            });

            message += "\n_Disclaimer: For informational purposes only. DYOR._";
            
            // Render the message with HTML formatting for display
            whatsappMessageContent.innerHTML = message
                .replace(/\*([^*]+)\*/g, '<strong>$1</strong>') // Bold
                .replace(/_([^_]+)_/g, '<em>$1</em>'); // Italics
        }

        function copyWhatsappMessage() {
            const textToCopy = whatsappMessageContent.innerText;
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);

            const originalButtonText = copyButton.innerHTML;
            copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/></svg>
                <span>Copied!</span>`;
            setTimeout(() => {
                copyButton.innerHTML = originalButtonText;
            }, 2000);
        }

        copyButton.addEventListener('click', copyWhatsappMessage);

        // --- Existing Functions ---

        async function getMarketMood() {
            const moods = [
                { mood: 'Optimistic', reason: 'Positive economic data and strong corporate earnings reports are boosting investor confidence.', emoji: '😊', color: 'var(--color-success)' },
                { mood: 'Cautious', reason: 'Geopolitical tensions and inflation concerns are leading to market uncertainty.', emoji: '🤔', color: '#ffc107' },
                { mood: 'Pessimistic', reason: 'Fears of a global recession are causing a widespread sell-off in the markets.', emoji: '😟', color: 'var(--color-danger)' },
            ];
            const randomMood = moods[Math.floor(Math.random() * moods.length)];

            moodIndicator.classList.remove('bg-gray-700', 'animate-pulse');
            moodIndicator.style.backgroundColor = randomMood.color;
            moodIndicator.textContent = randomMood.emoji;
            moodText.textContent = randomMood.mood;
            moodReason.textContent = randomMood.reason;
        }

        async function getStockSuggestions() {
            selectedStocks = mockStocks;
            displayStockSuggestions();
        }

        function displayStockSuggestions() {
            suggestionsGrid.innerHTML = '';
            selectedStocks.forEach(stock => {
                const priceData = mockPrice;
                const newsData = mockNews[stock.symbol] || { sentiment: 0.5, title: 'No recent news found.'};
                let sentimentColor = 'text-yellow-400';
                if (newsData.sentiment > 0.6) sentimentColor = 'text-green-400';
                if (newsData.sentiment < 0.4) sentimentColor = 'text-red-400';

                const card = `
                    <div class="rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 glass-effect" onclick="openStockModal('${stock.symbol}')">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="text-lg font-bold">${stock.symbol}</h3>
                                <p class="text-sm text-[var(--color-text-secondary)] truncate w-48">${stock.name}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xl font-semibold">${priceData.price}</p>
                                <p class="${priceData.change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'} text-sm">
                                    ${priceData.change} (${priceData.changePercent})
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-[var(--color-border)]">
                             <p class="text-sm font-medium text-[var(--color-text-secondary)]">Sentiment:</p>
                             <p class="text-base ${sentimentColor} font-semibold">${(newsData.sentiment * 100).toFixed(0)}% Positive</p>
                             <p class="text-xs text-[var(--color-text-secondary)] mt-1 truncate">${newsData.title}</p>
                        </div>
                    </div>
                `;
                suggestionsGrid.innerHTML += card;
            });
        }
        
        async function openStockModal(symbol) {
             modalContent.innerHTML = `<div class="p-8 shimmer h-96"></div>`;
             stockModal.classList.remove('hidden');

            const stock = selectedStocks.find(s => s.symbol === symbol);
            if (!stock) return;

            const detailedPrice = mockPrice;
            const companyOverview = {
                Description: `This is a mock description for ${stock.name}. It operates in the ${stock.sector} sector.`,
                MarketCapitalization: `${(Math.random() * 500).toFixed(2)}B`,
                PERatio: (Math.random() * 30 + 10).toFixed(2),
                DividendYield: (Math.random() * 5).toFixed(2) + '%'
            };
            const newsArticles = [
                { title: `Market Analysts Upgrade ${symbol}`, published_at: '2025-06-16T10:00:00Z', url: '#', source: 'MarketWatch' },
                { title: `New Product Line Boosts ${symbol} Outlook`, published_at: '2025-06-15T14:30:00Z', url: '#', source: 'Reuters' }
            ];
            const historicalData = {
                labels: Array.from({length: 30}, (_, i) => dayjs().subtract(30 - i, 'day').format('MMM D')),
                prices: Array.from({length: 30}, () => Math.random() * 50 + 150)
            };

            modalContent.innerHTML = `
                <button onclick="closeModal()" class="absolute top-4 right-4 text-2xl text-[var(--color-text-secondary)] hover:text-white">&times;</button>
                <div class="p-6">
                    <div class="flex flex-col md:flex-row justify-between items-start mb-6">
                        <div>
                            <h2 class="text-3xl font-bold">${symbol} <span class="text-lg font-normal text-[var(--color-text-secondary)]">${stock.name}</span></h2>
                            <p class="text-sm bg-[var(--color-secondary)] text-[var(--color-primary)] px-2 py-1 rounded-full inline-block mt-2">${stock.sector}</p>
                        </div>
                        <div class="text-right mt-4 md:mt-0">
                            <p class="text-3xl font-bold">${detailedPrice.price}</p>
                            <p class="${detailedPrice.change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}">
                                ${detailedPrice.change} (${detailedPrice.changePercent})
                            </p>
                        </div>
                    </div>
                    <div class="mb-6 h-64"><canvas id="stock-chart"></canvas></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 class="text-lg font-semibold mb-2">Company Overview</h3>
                            <p class="text-sm text-[var(--color-text-secondary)] mb-4">${companyOverview.Description}</p>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div><span class="font-semibold">Market Cap:</span> ${companyOverview.MarketCapitalization}</div>
                                <div><span class="font-semibold">P/E Ratio:</span> ${companyOverview.PERatio}</div>
                                <div><span class="font-semibold">Dividend Yield:</span> ${companyOverview.DividendYield}</div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold mb-2">Recent News</h3>
                            <div class="space-y-3">
                                ${newsArticles.map(article => `
                                    <a href="${article.url}" target="_blank" class="block p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors">
                                        <p class="font-medium text-sm">${article.title}</p>
                                        <div class="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
                                            <span>${article.source}</span>
                                            <span>${dayjs(article.published_at).fromNow()}</span>
                                        </div>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            renderChart(historicalData);
        }

        function closeModal() {
            stockModal.classList.add('hidden');
        }

        function renderChart(historicalData) {
            const ctx = document.getElementById('stock-chart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: historicalData.labels,
                    datasets: [{
                        label: 'Price (USD)', data: historicalData.prices,
                        borderColor: 'var(--color-primary)', backgroundColor: 'rgba(138, 43, 226, 0.1)',
                        borderWidth: 2, fill: true, tension: 0.4, pointRadius: 0
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                        y: { grid: { color: 'var(--color-border)' }, ticks: { color: 'var(--color-text-secondary)' } },
                        x: { grid: { display: false }, ticks: { color: 'var(--color-text-secondary)', maxRotation: 0, autoSkip: true, maxTicksLimit: 7 } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
        
        window.addEventListener('keydown', (e) => e.key === 'Escape' && !stockModal.classList.contains('hidden') && closeModal());
        stockModal.addEventListener('click', (e) => e.target === stockModal && closeModal());

        // --- Initial Load ---
        document.addEventListener('DOMContentLoaded', () => {
            generateWhatsappMessage();
            getMarketMood();
            getStockSuggestions();
        });
    </script>
</body>
</html>

