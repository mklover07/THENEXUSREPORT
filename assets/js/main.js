// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    NEWS_API_KEY: 'YOUR_NEWS_API_KEY', // Replace with your key
    NEWS_API_URL: 'https://newsapi.org/v2/',
    PAGE_SIZE: 6,
};

// ============================================================
// CYBER ALERTS DATA (Real-time from API + Fallback)
// ============================================================

// Fetch cyber alerts specifically
async function fetchCyberAlerts() {
    const queries = [
        'scam OR fraud',
        'phishing OR malware',
        'cyber attack OR data breach',
        'hacking OR ransomware'
    ];
    
    let allArticles = [];
    
    for (const query of queries) {
        try {
            const url = `${CONFIG.NEWS_API_URL}everything?q=${encodeURIComponent(query)}&pageSize=5&apiKey=${CONFIG.NEWS_API_KEY}&language=en&sortBy=publishedAt`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.articles) {
                    allArticles = allArticles.concat(data.articles);
                }
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    }
    
    // Remove duplicates based on title
    const unique = [];
    const titles = new Set();
    for (const article of allArticles) {
        if (!titles.has(article.title)) {
            titles.add(article.title);
            unique.push(article);
        }
    }
    
    // Sort by date (newest first)
    unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    return unique.slice(0, 20); // Return top 20
}

// Get alert severity based on keywords
function getAlertSeverity(title, description) {
    const text = (title + ' ' + (description || '')).toLowerCase();
    
    if (text.includes('ransomware') || text.includes('critical') || text.includes('emergency') || 
        text.includes('urgent') || text.includes('breach') || text.includes('attack')) {
        return { severity: 'urgent', level: '🚨 Urgent' };
    }
    if (text.includes('phishing') || text.includes('malware') || text.includes('virus') || 
        text.includes('hack') || text.includes('steal') || text.includes('fraud')) {
        return { severity: 'high', level: '⚠️ High' };
    }
    if (text.includes('scam') || text.includes('fake') || text.includes('warning') || 
        text.includes('alert') || text.includes('suspicious')) {
        return { severity: 'medium', level: '📢 Medium' };
    }
    return { severity: 'low', level: 'ℹ️ Low' };
}

// Render Cyber Alerts with severity
function renderAlertCard(article, index) {
    const { severity, level } = getAlertSeverity(article.title, article.description);
    const time = article.publishedAt ? timeAgo(new Date(article.publishedAt)) : 'Just now';
    const imageHtml = article.urlToImage ? 
        `<img src="${article.urlToImage}" alt="${article.title}" style="width:100%; height:140px; object-fit:cover; border-radius:8px; margin-bottom:12px;">` : 
        '';

    return `
        <div class="card alert-${severity}">
            ${imageHtml}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="alert-badge ${severity}">${level}</span>
                <span class="alert-time"><i class="fas fa-clock"></i> ${time}</span>
            </div>
            <h3>${article.title || 'Cyber Alert'}</h3>
            <p>${article.description || 'Stay vigilant. Check the source for more details.'}</p>
            <div class="meta">
                <i class="fas fa-shield-alt"></i> ${article.source?.name || 'Security Watch'}
            </div>
            <a href="${article.url || '#'}" target="_blank" class="link-arrow">
                View Alert <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

// Main Cyber Alerts render function
async function renderCyberAlerts() {
    const grid = document.getElementById('alertsGrid');
    if (!grid) return;
    
    // Show loading
    grid.innerHTML = `
        <div class="loading-spinner" style="grid-column: 1/-1;">
            <i class="fas fa-spinner"></i> Scanning for cyber alerts...
        </div>
    `;
    
    try {
        // Try to fetch real alerts
        const articles = await fetchCyberAlerts();
        
        if (articles && articles.length > 0) {
            // Update stats
            updateAlertStats(articles);
            
            // Render alerts
            grid.innerHTML = articles.map((article, i) => renderAlertCard(article, i)).join('');
        } else {
            // Use fallback data
            const fallbackAlerts = getFallbackAlerts();
            updateAlertStats(fallbackAlerts);
            grid.innerHTML = fallbackAlerts.map((alert, i) => renderAlertCard(alert, i)).join('');
            grid.innerHTML += `
                <div style="grid-column:1/-1; text-align:center; padding:20px; opacity:0.6; border-top:1px solid var(--border);">
                    <i class="fas fa-info-circle"></i> Showing sample alerts. Connect to NewsAPI for live updates.
                </div>
            `;
        }
    } catch (error) {
        console.error('Alert render error:', error);
        // Show fallback
        const fallbackAlerts = getFallbackAlerts();
        updateAlertStats(fallbackAlerts);
        grid.innerHTML = fallbackAlerts.map((alert, i) => renderAlertCard(alert, i)).join('');
        grid.innerHTML += `
            <div style="grid-column:1/-1; text-align:center; padding:20px; opacity:0.6; border-top:1px solid var(--border);">
                <i class="fas fa-exclamation-triangle"></i> Error fetching live alerts. Showing sample data.
            </div>
        `;
    }
}

// ============================================================
// FALLBACK ALERTS DATA
// ============================================================
function getFallbackAlerts() {
    return [
        {
            title: '⚠️ Ransomware Attack Targets Major Hospital Network',
            description: 'Multiple hospitals across 3 states affected. Patient data potentially compromised. FBI investigating.',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            url: '#',
            source: { name: 'Cyber Security Watch' }
        },
        {
            title: '🚨 New Phishing Campaign Impersonates PayPal',
            description: 'Fraudulent emails asking users to verify accounts. Do not click on links. Forward to spoof@paypal.com',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            url: '#',
            source: { name: 'Fraud Alert Network' }
        },
        {
            title: '⚠️ Fake Crypto Wallet App Steals Credentials',
            description: 'Malicious app disguised as popular wallet. Over 10,000 downloads. Uninstall immediately if installed.',
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            url: '#',
            source: { name: 'Crypto Security Report' }
        },
        {
            title: '📢 LinkedIn Scam Targeting Job Seekers',
            description: 'Fake recruiters asking for "background check fees". Always verify company profiles before sharing personal info.',
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            url: '#',
            source: { name: 'Employment Security Watch' }
        },
        {
            title: '🚨 Critical Vulnerability Found in Windows Systems',
            description: 'Zero-day exploit being actively used. Microsoft patches available. Update immediately.',
            publishedAt: new Date(Date.now() - 18000000).toISOString(),
            url: '#',
            source: { name: 'Security Patch Monitor' }
        },
        {
            title: '⚠️ QR Code Scam at Public Parking Meters',
            description: 'Fake QR codes placed over real ones. Scanning sends payment to scammers. Use official parking apps only.',
            publishedAt: new Date(Date.now() - 21600000).toISOString(),
            url: '#',
            source: { name: 'Public Safety Alert' }
        }
    ];
}

// ============================================================
// UPDATE ALERT STATS
// ============================================================
function updateAlertStats(articles) {
    const totalEl = document.getElementById('totalAlerts');
    const urgentEl = document.getElementById('urgentAlerts');
    const highEl = document.getElementById('highAlerts');
    const mediumEl = document.getElementById('mediumAlerts');
    
    if (!totalEl) return;
    
    let urgent = 0, high = 0, medium = 0;
    
    articles.forEach(article => {
        const { severity } = getAlertSeverity(article.title, article.description);
        if (severity === 'urgent') urgent++;
        else if (severity === 'high') high++;
        else if (severity === 'medium') medium++;
    });
    
    totalEl.textContent = articles.length;
    urgentEl.textContent = urgent;
    highEl.textContent = high;
    mediumEl.textContent = medium;
}

// ============================================================
// REFRESH ALERTS
// ============================================================
function setupRefreshAlerts() {
    const refreshBtn = document.getElementById('refreshAlerts');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async function() {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            
            await renderCyberAlerts();
            
            this.disabled = false;
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Alerts';
            
            // Show notification
            const grid = document.getElementById('alertsGrid');
            if (grid) {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    grid-column: 1/-1;
                    text-align: center;
                    padding: 10px;
                    background: var(--accent);
                    color: #0A192F;
                    border-radius: 8px;
                    font-weight: 600;
                    margin-bottom: 10px;
                `;
                notification.textContent = '✅ Alerts refreshed successfully!';
                grid.prepend(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
        });
    }
}

// ============================================================
// TIME HELPER
// ============================================================
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
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
    
    // Setup refresh button
    setupRefreshAlerts();
    
    // Setup back to top
    setupBackToTop();
    
    // Setup contact form
    setupContactForm();
    
    // Determine which page we're on and load accordingly
    const path = window.location.pathname;
    
    if (path.includes('cyber-alerts.html')) {
        renderCyberAlerts();
    } else if (path.includes('news.html')) {
        renderNews();
    } else if (path.includes('investigations.html')) {
        renderInvestigations();
    } else if (path.includes('fact-check.html')) {
        renderFactCheck();
    } else if (path.includes('osint-lab.html')) {
        renderOsint();
    } else if (path.includes('contact.html')) {
        // Contact page doesn't need news
    } else {
        renderHome();
    }
    
    console.log('🚀 The Nexus Report - Cyber Alerts Active!');
    console.log('📡 Monitoring for real-time cyber threats...');
});
