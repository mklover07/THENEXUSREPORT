
// ============================================================
// DATA (simulated content)
// ============================================================
const DATA = {
    news: [
        { id: 1, category: 'Cyber Crime', title: 'Ransomware Group Targets Energy Sector', desc: 'New wave of attacks exploiting unpatched VPN appliances. Critical infrastructure at risk.', time: '2 hours ago' },
        { id: 2, category: 'Tech Intel', title: 'AI-Powered Phishing Detection Breakthrough', desc: 'Researchers unveil model with 99.2% accuracy in identifying zero-day phishing campaigns.', time: '6 hours ago' },
        { id: 3, category: 'OSINT', title: 'Geolocation Analysis Exposes Disinformation Network', desc: 'Open-source intelligence traces coordinated influence operations across social media.', time: '1 day ago' },
        { id: 4, category: 'Cyber Crime', title: 'Healthcare Data Breach Affects 2.3M Patients', desc: 'Sensitive medical records exposed due to misconfigured cloud storage.', time: '2 days ago' },
        { id: 5, category: 'Scam', title: 'Fake Crypto Exchange "BitTradeX" Steals Millions', desc: 'Victims lured with promises of high returns; platform vanished overnight.', time: '3 days ago' },
        { id: 6, category: 'Tech Intel', title: 'Quantum-Resistant Encryption Standards Released', desc: 'NIST announces post-quantum cryptography algorithms for future security.', time: '4 days ago' },
        { id: 7, category: 'OSINT', title: 'Social Media Manipulation Campaign Mapped', desc: 'OSINT researchers identify coordinated bot networks influencing political discourse.', time: '5 days ago' },
        { id: 8, category: 'Cyber Crime', title: 'Supply Chain Attack Hits Software Vendor', desc: 'Malicious code injected into popular library, affecting thousands of applications.', time: '6 days ago' },
    ],
    alerts: [
        { id: 1, title: 'Fake "Security Update" SMS Campaign', desc: 'Fraudulent messages impersonating banks. Do not click any links.', severity: 'Urgent', type: 'Phishing' },
        { id: 2, title: 'Fake Investment Platform "CryptoVault"', desc: 'Promises high returns, but drains wallets. Multiple victims reported.', severity: 'Urgent', type: 'Scam' },
        { id: 3, title: 'Job Offer Scam Targeting Graduates', desc: 'Fake recruiters asking for "processing fees" for non-existent positions.', severity: 'High', type: 'Scam' },
        { id: 4, title: 'Malicious QR Codes in Parking Meters', desc: 'Scammers place fake QR codes that steal payment information.', severity: 'Medium', type: 'Phishing' },
    ],
    investigations: [
        { id: 1, title: 'DarkMarket Takedown: OSINT Analysis', desc: 'How open-source intelligence contributed to disrupting a major illicit marketplace.', type: 'Case Study' },
        { id: 2, title: 'Tracking State-Sponsored Hackers', desc: 'Evidence-based analysis of advanced persistent threat groups targeting critical infrastructure.', type: 'Research Report' },
        { id: 3, title: 'Financial Fraud Network Exposed', desc: 'Investigative deep-dive into a money laundering operation using crypto mixers.', type: 'Investigation' },
        { id: 4, title: 'Disinformation Campaign in Southeast Asia', desc: 'Mapping fake news networks and their influence on public opinion.', type: 'Research Report' },
    ],
    factchecks: [
        { id: 1, claim: '5G networks cause COVID-19', status: 'False', sources: 'WHO, IEEE, Reuters', detail: 'No scientific evidence supports this claim. Multiple studies debunk the conspiracy.' },
        { id: 2, claim: 'New malware steals banking data via QR', status: 'In Progress', sources: 'Under investigation', detail: 'Early OSINT suggests targeted campaigns in Southeast Asia. Verifying sources.' },
        { id: 3, claim: 'Biden administration banned TikTok', status: 'False', sources: 'White House, AP', detail: 'No such ban has been enacted. Legislative proposals are under review.' },
        { id: 4, claim: 'Solar panels cause cancer', status: 'False', sources: 'NIH, WHO, EPA', detail: 'No credible scientific evidence links solar panel exposure to cancer.' },
    ],
    osint: [
        { id: 1, title: 'Using Metadata to Track Disinformation', desc: 'Methodology: extracting geolocation and timestamp patterns from social media images.', type: 'Methodology' },
        { id: 2, title: 'AI & OSINT: Automating Threat Intelligence', desc: 'Leveraging large language models to filter and prioritize open-source threats.', type: 'Research' },
        { id: 3, title: 'Public Data Analysis: Exposing Fraud Rings', desc: 'Using publicly available data to identify patterns of fraudulent activity.', type: 'Technique' },
        { id: 4, title: 'Social Network Analysis for OSINT', desc: 'Mapping connections and influence using graph theory and open data.', type: 'Educational' },
    ]
};

// ============================================================
// RENDER HELPERS
// ============================================================
function renderCard(item) {
    let badge = item.category || item.type || item.severity || 'Info';
    let badgeClass = '';
    if (item.severity === 'Urgent') badgeClass = 'warning';
    else if (item.status === 'False') badgeClass = 'warning';
    else if (item.status === 'True') badgeClass = 'accent';
    else if (item.category === 'Cyber Crime') badgeClass = '';
    else if (item.category === 'Tech Intel') badgeClass = '';
    else if (item.category === 'OSINT') badgeClass = '';
    else if (item.type === 'Case Study') badgeClass = '';
    else badgeClass = 'accent';

    let statusHtml = '';
    if (item.status) {
        let cls = item.status === 'False' ? 'false' : (item.status === 'In Progress' ? 'pending' : 'true');
        statusHtml = `<span class="fact-status ${cls}"><i class="fas ${item.status === 'False' ? 'fa-times-circle' : (item.status === 'In Progress' ? 'fa-clock' : 'fa-check-circle')}"></i> ${item.status}</span>`;
    }

    let meta = '';
    if (item.time) meta = `<i class="far fa-clock"></i> ${item.time}`;
    else if (item.sources) meta = `Sources: ${item.sources}`;
    else if (item.type) meta = `<i class="fas fa-tag"></i> ${item.type}`;

    return `
        <div class="card">
            <span class="badge ${badgeClass}">${badge}</span>
            <h3>${item.title || item.claim || ''}</h3>
            <p>${item.desc || item.claim || ''}</p>
            ${statusHtml ? `<div style="margin:6px 0;">${statusHtml}</div>` : ''}
            ${item.detail ? `<p style="font-size:0.9rem; opacity:0.7; margin-top:4px;">${item.detail}</p>` : ''}
            <div class="meta">${meta}</div>
            <a href="#" class="link-arrow">Read more <i class="fas fa-arrow-right"></i></a>
        </div>
    `;
}

function renderCards(arr, container) {
    if (!container) return;
    container.innerHTML = arr.map(item => renderCard(item)).join('');
}

// ============================================================
// PAGE SPECIFIC RENDER FUNCTIONS
// ============================================================
let newsPage = 1;
const perPage = 4;

function renderNews() {
    const search = document.getElementById('newsSearch');
    const filter = document.getElementById('newsFilter');
    if (!search || !filter) return;

    const searchTerm = search.value.toLowerCase();
    const filterVal = filter.value;

    let items = DATA.news.filter(n => {
        const matchSearch = n.title.toLowerCase().includes(searchTerm) || n.desc.toLowerCase().includes(searchTerm);
        const matchFilter = filterVal === 'all' || n.category === filterVal;
        return matchSearch && matchFilter;
    });

    const totalPages = Math.ceil(items.length / perPage) || 1;
    if (newsPage > totalPages) newsPage = totalPages;
    const start = (newsPage - 1) * perPage;
    const pageItems = items.slice(start, start + perPage);

    const grid = document.getElementById('newsGrid');
    if (!grid) return;

    if (pageItems.length === 0) {
        grid.innerHTML = '<p style="opacity:0.6; grid-column:1/-1; text-align:center;">No news found.</p>';
    } else {
        renderCards(pageItems, grid);
    }

    // Pagination
    const pag = document.getElementById('newsPagination');
    if (!pag) return;
    pag.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.disabled = newsPage === 1;
    prevBtn.onclick = () => { if (newsPage > 1) { newsPage--; renderNews(); } };
    pag.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const b = document.createElement('button');
        b.textContent = i;
        b.className = i === newsPage ? 'active' : '';
        b.onclick = () => { newsPage = i; renderNews(); };
        pag.appendChild(b);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '›';
    nextBtn.disabled = newsPage === totalPages;
    nextBtn.onclick = () => { if (newsPage < totalPages) { newsPage++; renderNews(); } };
    pag.appendChild(nextBtn);
}

function renderAlerts() {
    const grid = document.getElementById('alertsGrid');
    if (grid) renderCards(DATA.alerts, grid);
}

function renderInvestigations() {
    const grid = document.getElementById('investigationsGrid');
    if (grid) renderCards(DATA.investigations, grid);
}

function renderFactCheck() {
    const grid = document.getElementById('factcheckGrid');
    if (grid) renderCards(DATA.factchecks, grid);
}

function renderOsint() {
    const grid = document.getElementById('osintGrid');
    if (grid) renderCards(DATA.osint, grid);
}

function renderHome() {
    const homeNews = document.getElementById('homeNews');
    const homeAlerts = document.getElementById('homeAlerts');
    const homeFactCheck = document.getElementById('homeFactCheck');
    const homeOsint = document.getElementById('homeOsint');

    if (homeNews) renderCards(DATA.news.slice(0, 3), homeNews);
    if (homeAlerts) renderCards(DATA.alerts.slice(0, 2), homeAlerts);
    if (homeFactCheck) renderCards(DATA.factchecks.slice(0, 2), homeFactCheck);
    if (homeOsint) renderCards(DATA.osint.slice(0, 2), homeOsint);
}

// ============================================================
// CONTACT FORM
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for reaching out. The Nexus Report team will respond within 24 hours. (Demo)');
            this.reset();
        });
    }

    // News page search/filter
    const newsSearch = document.getElementById('newsSearch');
    const newsFilter = document.getElementById('newsFilter');
    if (newsSearch) {
        newsSearch.addEventListener('input', () => { newsPage = 1;
            renderNews(); });
    }
    if (newsFilter) {
        newsFilter.addEventListener('change', () => { newsPage = 1;
            renderNews(); });
    }

    // Initialize all pages
    renderHome();
    renderNews();
    renderAlerts();
    renderInvestigations();
    renderFactCheck();
    renderOsint();

    // Detect which page we're on and render appropriately
    const path = window.location.pathname;
    if (path.includes('news.html')) renderNews();
    if (path.includes('cyber-alerts.html')) renderAlerts();
    if (path.includes('investigations.html')) renderInvestigations();
    if (path.includes('fact-check.html')) renderFactCheck();
    if (path.includes('osint-lab.html')) renderOsint();
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) renderHome();
});
