/**
 * CASE STUDY PAGE — Editorial UX Storytelling Script
 * Data-driven: each case study is a static object, selected via ?id= param.
 */

// ============================================
// SMOOTH SCROLL ENGINE
// ============================================
class SmoothScroll {
    constructor(opts = {}) {
        this.ease = opts.ease || 0.08;
        this.targetY = window.scrollY;
        this.currentY = window.scrollY;
        this.isRunning = false;
        this.wheelMultiplier = opts.wheelMultiplier || 1;

        if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
            window.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
        }

        window.addEventListener('scroll', () => {
            if (!this.isRunning) {
                this.targetY = window.scrollY;
                this.currentY = window.scrollY;
            }
        }, { passive: true });
    }

    _onWheel(e) {
        if (document.body.classList.contains('no-scroll')) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        this.targetY += e.deltaY * this.wheelMultiplier;
        this.targetY = Math.max(0, Math.min(this.targetY, maxScroll));

        if (!this.isRunning) {
            this.isRunning = true;
            this._animate();
        }
    }

    _animate() {
        const diff = this.targetY - this.currentY;
        if (Math.abs(diff) < 0.5) {
            this.currentY = this.targetY;
            window.scrollTo(0, this.currentY);
            this.isRunning = false;
            return;
        }
        this.currentY += diff * this.ease;
        window.scrollTo(0, this.currentY);
        requestAnimationFrame(() => this._animate());
    }
}

const smoothScroll = new SmoothScroll({ ease: 0.05, wheelMultiplier: 0.8 });

// ============================================
// THEME INIT
// ============================================
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('night-mode');
}

// ============================================
// CASE STUDY DATA
// ============================================
const CASE_STUDIES = {
    bcgi: {
        id: 'bcgi',
        badge: 'UI/UX CASE STUDY',
        title: 'BCGI',
        subtitle: 'About Page UX Redesign — The BlackCoders Group Inc.',
        domain: 'theblackcoders.com/about',
        role: 'UX/UI Designer',
        tools: 'Figma, Photoshop, Canva',
        year: '2026',
        scope: 'About Page Redesign',
        overview: 'A self-initiated UX/UI redesign of The BlackCoders Group Inc.\'s About page focused on improving visual hierarchy, readability, trust-building, and overall user experience. This conceptual redesign was created to analyze usability issues within the existing interface and propose a cleaner, more modern, and conversion-focused experience for potential clients and visitors.',
        problemIntro: 'The original About page presented important company information, but several UX issues reduced readability, clarity, and user engagement.',
        problems: [
            'Weak visual hierarchy made sections difficult to scan',
            'Large blocks of text created cognitive overload',
            'Repetitive messaging reduced content clarity',
            'Trust-building elements were limited',
            'Calls-to-action lacked emphasis',
            'Inconsistent spacing and layout structure affected readability',
            'The page felt overly corporate and lacked emotional connection',
            'Mobile responsiveness likely suffered due to dense content structure'
        ],
        impactText: 'As a result, users may struggle to quickly understand what the company specializes in, why the company is credible, and what action they should take next.',
        goals: [
            { title: 'Improve Hierarchy', desc: 'Create a clear visual hierarchy that guides users through the content naturally and effectively.' },
            { title: 'Enhance Scanability', desc: 'Make information easier to scan so users can quickly find what matters to them.' },
            { title: 'Modern Interface', desc: 'Design a cleaner, more modern aesthetic that reflects a professional IT company.' },
            { title: 'Build Trust', desc: 'Strengthen credibility signals through strategic layout and content presentation.' },
            { title: 'Mobile-First', desc: 'Ensure the design works beautifully across all device sizes and breakpoints.' },
            { title: 'CTA Visibility', desc: 'Improve call-to-action prominence and user flow toward conversion points.' }
        ],
        researchMethod: 'The original design was evaluated using usability principles inspired by Jakob Nielsen\'s usability heuristics. A thorough heuristic evaluation revealed multiple opportunities for improvement across content structure, visual design, and interaction patterns.',
        findings: [
            'Inconsistent content structure',
            'Weak hierarchy between headings and body text',
            'Minimal whitespace between sections',
            'Overuse of long paragraphs',
            'Lack of visual prioritization',
            'Generic messaging with low differentiation'
        ],
        process: [
            {
                title: 'Content Restructuring',
                text: 'I reorganized the content into clearer sections to improve scanability and information flow. The improved structure includes: Hero Section, Company Overview, Mission & Vision, Core Services, Trust & Credibility, Team/Company Culture, and a CTA Section.',
                tags: ['Information Architecture', 'Content Strategy', 'User Flow']
            },
            {
                title: 'Visual Hierarchy Improvements',
                text: 'To guide users more effectively through the page, I improved typography scale, section spacing, contrast, CTA prominence, and content grouping. This helped create a clearer reading flow and reduced visual clutter.',
                tags: ['Typography', 'Spacing', 'Contrast', 'CTA Design']
            },
            {
                title: 'Trust-Building Enhancements',
                text: 'Since trust is critical for IT and cybersecurity companies, I introduced statistics and company highlights, cleaner service presentation, modern card layouts, professional visual consistency, and stronger CTA placement.',
                tags: ['Trust Signals', 'Card Layouts', 'Statistics', 'Visual Consistency']
            },
            {
                title: 'Mobile-First Considerations',
                text: 'The redesign was optimized for responsiveness by reducing long text sections, creating modular content blocks, improving spacing for smaller screens, and simplifying navigation flow.',
                tags: ['Responsive Design', 'Modular Blocks', 'Mobile UX']
            }
        ],
        screenshotAfter: 'assets/bcgi_aboutus.png',
        screenshotBefore: 'assets/bcgi_aboutus_before.png',
        screenshotTitle: 'Before & After Redesign Comparison',
        screenshotCaption: 'Use the toggle above to compare the original layout with the redesigned concept.',
        outcomes: [
            { icon: '✦', title: 'Cleaner Interface', desc: 'A more modern and professional visual design' },
            { icon: '◈', title: 'Better Readability', desc: 'Improved scanability and content flow' },
            { icon: '▲', title: 'Visual Hierarchy', desc: 'Clear content prioritization and structure' },
            { icon: '◉', title: 'Trust Signals', desc: 'Stronger credibility presentation' },
            { icon: '◆', title: 'Engaging Content', desc: 'More dynamic and interactive structure' },
            { icon: '▣', title: 'Responsive Design', desc: 'Optimized across all device sizes' }
        ],
        learnings: [
            'Information Architecture',
            'UX Problem Identification',
            'Visual Hierarchy Design',
            'Content Restructuring',
            'Responsive UI Design',
            'Trust-Centered UX Design'
        ],
        disclaimer: 'This was a self-initiated conceptual redesign created for educational and portfolio purposes. I am not affiliated with The BlackCoders Group Inc. All original content and branding belong to their respective owners.'
    },
    merge: {
        id: 'merge',
        badge: 'UI/UX DESIGN',
        title: 'MERGE',
        subtitle: 'High-Fidelity macOS Interactive Platform & Demo',
        domain: 'merge-platform.com',
        role: 'UI/UX Designer',
        tools: 'Figma',
        year: '2026',
        scope: 'Desktop App Design',
        overview: 'A self-initiated personal UI/UX design project for MERGE, a high-fidelity interactive macOS platform concept. Designed entirely by me with no external client, this project features premium dark mode layouts, high density information displays, and pixel-perfect interactive mockups. The project showcases how modern desktop applications can balance aesthetic minimalism with rich technical capabilities.',
        problemIntro: 'Designing a complex dashboard for high-end users presents unique challenges in terms of data density, scanning efficiency, and interaction visual styling.',
        problems: [
            'High cognitive load due to complex technical data streams',
            'Difficulty in balancing minimalism with dense technical instrumentation',
            'Unrefined interaction flows for window management and platform navigation',
            'Visual clutter when multiple panels are active simultaneously'
        ],
        impactText: 'Without proper visual scaffolding and layout structuring, users can quickly become overwhelmed by data-dense environments.',
        goals: [
            { title: 'Simplify Complexity', desc: 'Present massive amounts of technical data in a clean, legible, and visual manner.' },
            { title: 'Aesthetic Premium', desc: 'Craft a stunning, high-end dark mode design utilizing rich glassmorphism and subtle gradients.' },
            { title: 'Fluid Interactions', desc: 'Design smooth macOS-style transitions and modular interactive desktop widgets.' }
        ],
        researchMethod: 'I analyzed expert usability principles, window-docking patterns, and cognitive patterns under dense information workloads to design an optimal, low-stress workstation layout.',
        findings: [
            'Modular layouts with collapsable panels reduce interface stress',
            'Dark mode with selected high-contrast color highlights increases long-term reading comfort',
            'Predictable navigation anchors speed up professional workflows'
        ],
        process: [
            {
                title: 'Wireframing & IA',
                text: 'Mapped out user journeys for technical analysts and sketched modular widget arrangements.',
                tags: ['Information Architecture', 'Low-Fi Sketches']
            },
            {
                title: 'High-Fidelity UI Design',
                text: 'Engineered a cohesive macOS design system with refined dark modes, precise typography scales, and elegant shadow systems.',
                tags: ['Figma', 'UI Kits', 'Design System']
            },
            {
                title: 'Interaction & Video Prototyping',
                text: 'Created dynamic high-fidelity video walkthroughs (M02.mp4) to simulate and test desktop transitions, overlays, and responsiveness.',
                tags: ['Motion Design', 'Video Demo']
            }
        ],
        outcomes: [
            { icon: '✦', title: 'Seamless Visuals', desc: 'An ultra-premium, modern dark aesthetic' },
            { icon: '◈', title: 'Modular Control', desc: 'Flexible sidebars and widgets designed for power users' },
            { icon: '▲', title: 'High-Fidelity Demo', desc: 'Rich motion prototype illustrating production-level interactions' }
        ],
        learnings: [
            'Complex Data Layouts',
            'Motion Design & Prototyping',
            'macOS Interface Aesthetics',
            'Precision Component Engineering'
        ],
        disclaimer: 'This is a personal, self-initiated conceptual project designed entirely by me. All original assets, design components, mockups, and interaction demo videos were created by me.'
    }
};

// ============================================
// POPULATE PAGE
// ============================================
function populate() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'bcgi';
    const cs = CASE_STUDIES[id];

    if (!cs) {
        console.error('Case study not found:', id);
        return;
    }

    // Helper
    const set = (elId, val) => {
        const el = document.getElementById(elId);
        if (el) el.textContent = val;
    };

    // Page title
    document.title = `${cs.title} — Case Study — Nate`;

    // Hero
    set('csBadge', cs.badge);
    set('csTitle', cs.title);
    set('csSubtitle', cs.subtitle);
    set('csRole', cs.role);
    set('csTools', cs.tools);
    set('csYear', cs.year);
    set('csScope', cs.scope);

    // Overview
    set('csOverview', cs.overview);

    // Problem
    set('csProblemIntro', cs.problemIntro);
    const problemList = document.getElementById('csProblemList');
    if (problemList) {
        problemList.innerHTML = cs.problems.map(p => `
            <li class="cs-problem-item">
                <span class="cs-problem-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 9v4M12 17h.01M12 2L2 22h20L12 2z"/>
                    </svg>
                </span>
                <span>${p}</span>
            </li>
        `).join('');
    }
    set('csImpactText', cs.impactText);

    // Goals
    const goalsGrid = document.getElementById('csGoalsGrid');
    if (goalsGrid) {
        goalsGrid.innerHTML = cs.goals.map((g, i) => `
            <div class="cs-goal-card" data-reveal>
                <span class="cs-goal-num">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="cs-goal-title">${g.title}</h3>
                <p class="cs-goal-desc">${g.desc}</p>
            </div>
        `).join('');
    }

    // Research
    set('csResearchMethod', cs.researchMethod);
    const findingList = document.getElementById('csFindingList');
    if (findingList) {
        findingList.innerHTML = cs.findings.map(f => `
            <li class="cs-finding-item">
                <span class="cs-finding-bullet"></span>
                <span>${f}</span>
            </li>
        `).join('');
    }

    // Process
    const processSteps = document.getElementById('csProcessSteps');
    if (processSteps) {
        processSteps.innerHTML = cs.process.map((step, i) => `
            <div class="cs-step" data-reveal>
                <div class="cs-step-num-wrap">
                    <span class="cs-step-num">${String(i + 1).padStart(2, '0')}</span>
                    ${i < cs.process.length - 1 ? '<span class="cs-step-line"></span>' : ''}
                </div>
                <div class="cs-step-content">
                    <h3 class="cs-step-title">${step.title}</h3>
                    <p class="cs-step-text">${step.text}</p>
                    <div class="cs-step-tags">
                        ${step.tags.map(t => `<span class="cs-step-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Screenshot / Concept Display
    if (id === 'merge') {
        const screenshotSection = document.querySelector('.cs-screenshot');
        if (screenshotSection) {
            screenshotSection.innerHTML = `
                <div class="cs-screenshot-header" data-reveal>
                    <span class="cs-screenshot-label">INTERACTIVE MOCKUPS</span>
                    <h3 class="cs-screenshot-title" id="csScreenshotTitle">High-Fidelity macOS Desktop Mockups</h3>
                </div>
                <div class="cs-merge-mockups-container" data-reveal>
                    <!-- Left Side: Scrollable image in macOS style desktop frame -->
                    <div class="cs-browser-frame">
                        <div class="cs-browser-header-bar">
                            <div class="cs-browser-dots">
                                <span class="cs-dot close"></span>
                                <span class="cs-dot minimize"></span>
                                <span class="cs-dot maximize"></span>
                            </div>
                            <div class="cs-browser-address-bar">merge-platform.com/dashboard</div>
                        </div>
                        <div class="cs-screenshot-container" style="height: 480px; overflow-y: auto; background: #0e0e0e;">
                            <img class="cs-screenshot-img active" src="assets/M01.png" alt="Merge Dashboard Design Layout" style="width: 100%; height: auto; display: block; cursor: zoom-in;">
                        </div>
                    </div>
                    
                    <!-- Right Side: Video in macOS style desktop frame -->
                    <div class="cs-browser-frame">
                        <div class="cs-browser-header-bar">
                            <div class="cs-browser-dots">
                                <span class="cs-dot close"></span>
                                <span class="cs-dot minimize"></span>
                                <span class="cs-dot maximize"></span>
                            </div>
                            <div class="cs-browser-address-bar">merge-platform.com/interaction-demo</div>
                        </div>
                        <div class="cs-screenshot-container" style="height: 480px; overflow: hidden; background: #0a0a0a; display: flex; align-items: center; justify-content: center;">
                            <video autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;">
                                <source src="assets/M02.mp4" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
                <p class="cs-screenshot-caption" id="csScreenshotCaption" data-reveal>On the left: The pixel-perfect scrollable layout (M01). On the right: The high-fidelity desktop interaction demonstration video (M02).</p>
            `;

            // Explicitly play and configure the video element programmatically
            const video = screenshotSection.querySelector('video');
            if (video) {
                // Explicitly set DOM attributes (essential for Chrome/Safari video parser recognition)
                video.setAttribute('autoplay', '');
                video.setAttribute('loop', '');
                video.setAttribute('muted', '');
                video.setAttribute('playsinline', '');

                video.defaultMuted = true;
                video.muted = true;
                video.autoplay = true;
                video.loop = true;
                video.playsInline = true;

                let playPromise = null;
                const startPlay = () => {
                    if (video.paused) {
                        playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(err => {
                                console.warn('[Video Player] Playback was blocked or interrupted:', err.message);
                            });
                        }
                    }
                };

                // Try playing immediately
                startPlay();

                // Listen for loaded events to play
                video.addEventListener('loadedmetadata', startPlay);
                video.addEventListener('canplay', startPlay);

                // Use viewport-based playback: play when visible, pause when offscreen
                if ('IntersectionObserver' in window) {
                    const videoObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                startPlay();
                            } else {
                                video.pause();
                            }
                        });
                    }, { threshold: 0.1 });
                    videoObserver.observe(video);
                }

                // Register standard user activation listeners to kick off playback upon first tap/click/keypress
                const userActivationEvents = ['click', 'touchstart', 'keydown', 'pointerdown'];
                const playOnGesture = () => {
                    startPlay();
                    userActivationEvents.forEach(evt => {
                        document.removeEventListener(evt, playOnGesture);
                    });
                };
                userActivationEvents.forEach(evt => {
                    document.addEventListener(evt, playOnGesture, { passive: true });
                });

                // Load source elements to trigger playback pipeline
                video.load();

                // Interactive tap/click toggle on the video itself
                video.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (video.paused) {
                        video.play().catch(err => console.warn('[Video Player] Toggle play failed:', err));
                    } else {
                        video.pause();
                    }
                });
            }
        }
    } else {
        // Screenshot Before/After Population
        const imgAfter = document.getElementById('csScreenshotImgAfter');
        const imgBefore = document.getElementById('csScreenshotImgBefore');
        if (imgAfter && cs.screenshotAfter) {
            imgAfter.src = cs.screenshotAfter;
        }
        if (imgBefore && cs.screenshotBefore) {
            imgBefore.src = cs.screenshotBefore;
        }
        if (cs.domain) {
            set('csBrowserAddress', cs.domain);
        }
        set('csScreenshotTitle', cs.screenshotTitle);
        set('csScreenshotCaption', cs.screenshotCaption);

        // Setup interactive comparison switcher
        initCompareTabs();
    }

    // Outcomes
    const outcomeGrid = document.getElementById('csOutcomeGrid');
    if (outcomeGrid) {
        outcomeGrid.innerHTML = cs.outcomes.map(o => `
            <div class="cs-outcome-card" data-reveal>
                <span class="cs-outcome-icon">${o.icon}</span>
                <h3 class="cs-outcome-title">${o.title}</h3>
                <p class="cs-outcome-desc">${o.desc}</p>
            </div>
        `).join('');
    }

    // Learnings
    const learningItems = document.getElementById('csLearningItems');
    if (learningItems) {
        learningItems.innerHTML = cs.learnings.map(l => `
            <div class="cs-learning-card">
                <span class="cs-learning-title">${l}</span>
            </div>
        `).join('');
    }

    // Disclaimer
    set('csDisclaimer', cs.disclaimer);

    // Init lightbox after images loaded
    initLightbox();
}

// ============================================
// COMPARISON TABS CONTROLLER
// ============================================
function initCompareTabs() {
    const tabs = document.querySelectorAll('.cs-compare-tab');
    const imgAfter = document.getElementById('csScreenshotImgAfter');
    const imgBefore = document.getElementById('csScreenshotImgBefore');
    const indicator = document.querySelector('.cs-compare-indicator');

    if (!imgAfter || !imgBefore) return;

    function updateIndicator(tab) {
        if (!indicator || !tab) return;
        const rect = tab.getBoundingClientRect();
        const parentRect = tab.parentElement.getBoundingClientRect();
        indicator.style.width = rect.width + 'px';
        indicator.style.left = (rect.left - parentRect.left) + 'px';
    }

    // Init active tab indicator position
    const activeTab = document.querySelector('.cs-compare-tab.active');
    if (activeTab) {
        setTimeout(() => updateIndicator(activeTab), 150);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateIndicator(tab);

            if (view === 'after') {
                imgAfter.classList.add('active');
                imgBefore.classList.remove('active');
            } else {
                imgBefore.classList.add('active');
                imgAfter.classList.remove('active');
            }
        });
    });

    window.addEventListener('resize', () => {
        const active = document.querySelector('.cs-compare-tab.active');
        if (active) updateIndicator(active);
    });
}

populate();

// ============================================
// REVEAL ON SCROLL ENGINE
// ============================================
(function () {
    function initReveals() {
        const revealElements = document.querySelectorAll('[data-reveal]');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));

        // Quick reveal for above-fold
        setTimeout(() => {
            const hero = document.getElementById('csHero');
            if (hero) {
                hero.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
            }
        }, 300);
    }

    // Run after populate
    setTimeout(initReveals, 50);
})();

// ============================================
// CUSTOM CURSOR
// ============================================
(function () {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    dot.style.pointerEvents = 'none';
    ring.style.pointerEvents = 'none';

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    const ringEase = 0.15;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        const dx = mouseX - ringX;
        const dy = mouseY - ringY;
        ringX += dx * ringEase;
        ringY += dy * ringEase;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    const hoverables = document.querySelectorAll('a, button, .cs-goal-card, .cs-outcome-card, .cs-screenshot-img');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();

// ============================================
// MAGNETIC EFFECTS
// ============================================
(function () {
    const magnets = document.querySelectorAll('.cs-back-link, .cs-next-badge');

    magnets.forEach(m => {
        m.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = m.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            m.style.transform = `translate(${dx * 0.2}px, ${dy * 0.2}px)`;
        });
        m.addEventListener('mouseleave', () => {
            m.style.transform = 'translate(0, 0)';
        });
    });
})();

// ============================================
// LIGHTBOX
// ============================================
function initLightbox() {
    const overlay = document.getElementById('csLightbox');
    const img = document.getElementById('csLightboxImg');
    const close = document.getElementById('csLightboxClose');

    if (!overlay || !img || !close) return;

    const bindLightbox = (el) => {
        if (!el) return;
        el.addEventListener('click', () => {
            img.src = el.src;
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    };

    // Bind all screenshot images dynamically
    const screenshotImgs = document.querySelectorAll('.cs-screenshot-img, .cs-screenshot-container img');
    screenshotImgs.forEach(bindLightbox);

    close.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('cs-lightbox-backdrop')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// ============================================
// SHARE BUTTON
// ============================================
(function () {
    const btn = document.getElementById('csShareBtn');
    if (!btn) return;
    const tooltip = btn.querySelector('.cs-share-tooltip');

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            btn.classList.add('copied');
            if (tooltip) tooltip.textContent = 'COPIED!';

            setTimeout(() => {
                btn.classList.remove('copied');
                if (tooltip) tooltip.textContent = 'COPY LINK';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
})();
