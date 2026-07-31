// ============================================================
// SCI-FI CYBER INTELLIGENCE PLATFORM
// Particles · Terminal · Animations
// ============================================================

// ============================================================
// PRELOADER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 2000);
});

// ============================================================
// PARTICLE SYSTEM
// ============================================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        // Mouse interaction
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 0.5;
            this.y += (dy / dist) * force * 0.5;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        ctx.fill();
        // Glow
        ctx.shadowColor = 'rgba(0, 240, 255, 0.2)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function initParticles() {
    const count = Math.min(150, Math.floor((canvas.width * canvas.height) / 20000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ============================================================
// UPTIME COUNTER
// ============================================================
let startTime = Date.now();
setInterval(function() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl) uptimeEl.textContent = `${hours}:${minutes}:${seconds}`;
}, 1000);

// ============================================================
// CLOCK
// ============================================================
function updateClock() {
    const clockEl = document.getElementById('clockTime');
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
// TERMINAL ANIMATION
// ============================================================
const terminalLines = [
    '> INITIALIZING NEURAL INTERFACE...',
    '> CONNECTING TO SATELLITE NETWORK...',
    '> ESTABLISHING SECURE CHANNEL...',
    '> <span class="terminal-success">CONNECTION ESTABLISHED ✓</span>',
    '> MONITORING GLOBAL THREAT FEED...',
    '> <span class="terminal-success">ALL SYSTEMS NOMINAL ✓</span>',
    '> <span class="terminal-cursor">_</span>'
];

let lineIndex = 0;
const terminalOutput = document.getElementById('terminalOutput');

function updateTerminal() {
    if (!terminalOutput) return;
    if (lineIndex < terminalLines.length) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = terminalLines[lineIndex];
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        lineIndex++;
        setTimeout(updateTerminal, 500 + Math.random() * 300);
    } else {
        setTimeout(function() {
            // Clear and restart
            terminalOutput.innerHTML = '';
            lineIndex = 0;
            setTimeout(updateTerminal, 1000);
        }, 5000);
    }
}
setTimeout(updateTerminal, 500);

// ============================================================
// THEME TOGGLE
// ============================================================
function toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}
document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
const icon = document.querySelector('#themeToggle i');
if (icon) icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

// ============================================================
// MOBILE MENU
// ============================================================
document.getElementById('menuToggle')?.addEventListener('click', function() {
    document.querySelector('.nav-links')?.classList.toggle('open');
});

// ============================================================
// BACK TO TOP
// ============================================================
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
    if (backBtn) {
        backBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
    }
});
backBtn?.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// TOAST SYSTEM
// ============================================================
function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed; top:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px;';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none; border:none; color:var(--text); cursor:pointer; opacity:0.5; font-size:1.2rem;">&times;</button>`;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 500);
        }
    }, duration);
}

// ============================================================
// FALLBACK DATA
// ============================================================
const FALLBACK_ARTICLES = [
    { title: '🔒 Ransomware Attack Targets Hospitals', description: 'Multiple healthcare facilities affected worldwide.', category: 'Cyber Security', source: { name: 'Security Watch' }, url: '#', publishedAt: new Date().toISOString() },
    { title: '🚨 AI-Powered Phishing Campaign Detected', description: 'Scammers using AI to clone voices and steal money.', category: 'Scam Alert', source: { name: 'Fraud Alert' }, url: '#', publishedAt: new Date(Date.now() - 3600000).toISOString() },
    { title: '💻 Critical Windows Zero-Day Patched', description: 'Microsoft releases emergency security update.', category: 'Technology', source: { name: 'Tech Security' }, url: '#', publishedAt: new Date(Date.now() - 7200000).toISOString() },
    { title: '📱 Banking Malware on Play Store', description: 'Over 100,000 downloads of malicious banking trojan.', category: 'Cyber Security', source: { name: 'Mobile Security' }, url: '#', publishedAt: new Date(Date.now() - 10800000).toISOString() },
    { title: '🕵️ OSINT Exposes Disinformation Network', description: 'Coordinated campaign targeting elections uncovered.', category: 'OSINT', source: { name: 'OSINT Research' }, url: '#', publishedAt: new Date(Date.now() - 14400000).toISOString() },
    { title: '💰 Fake Crypto Platform Steals $50M', description: 'Investment scam vanishes overnight.', category: 'Scam Alert', source: { name: 'Crypto Security' }, url: '#', publishedAt: new Date(Date.now() - 18000000).toISOString() }
];

// ============================================================
// RENDER CARDS
// ============================================================
function renderArticleCard(article) {
    const time = article.publishedAt ? timeAgo(new Date(article.publishedAt)) : 'Just now';
    const category = article.category || 'News';
    let badgeClass = 'cyber';
    if (category === 'Scam Alert') badgeClass = 'scam';
    else if (category === 'OSINT') badgeClass = 'osint';
    const source = article.source?.name || 'Unknown';
    return `<div class="card">
        <span class="badge ${badgeClass}">${category}</span>
        <h3>${article.title || 'Untitled'}</h3>
        <p>${(article.description || '').substring(0, 120)}${(article.description || '').length > 120 ? '...' : ''}</p>
        <div class="meta"><span><i class="far fa-clock"></i> ${time}</span><span><i class="fas fa-user"></i> ${source}</span></div>
        <a href="${article.url || '#'}" target="_blank" class="link-arrow">READ MORE <i class="fas fa-arrow-right"></i></a>
    </div>`;
}

function renderArticles(articles, container) {
    if (!container) return;
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; opacity:0.5;">NO INTELLIGENCE FEED</div>';
        return;
    }
    container.innerHTML = articles.map(renderArticleCard).join('');
}

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (isNaN(seconds) || seconds < 0) return 'Just now';
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    return Math.floor(days / 7) + 'w ago';
}

function renderHome() {
    const container = document.getElementById('homeNews');
    if (!container) return;
    container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    setTimeout(() => {
        renderArticles(FALLBACK_ARTICLES.slice(0, 6), container);
    }, 500);
}

// ============================================================
// TOOLS MODAL
// ============================================================
function openTool(type) {
    const modal = document.getElementById('toolModal');
    const title = document.getElementById('toolModalTitle');
    const body = document.getElementById('toolModalBody');
    if (!modal || !title || !body) return;
    modal.classList.add('show');
    const tools = {
        ip: { title: '🔍 IP INTELLIGENCE', html: `<p>Check IP reputation and geolocation</p><input type="text" id="ipInput" placeholder="Enter IP" value="8.8.8.8"><button onclick="checkIP()">SCAN</button><div id="ipResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>` },
        domain: { title: '🌐 DOMAIN ANALYSIS', html: `<p>Check domain reputation and WHOIS</p><input type="text" id="domainInput" placeholder="Enter domain"><button onclick="checkDomain()">SCAN</button><div id="domainResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>` },
        email: { title: '✉️ EMAIL INVESTIGATION', html: `<p>Validate email and check breaches</p><input type="email" id="emailInput" placeholder="Enter email"><button onclick="validateEmail()">SCAN</button><div id="emailResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>` },
        breach: { title: '📊 BREACH DATABASE', html: `<p>Check if email has been breached</p><input type="email" id="breachInput" placeholder="Enter email"><button onclick="checkBreach()">SCAN</button><div id="breachResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>` },
        hash: { title: '🔐 HASH ANALYSIS', html: `<p>Check file hash for malware</p><input type="text" id="hashInput" placeholder="Enter MD5/SHA1/SHA256"><button onclick="checkHash()">SCAN</button><div id="hashResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>` },
        darkweb: { title: '👁️ DARK WEB MONITOR', html: `<p>Monitor dark web for threats</p><input type="text" id="darkwebInput" placeholder="Enter keyword to monitor"><button onclick="checkDarkWeb()">MONITOR</button><div id="darkwebResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>` }
    };
    const tool = tools[type];
    if (tool) { title.textContent = tool.title; body.innerHTML = tool.html; }
}

function closeToolModal() {
    document.getElementById('toolModal')?.classList.remove('show');
}
document.addEventListener('click', function(e) {
    if (e.target === document.getElementById('toolModal')) closeToolModal();
});

// ============================================================
// TOOL FUNCTIONS
// ============================================================
function checkIP() {
    const input = document.getElementById('ipInput');
    const result = document.getElementById('ipResult');
    if (!input || !result) return;
    const ip = input.value.trim();
    if (!ip) { showToast('Enter IP address', 'error'); return; }
    result.style.display = 'block';
    result.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    setTimeout(() => {
        const safe = Math.random() > 0.3;
        result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>IP:</strong> ${ip}</span><span style="color:${safe ? 'var(--tertiary)' : '#ff3333'}">${safe ? '✅ SAFE' : '⚠️ SUSPICIOUS'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>📍 ${safe ? 'United States' : 'Unknown (VPN)'}</div><div>🛡️ ${safe ? 'Clean record' : 'Reported 15 times'}</div></div>`;
        showToast('IP scan complete', 'info');
    }, 1500);
}

function checkDomain() {
    const input = document.getElementById('domainInput');
    const result = document.getElementById('domainResult');
    if (!input || !result) return;
    const domain = input.value.trim();
    if (!domain) { showToast('Enter domain', 'error'); return; }
    result.style.display = 'block';
    result.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    setTimeout(() => {
        const safe = Math.random() > 0.3;
        result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Domain:</strong> ${domain}</span><span style="color:${safe ? 'var(--tertiary)' : '#ff3333'}">${safe ? '✅ SAFE' : '⚠️ SUSPICIOUS'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>📅 ${Math.floor(Math.random() * 10) + 1} years old</div><div>🔒 ${safe ? 'SSL Valid' : 'SSL Expired'}</div></div>`;
        showToast('Domain scan complete', 'info');
    }, 1500);
}

function validateEmail() {
    const input = document.getElementById('emailInput');
    const result = document.getElementById('emailResult');
    if (!input || !result) return;
    const email = input.value.trim();
    if (!email || !email.includes('@')) { showToast('Enter valid email', 'error'); return; }
    result.style.display = 'block';
    result.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    setTimeout(() => {
        const valid = Math.random() > 0.2;
        const breached = Math.random() > 0.7;
        result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Email:</strong> ${email}</span><span style="color:${valid ? 'var(--tertiary)' : '#ff3333'}">${valid ? '✅ VALID' : '❌ INVALID'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>🔓 ${breached ? '⚠️ Found in breaches' : '✅ No breaches'}</div></div>`;
        showToast('Email validation complete', 'info');
    }, 1500);
}

function checkBreach() {
    const input = document.getElementById('breachInput');
    const result = document.getElementById('breachResult');
    if (!input || !result) return;
    const email = input.value.trim();
    if (!email || !email.includes('@')) { showToast('Enter valid email', 'error'); return; }
    result.style.display = 'block';
    result.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    setTimeout(() => {
        const breaches = Math.floor(Math.random() * 4);
        result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Email:</strong> ${email}</span><span style="color:${breaches > 0 ? '#ffaa33' : 'var(--tertiary)'}">${breaches > 0 ? `⚠️ ${breaches} BREACHES` : '✅ CLEAN'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;">${breaches > 0 ? `<div>🔓 ${['LinkedIn', 'Adobe', 'Dropbox', 'MySpace'].slice(0, breaches).join(', ')}</div><div style="color:#ffaa33;">🔄 Change password!</div>` : '<div>✅ No breaches found</div>'}</div>`;
        showToast('Breach check complete', 'info');
    }, 1500);
}

function checkHash() {
    const input = document.getElementById('hashInput');
    const result = document.getElementById('hashResult');
    if (!input || !result) return;
    const hash = input.value.trim();
    if (!hash || hash.length < 32) { showToast('Enter valid hash (32+ chars)', 'error'); return; }
    result.style.display = 'block';
    result.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    setTimeout(() => {
        const malicious = Math.random() > 0.8;
        result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Hash:</strong> ${hash.substring(0, 16)}...</span><span style="color:${malicious ? '#ff3333' : 'var(--tertiary)'}">${malicious ? '⚠️ MALICIOUS' : '✅ CLEAN'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>📊 ${malicious ? 'Malware detected' : 'Clean file'}</div><div>🛡️ ${malicious ? '12/65 vendors' : '0/65 vendors'}</div></div>`;
        showToast('Hash analysis complete', 'info');
    }, 1500);
}

function checkDarkWeb() {
    const input = document.getElementById('darkwebInput');
    const result = document.getElementById('darkwebResult');
    if (!input || !result) return;
    const keyword = input.value.trim();
    if (!keyword) { showToast('Enter keyword', 'error'); return; }
    result.style.display = 'block';
    result.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner"></i></div>';
    setTimeout(() => {
        const listings = Math.floor(Math.random() * 20);
        result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Keyword:</strong> ${keyword}</span><span style="color:${listings > 5 ? '#ffaa33' : 'var(--tertiary)'}">${listings} LISTINGS</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>🔍 ${listings > 0 ? `${listings} mentions found` : 'No mentions'}</div>${listings > 0 ? '<div style="color:#ffaa33;">⚠️ Monitor activity</div>' : ''}</div>`;
        showToast('Dark web monitor complete', 'info');
    }, 1500);
}

// ============================================================
// CONTACT FORM
// ============================================================
document.getElementById('footerNewsletter')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input')?.value || '';
    showToast(`📡 Subscribed: ${email}`, 'success', 4000);
    this.reset();
});

// ============================================================
// INIT
// ============================================================
renderHome();

console.log('🚀 NEXUS · Sci-Fi Cyber Intelligence Platform');
console.log('🔮 System initialized successfully');
console.log('🛸 Welcome to the future of intelligence');
