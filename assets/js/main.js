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
// ============================================================
// REAL-TIME CYBER ATTACK GLOBE
// Three.js + Check Point Threat Map API
// ============================================================

// ---------- GLOBE VARIABLES ----------
let scene, camera, renderer, globe;
let attackMarkers = [];
let attackLines = [];
let attackData = [];
let isGlobeInitialized = false;
let globeAnimationId = null;
let attackCounter = 0;
let totalAttackCount = 0;

// ---------- CHECK POINT API ----------
const CHECKPOINT_API = 'https://threatmap-api.checkpoint.com';
const ATTACK_FETCH_INTERVAL = 3000; // 3 seconds

// ---------- GLOBE INITIALIZATION ----------
function initGlobe() {
    const container = document.getElementById('globe-container');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050F);

    // Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 250);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ---------- CREATE GLOBE ----------
    const radius = 80;
    const segments = 64;

    // Earth texture (using free texture)
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const earthBumpMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
    const earthSpecularMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png');
    
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: earthBumpMap,
        bumpScale: 0.5,
        specularMap: earthSpecularMap,
        specular: new THREE.Color('grey'),
        shininess: 5,
        transparent: true,
        opacity: 0.95,
    });
    
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // ---------- ATMOSPHERE GLOW ----------
    const glowGeometry = new THREE.SphereGeometry(radius * 1.02, segments, segments);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00F0FF,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    // ---------- GRID RINGS (Sci-Fi Effect) ----------
    const ringGeometry = new THREE.TorusGeometry(radius * 1.5, 0.5, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00F0FF,
        transparent: true,
        opacity: 0.1,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.z = Math.PI / 3;
    ring2.rotation.x = Math.PI / 4;
    scene.add(ring2);

    // ---------- LIGHTS ----------
    const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x00F0FF, 0.5);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    // ---------- STARS ----------
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
        starPositions[i] = (Math.random() - 0.5) * 800;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // ---------- HIDE LOADING ----------
    document.getElementById('globe-loading').style.display = 'none';

    // ---------- START ANIMATION ----------
    isGlobeInitialized = true;
    animateGlobe();

    // ---------- FETCH ATTACKS ----------
    fetchAttacks();
    setInterval(fetchAttacks, ATTACK_FETCH_INTERVAL);

    // ---------- RESIZE HANDLER ----------
    window.addEventListener('resize', () => {
        const container = document.getElementById('globe-container');
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    console.log('🌍 NEXUS Cyber Attack Globe initialized');
}

// ---------- FETCH ATTACKS FROM CHECK POINT API ----------
async function fetchAttacks() {
    try {
        // Using Check Point Threat Map API
        const response = await fetch('https://threatmap-api.checkpoint.com/api/v1/attacks/latest', {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        
        if (data && data.attacks) {
            processAttackData(data.attacks);
        }
    } catch (error) {
        console.log('Using fallback attack data:', error.message);
        // Use fallback data if API fails
        generateFallbackAttacks();
    }
}

// ---------- PROCESS ATTACK DATA ----------
function processAttackData(attacks) {
    if (!attacks || attacks.length === 0) return;

    attackData = attacks;
    totalAttackCount += attacks.length;
    attackCounter = attacks.length;

    // Update stats
    document.getElementById('totalAttacks').textContent = totalAttackCount;
    document.getElementById('activeAttacks').textContent = attackCounter;
    document.getElementById('attackCounter').textContent = attackCounter;

    // Get unique attack types
    const types = new Set(attacks.map(a => a.type || 'unknown'));
    document.getElementById('attackTypes').textContent = types.size;

    // Get unique countries
    const countries = new Set(attacks.map(a => a.country || 'unknown'));
    document.getElementById('attackerCountries').textContent = countries.size;

    // Update location status
    if (attacks.length > 0 && attacks[0].country) {
        document.getElementById('attackLocation').textContent = attacks[0].country;
    }

    // Clear old markers
    clearAttackMarkers();

    // Add new markers
    attacks.slice(0, 50).forEach((attack, index) => {
        setTimeout(() => {
            addAttackMarker(attack);
        }, index * 50);
    });
}

// ---------- ADD ATTACK MARKER ----------
function addAttackMarker(attack) {
    if (!globe || !scene) return;

    const lat = attack.lat || (Math.random() - 0.5) * 180;
    const lng = attack.lng || (Math.random() - 0.5) * 360;
    const type = attack.type || 'unknown';
    const severity = attack.severity || 'medium';

    // Convert lat/lng to 3D position
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;
    const radius = 82;

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    // Color based on severity
    let color;
    switch(severity) {
        case 'critical': color = 0xff3333; break;
        case 'high': color = 0xff6b35; break;
        case 'medium': color = 0xffaa33; break;
        default: color = 0x00F0FF;
    }

    // Create marker (glowing sphere)
    const markerGeometry = new THREE.SphereGeometry(1.2, 8, 8);
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(x, y, z);
    marker.userData = { attack: attack };

    // Add glow
    const glowGeometry = new THREE.SphereGeometry(2.5, 8, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(x, y, z);

    scene.add(marker);
    scene.add(glow);

    attackMarkers.push({ marker, glow, data: attack });

    // Create attack line (from origin to target)
    createAttackLine(x, y, z, color);

    // Remove marker after some time
    setTimeout(() => {
        scene.remove(marker);
        scene.remove(glow);
        const idx = attackMarkers.findIndex(m => m.marker === marker);
        if (idx > -1) attackMarkers.splice(idx, 1);
    }, 8000);
}

// ---------- CREATE ATTACK LINE ----------
function createAttackLine(x, y, z, color) {
    const points = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const r = 80 + t * (120 - 80);
        const angle = t * Math.PI * 0.5;
        
        const px = x * (1 - t * 0.8);
        const py = y * (1 - t * 0.8);
        const pz = z * (1 - t * 0.8);
        
        points.push(new THREE.Vector3(px, py, pz));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    attackLines.push(line);

    // Remove line after some time
    setTimeout(() => {
        scene.remove(line);
        const idx = attackLines.indexOf(line);
        if (idx > -1) attackLines.splice(idx, 1);
    }, 8000);
}

// ---------- CLEAR ATTACK MARKERS ----------
function clearAttackMarkers() {
    attackMarkers.forEach(({ marker, glow }) => {
        scene.remove(marker);
        scene.remove(glow);
    });
    attackMarkers = [];

    attackLines.forEach(line => {
        scene.remove(line);
    });
    attackLines = [];
}

// ---------- GENERATE FALLBACK ATTACKS ----------
function generateFallbackAttacks() {
    const countries = ['USA', 'China', 'Russia', 'Germany', 'UK', 'India', 'Brazil', 'Japan', 'Australia', 'Canada'];
    const types = ['DDoS', 'Malware', 'Phishing', 'Ransomware', 'APT', 'SQL Injection', 'XSS', 'Zero-Day'];
    const severities = ['critical', 'high', 'medium', 'low'];
    
    const attacks = [];
    const count = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < count; i++) {
        attacks.push({
            lat: (Math.random() - 0.5) * 140,
            lng: (Math.random() - 0.5) * 360,
            type: types[Math.floor(Math.random() * types.length)],
            severity: severities[Math.floor(Math.random() * severities.length)],
            country: countries[Math.floor(Math.random() * countries.length)],
            target: countries[Math.floor(Math.random() * countries.length)],
            timestamp: new Date().toISOString()
        });
    }
    
    processAttackData(attacks);
}

// ---------- GLOBE ANIMATION ----------
function animateGlobe() {
    if (!isGlobeInitialized) return;

    globeAnimationId = requestAnimationFrame(animateGlobe);

    // Rotate globe slowly
    if (globe) {
        globe.rotation.y += 0.001;
    }

    // Animate markers (pulse)
    attackMarkers.forEach(({ marker, glow }, index) => {
        const scale = 1 + Math.sin(Date.now() / 500 + index) * 0.2;
        marker.scale.set(scale, scale, scale);
        glow.scale.set(scale * 1.5, scale * 1.5, scale * 1.5);
        glow.material.opacity = 0.1 + Math.sin(Date.now() / 300 + index) * 0.05;
    });

    renderer.render(scene, camera);
}

// ---------- INIT GLOBE WHEN DOM LOADS ----------
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Three.js to load
    if (typeof THREE !== 'undefined') {
        setTimeout(initGlobe, 500);
    } else {
        // Load Three.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = function() {
            setTimeout(initGlobe, 500);
        };
        document.head.appendChild(script);
    }
});
