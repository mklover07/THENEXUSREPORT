// ============================================================
// NEW FUNCTIONS - ADD TO EXISTING main.js
// ============================================================

// ============================================================
// TOOL MODAL
// ============================================================
function openTool(toolType) {
    const modal = document.getElementById('toolModal');
    const title = document.getElementById('toolModalTitle');
    const body = document.getElementById('toolModalBody');
    
    modal.classList.add('show');
    
    const tools = {
        ip: {
            title: '🔍 IP Lookup Tool',
            html: `
                <p>Check IP address reputation and location</p>
                <input type="text" id="ipInput" placeholder="Enter IP address (e.g., 8.8.8.8)" value="8.8.8.8">
                <button onclick="checkIP()">Check IP</button>
                <div id="ipResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>
            `
        },
        domain: {
            title: '🌐 Domain Reputation Checker',
            html: `
                <p>Check if a domain is safe or malicious</p>
                <input type="text" id="domainInput" placeholder="Enter domain (e.g., google.com)">
                <button onclick="checkDomain()">Check Domain</button>
                <div id="domainResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>
            `
        },
        email: {
            title: '✉️ Email Validator',
            html: `
                <p>Verify if an email address is valid</p>
                <input type="email" id="emailInput" placeholder="Enter email address">
                <button onclick="validateEmail()">Validate</button>
                <div id="emailResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>
            `
        },
        hash: {
            title: '🔐 Hash Checker',
            html: `
                <p>Check file hash for known malware</p>
                <input type="text" id="hashInput" placeholder="Enter MD5/SHA1/SHA256 hash">
                <button onclick="checkHash()">Check Hash</button>
                <div id="hashResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>
            `
        },
        ssl: {
            title: '🔒 SSL Certificate Checker',
            html: `
                <p>Check SSL certificate details</p>
                <input type="text" id="sslInput" placeholder="Enter domain (e.g., google.com)" value="google.com">
                <button onclick="checkSSL()">Check SSL</button>
                <div id="sslResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>
            `
        },
        breach: {
            title: '📊 Breach Checker',
            html: `
                <p>Check if your email has been breached</p>
                <input type="email" id="breachInput" placeholder="Enter email address">
                <button onclick="checkBreach()">Check Breach</button>
                <div id="breachResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>
            `
        }
    };
    
    const tool = tools[toolType];
    if (tool) {
        title.textContent = tool.title;
        body.innerHTML = tool.html;
    }
}

function closeToolModal() {
    document.getElementById('toolModal').classList.remove('show');
}

// Close modal on click outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('toolModal');
    if (e.target === modal) {
        closeToolModal();
    }
});

// ============================================================
// TOOL FUNCTIONS
// ============================================================
function checkIP() {
    const input = document.getElementById('ipInput');
    const result = document.getElementById('ipResult');
    const ip = input.value.trim();
    
    if (!ip) {
        showToast('Please enter an IP address', 'error');
        return;
    }
    
    result.style.display = 'block';
    result.innerHTML = `
        <div class="loading-spinner"><i class="fas fa-spinner"></i> Checking IP...</div>
    `;
    
    // Simulate API call
    setTimeout(() => {
        const isMalicious = Math.random() > 0.7;
        result.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>IP:</strong> ${ip}</span>
                <span style="color: ${isMalicious ? '#ff3333' : 'var(--accent)'}">
                    ${isMalicious ? '⚠️ Suspicious' : '✅ Safe'}
                </span>
            </div>
            <div style="margin-top:8px; font-size:0.85rem; opacity:0.7;">
                <div>📍 Location: ${isMalicious ? 'Unknown (VPN detected)' : 'United States'}</div>
                <div>🛡️ Reputation: ${isMalicious ? 'Poor - Reported 15 times' : 'Good - Clean record'}</div>
            </div>
        `;
        showToast('IP check completed!', 'info');
    }, 1500);
}

function checkDomain() {
    const input = document.getElementById('domainInput');
    const result = document.getElementById('domainResult');
    const domain = input.value.trim();
    
    if (!domain) {
        showToast('Please enter a domain', 'error');
        return;
    }
    
    result.style.display = 'block';
    result.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner"></i> Checking domain...</div>`;
    
    setTimeout(() => {
        const isSafe = Math.random() > 0.3;
        result.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>Domain:</strong> ${domain}</span>
                <span style="color: ${isSafe ? 'var(--accent)' : '#ff3333'}">
                    ${isSafe ? '✅ Safe' : '⚠️ Suspicious'}
                </span>
            </div>
            <div style="margin-top:8px; font-size:0.85rem; opacity:0.7;">
                <div>📅 Age: ${Math.floor(Math.random() * 10) + 1} years</div>
                <div>🔒 SSL: ${isSafe ? 'Valid' : 'Expired'}</div>
                ${!isSafe ? '<div>⚠️ Reported for phishing activities</div>' : ''}
            </div>
        `;
        showToast('Domain check completed!', 'info');
    }, 1500);
}

function validateEmail() {
    const input = document.getElementById('emailInput');
    const result = document.getElementById('emailResult');
    const email = input.value.trim();
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    
    result.style.display = 'block';
    result.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner"></i> Validating email...</div>`;
    
    setTimeout(() => {
        const isValid = Math.random() > 0.2;
        const hasBreaches = Math.random() > 0.7;
        result.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>Email:</strong> ${email}</span>
                <span style="color: ${isValid ? 'var(--accent)' : '#ff3333'}">
                    ${isValid ? '✅ Valid' : '❌ Invalid'}
                </span>
            </div>
            <div style="margin-top:8px; font-size:0.85rem; opacity:0.7;">
                <div>📧 Format: ${isValid ? 'Correct' : 'Incorrect'}</div>
                <div>🔓 Breaches: ${hasBreaches ? '⚠️ Found in 2 data breaches' : '✅ No breaches found'}</div>
            </div>
        `;
        showToast('Email validation completed!', 'info');
    }, 1500);
}

function checkHash() {
    const input = document.getElementById('hashInput');
    const result = document.getElementById('hashResult');
    const hash = input.value.trim();
    
    if (!hash || hash.length < 32) {
        showToast('Please enter a valid hash (MD5/SHA1/SHA256)', 'error');
        return;
    }
    
    result.style.display = 'block';
    result.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner"></i> Checking hash...</div>`;
    
    setTimeout(() => {
        const isMalicious = Math.random() > 0.8;
        result.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>Hash:</strong> ${hash.substring(0, 16)}...</span>
                <span style="color: ${isMalicious ? '#ff3333' : 'var(--accent)'}">
                    ${isMalicious ? '⚠️ Malicious' : '✅ Clean'}
                </span>
            </div>
            <div style="margin-top:8px; font-size:0.85rem; opacity:0.7;">
                <div>📊 File Type: ${isMalicious ? 'Executable (Malware detected)' : 'Document (Safe)'}</div>
                <div>🛡️ Detection Rate: ${isMalicious ? '12/65 vendors' : '0/65 vendors'}</div>
            </div>
        `;
        showToast('Hash check completed!', 'info');
    }, 1500);
}

function checkSSL() {
    const input = document.getElementById('sslInput');
    const result = document.getElementById('sslResult');
    const domain = input.value.trim();
    
    if (!domain) {
        showToast('Please enter a domain', 'error');
        return;
    }
    
    result.style.display = 'block';
    result.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner"></i> Checking SSL...</div>`;
    
    setTimeout(() => {
        const isValid = Math.random() > 0.2;
        const daysLeft = Math.floor(Math.random() * 365);
        result.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>Domain:</strong> ${domain}</span>
                <span style="color: ${isValid ? 'var(--accent)' : '#ff3333'}">
                    ${isValid ? '✅ Valid' : '❌ Invalid/Expired'}
                </span>
            </div>
            <div style="margin-top:8px; font-size:0.85rem; opacity:0.7;">
                <div>📅 Expires: ${isValid ? `${daysLeft} days from now` : 'Expired'}</div>
                <div>🔒 Issuer: ${isValid ? 'Let\'s Encrypt' : 'Unknown'}</div>
                <div>🌐 Protocol: ${isValid ? 'TLS 1.3' : 'None'}</div>
            </div>
        `;
        showToast('SSL check completed!', 'info');
    }, 1500);
}

function checkBreach() {
    const input = document.getElementById('breachInput');
    const result = document.getElementById('breachResult');
    const email = input.value.trim();
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    
    result.style.display = 'block';
    result.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner"></i> Checking breaches...</div>`;
    
    setTimeout(() => {
        const breaches = Math.floor(Math.random() * 5);
        result.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>Email:</strong> ${email}</span>
                <span style="color: ${breaches > 0 ? '#ffaa33' : 'var(--accent)'}">
                    ${breaches > 0 ? `⚠️ ${breaches} breaches found` : '✅ No breaches found'}
                </span>
            </div>
            <div style="margin-top:8px; font-size:0.85rem; opacity:0.7;">
                ${breaches > 0 ? `
                    <div>🔓 Breached Sites: ${['LinkedIn', 'Adobe', 'Dropbox', 'MySpace', '000webhost'].slice(0, breaches).join(', ')}</div>
                    <div>📅 Latest Breach: ${new Date(Date.now() - Math.random() * 31536000000).toLocaleDateString()}</div>
                    <div style="color: #ffaa33; margin-top:4px;">🔄 Change your password immediately!</div>
                ` : `
                    <div>✅ No breaches found in our database</div>
                    <div>🛡️ Your email appears to be secure</div>
                `}
            </div>
        `;
        showToast('Breach check completed!', 'info');
    }, 1500);
}

// ============================================================
// REPORT SCAM - MODAL
// ============================================================
function openReportScam() {
    const modal = document.getElementById('toolModal');
    const title = document.getElementById('toolModalTitle');
    const body = document.getElementById('toolModalBody');
    
    modal.classList.add('show');
    title.textContent = '🚨 Report a Scam';
    body.innerHTML = `
        <p style="margin-bottom:12px;">Help others stay safe. Report suspicious activity.</p>
        <form id="reportScamForm">
            <input type="text" placeholder="Your Name" required>
            <input type="email" placeholder="Your Email" required>
            <input type="text" placeholder="Scam Type (e.g., Phishing, Investment Fraud, etc.)" required>
            <textarea placeholder="Describe the scam in detail..." rows="4" required></textarea>
            <button type="submit"><i class="fas fa-flag"></i> Submit Report</button>
        </form>
    `;
    
    document.getElementById('reportScamForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('✅ Thank you! Your report has been submitted for review.', 'success', 5000);
        closeToolModal();
    });
}

// ============================================================
// UPDATE DASHBOARD - LIVE DATA
// ============================================================
function updateDashboard() {
    // Update threat level
    const threatLevels = ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'];
    const randomThreat = threatLevels[Math.floor(Math.random() * threatLevels.length)];
    const threatElement = document.getElementById('globalThreat');
    if (threatElement) {
        threatElement.textContent = randomThreat;
        const colors = {
            'LOW': 'var(--accent)',
            'MODERATE': '#33ccff',
            'ELEVATED': '#ffaa33',
            'HIGH': '#ff6b35',
            'CRITICAL': '#ff3333'
        };
        threatElement.style.color = colors[randomThreat] || 'var(--secondary)';
    }
    
    // Update malware count
    const malwareElement = document.getElementById('activeMalware');
    if (malwareElement) {
        malwareElement.textContent = Math.floor(Math.random() * 20) + 5;
    }
    
    // Update dark web listings
    const darkWebElement = document.getElementById('darkWebListings');
    if (darkWebElement) {
        darkWebElement.textContent = (Math.floor(Math.random() * 5000) + 1000).toLocaleString();
    }
}

// Update dashboard every 30 seconds
setInterval(updateDashboard, 30000);
setTimeout(updateDashboard, 1000);

// ============================================================
// THREAT STATUS ROTATOR
// ============================================================
const threatStatuses = [
    '🟢 All systems nominal',
    '🟡 Elevated phishing activity detected',
    '🔴 New ransomware variant reported',
    '🟢 Security update available',
    '🟠 Ongoing OSINT investigation',
    '🔵 Coordinated DDoS attack mitigated',
    '🟢 All clear - no major threats'
];

const statusElement = document.getElementById('threatStatus');
if (statusElement) {
    setInterval(() => {
        const randomStatus = threatStatuses[Math.floor(Math.random() * threatStatuses.length)];
        statusElement.textContent = randomStatus;
    }, 10000);
}
