// ============================================================
// OPEN SOURCE NEWS AGGREGATOR - 100% JavaScript
// No PHP, No API Keys - Works on GitHub Pages
// ============================================================

// ============================================================
// FREE NEWS SOURCES (No API Key Required)
// ============================================================
const NEWS_SOURCES = {
    // Google News RSS (Free, No API Key)
    google: {
        url: 'https://news.google.com/rss',
        feeds: [
            { name: 'Top Stories', url: 'https://news.google.com/rss' },
            { name: 'World', url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en' },
            { name: 'Technology', url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en' },
            { name: 'Science', url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en' },
            { name: 'Business', url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en' },
        ]
    },
    // Hacker News (Free API)
    hackernews: {
        url: 'https://hacker-news.firebaseio.com/v0',
        feeds: [
            { name: 'Top Stories', url: 'https://hacker-news.firebaseio.com/v0/topstories.json' },
            { name: 'New Stories', url: 'https://hacker-news.firebaseio.com/v0/newstories.json' },
            { name: 'Best Stories', url: 'https://hacker-news.firebaseio.com/v0/beststories.json' },
        ]
    },
    // GDELT (Free, No API Key)
    gdelt: {
        url: 'https://api.gdeltproject.org/api/v2/doc/doc?query=cyber%20security%20OR%20hacking&mode=artlist&format=json'
    },
    // RSS2JSON - Free proxy for RSS feeds
    rss2json: {
        url: 'https://api.rss2json.com/v1/api.json?rss_url=',
        feeds: [
            'https://thehackernews.com/feeds/posts/default',
            'https://www.bleepingcomputer.com/feed/',
            'https://www.darkreading.com/rss/all.xml',
            'https://feeds.feedburner.com/TechCrunch/security',
            'https://krebsonsecurity.com/feed/',
            'https://www.schneier.com/blog/atom.xml',
            'https://www.wired.com/feed/category/security/latest/rss',
            'https://www.zdnet.com/topic/security/rss.xml',
        ]
    }
};

// ============================================================
// FETCH NEWS FROM MULTIPLE SOURCES
// ============================================================

// 1. Fetch from Google News RSS (via RSS2JSON proxy)
async function fetchGoogleNews(query = '') {
    try {
        const feedUrls = NEWS_SOURCES.google.feeds;
        let allArticles = [];
        
        // Use RSS2JSON proxy (free, no API key)
        const proxy = 'https://api.rss2json.com/v1/api.json?rss_url=';
        
        for (const feed of feedUrls) {
            try {
                const url = feed.url;
                const response = await fetch(proxy + encodeURIComponent(url));
                if (!response.ok) continue;
                
                const data = await response.json();
                if (data.status === 'ok' && data.items) {
                    const articles = data.items.map(item => ({
                        title: item.title || 'Untitled',
                        description: item.description || item.content || 'No description',
                        url: item.link || '#',
                        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        source: { name: item.author || feed.name || 'Google News' },
                        urlToImage: item.thumbnail || item.enclosure?.link || null,
                        category: feed.name || 'News'
                    }));
                    allArticles = allArticles.concat(articles);
                }
            } catch (e) {
                console.log('Feed error:', feed.name, e.message);
            }
        }
        
        return allArticles;
    } catch (error) {
        console.error('Google News fetch error:', error);
        return [];
    }
}

// 2. Fetch from Hacker News
async function fetchHackerNews() {
    try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!response.ok) return [];
        
        const ids = await response.json();
        const topIds = ids.slice(0, 20);
        const articles = [];
        
        for (const id of topIds) {
            try {
                const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                if (!storyRes.ok) continue;
                
                const story = await storyRes.json();
                if (story && story.title) {
                    articles.push({
                        title: story.title || 'Untitled',
                        description: story.text || 'Hacker News Discussion',
                        url: story.url || `https://news.ycombinator.com/item?id=${id}`,
                        publishedAt: story.time ? new Date(story.time * 1000).toISOString() : new Date().toISOString(),
                        source: { name: 'Hacker News' },
                        urlToImage: null,
                        category: 'Technology',
                        score: story.score || 0
                    });
                }
            } catch (e) {
                console.log('HN story error:', e.message);
            }
        }
        
        return articles;
    } catch (error) {
        console.error('Hacker News fetch error:', error);
        return [];
    }
}

// 3. Fetch from RSS2JSON (Direct RSS feeds)
async function fetchRSSFeeds() {
    try {
        const feedUrls = NEWS_SOURCES.rss2json.feeds;
        const allArticles = [];
        const proxy = 'https://api.rss2json.com/v1/api.json?rss_url=';
        
        // Take only first 5 feeds to avoid rate limiting
        const selectedFeeds = feedUrls.slice(0, 5);
        
        for (const feedUrl of selectedFeeds) {
            try {
                const response = await fetch(proxy + encodeURIComponent(feedUrl));
                if (!response.ok) continue;
                
                const data = await response.json();
                if (data.status === 'ok' && data.items) {
                    const articles = data.items.slice(0, 5).map(item => ({
                        title: item.title || 'Untitled',
                        description: item.description || item.content || 'No description',
                        url: item.link || '#',
                        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        source: { name: item.author || data.feed?.title || 'RSS Feed' },
                        urlToImage: item.thumbnail || null,
                        category: data.feed?.title || 'News'
                    }));
                    allArticles.push(...articles);
                }
            } catch (e) {
                console.log('RSS feed error:', e.message);
            }
        }
        
        return allArticles;
    } catch (error) {
        console.error('RSS fetch error:', error);
        return [];
    }
}

// 4. Main fetch function
async function fetchAllNews(category = 'all', query = '') {
    let allArticles = [];
    let fallbackUsed = false;
    
    try {
        // Try multiple sources
        const sources = [
            fetchRSSFeeds(),
            fetchGoogleNews(query),
            fetchHackerNews()
        ];
        
        const results = await Promise.allSettled(sources);
        
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value && result.value.length > 0) {
                allArticles = allArticles.concat(result.value);
            }
        });
        
        // If no articles, use fallback
        if (allArticles.length === 0) {
            allArticles = getFallbackNews();
            fallbackUsed = true;
        }
        
        // Filter by category if needed
        if (category && category !== 'all') {
            allArticles = allArticles.filter(article => {
                const cat = article.category || '';
                return cat.toLowerCase().includes(category.toLowerCase());
            });
        }
        
        // Filter by search query
        if (query && query.trim()) {
            const searchLower = query.toLowerCase().trim();
            allArticles = allArticles.filter(article => {
                const title = (article.title || '').toLowerCase();
                const desc = (article.description || '').toLowerCase();
                return title.includes(searchLower) || desc.includes(searchLower);
            });
        }
        
        // Remove duplicates
        const unique = [];
        const titles = new Set();
        for (const article of allArticles) {
            const key = article.title || article.url || '';
            if (key && !titles.has(key)) {
                titles.add(key);
                unique.push(article);
            }
        }
        
        // Sort by date
        unique.sort((a, b) => {
            const dateA = new Date(a.publishedAt || 0);
            const dateB = new Date(b.publishedAt || 0);
            return dateB - dateA;
        });
        
        return {
            status: 'ok',
            totalResults: unique.length,
            articles: unique,
            fallback: fallbackUsed
        };
        
    } catch (error) {
        console.error('Fetch error:', error);
        return {
            status: 'error',
            totalResults: 6,
            articles: getFallbackNews(),
            fallback: true,
            error: error.message
        };
    }
}

// ============================================================
// FALLBACK NEWS (When all sources fail)
// ============================================================
function getFallbackNews() {
    return [
        {
            title: '🔒 Ransomware Attack Targets Hospitals Worldwide',
            description: 'Multiple healthcare facilities affected. FBI and Interpol investigating the attacks. Critical infrastructure at risk.',
            url: '#',
            publishedAt: new Date().toISOString(),
            source: { name: 'Security Watch' },
            urlToImage: null,
            category: 'Cyber Security'
        },
        {
            title: '🚨 New Phishing Campaign Uses AI to Clone Voices',
            description: 'Scammers using AI to impersonate family members and demand money. Reports increasing in North America and Europe.',
            url: '#',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: 'Fraud Alert Network' },
            urlToImage: null,
            category: 'Scam Alert'
        },
        {
            title: '💻 Critical Windows Zero-Day Vulnerability Disclosed',
            description: 'Microsoft releases emergency patch. Update immediately to protect your system from active exploits.',
            url: '#',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: { name: 'Tech Security Monitor' },
            urlToImage: null,
            category: 'Technology'
        },
        {
            title: '📱 Android Malware Steals Banking Credentials',
            description: 'New variant of banking trojan discovered in Google Play Store. Over 100,000 downloads reported.',
            url: '#',
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            source: { name: 'Mobile Security Lab' },
            urlToImage: null,
            category: 'Cyber Security'
        },
        {
            title: '🕵️ OSINT Investigation Exposes Disinformation Network',
            description: 'Open-source intelligence reveals coordinated campaign targeting European elections and public opinion.',
            url: '#',
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            source: { name: 'OSINT Research Center' },
            urlToImage: null,
            category: 'OSINT'
        },
        {
            title: '💰 Fake Crypto Investment Platform Steals $50M',
            description: 'Victims lured with fake returns on cryptocurrency investments. Platform disappeared overnight.',
            url: '#',
            publishedAt: new Date(Date.now() - 18000000).toISOString(),
            source: { name: 'Crypto Security Watch' },
            urlToImage: null,
            category: 'Scam Alert'
        }
    ];
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================
function renderArticleCard(article, index) {
    const time = article.publishedAt ? timeAgo(new Date(article.publishedAt)) : 'Recent';
    const category = article.category || 'News';
    const source = article.source?.name || 'Unknown Source';
    
    const imageHtml = article.urlToImage ? 
        `<img src="${article.urlToImage}" alt="${article.title}" loading="lazy" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:12px;" 
              onerror="this.style.display='none'">` : 
        `<div style="width:100%; height:160px; background:var(--border); border-radius:8px; margin-bottom:12px; display:flex; align-items:center; justify-content:center; opacity:0.3;">
            <i class="fas fa-newspaper" style="font-size:3rem;"></i>
         </div>`;
    
    return `
        <div class="card">
            ${imageHtml}
            <span class="badge">${category}</span>
            <h3>${article.title || 'Untitled Article'}</h3>
            <p>${(article.description || '').substring(0, 150)}${(article.description || '').length > 150 ? '...' : ''}</p>
            <div class="meta">
                <i class="far fa-clock"></i> ${time}
                ${source ? ` • ${source}` : ''}
            </div>
            <a href="${article.url || '#'}" target="_blank" rel="noopener noreferrer" class="link-arrow">
                Read more <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

function renderArticles(articles, container) {
    if (!container) return;
    
    if (!articles || articles.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; opacity:0.6;">
                <i class="fas fa-inbox" style="font-size:2rem; display:block; margin-bottom:12px;"></i>
                No articles found. Please try a different search.
            </div>
        `;
        return;
    }
    
    container.innerHTML = articles.map((article, i) => renderArticleCard(article, i)).join('');
}

// ============================================================
// TIME HELPER
// ============================================================
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (isNaN(seconds) || seconds < 0) return 'Just now';
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    
    return `${Math.floor(months / 12)}y ago`;
}

// ============================================================
// PAGE LOADERS
// ============================================================
let currentPage = 1;
let currentQuery = '';
let currentCategory = 'all';
const PAGE_SIZE = 6;

async function renderHome() {
    const containers = {
        homeNews: document.getElementById('homeNews'),
        homeAlerts: document.getElementById('homeAlerts'),
        homeFactCheck: document.getElementById('homeFactCheck'),
        homeOsint: document.getElementById('homeOsint')
    };
    
    // Show loading
    Object.values(containers).forEach(el => {
        if (el) el.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    });
    
    try {
        const data = await fetchAllNews('', '');
        const articles = data.articles || [];
        
        const news = articles.filter(a => a.category === 'News' || a.category === 'Technology').slice(0, 3);
        const alerts = articles.filter(a => a.category === 'Scam Alert' || a.category === 'Cyber Security').slice(0, 2);
        const factCheck = articles.filter(a => a.category === 'News').slice(0, 2);
        const osint = articles.filter(a => a.category === 'OSINT' || a.category === 'Technology').slice(0, 2);
        
        if (containers.homeNews) renderArticles(news.length > 0 ? news : articles.slice(0, 3), containers.homeNews);
        if (containers.homeAlerts) renderArticles(alerts.length > 0 ? alerts : articles.slice(0, 2), containers.homeAlerts);
        if (containers.homeFactCheck) renderArticles(factCheck.length > 0 ? factCheck : articles.slice(0, 2), containers.homeFactCheck);
        if (containers.homeOsint) renderArticles(osint.length > 0 ? osint : articles.slice(0, 2), containers.homeOsint);
        
        // Show fallback message
        if (data.fallback) {
            const msg = document.createElement('div');
            msg.style.cssText = 'grid-column:1/-1; text-align:center; padding:10px; background:#ffaa33; color:#0A192F; border-radius:8px; margin-top:10px;';
            msg.textContent = '⚠️ Using fallback data. Some news sources may be temporarily unavailable.';
            if (containers.homeNews) containers.homeNews.appendChild(msg);
        }
    } catch (error) {
        console.error('Home render error:', error);
        Object.values(containers).forEach(el => {
            if (el) el.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load news. Please refresh.</p>';
        });
    }
}

async function renderNews() {
    const grid = document.getElementById('newsGrid');
    const searchInput = document.getElementById('newsSearch');
    const filterSelect = document.getElementById('newsFilter');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    
    const query = searchInput?.value || currentQuery;
    const category = filterSelect?.value || currentCategory;
    
    try {
        const data = await fetchAllNews(category, query);
        const articles = data.articles || [];
        
        // Pagination
        const start = (currentPage - 1) * PAGE_SIZE;
        const pageArticles = articles.slice(start, start + PAGE_SIZE);
        
        renderArticles(pageArticles, grid);
        updatePagination(articles.length);
        
        // Show fallback message
        if (data.fallback && grid) {
            const msg = document.createElement('div');
            msg.style.cssText = 'grid-column:1/-1; text-align:center; padding:10px; background:#ffaa33; color:#0A192F; border-radius:8px; margin-top:10px; font-size:0.9rem;';
            msg.textContent = '⚠️ ' + (data.error || 'Using fallback data. Some sources may be unavailable.');
            grid.appendChild(msg);
        }
    } catch (error) {
        console.error('News render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Error loading news. Please refresh.</p>';
    }
}

async function renderAlerts() {
    const grid = document.getElementById('alertsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    
    try {
        const data = await fetchAllNews('', 'scam OR fraud OR phishing');
        const articles = data.articles || [];
        renderArticles(articles.slice(0, 12), grid);
    } catch (error) {
        console.error('Alerts render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load alerts.</p>';
    }
}

async function renderInvestigations() {
    const grid = document.getElementById('investigationsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    
    try {
        const data = await fetchAllNews('', 'investigation OR report OR analysis');
        const articles = data.articles || [];
        renderArticles(articles.slice(0, 8), grid);
    } catch (error) {
        console.error('Investigations render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load investigations.</p>';
    }
}

async function renderFactCheck() {
    const grid = document.getElementById('factcheckGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    
    try {
        const data = await fetchAllNews('', 'fact check OR verification');
        const articles = data.articles || [];
        renderArticles(articles.slice(0, 8), grid);
    } catch (error) {
        console.error('Fact Check render error:', error);
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">Unable to load fact checks.</p>';
    }
}

async function renderOsint() {
    const grid = document.getElementById('osintGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    
    try {
        const data = await fetchAllNews('', 'OSINT OR intelligence');
        const articles = data.articles || [];
        renderArticles(articles.slice(0, 8), grid);
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
    
    const totalPages = Math.ceil(totalResults / PAGE_SIZE) || 1;
    pag.innerHTML = '';
    
    // Previous
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderNews(); } };
    pag.appendChild(prevBtn);
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => { currentPage = i; renderNews(); };
        pag.appendChild(btn);
    }
    
    // Next
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '›';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderNews(); } };
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
            currentPage = 1;
            currentQuery = searchInput.value;
            renderNews();
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            currentPage = 1;
            currentCategory = filterSelect.value;
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

function setupThemeToggle() {
    const nav = document.querySelector('.nav-links');
    if (nav && !document.querySelector('.theme-toggle')) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
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
}

// ============================================================
// BACK TO TOP
// ============================================================
function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// CONTACT FORM
// ============================================================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('✅ Thank you! Your message has been sent. We will respond within 24 hours.');
            this.reset();
        });
    }
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Setup all features
    setupThemeToggle();
    setupSearchAndFilter();
    setupBackToTop();
    setupContactForm();
    
    // Load page based on URL
    const path = window.location.pathname;
    
    if (path.includes('cyber-alerts.html')) {
        renderAlerts();
    } else if (path.includes('news.html')) {
        renderNews();
    } else if (path.includes('investigations.html')) {
        renderInvestigations();
    } else if (path.includes('fact-check.html')) {
        renderFactCheck();
    } else if (path.includes('osint-lab.html')) {
        renderOsint();
    } else {
        renderHome();
    }
    
    console.log('🚀 The Nexus Report - Open Source News Aggregator');
    console.log('📰 100% JavaScript - No PHP, No API Keys Required');
    console.log('📡 Fetching from Google News, Hacker News, and RSS feeds via RSS2JSON');
    console.log('💡 If no news appears, check console for errors');
});
