// ============================================================
// THE NEXUS REPORT - Main JavaScript
// All Features: News, Animations, Clock, Toast, Bookmarks
// ============================================================

// ============================================================
// PRELOADER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    }
});

// ============================================================
// LIVE CLOCK
// ============================================================
function updateClock() {
    const clockElement = document.getElementById('clockTime');
    if (!clockElement) return;
    
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    clockElement.textContent = time;
}

setInterval(updateClock, 1000);
updateClock();

// ============================================================
// THEME TOGGLE
// ============================================================
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
const themeIcon = document.querySelector('#themeToggle i');
if (themeIcon) {
    themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// ============================================================
// MOBILE MENU
// ============================================================
document.getElementById('menuToggle')?.addEventListener('click', function() {
    const nav = document.querySelector('.nav-links');
    nav?.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.remove('open');
    });
});

// ============================================================
// HERO PARTICLES
// ============================================================
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    
    const particles = 30;
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? '#00C2FF' : '#00FF88'};
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.4 + 0.1};
            animation: float ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}
createParticles();

// Add float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
        50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
    }
`;
document.head.appendChild(style);

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (!target) return;
        
        const increment = target / 60;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
        });
        observer.observe(counter);
    });
}

setTimeout(animateCounters, 1000);

// ============================================================
// BACK TO TOP
// ============================================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (backToTop) {
        backToTop.style.display = window.scrollY > 500 ? 'flex' : 'none';
    }
});

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    container.appendChild(toast);
    
    toast.querySelector('.toast-close')?.addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 500);
    }, duration);
}

// ============================================================
// BOOKMARK SYSTEM
// ============================================================
function toggleBookmark(articleId, title, url) {
    let bookmarks = JSON.parse(localStorage.getItem('nexus_bookmarks') || '[]');
    
    const index = bookmarks.findIndex(b => b.id === articleId);
    if (index > -1) {
        bookmarks.splice(index, 1);
        showToast('Removed from bookmarks', 'info');
    } else {
        bookmarks.push({ id: articleId, title, url, date: new Date().toISOString() });
        showToast('Added to bookmarks! 📑', 'success');
    }
    
    localStorage.setItem('nexus_bookmarks', JSON.stringify(bookmarks));
}

function getBookmarks() {
    return JSON.parse(localStorage.getItem('nexus_bookmarks') || '[]');
}

// ============================================================
// OPEN SOURCE NEWS AGGREGATOR
// ============================================================
async function fetchAllNews(category = 'all', query = '') {
    const sources = [
        fetchGoogleNews(query),
        fetchHackerNews(),
        fetchRSSFeeds()
    ];
    
    let allArticles = [];
    let fallbackUsed = false;
    
    try {
        const results = await Promise.allSettled(sources);
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value?.length > 0) {
                allArticles = allArticles.concat(result.value);
            }
        });
        
        if (allArticles.length === 0) {
            allArticles = getFallbackNews();
            fallbackUsed = true;
        }
        
        // Filter by category
        if (category && category !== 'all') {
            allArticles = allArticles.filter(a => 
                (a.category || '').toLowerCase().includes(category.toLowerCase())
            );
        }
        
        // Filter by query
        if (query && query.trim()) {
            const search = query.toLowerCase().trim();
            allArticles = allArticles.filter(a => {
                const title = (a.title || '').toLowerCase();
                const desc = (a.description || '').toLowerCase();
                return title.includes(search) || desc.includes(search);
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
            fallback: true
        };
    }
}

// ============================================================
// RSS2JSON - FREE RSS PROXY
// ============================================================
const RSS2JSON_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

async function fetchGoogleNews(query = '') {
    const feedUrls = [
        'https://news.google.com/rss',
        'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
        'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    ];
    
    let articles = [];
    const selectedFeeds = feedUrls.slice(0, 3);
    
    for (const feedUrl of selectedFeeds) {
        try {
            const response = await fetch(RSS2JSON_PROXY + encodeURIComponent(feedUrl));
            if (!response.ok) continue;
            const data = await response.json();
            if (data.status === 'ok' && data.items) {
                const items = data.items.slice(0, 5).map(item => ({
                    title: item.title || 'Untitled',
                    description: item.description || item.content || 'No description',
                    url: item.link || '#',
                    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    source: { name: item.author || 'Google News' },
                    urlToImage: item.thumbnail || item.enclosure?.link || null,
                    category: 'News'
                }));
                articles = articles.concat(items);
            }
        } catch (e) {
            console.log('Google News feed error:', e.message);
        }
    }
    return articles;
}

async function fetchHackerNews() {
    try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!response.ok) return [];
        const ids = await response.json();
        const topIds = ids.slice(0, 10);
        const articles = [];
        
        for (const id of topIds) {
            try {
                const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                if (!storyRes.ok) continue;
                const story = await storyRes.json();
                if (story?.title) {
                    articles.push({
                        title: story.title,
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

async function fetchRSSFeeds() {
    const feedUrls = [
        'https://thehackernews.com/feeds/posts/default',
        'https://www.bleepingcomputer.com/feed/',
        'https://krebsonsecurity.com/feed/',
        'https://www.schneier.com/blog/atom.xml',
        'https://feeds.feedburner.com/TechCrunch/security',
    ];
    
    let articles = [];
    const selectedFeeds = feedUrls.slice(0, 4);
    
    for (const feedUrl of selectedFeeds) {
        try {
            const response = await fetch(RSS2JSON_PROXY + encodeURIComponent(feedUrl));
            if (!response.ok) continue;
            const data = await response.json();
            if (data.status === 'ok' && data.items) {
                const items = data.items.slice(0, 4).map(item => ({
                    title: item.title || 'Untitled',
                    description: item.description || item.content || 'No description',
                    url: item.link || '#',
                    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    source: { name: data.feed?.title || 'RSS Feed' },
                    urlToImage: item.thumbnail || null,
                    category: 'Cyber Security'
                }));
                articles = articles.concat(items);
            }
        } catch (e) {
            console.log('RSS feed error:', e.message);
        }
    }
    return articles;
}

// ============================================================
// FALLBACK NEWS
// ============================================================
function getFallbackNews() {
    return [
        {
            title: '🔒 Ransomware Attack Targets Hospitals Worldwide',
            description: 'Multiple healthcare facilities affected. FBI and Interpol investigating. Critical infrastructure at risk.',
            url: '#',
            publishedAt: new Date().toISOString(),
            source: { name: 'Security Watch' },
            urlToImage: null,
            category: 'Cyber Security'
        },
        {
            title: '🚨 New Phishing Campaign Uses AI to Clone Voices',
            description: 'Scammers using AI to impersonate family members and demand money. Reports increasing globally.',
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
            description: 'Open-source intelligence reveals coordinated campaign targeting European elections.',
            url: '#',
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            source: { name: 'OSINT Research Center' },
            urlToImage: null,
            category: 'OSINT'
        },
        {
            title: '💰 Fake Crypto Investment Platform Steals $50M',
            description: 'Victims lured with fake returns. Platform disappeared overnight. Regulators investigating.',
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
    const time = article.publishedAt ? timeAgo(new Date(article.publishedAt)) : 'Just now';
    const category = article.category || 'News';
    const source = article.source?.name || 'Unknown Source';
    
    const imageHtml = article.urlToImage ? 
        `<img src="${article.urlToImage}" alt="${article.title}" loading="lazy" 
              onerror="this.style.display='none'" crossorigin="anonymous">` : 
        `<div style="width:100%; height:180px; background:linear-gradient(135deg, var(--primary), var(--border)); border-radius:8px; margin-bottom:12px; display:flex; align-items:center; justify-content:center; opacity:0.3;">
            <i class="fas fa-newspaper" style="font-size:3rem;"></i>
         </div>`;
    
    return `
        <div class="card animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.05}s">
            ${imageHtml}
            <span class="badge ${category === 'Scam Alert' ? 'warning' : category === 'OSINT' ? 'accent' : ''}">${category}</span>
            <h3>${article.title || 'Untitled Article'}</h3>
            <p>${(article.description || '').substring(0, 150)}${(article.description || '').length > 150 ? '...' : ''}</p>
            <div class="meta">
                <span><i class="far fa-clock"></i> ${time}</span>
                <span><i class="fas fa-bookmark" style="cursor:pointer;" onclick="toggleBookmark('${article.url || index}', '${article.title}', '${article.url}')"></i></span>
                ${source ? `<span><i class="fas fa-user"></i> ${source}</span>` : ''}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                <a href="${article.url || '#'}" target="_blank" rel="noopener noreferrer" class="link-arrow">
                    Read more <i class="fas fa-arrow-right"></i>
                </a>
                <div style="display:flex; gap:8px;">
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}" target="_blank" style="color:var(--text); opacity:0.4; transition:0.3s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.4'">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}" target="_blank" style="color:var(--text); opacity:0.4; transition:0.3s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.4'">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>
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
        
        if (data.fallback) {
            showToast('⚠️ Using fallback data. Some sources unavailable.', 'info');
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
        const start = (currentPage - 1) * PAGE_SIZE;
        const pageArticles = articles.slice(start, start + PAGE_SIZE);
        
        renderArticles(pageArticles, grid);
        updatePagination(articles.length);
        
        if (data.fallback) {
            showToast('⚠️ Some news sources unavailable. Showing available content.', 'info');
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
        renderArticles((data.articles || []).slice(0, 12), grid);
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
        renderArticles((data.articles || []).slice(0, 8), grid);
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
        renderArticles((data.articles || []).slice(0, 8), grid);
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
        renderArticles((data.articles || []).slice(0, 8), grid);
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
    
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderNews(); } };
    pag.appendChild(prevBtn);
    
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
// CONTACT FORM
// ============================================================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('✅ Thank you! Your message has been sent.', 'success');
            this.reset();
        });
    }
}

// ============================================================
// NEWSLETTER FORM
// ============================================================
function setupNewsletter() {
    const form = document.getElementById('footerNewsletter');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            showToast(`✅ Subscribed! ${email} will receive updates.`, 'success');
            this.reset();
        });
    }
}

// ============================================================
// TRENDING TAGS - CLICK TO SEARCH
// ============================================================
function setupTrendingTags() {
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const text = this.textContent.replace('#', '').trim();
            currentQuery = text;
            currentPage = 1;
            
            // Navigate to news page if not already there
            if (!window.location.pathname.includes('news.html')) {
                window.location.href = `news.html?q=${encodeURIComponent(text)}`;
            } else {
                const searchInput = document.getElementById('newsSearch');
                if (searchInput) {
                    searchInput.value = text;
                    renderNews();
                }
            }
        });
    });
}

// ============================================================
// NOTIFICATION BAR
// ============================================================
function setupNotificationBar() {
    const closeBtn = document.getElementById('closeNotification');
    const bar = document.getElementById('notificationBar');
    
    if (closeBtn && bar) {
        closeBtn.addEventListener('click', () => {
            bar.style.display = 'none';
        });
    }
    
    // Update threat status randomly
    const statuses = [
        'All systems nominal',
        '⚠️ Elevated phishing activity detected',
        '🔒 New ransomware variant reported',
        '✅ Security update available',
        '🕵️ Ongoing OSINT investigation'
    ];
    
    const statusElement = document.getElementById('threatStatus');
    if (statusElement) {
        setInterval(() => {
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            statusElement.textContent = randomStatus;
        }, 8000);
    }
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Setup all features
    setupSearchAndFilter();
    setupContactForm();
    setupNewsletter();
    setupTrendingTags();
    setupNotificationBar();
    
    // Load page based on URL
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    if (searchQuery) {
        currentQuery = searchQuery;
    }
    
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
    
    console.log('🚀 The Nexus Report - Cyber Intelligence Platform');
    console.log('📰 Modern Design with Glassmorphism & Animations');
    console.log('📡 Fetching from Google News, Hacker News & RSS feeds');
    console.log('💡 Features: Bookmark, Share, Toast Notifications, Live Clock');
});
