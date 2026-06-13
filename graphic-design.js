/**
 * GRAPHIC DESIGN / PROMPT ARTISTRY ENGINE
 * Dynamically populates and controls the graphic design gallery
 * Custom Lightbox Modal, dynamic filters, pagination, and interactions.
 */

// ══════════════════════════════════════════
// DATA: 26 AI GENERATED DESIGNS
// ══════════════════════════════════════════
const AIGI_ITEMS = [
    {
        id: 1,
        title: "AURA SKINCARE",
        category: "advertising",
        concept: "A minimalist visual direction for an organic skincare brand, emphasizing natural tones, botanical shadows, and a premium glass finish.",
        image: "assets/AIGI/AIGI1.png",
        tags: "Luxury, Skincare, Organic"
    },
    {
        id: 2,
        title: "LUMEN SMART BULB",
        category: "branding",
        concept: "Cyberpunk-inspired smart home lighting campaign, focusing on vibrant cyan and neon magenta glows.",
        image: "assets/AIGI/AIGI2.png",
        tags: "Tech, Smart Home, Neon"
    },
    {
        id: 3,
        title: "VELOCE ENERGY",
        category: "advertising",
        concept: "High-contrast sports beverage advertisement featuring explosive liquid splashes and bold retro typography.",
        image: "assets/AIGI/AIGI3.png",
        tags: "Beverage, Action, 90s Style"
    },
    {
        id: 4,
        title: "TERRA COFFEE",
        category: "product",
        concept: "Sustainable packaging and brand identity layout for a premium fair-trade coffee roaster.",
        image: "assets/AIGI/AIGI4.png",
        tags: "Coffee, Eco-Friendly, Kraft"
    },
    {
        id: 5,
        title: "NEXUS BUDS",
        category: "product",
        concept: "Futuristic hardware design mockup showcasing wireless audio devices floating in a stark industrial concrete space.",
        image: "assets/AIGI/AIGI5.png",
        tags: "Audio, Hardware, Brutalist"
    },
    {
        id: 6,
        title: "ZEPHYR SHOES",
        category: "advertising",
        concept: "Activewear product poster illustrating motion speed with motion-blurred clay geometry.",
        image: "assets/AIGI/AIGI6.png",
        tags: "Fashion, Footwear, Sports"
    },
    {
        id: 7,
        title: "SOLEIL WINE",
        category: "product",
        concept: "Premium organic wine bottle mockup with warm gold-hour lighting and subtle shadow play.",
        image: "assets/AIGI/AIGI7.png",
        tags: "Wine, Luxury, Summer"
    },
    {
        id: 8,
        title: "KAIJU MATCHA",
        category: "editorial",
        concept: "Streetwear-influenced canned beverage concept featuring playful monster vector art.",
        image: "assets/AIGI/AIGI8.png",
        tags: "Illustration, Japan, Pop-Art"
    },
    {
        id: 9,
        title: "VALO WATCH CO.",
        category: "advertising",
        concept: "High-end titanium wristwatch showcase set against a raw concrete block under dramatic direct sunlight.",
        image: "assets/AIGI/AIGI9.png",
        tags: "Horology, Premium, Studio"
    },
    {
        id: 10,
        title: "ALPIN HONEY",
        category: "branding",
        concept: "Eco-friendly jar mockups with amber fluid reflections and wildflower shadow textures.",
        image: "assets/AIGI/AIGI10.png",
        tags: "Packaging, Organic, Honey"
    },
    {
        id: 11,
        title: "HOLO WEAR",
        category: "editorial",
        concept: "Holographic brand apparel mockup demonstrating light-refracting futuristic textile prints.",
        image: "assets/AIGI/AIGI11.png",
        tags: "Fashion, Futuristic, Hologram"
    },
    {
        id: 12,
        title: "SOLIS PERFUME",
        category: "product",
        concept: "Glass luxury perfume flacon designed for a summer collection with lens flare reflections.",
        image: "assets/AIGI/AIGI12.png",
        tags: "Perfume, Light, High-Fashion"
    },
    {
        id: 13,
        title: "BLOOM FLORALS",
        category: "branding",
        concept: "Minimalist identity package for a boutique florist, using elegant neutral colors and embossed stationery.",
        image: "assets/AIGI/AIGI13.png",
        tags: "Stationery, Florist, Minimalist"
    },
    {
        id: 14,
        title: "APEX GYM ADS",
        category: "advertising",
        concept: "Heavy-contrast fitness campaign showing a dynamic weight plate design with metallic texture overlays.",
        image: "assets/AIGI/AIGI14.png",
        tags: "Fitness, Bold, Metal"
    },
    {
        id: 15,
        title: "NOVA SPARK",
        category: "advertising",
        concept: "Sparkling mineral water print ad emphasizing cleanliness, glass condensation, and crisp lime gradients.",
        image: "assets/AIGI/AIGI15.png",
        tags: "Liquid, Fresh, Branding"
    },
    {
        id: 16,
        title: "ZERO WASTE CO.",
        category: "branding",
        concept: "Biodegradable shampoo bar packaging layout using organic pulp cartons and earthy textures.",
        image: "assets/AIGI/AIGI16.png",
        tags: "Sustainable, Beauty, Pulp"
    },
    {
        id: 17,
        title: "LUNA SLEEP",
        category: "branding",
        concept: "Dark mode visual identity mockup for a wellness app, featuring deep blues, stars, and soft velvet assets.",
        image: "assets/AIGI/AIGI17.png",
        tags: "App, Meditation, Celestial"
    },
    {
        id: 18,
        title: "ROVE LUGGAGE",
        category: "advertising",
        concept: "Durable travel gear campaign illustrating a suitcase positioned in an abstract sand dune environment.",
        image: "assets/AIGI/AIGI18.png",
        tags: "Adventure, Travel, Texture"
    },
    {
        id: 19,
        title: "VAPOR RECORDS",
        category: "editorial",
        concept: "Synthwave music label magazine spread showcasing neon typography and retro grid aesthetics.",
        image: "assets/AIGI/AIGI19.png",
        tags: "Music, 80s Retro, Magazine"
    },
    {
        id: 20,
        title: "ORBIS SPEAKERS",
        category: "product",
        concept: "Spherical wireless home audio systems rendered with matte charcoal textures in a modern living room.",
        image: "assets/AIGI/AIGI20.png",
        tags: "Audio, Interior, Industrial"
    },
    {
        id: 21,
        title: "FLORA CAFE",
        category: "branding",
        concept: "Warm-toned menu card and signage concepts for an urban greenhouse cafe.",
        image: "assets/AIGI/AIGI21.png",
        tags: "Design System, Menu, Cafe"
    },
    {
        id: 22,
        title: "TITAN TOOLS",
        category: "advertising",
        concept: "Tough-grade hand tools advertising concept featuring high-contrast steel highlights on dark backgrounds.",
        image: "assets/AIGI/AIGI22.png",
        tags: "Hardware, Rugged, High-Contrast"
    },
    {
        id: 23,
        title: "PULSE ENERGY",
        category: "branding",
        concept: "Dynamic smart-grid app brand identity showing vibrant neon green vector graphics on phone screens.",
        image: "assets/AIGI/AIGI23.png",
        tags: "Vector, App, Clean Energy"
    },
    {
        id: 24,
        title: "AERO DRONE",
        category: "product",
        concept: "Sleek matte black carbon-fiber drone mockup hovering in an abstract wind-tunnel setting.",
        image: "assets/AIGI/AIGI24.png",
        tags: "Tech, Carbon, Aerodynamic"
    },
    {
        id: 25,
        title: "HYDRA DRINK",
        category: "advertising",
        concept: "Isotonic sports hydration campaign showcasing a neon bottle crashing through water ripples.",
        image: "assets/AIGI/AIGI25.png",
        tags: "Action, Water, Splash"
    },
    {
        id: 26,
        title: "NORDIC HOME",
        category: "editorial",
        concept: "Scandinavian interior magazine design layout showing clean typography and raw oak wood products.",
        image: "assets/AIGI/AIGI26.png",
        tags: "Interior, Magazine, Minimalist"
    }
];

// ══════════════════════════════════════════
// STATE MANAGEMENT
// ══════════════════════════════════════════
let currentFilter = 'all';
let currentOffset = 0;
const ITEMS_PER_PAGE = 8;
let filteredList = [];
let activeItemIndex = -1; // for lightbox slider navigation

// DOM cache
let gridContainer = null;
let loadMoreBtn = null;
let lightboxModal = null;
let currentLightboxItem = null;

// ══════════════════════════════════════════
// GRID INITIALIZATION & RENDERING
// ══════════════════════════════════════════

export function initGraphicDesign() {
    gridContainer = document.getElementById('designGrid');
    loadMoreBtn = document.getElementById('designLoadMore');
    if (!gridContainer) return;

    // Build the dynamic Lightbox markup in the body
    createLightboxMarkup();

    // Set up tab events
    const tabs = document.querySelectorAll('.design-filter-tab');
    const indicator = document.querySelector('.design-filter-indicator');

    function updateIndicator(tab) {
        if (!indicator || !tab) return;
        const rect = tab.getBoundingClientRect();
        const parentRect = tab.parentElement.getBoundingClientRect();
        indicator.style.width = rect.width + 'px';
        indicator.style.left = (rect.left - parentRect.left) + 'px';
    }

    // Initialize indicator on the active tab
    const activeTab = document.querySelector('.design-filter-tab.active');
    if (activeTab) {
        setTimeout(() => updateIndicator(activeTab), 150);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateIndicator(tab);
            applyFilter(filter);
        });
    });

    // Resize listener to reposition filter tab indicator
    window.addEventListener('resize', () => {
        const active = document.querySelector('.design-filter-tab.active');
        if (active) updateIndicator(active);
    });

    // Set up Load More event
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            renderNextBatch();
        });
    }

    // Initial render
    applyFilter('all');
}

/**
 * Filter the dataset and reset page settings.
 */
function applyFilter(filter) {
    currentFilter = filter;
    currentOffset = 0;
    
    if (filter === 'all') {
        filteredList = [...AIGI_ITEMS];
    } else {
        filteredList = AIGI_ITEMS.filter(item => item.category === filter);
    }

    // Clear grid
    gridContainer.innerHTML = '';
    
    // Render first batch
    renderNextBatch();
}

/**
 * Renders the next batch of items based on currentOffset.
 */
function renderNextBatch() {
    const end = Math.min(currentOffset + ITEMS_PER_PAGE, filteredList.length);
    const batch = filteredList.slice(currentOffset, end);

    batch.forEach(item => {
        const card = createCardElement(item);
        gridContainer.appendChild(card);
    });

    currentOffset = end;

    // Trigger reveal classes after painting
    setTimeout(() => {
        const cards = gridContainer.querySelectorAll('.design-card[data-reveal]');
        cards.forEach(card => {
            if (window.__revealObserver) {
                window.__revealObserver.observe(card);
            } else {
                card.classList.add('revealed');
            }
        });
    }, 50);

    // Hide or show load more button
    if (loadMoreBtn) {
        if (currentOffset >= filteredList.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
}

/**
 * Instantiates a single card node and binds all high-end cursor / 3D tilt interactions.
 */
function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'design-card';
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-reveal', '');

    card.innerHTML = `
        <div class="design-card-img-wrap">
            <div class="design-card-img" style="background-image: url('${item.image}')"></div>
            <span class="design-card-badge">${item.category.toUpperCase()}</span>
        </div>
        <div class="design-card-info">
            <h3 class="design-card-title">${item.title}</h3>
            <div class="design-card-top">
                <span class="design-card-num">${String(item.id).padStart(2, '0')}</span>
                <span class="design-card-cat">${item.tags}</span>
            </div>
        </div>
    `;

    // ── INTERACTION EVENTS ──

    const label = document.getElementById('magneticLabel');

    // Hover state updates cursor label & class
    card.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (label) {
            label.textContent = "EXPLORE";
            label.classList.add('active');
        }
    });

    card.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        if (label) {
            label.classList.remove('active');
        }
        
        // Reset 3D transform on leave
        const img = card.querySelector('.design-card-img');
        if (img) {
            img.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        }
    });

    // Dynamic 3D tilt perspective movement
    card.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Sensible limits to look professional (max 6 degrees rotation)
        const rotateX = (mouseY / (height / 2)) * -6;
        const rotateY = (mouseX / (width / 2)) * 6;

        const img = card.querySelector('.design-card-img');
        if (img) {
            img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
        }
    });

    // Lightbox open trigger
    card.addEventListener('click', () => {
        openLightbox(item.id);
    });

    return card;
}

// ══════════════════════════════════════════
// LIGHTBOX MODAL CODE
// ══════════════════════════════════════════

function createLightboxMarkup() {
    lightboxModal = document.createElement('div');
    lightboxModal.id = 'designLightbox';
    lightboxModal.className = 'design-lightbox';
    lightboxModal.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-container">
            <button class="lightbox-close" id="lightboxClose" aria-label="Close details">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="lightbox-content">
                <div class="lightbox-img-col">
                    <div class="lightbox-img-wrap">
                        <img src="" alt="" class="lightbox-img" id="lightboxImg">
                        <div class="lightbox-spinner"></div>
                    </div>
                </div>
                <div class="lightbox-info-col">
                    <div class="lightbox-meta">
                        <span class="lightbox-num" id="lightboxNum">00</span>
                        <span class="lightbox-badge" id="lightboxBadge">CATEGORY</span>
                    </div>
                    <h2 class="lightbox-title" id="lightboxTitle">TITLE</h2>
                    <div class="lightbox-details">
                        <div class="detail-block">
                            <span class="detail-label">CREATIVE CONCEPT</span>
                            <p class="detail-text" id="lightboxConcept">Concept text</p>
                        </div>
                        <div class="detail-block">
                            <span class="detail-label">BRAND FOCUS</span>
                            <p class="detail-text" id="lightboxTags">Tags</p>
                        </div>
                        <div class="detail-block">
                            <span class="detail-label">TWIST / METHODOLOGY</span>
                            <p class="detail-text">Concept and business strategy engineered via <strong>ChatGPT</strong> prompts. Visually synthesized and art-directed using the <strong>Nano Banana</strong> layout grid workflow for professional commercial assets.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="lightbox-navigation">
                <button class="lightbox-nav-btn" id="lightboxPrev" aria-label="Previous image">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <span>PREV</span>
                </button>
                <button class="lightbox-nav-btn" id="lightboxNext" aria-label="Next image">
                    <span>NEXT</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(lightboxModal);

    // Bind event listeners
    const closeBtn = lightboxModal.querySelector('#lightboxClose');
    const backdrop = lightboxModal.querySelector('.lightbox-backdrop');
    const prevBtn = lightboxModal.querySelector('#lightboxPrev');
    const nextBtn = lightboxModal.querySelector('#lightboxNext');

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Custom cursor hints
    [closeBtn, prevBtn, nextBtn].forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Keyboard support (Escape, ArrowLeft, ArrowRight)
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(id) {
    // Find index of this item in the filtered list
    activeItemIndex = filteredList.findIndex(item => item.id === id);
    if (activeItemIndex === -1) return;

    lightboxModal.classList.add('active');
    document.body.classList.add('no-scroll');
    updateLightboxContent();
}

function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    document.body.classList.remove('cursor-hover');
}

function navigateLightbox(direction) {
    if (filteredList.length <= 1) return;

    activeItemIndex += direction;
    if (activeItemIndex < 0) {
        activeItemIndex = filteredList.length - 1; // loop to end
    } else if (activeItemIndex >= filteredList.length) {
        activeItemIndex = 0; // loop to start
    }

    // Fade out visual content slightly during swap
    const content = lightboxModal.querySelector('.lightbox-content');
    content.style.opacity = '0';
    content.style.transform = 'scale(0.98)';

    setTimeout(() => {
        updateLightboxContent();
        content.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 200);
}

function updateLightboxContent() {
    const item = filteredList[activeItemIndex];
    if (!item) return;

    const img = lightboxModal.querySelector('#lightboxImg');
    const title = lightboxModal.querySelector('#lightboxTitle');
    const badge = lightboxModal.querySelector('#lightboxBadge');
    const num = lightboxModal.querySelector('#lightboxNum');
    const concept = lightboxModal.querySelector('#lightboxConcept');
    const tags = lightboxModal.querySelector('#lightboxTags');
    const spinner = lightboxModal.querySelector('.lightbox-spinner');

    // Show loading spinner
    spinner.style.display = 'block';
    img.style.opacity = '0';

    img.src = item.image;
    img.alt = item.title;
    
    img.onload = () => {
        spinner.style.display = 'none';
        img.style.opacity = '1';
    };

    title.textContent = item.title;
    badge.textContent = item.category.toUpperCase();
    num.textContent = String(item.id).padStart(2, '0');
    concept.textContent = item.concept;
    tags.textContent = item.tags;
}

// ══════════════════════════════════════════
// AUTO INIT ON CONTENT LOAD
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initGraphicDesign();
});
