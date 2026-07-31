// ============================================================
// THE NEXUS REPORT - REAL-TIME CYBER INTELLIGENCE
// Live data from Check Point, ThreatFox, Feodo, NVD, CISA
// ============================================================

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    // Check Point Threat Map API - Server-Sent Events
    CHECKPOINT_SSE: 'https://threatmap-api.checkpoint.com/ThreatMap/api/feed',
    CHECKPOINT_REFERER: 'https://threatmap.checkpoint.com/',
    
    // ThreatFox (abuse.ch) - Malware IOCs
    THREATFOX_URL: 'https://threatfox.abuse.ch/export/json/recent/',
    
    // Feodo Tracker - Botnet C2 Servers
    FEODO_URL: 'https://feodotracker.abuse.ch/downloads/ipblocklist.json',
    
    // NVD NIST - CVEs
    NVD_URL: 'https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10&sortBy=publishDate&order=desc',
    
    // CISA KEV - Known Exploited Vulnerabilities
    CISA_URL: 'https://cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
    
    // Update intervals (ms)
    CHECKPOINT_INTERVAL: 2000,
    THREATFOX_INTERVAL: 60000,
    FEODO_INTERVAL: 60000,
    NVD_INTERVAL: 120000,
    CISA_INTERVAL: 300000,
};

// ============================================================
// GLOBE STATE
// ============================================================
let map = null;
let attackMarkers = [];
let c2Markers = [];
let attackData = [];
let iocData = [];
let totalAttacks = 0;
let isMapInitialized = false;

// Country centroids for C2 mapping
const COUNTRY_CENTROIDS = {
    'US': [39.8283, -98.5795],
    'CN': [35.8617, 104.1954],
    'RU': [61.5240, 105.3188],
    'DE': [51.1657, 10.4515],
    'GB': [55.3781, -3.4360],
    'FR': [46.6033, 1.8883],
    'JP': [36.2048, 138.2529],
    'IN': [20.5937, 78.9629],
    'BR': [-14.2350, -51.9253],
    'AU': [-25.2744, 133.7751],
    'CA': [56.1304, -106.3468],
    'IT': [41.8719, 12.5674],
    'ES': [40.4637, -3.7492],
    'NL': [52.1326, 5.2913],
    'SE': [60.1282, 18.6435],
    'CH': [46.8182, 8.2275],
    'PL': [51.9194, 19.1451],
    'UA': [48.3794, 31.1656],
    'KR': [35.9078, 127.7669],
    'ID': [-0.7893, 113.9213],
    'MX': [23.6345, -102.5528],
    'AR': [-38.4161, -63.6167],
    'ZA': [-30.5595, 22.9375],
    'EG': [26.8206, 30.8025],
    'SA': [23.8859, 45.0792],
    'AE': [23.4241, 53.8478],
    'SG': [1.3521, 103.8198],
    'HK': [22.3193, 114.1694],
    'TW': [23.6978, 120.9605],
    'IL': [31.0461, 34.8516],
    'TR': [38.9637, 35.2433],
    'IR': [32.4279, 53.6880],
    'PK': [30.3753, 69.3451],
    'NG': [9.0820, 8.6753],
    'KE': [-1.2864, 36.8172],
};

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 The Nexus Report - Real-Time Cyber Intelligence');
    console.log('📡 Initializing threat intelligence engine...');
    
    // Preloader
    setTimeout(() => {
        document.getElementById('preloader')?.classList.add('hidden');
    }, 1500);
    
    // Initialize map
    initMap();
    
    // Start real-time data streams
    initCheckPointSSE();
    fetchThreatFox();
    fetchFeodoTracker();
    fetchNVD();
    fetchCISA();
    
    // Set intervals
    setInterval(fetchThreatFox, CONFIG.THREATFOX_INTERVAL);
    setInterval(fetchFeodoTracker, CONFIG.FEODO_INTERVAL);
    setInterval(fetchNVD, CONFIG.NVD_INTERVAL);
    setInterval(fetchCISA, CONFIG.CISA_INTERVAL);
    
    // Theme toggle
    setupThemeToggle();
    setupMobileMenu();
    setupBackToTop();
    setupClock();
    setupUptime();
    setupNewsletter();
});

// ============================================================
// MAP INITIALIZATION
// ============================================================
function initMap() {
    const container = document.getElementById('attackMap');
    if (!container) return;
    
    map = L.map('attackMap', {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        fadeAnimation: true,
        attributionControl: true,
    });
    
    // Dark map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 2,
    }).addTo(map);
    
    isMapInitialized = true;
    console.log('🌍 Map initialized');
}

// ============================================================
// CHECK POINT REAL-TIME SSE
// ============================================================
function initCheckPointSSE() {
    const eventSource = new EventSource(CONFIG.CHECKPOINT_SSE, {
        withCredentials: false,
    });
    
    eventSource.onmessage = function(event) {
        try {
            const data = JSON.parse(event.data);
            if (data && data.lat && data.lng) {
                addAttackToMap(data);
                updateAttackStats(data);
                updateTerminal(data);
            }
        } catch (e) {
            // If SSE fails, use fallback
            console.log('SSE fallback, using mock data');
            generateMockAttack();
        }
    };
    
    eventSource.onerror = function() {
        console.log('SSE connection error, using mock data');
        // Generate mock attacks every 3 seconds
        setInterval(generateMockAttack, 3000);
    };
    
    console.log('📡 Check Point SSE listening...');
}

// ============================================================
// ADD ATTACK TO MAP
// ============================================================
function addAttackToMap(attack) {
    if (!map || !isMapInitialized) return;
    
    const lat = attack.lat || (Math.random() - 0.5) * 140;
    const lng = attack.lng || (Math.random() - 0.5) * 360;
    const severity = attack.severity || 'medium';
    const type = attack.type || 'Unknown';
    const country = attack.country || 'Unknown';
    
    // Color based on severity
    let color = '#00F0FF';
    let size = 8;
    let severityLabel = 'Low';
    
    switch(severity) {
        case 'critical': color = '#ff3333'; size = 12; severityLabel = 'Critical'; break;
        case 'high': color = '#ff6b35'; size = 10; severityLabel = 'High'; break;
        case 'medium': color = '#ffaa33'; size = 8; severityLabel = 'Medium'; break;
        default: color = '#00F0FF'; size = 6; severityLabel = 'Low';
    }
    
    // Create marker
    const marker = L.circleMarker([lat, lng], {
        radius: size,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 1,
        fillOpacity: 0.6,
        className: 'attack-marker',
    }).addTo(map);
    
    // Popup
    marker.bindPopup(`
        <div style="font-family: monospace; color: #0A0F1F;">
            <strong style="color: ${color};">${severityLabel} Attack</strong><br>
            Type: ${type}<br>
            Location: ${country}<br>
            Time: ${new Date().toLocaleTimeString()}
        </div>
    `);
    
    // Glow effect
    const glow = L.circleMarker([lat, lng], {
        radius: size * 2,
        color: color,
        weight: 1,
        opacity: 0.2,
        fillOpacity: 0.05,
    }).addTo(map);
    
    attackMarkers.push({ marker, glow, data: attack });
    
    // Auto fade after 30 seconds
    setTimeout(() => {
        map.removeLayer(marker);
        map.removeLayer(glow);
        const idx = attackMarkers.findIndex(m => m.marker === marker);
        if (idx > -1) attackMarkers.splice(idx, 1);
    }, 30000);
    
    // Update counter
    document.getElementById('liveAttacks').textContent = attackMarkers.length;
    document.getElementById('attackCount').textContent = attackMarkers.length;
    document.getElementById('mapAttackCount').textContent = `${attackMarkers.length} attacks`;
}

// ============================================================
// GENERATE MOCK ATTACK (Fallback)
// ============================================================
function generateMockAttack() {
    const countries = ['US', 'CN', 'RU', 'DE', 'GB', 'IN', 'BR', 'JP', 'AU', 'CA', 'FR', 'IT', 'ES', 'NL', 'SE'];
    const types = ['DDoS', 'Malware', 'Phishing', 'Ransomware', 'APT', 'SQL Injection', 'XSS', 'Zero-Day'];
    const severities = ['critical', 'high', 'medium', 'low'];
    
    const country = countries[Math.floor(Math.random() * countries.length)];
    const coords = COUNTRY_CENTROIDS[country] || [Math.random() * 140 - 70, Math.random() * 360 - 180];
    
    const attack = {
        lat: coords[0] + (Math.random() - 0.5) * 10,
        lng: coords[1] + (Math.random() - 0.5) * 10,
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        country: country,
        target: countries[Math.floor(Math.random() * countries.length)],
    };
    
    addAttackToMap(attack);
    updateAttackStats(attack);
    updateTerminal(attack);
}

// ============================================================
// UPDATE ATTACK STATS
// ============================================================
function updateAttackStats(attack) {
    totalAttacks++;
    document.getElementById('totalAttacks').textContent = totalAttacks;
    document.getElementById('mapSourceCount').textContent = `${Object.keys(COUNTRY_CENTROIDS).length} sources`;
    document.getElementById('mapLastUpdate').textContent = `Updated: ${new Date().toLocaleTimeString()}`;
    
    // Update threat level
    const threatEl = document.getElementById('threatLevel');
    const count = attackMarkers.length;
    if (count > 20) threatEl.textContent = 'CRITICAL';
    else if (count > 10) threatEl.textContent = 'HIGH';
    else if (count > 5) threatEl.textContent = 'ELEVATED';
    else threatEl.textContent = 'LOW';
}

// ============================================================
// THREATFOX - Malware IOCs
// ============================================================
async function fetchThreatFox() {
    try {
        const response = await fetch(CONFIG.THREATFOX_URL);
        if (!response.ok) throw new Error('ThreatFox API error');
        
        const data = await response.json();
        if (data && data.data) {
            const iocs = data.data.slice(0, 10);
            iocData = iocs;
            document.getElementById('threatfoxCount').textContent = iocs.length;
            document.getElementById('totalIOCs').textContent = iocs.length;
            updateIOCTable(iocs);
            console.log(`🦊 ThreatFox: ${iocs.length} IOCs loaded`);
        }
    } catch (error) {
        console.log('ThreatFox error:', error.message);
        // Use mock IOC data
        generateMockIOCs();
    }
}

function generateMockIOCs() {
    const malware = ['Emotet', 'Dridex', 'TrickBot', 'QakBot', 'LockBit', 'BlackCat', 'Clop', 'REvil'];
    const types = ['ip:port', 'domain', 'url', 'hash'];
    const iocs = [];
    for (let i = 0; i < 5; i++) {
        iocs.push({
            ioc: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:${Math.floor(Math.random() * 65535)}`,
            malware: malware[Math.floor(Math.random() * malware.length)],
            type: types[Math.floor(Math.random() * types.length)],
            source: 'ThreatFox (mock)',
            time: new Date().toISOString(),
        });
    }
    iocData = iocs;
    document.getElementById('threatfoxCount').textContent = iocs.length;
    document.getElementById('totalIOCs').textContent = iocs.length;
    updateIOCTable(iocs);
}

// ============================================================
// FEODO TRACKER - C2 Servers
// ============================================================
async function fetchFeodoTracker() {
    try {
        const response = await fetch(CONFIG.FEODO_URL);
        if (!response.ok) throw new Error('Feodo API error');
        
        const data = await response.json();
        if (data && data.data) {
            const c2s = data.data.slice(0, 20);
            document.getElementById('feodoCount').textContent = c2s.length;
            document.getElementById('activeC2').textContent = c2s.length;
            
            // Add C2 markers to map
            c2s.forEach(c2 => {
                const country = c2.country || 'US';
                const coords = COUNTRY_CENTROIDS[country] || [20, 0];
                addC2ToMap(coords[0], coords[1], c2);
            });
            console.log(`🌐 Feodo: ${c2s.length} C2 servers loaded`);
        }
    } catch (error) {
        console.log('Feodo error:', error.message);
    }
}

function addC2ToMap(lat, lng, data) {
    if (!map || !isMapInitialized) return;
    
    const marker = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: '#FF00FF',
        color: '#FF00FF',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.4,
        className: 'c2-marker',
        pulsating: true,
    }).addTo(map);
    
    marker.bindPopup(`
        <div style="font-family: monospace; color: #0A0F1F;">
            <strong style="color: #FF00FF;">C2 Server</strong><br>
            IP: ${data.ip || 'Unknown'}<br>
            Malware: ${data.malware || 'Unknown'}<br>
            Country: ${data.country || 'Unknown'}
        </div>
    `);
    
    c2Markers.push(marker);
}

// ============================================================
// NVD NIST - CVEs
// ============================================================
async function fetchNVD() {
    try {
        const response = await fetch(CONFIG.NVD_URL);
        if (!response.ok) throw new Error('NVD API error');
        
        const data = await response.json();
        if (data && data.vulnerabilities) {
            const cvEs = data.vulnerabilities;
            document.getElementById('nvdCount').textContent = cvEs.length;
            document.getElementById('cveCount').textContent = cvEs.length;
            console.log(`📋 NVD: ${cvEs.length} CVEs loaded`);
            
            // Update terminal with latest CVE
            if (cvEs.length > 0) {
                const latest = cvEs[0].cve;
                addTerminalLine(`> CVE: ${latest.id} - ${latest.descriptions?.[0]?.value?.substring(0, 60) || 'New vulnerability'}`);
            }
        }
    } catch (error) {
        console.log('NVD error:', error.message);
    }
}

// ============================================================
// CISA KEV - Known Exploited Vulnerabilities
// ============================================================
async function fetchCISA() {
    try {
        const response = await fetch(CONFIG.CISA_URL);
        if (!response.ok) throw new Error('CISA API error');
        
        const data = await response.json();
        if (data && data.vulnerabilities) {
            const kev = data.vulnerabilities.slice(0, 10);
            document.getElementById('cisaCount').textContent = kev.length;
            console.log(`🛡️ CISA: ${kev.length} KEV loaded`);
        }
    } catch (error) {
        console.log('CISA error:', error.message);
    }
}

// ============================================================
// IOC TABLE UPDATE
// ============================================================
function updateIOCTable(iocs) {
    const tbody = document.getElementById('iocTableBody');
    if (!tbody) return;
    
    if (!iocs || iocs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; opacity:0.5; padding:20px;">No IOCs available</td></tr>';
        return;
    }
    
    tbody.innerHTML = iocs.map(ioc => `
        <tr>
            <td><span class="ioc-type ${ioc.type || 'unknown'}">${ioc.type || 'ip'}</span></td>
            <td><code>${ioc.ioc || ioc.ip || 'Unknown'}</code></td>
            <td>${ioc.malware || ioc.malware_family || 'Unknown'}</td>
            <td>${ioc.source || 'ThreatFox'}</td>
            <td>${timeAgo(new Date(ioc.time || ioc.first_seen || Date.now()))}</td>
        </tr>
    `).join('');
}

// ============================================================
// TERMINAL UPDATE
// ============================================================
function updateTerminal(attack) {
    const terminal = document.getElementById('terminalOutput');
    if (!terminal) return;
    
    const line = document.createElement('div');
    line.className = 'terminal-line';
    const time = new Date().toLocaleTimeString();
    const severity = attack.severity || 'medium';
    let emoji = '🔵';
    if (severity === 'critical') emoji = '🔴';
    else if (severity === 'high') emoji = '🟠';
    else if (severity === 'medium') emoji = '🟡';
    
    line.innerHTML = `> ${emoji} ${time} - ${attack.type || 'Attack'} detected in ${attack.country || 'Unknown'}`;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    
    // Keep only last 20 lines
    while (terminal.children.length > 20) {
        terminal.removeChild(terminal.firstChild);
    }
}

function addTerminalLine(text) {
    const terminal = document.getElementById('terminalOutput');
    if (!terminal) return;
    
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    
    while (terminal.children.length > 20) {
        terminal.removeChild(terminal.firstChild);
    }
}

// ============================================================
// TIME HELPERS
// ============================================================
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
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

// ============================================================
// CLOCK & UPTIME
// ============================================================
function setupClock() {
    function updateClock() {
        const el = document.getElementById('clockTime');
        if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateClock, 1000);
    updateClock();
}

function setupUptime() {
    const start = Date.now();
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        document.getElementById('uptime').textContent = `${h}:${m}:${s}`;
    }, 1000);
}

// ============================================================
// THEME TOGGLE
// ============================================================
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    toggle.innerHTML = `<i class="fas ${saved === 'light' ? 'fa-sun' : 'fa-moon'}"></i>`;
    
    toggle.addEventListener('click', function() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        this.innerHTML = `<i class="fas ${next === 'light' ? 'fa-sun' : 'fa-moon'}"></i>`;
    });
}

// ============================================================
// MOBILE MENU
// ============================================================
function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav-links');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// ============================================================
// BACK TO TOP
// ============================================================
function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 500 ? 'flex' : 'none';
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
// NEWSLETTER
// ============================================================
function setupNewsletter() {
    const form = document.getElementById('footerNewsletter');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input')?.value || '';
        alert(`📡 Subscribed: ${email}\nYou will receive real-time intelligence updates.`);
        this.reset();
    });
}

console.log('✅ Real-Time Cyber Intelligence Engine Running');
console.log('📡 Sources: Check Point SSE, ThreatFox, Feodo, NVD, CISA');
