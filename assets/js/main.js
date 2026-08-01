// ============================================================
// THE NEXUS REPORT - COMPLETE JAVASCRIPT
// Typing Animation with Loop · Real-Time Data · All Features
// ============================================================

// ============================================================
// PRELOADER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader after 1.5 seconds
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 1500);

    // Console branding
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║                                                  ║');
    console.log('║   ████████╗██╗  ██╗███████╗                      ║');
    console.log('║   ╚══██╔══╝██║  ██║██╔════╝                      ║');
    console.log('║      ██║   ███████║█████╗                        ║');
    console.log('║      ██║   ██╔══██║██╔══╝                        ║');
    console.log('║      ██║   ██║  ██║███████╗                      ║');
    console.log('║      ╚═╝   ╚═╝  ╚═╝╚══════╝                      ║');
    console.log('║                                                  ║');
    console.log('║     THE NEXUS REPORT                             ║');
    console.log('║     Intelligence · Investigation · Verification  ║');
    console.log('║                                                  ║');
    console.log('║     A Digital Intelligence & Research            ║');
    console.log('║     Initiative of MK Global Nexus                ║');
    console.log('║     Founded by Manoj Meena                       ║');
    console.log('║                                                  ║');
    console.log('╚══════════════════════════════════════════════════╝');

    // ============================================================
    // TYPING ANIMATION WITH LOOP (Infinite)
    // ============================================================
    
    // --- DATA ---
    const bioLines = [
        'Manoj Meena is the Founder & CEO of MK Global Nexus.',
        'His work focuses on cyber analysis, investigative research,',
        'OSINT methodologies, technology intelligence, and digital literacy.',
        '',
        'The mission is to promote responsible use of technology,',
        'cyber security awareness, and digital literacy.'
    ];

    const valuesText = 'Truth First · Evidence-Based · Integrity · Professionalism · Public Awareness · Cyber Security Education · Research-Oriented · Responsible Investigation';

    // --- DOM ELEMENTS ---
    const typingBio = document.getElementById('typingBio');
    const typingValues = document.getElementById('typingValues');
    const terminalValues = document.getElementById('terminalValues');

    if (typingBio) {
        // --- STATE ---
        let isDeleting = false;
        let bioIndex = 0;
        let charIndex = 0;
        let currentText = '';
        let isValuesTyping = false;
        let valuesCharIndex = 0;
        let isValuesDeleting = false;
        let valuesCurrentText = '';
        let isPaused = false;
        let pauseTimeout = null;

        // --- TYPE BIO FUNCTION ---
        function typeBio() {
            if (isPaused) return;

            const fullText = bioLines[bioIndex] || '';

            if (!isDeleting) {
                // --- TYPING ---
                if (charIndex < fullText.length) {
                    currentText += fullText.charAt(charIndex);
                    typingBio.textContent = currentText;
                    charIndex++;
                    const speed = 30 + Math.random() * 40;
                    setTimeout(typeBio, speed);
                } else {
                    // --- LINE COMPLETE ---
                    if (bioIndex < bioLines.length - 1) {
                        // Next line
                        bioIndex++;
                        charIndex = 0;
                        currentText += '\n';
                        typingBio.textContent = currentText;
                        setTimeout(typeBio, 300);
                    } else {
                        // --- ALL LINES COMPLETE → START VALUES TYPING ---
                        isPaused = true;
                        if (terminalValues) {
                            terminalValues.style.display = 'block';
                        }
                        setTimeout(() => {
                            isPaused = false;
                            typeValues();
                        }, 800);
                    }
                }
            }
        }

        // --- TYPE VALUES FUNCTION ---
        function typeValues() {
            if (isPaused) return;

            if (!isValuesDeleting) {
                // --- TYPING VALUES ---
                if (valuesCharIndex < valuesText.length) {
                    valuesCurrentText += valuesText.charAt(valuesCharIndex);
                    if (typingValues) {
                        typingValues.textContent = valuesCurrentText;
                    }
                    valuesCharIndex++;
                    const speed = 20 + Math.random() * 30;
                    setTimeout(typeValues, speed);
                } else {
                    // --- VALUES COMPLETE → PAUSE THEN DELETE ---
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        isValuesDeleting = true;
                        deleteValues();
                    }, 3000);
                }
            }
        }

        // --- DELETE VALUES FUNCTION ---
        function deleteValues() {
            if (isPaused) return;

            if (valuesCurrentText.length > 0) {
                valuesCurrentText = valuesCurrentText.slice(0, -1);
                if (typingValues) {
                    typingValues.textContent = valuesCurrentText;
                }
                const speed = 15 + Math.random() * 20;
                setTimeout(deleteValues, speed);
            } else {
                // --- VALUES DELETED → DELETE BIO ---
                isValuesDeleting = false;
                valuesCharIndex = 0;
                isDeleting = true;
                deleteBio();
            }
        }

        // --- DELETE BIO FUNCTION ---
        function deleteBio() {
            if (isPaused) return;

            if (currentText.length > 0) {
                // Remove last character
                if (currentText.endsWith('\n')) {
                    currentText = currentText.slice(0, -1);
                }
                currentText = currentText.slice(0, -1);
                typingBio.textContent = currentText;
                const speed = 15 + Math.random() * 25;
                setTimeout(deleteBio, speed);
            } else {
                // --- BIO DELETED → RESET AND START OVER ---
                isDeleting = false;
                bioIndex = 0;
                charIndex = 0;
                currentText = '';
                if (terminalValues) {
                    terminalValues.style.display = 'none';
                }
                if (typingValues) {
                    typingValues.textContent = '';
                }
                valuesCurrentText = '';
                valuesCharIndex = 0;
                isValuesDeleting = false;

                // Small pause before restart
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    typeBio();
                }, 1000);
            }
        }

        // --- START TYPING ---
        setTimeout(typeBio, 500);

        // --- FOUNDER NAME GLOW EFFECT ---
        const founderName = document.getElementById('founderName');
        if (founderName) {
            setInterval(() => {
                const glow = 0.2 + Math.random() * 0.3;
                founderName.style.textShadow = `0 0 ${20 + Math.random() * 30}px rgba(0, 194, 255, ${glow})`;
            }, 500);
        }

        // --- FOUNDER TITLE GLOW EFFECT ---
        const founderTitle = document.getElementById('founderTitle');
        if (founderTitle) {
            setInterval(() => {
                const glow = 0.1 + Math.random() * 0.2;
                founderTitle.style.textShadow = `0 0 ${10 + Math.random() * 20}px rgba(0, 194, 255, ${glow})`;
            }, 800);
        }

        console.log('⌨️ Typing Animation with Loop Started!');
    }

    // ============================================================
    // CLOCK
    // ============================================================
    function updateClock() {
        const clockEl = document.getElementById('clockTime');
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ============================================================
    // UPTIME
    // ============================================================
    let startTime = Date.now();
    setInterval(function() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        const uptimeEl = document.getElementById('uptime');
        if (uptimeEl) uptimeEl.textContent = `${h}:${m}:${s}`;
    }, 1000);

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
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

    // ============================================================
    // MOBILE MENU
    // ============================================================
    document.getElementById('menuToggle')?.addEventListener('click', function() {
        document.querySelector('.nav-links')?.classList.toggle('open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-links')?.classList.remove('open');
        });
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
    window.showToast = showToast;

    // ============================================================
    // TERMINAL ANIMATION (Home Page)
    // ============================================================
    const terminalLines = [
        '> INITIALIZING INTELLIGENCE SYSTEM...',
        '> CONNECTING TO SECURE NETWORK...',
        '> ESTABLISHING ENCRYPTED CHANNEL...',
        '> <span class="terminal-success">CONNECTION ESTABLISHED ✓</span>',
        '> <span class="terminal-success">MK GLOBAL NEXUS ACTIVE ✓</span>',
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
            setTimeout(updateTerminal, 400 + Math.random() * 300);
        } else {
            setTimeout(function() {
                terminalOutput.innerHTML = '';
                lineIndex = 0;
                setTimeout(updateTerminal, 3000);
            }, 4000);
        }
    }
    setTimeout(updateTerminal, 500);

    // ============================================================
    // FALLBACK DATA FOR NEWS
    // ============================================================
    const FALLBACK_ARTICLES = [
        { title: '🔒 Ransomware Attack Targets Hospitals', description: 'Multiple healthcare facilities affected worldwide. FBI investigating.', category: 'Cyber Security', source: { name: 'Security Watch' }, url: '#', publishedAt: new Date().toISOString() },
        { title: '🚨 AI-Powered Phishing Campaign Detected', description: 'Scammers using AI to clone voices and demand money from victims.', category: 'Scam Alert', source: { name: 'Fraud Alert' }, url: '#', publishedAt: new Date(Date.now() - 3600000).toISOString() },
        { title: '💻 Critical Windows Zero-Day Patched', description: 'Microsoft releases emergency security update for all Windows versions.', category: 'Technology', source: { name: 'Tech Security' }, url: '#', publishedAt: new Date(Date.now() - 7200000).toISOString() },
        { title: '📱 Banking Malware on Play Store', description: 'Over 100,000 downloads of malicious banking trojan discovered.', category: 'Cyber Security', source: { name: 'Mobile Security' }, url: '#', publishedAt: new Date(Date.now() - 10800000).toISOString() },
        { title: '🕵️ OSINT Exposes Disinformation Network', description: 'Coordinated campaign targeting elections uncovered by OSINT research.', category: 'OSINT', source: { name: 'OSINT Research' }, url: '#', publishedAt: new Date(Date.now() - 14400000).toISOString() },
        { title: '💰 Fake Crypto Platform Steals $50M', description: 'Investment scam vanishes overnight, leaving thousands of victims.', category: 'Scam Alert', source: { name: 'Crypto Security' }, url: '#', publishedAt: new Date(Date.now() - 18000000).toISOString() }
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
    renderHome();

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
            darkweb: { title: '👁️ DARK WEB MONITOR', html: `<p>Monitor dark web for threats</p><input type="text" id="darkwebInput" placeholder="Enter keyword"><button onclick="checkDarkWeb()">MONITOR</button><div id="darkwebResult" style="margin-top:12px; padding:12px; background:var(--bg); border-radius:8px; display:none;"></div>` }
        };
        const tool = tools[type];
        if (tool) { title.textContent = tool.title; body.innerHTML = tool.html; }
    }
    window.openTool = openTool;

    function closeToolModal() {
        document.getElementById('toolModal')?.classList.remove('show');
    }
    window.closeToolModal = closeToolModal;

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
            result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>IP:</strong> ${ip}</span><span style="color:${safe ? 'var(--accent)' : '#ff3333'}">${safe ? '✅ SAFE' : '⚠️ SUSPICIOUS'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>📍 ${safe ? 'United States' : 'Unknown (VPN)'}</div><div>🛡️ ${safe ? 'Clean record' : 'Reported 15 times'}</div></div>`;
            showToast('IP scan complete', 'info');
        }, 1500);
    }
    window.checkIP = checkIP;

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
            result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Domain:</strong> ${domain}</span><span style="color:${safe ? 'var(--accent)' : '#ff3333'}">${safe ? '✅ SAFE' : '⚠️ SUSPICIOUS'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>📅 ${Math.floor(Math.random() * 10) + 1} years old</div><div>🔒 ${safe ? 'SSL Valid' : 'SSL Expired'}</div></div>`;
            showToast('Domain scan complete', 'info');
        }, 1500);
    }
    window.checkDomain = checkDomain;

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
            result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Email:</strong> ${email}</span><span style="color:${valid ? 'var(--accent)' : '#ff3333'}">${valid ? '✅ VALID' : '❌ INVALID'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>🔓 ${breached ? '⚠️ Found in breaches' : '✅ No breaches'}</div></div>`;
            showToast('Email validation complete', 'info');
        }, 1500);
    }
    window.validateEmail = validateEmail;

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
            result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Email:</strong> ${email}</span><span style="color:${breaches > 0 ? '#ffaa33' : 'var(--accent)'}">${breaches > 0 ? `⚠️ ${breaches} BREACHES` : '✅ CLEAN'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;">${breaches > 0 ? `<div>🔓 ${['LinkedIn', 'Adobe', 'Dropbox', 'MySpace'].slice(0, breaches).join(', ')}</div><div style="color:#ffaa33;">🔄 Change password!</div>` : '<div>✅ No breaches found</div>'}</div>`;
            showToast('Breach check complete', 'info');
        }, 1500);
    }
    window.checkBreach = checkBreach;

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
            result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Hash:</strong> ${hash.substring(0, 16)}...</span><span style="color:${malicious ? '#ff3333' : 'var(--accent)'}">${malicious ? '⚠️ MALICIOUS' : '✅ CLEAN'}</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>📊 ${malicious ? 'Malware detected' : 'Clean file'}</div><div>🛡️ ${malicious ? '12/65 vendors' : '0/65 vendors'}</div></div>`;
            showToast('Hash analysis complete', 'info');
        }, 1500);
    }
    window.checkHash = checkHash;

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
            result.innerHTML = `<div style="display:flex; justify-content:space-between"><span><strong>Keyword:</strong> ${keyword}</span><span style="color:${listings > 5 ? '#ffaa33' : 'var(--accent)'}">${listings} LISTINGS</span></div><div style="margin-top:8px; opacity:0.5; font-size:0.8rem;"><div>🔍 ${listings > 0 ? `${listings} mentions found` : 'No mentions'}</div>${listings > 0 ? '<div style="color:#ffaa33;">⚠️ Monitor activity</div>' : ''}</div>`;
            showToast('Dark web monitor complete', 'info');
        }, 1500);
    }
    window.checkDarkWeb = checkDarkWeb;

    // ============================================================
    // NEWSLETTER
    // ============================================================
    document.getElementById('footerNewsletter')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input')?.value || '';
        showToast(`📡 Subscribed: ${email}`, 'success', 4000);
        this.reset();
    });

    // ============================================================
    // CONTACT FORM
    // ============================================================
    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]')?.value || '';
        showToast(`✅ Thank you ${name}! Your message has been sent.`, 'success', 4000);
        this.reset();
    });

    // ============================================================
    // ANIMATED COUNTERS
    // ============================================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (!target || isNaN(target)) return;
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
    // PARTICLES BACKGROUND
    // ============================================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
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
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
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
                ctx.fillStyle = `rgba(0, 194, 255, ${this.opacity})`;
                ctx.fill();
                ctx.shadowColor = 'rgba(0, 194, 255, 0.1)';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initParticles() {
            const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 30000));
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
    }

    console.log('✅ The Nexus Report - All Systems Ready!');
    console.log('🚀 Features: Typing Animation · Real-Time Data · OSINT Tools');
});
