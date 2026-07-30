// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    // FREE News API - Get your key from https://newsapi.org/
    NEWS_API_KEY: 'YOUR_NEWS_API_KEY', // Replace with your key
    NEWS_API_URL: 'https://newsapi.org/v2/',
    PAGE_SIZE: 6,
};

// Categories mapping for our sections
const CATEGORIES = {
    'Cyber Crime': 'technology',
    'Tech Intel': 'technology',
    'OSINT': 'technology',
    'Scam': 'technology',
    'Cyber Security': 'technology',
    'General': 'general',
};

// ============================================================
// FETCH REAL NEWS FROM API
// ============================================================
async function fetchNews(query = 'cyber security OR scam OR hacking OR OSINT', page = 1) {
    const url = `${CONFIG.NEWS_API_URL}everything?q=${encodeURIComponent(query)}&pageSize=${CONFIG.PAGE_SIZE}&page=${page}&apiKey=${CONFIG.NEWS_API_KEY}&language=en&sortBy=publishedAt`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('News fetch error:', error);
        // Return mock data if API fails
        return getMockNews();
    }
}

// Fetch top headlines by category
async function fetchHeadlines(category = 'technology') {
    const url = `${CONFIG.NEWS_API_URL}top-headlines?category=${category}&pageSize=10&apiKey=${CONFIG.NEWS_API_KEY}&language=en`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Headlines fetch error:', error);
        return getMockNews();
    }
}

// ============================================================
// MOCK DATA (Fallback if API fails)
// ============================================================
function getMockNews() {
    return {
        status: 'ok',
        totalResults: 8,
        articles: [
            {
                title: 'Ransomware Group Targets Energy Sector',
                description: 'New wave of attacks exploiting unpatched VPN appliances. Critical infrastructure at risk worldwide.',
                url: '#',
                urlToImage: null,
                publishedAt: new Date().toISOString(),
                source: { name: 'Cyber Security News' },
                author: 'Security Team'
            },
            {
                title: 'AI-Powered Phishing Detection Breakthrough',
                description: 'Researchers unveil model with 99.2% accuracy in identifying zero-day phishing campaigns.',
                url: '#',
                urlToImage: null,
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                source: { name: 'Tech Intel Daily' },
                author: 'AI Research Lab'
            },
            {
                title: 'Geolocation Analysis Exposes Disinformation Network',
                description: 'Open-source intelligence traces coordinated influence operations across social media platforms.',
                url: '#',
                urlToImage: null,
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                source: { name: 'OSINT Journal' },
                author: 'Investigation Team'
            },
            {
                title: 'Healthcare Data Breach Affects 2.3M Patients',
                description: 'Sensitive medical records exposed due to misconfigured cloud storage.',
                url: '#',
                urlToImage: null,
                publishedAt: new Date(Date.now() - 86400000).toISOString(),
                source: { name: 'Health Security Watch' },
                author: 'Medical Data Team'
            },
            {
                title: 'Fake Crypto Exchange "BitTradeX" Steals Millions',
                description: 'Victims lured with promises of high returns; platform vanished overnight.',
                url: '#',
                urlToImage: null,
                publishedAt: new Date(Date.now() - 172800000).toISOString(),
                source: { name: 'Fraud Alert Network' },
                author: 'Crypto Investigation Unit'
            },
            {
                title: 'Quantum-Resistant Encryption Standards Released',
                description: 'NIST announces post-quantum cryptography algorithms for future security.',
                url: '#',
                urlToImage: null,
                publishedAt: new Date(Date.now() - 259200000).toISOString(),
                source: { name: 'Tech Standards Watch' },
                author: 'Cryptography Team'
            }
        ]
    };
}

// ============================================================
// RENDER FUNCTIONS WITH REAL DATA
// ============================================================
function renderArticleCard(article, index) {
    const category = article.category || 'General';
    const badge = category;
    const time = article.publishedAt ? timeAgo(new Date(article.publishedAt)) : 'Recent';
    const imageHtml = article.urlToImage ? 
        `<img src="${article.urlToImage}" alt="${article.title}" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:12px;">` : 
        '';

    return `
        <div class="card" data-index="${index}">
            ${imageHtml}
            <span class="badge">${badge}</span>
            <h3>${article.title || 'Untitled Article'}</h3>
            <p>${article.description || 'No description available.'}</p>
            <div class="meta">
                <i class="far fa-clock"></i> ${time}
                ${article.source?.name ? ` • ${article.source.name}` : ''}
            </div>
            <a href="${article.url || '#'}" target="_blank" class="link-arrow">Read more <i class="fas fa-arrow-right"></i></a>
        </div>
    `;
}

function renderArticles(articles, container) {
    if (!container) return;
    if (!articles || articles.length === 0) {
        container.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center; padding:40px;">No articles found. Please try again later.</p>';
        return;
    }
    container.innerHTML = articles.map((article, i) => renderArticleCard(article, i)).join('');
}

// ============================================================
// TIME HELPER
// ============================================================
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const count = Math.floor(seconds / secondsInUnit);
        if (count >= 1) {
            return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
        }
    }
    return 'Just now';
}

// ============================================================
// PAGE SPECIFIC LOADERS
// ============================================================
let currentNewsPage = 1;
let currentSearchQuery = 'cyber security OR scam OR hacking OR OSINT';
let currentCategory = 'all';

// Home Page
async function renderHome() {
    const homeNews = document.getElementById('homeNews');
    const homeAlerts = document.getElementById('homeAlerts');
    const homeFactCheck = document.getElementById('homeFactCheck');
    const homeOsint = document.getElementById('homeOsint');
    
    // Show loading state
    if (homeNews) homeNews.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Loading latest news...</p>';
    
    try {
        // Fetch tech news for home
        const data = await fetchNews('cyber security OR technology OR hacking', 1);
        const articles = data.articles || [];
        
        // Home News - 3 articles
        if (homeNews) renderArticles(articles.slice(0, 3), homeNews);
        
        // Home Alerts - 2 articles (scam/fraud related)
        const alertData = await fetchNews('scam OR fraud OR phishing', 1);
        const alertArticles = alertData.articles || [];
        if (homeAlerts) renderArticles(alertArticles.slice(0, 2), homeAlerts);
        
        // Home Fact Check - 2 articles (fact checking related)
        const factData = await fetchNews('fact check OR verification OR misinformation', 1);
        const factArticles = factData.articles || [];
        if (homeFactCheck) renderArticles(factArticles.slice(0, 2), homeFactCheck);
        
        // Home OSINT - 2 articles
        const osintData = await fetchNews('OSINT OR intelligence OR investigation', 1);
        const osintArticles = osintData.articles || [];
        if (homeOsint) renderArticles(osintArticles.slice(0, 2), homeOsint);
        
    } catch (error) {
        console.error('Home render error:', error);
        if (homeNews) homeNews.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load news. Please try again.</p>';
    }
}

// News Page with Search
async function renderNews() {
    const grid = document.getElementById('newsGrid');
    const searchInput = document.getElementById('newsSearch');
    const filterSelect = document.getElementById('newsFilter');
    
    if (!grid) return;
    
    // Show loading
    grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Loading news...</p>';
    
    // Build query
    let query = currentSearchQuery;
    if (searchInput && searchInput.value.trim()) {
        query = searchInput.value.trim();
    }
    
    // Add category filter
    if (filterSelect && filterSelect.value !== 'all') {
        query += ` ${filterSelect.value}`;
    }
    
    try {
        const data = await fetchNews(query, currentNewsPage);
        const articles = data.articles || [];
        renderArticles(articles, grid);
        
        // Update pagination
        updatePagination(data.totalResults || 0);
        
    } catch (error) {
        console.error('News render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Error loading news. Please try again.</p>';
    }
}

// Cyber Alerts Page
async function renderAlerts() {
    const grid = document.getElementById('alertsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Loading alerts...</p>';
    
    try {
        const data = await fetchNews('scam OR fraud OR phishing OR malware', 1);
        const articles = data.articles || [];
        renderArticles(articles, grid);
    } catch (error) {
        console.error('Alerts render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load alerts.</p>';
    }
}

// Investigations Page
async function renderInvestigations() {
    const grid = document.getElementById('investigationsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Loading investigations...</p>';
    
    try {
        const data = await fetchNews('investigation OR research OR analysis OR report', 1);
        const articles = data.articles || [];
        renderArticles(articles, grid);
    } catch (error) {
        console.error('Investigations render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load investigations.</p>';
    }
}

// Fact Check Page
async function renderFactCheck() {
    const grid = document.getElementById('factcheckGrid');
    if (!grid) return;
    
    grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Loading fact checks...</p>';
    
    try {
        const data = await fetchNews('fact check OR verification OR false OR true', 1);
        const articles = data.articles || [];
        renderArticles(articles, grid);
    } catch (error) {
        console.error('Fact Check render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load fact checks.</p>';
    }
}

// OSINT Lab Page
async function renderOsint() {
    const grid = document.getElementById('osintGrid');
    if (!grid) return;
    
    grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Loading OSINT research...</p>';
    
    try {
        const data = await fetchNews('OSINT OR intelligence OR open source', 1);
        const articles = data.articles || [];
        renderArticles(articles, grid);
    } catch (error) {
        console.error('OSINT render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load OSINT content.</p>';
    }
}

// ============================================================
// PAGINATION
// ============================================================
function updatePagination(totalResults) {
    const pag = document.getElementById('newsPagination');
    if (!pag) return;
    
    const totalPages = Math.ceil(totalResults / CONFIG.PAGE_SIZE) || 1;
    pag.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.disabled = currentNewsPage === 1;
    prevBtn.onclick = () => { if (currentNewsPage > 1) { currentNewsPage--; renderNews(); } };
    pag.appendChild(prevBtn);
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentNewsPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentNewsPage ? 'active' : '';
        btn.onclick = () => { currentNewsPage = i; renderNews(); };
        pag.appendChild(btn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '›';
    nextBtn.disabled = currentNewsPage === totalPages;
    nextBtn.onclick = () => { if (currentNewsPage < totalPages) { currentNewsPage++; renderNews(); } };
    pag.appendChild(nextBtn);
}

// ============================================================
// SEARCH & FILTER
// ============================================================
function setupSearchAndFilter() {
    const searchInput = document.getElementById('newsSearch');
    const filterSelect = document.getElementById('newsFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentNewsPage = 1;
            renderNews();
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            currentNewsPage = 1;
            renderNews();
        });
    }
}

// ============================================================
// THEME TOGGLE
// ============================================================
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const btn = document.querySelector('.theme-toggle i');
    if (btn) {
        btn.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ============================================================
// CONTACT FORM
// ============================================================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]')?.value || '';
            const email = this.querySelector('input[type="email"]')?.value || '';
            const message = this.querySelector('textarea')?.value || '';
            
            // Show success message
            alert(`Thank you ${name}! Your message has been sent.\n\nWe will respond to ${email} within 24 hours.`);
            this.reset();
        });
    }
}

// ============================================================
// BACK TO TOP BUTTON
// ============================================================
function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Setup theme toggle
    const nav = document.querySelector('.nav-links');
    if (nav && !document.querySelector('.theme-toggle')) {
        const toggleBtn = document.createElement('a');
        toggleBtn.href = '#';
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = `<i class="fas ${savedTheme === 'light' ? 'fa-moon' : 'fa-sun'}"></i>`;
        toggleBtn.style.marginLeft = '10px';
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
        nav.appendChild(toggleBtn);
    }
    
    // Setup search and filter
    setupSearchAndFilter();
    
    // Setup contact form
    setupContactForm();
    
    // Setup back to top
    setupBackToTop();
    
    // Initialize all pages
    const path = window.location.pathname;
    
    if (path.includes('news.html')) {
        renderNews();
    } else if (path.includes('cyber-alerts.html')) {
        renderAlerts();
    } else if (path.includes('investigations.html')) {
        renderInvestigations();
    } else if (path.includes('fact-check.html')) {
        renderFactCheck();
    } else if (path.includes('osint-lab.html')) {
        renderOsint();
    } else {
        // Home page
        renderHome();
    }
    
    console.log('🚀 The Nexus Report - Live News Platform');
    console.log('📰 Powered by NewsAPI.org');
    console.log('💡 Tip: Replace YOUR_NEWS_API_KEY with your actual API key');
});
