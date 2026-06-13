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
        title: "KINETIX LABS ACTIVEWEAR",
        category: "advertising",
        concept: "High-performance half-zip athletic wear advertisement campaign featuring thermal regulation technology, clean typography, and a modern studio look.",
        image: "assets/AIGI/AIGI1.png",
        tags: "Fashion, Athletic, Campaign"
    },
    {
        id: 2,
        title: "CANVAS SKINCARE",
        category: "branding",
        concept: "A product launch campaign for Hydrating Shield moisturizer, split between a dry, cracked soil background and a lush, sunny environment to emphasize protection.",
        image: "assets/AIGI/AIGI2.png",
        tags: "Skincare, Branding, Advertisement"
    },
    {
        id: 3,
        title: "ORIGIN ROAST COFFEE",
        category: "product",
        concept: "Eco-friendly kraft paper coffee pouch design set against a warm sunrise and mountain vista, conveying organic, high-elevation sourcing.",
        image: "assets/AIGI/AIGI3.png",
        tags: "Coffee, Packaging, Organic"
    },
    {
        id: 4,
        title: "PRESS RESTART JUICE",
        category: "product",
        concept: "Vibrant and energetic visual for cold-pressed green juice, featuring explosive splashes of cucumber, apple, lemon, and kale.",
        image: "assets/AIGI/AIGI4.png",
        tags: "Beverage, Splash, Fresh"
    },
    {
        id: 5,
        title: "FUEL THE GRIND",
        category: "advertising",
        concept: "High-contrast dark-mode advertisement for a premium energy drink can featuring a gold lightning bolt badge and wet droplets.",
        image: "assets/AIGI/AIGI5.png",
        tags: "Energy Drink, Premium, Bold"
    },
    {
        id: 6,
        title: "PAWCO REFLECTIVE HARNESS",
        category: "branding",
        concept: "A feature-rich product catalog banner for PawCo's reflective dog harness, showcasing key product details and anatomy.",
        image: "assets/AIGI/AIGI6.png",
        tags: "Pets, Product Design, E-commerce"
    },
    {
        id: 7,
        title: "ALPHA K9 TACTICAL HARNESS",
        category: "branding",
        concept: "A heavy-duty product features guide for Alpha K9's tactical gear, emphasizing durable alloy leash points and quick-release buckles.",
        image: "assets/AIGI/AIGI7.png",
        tags: "Tactical, Pets, Gear"
    },
    {
        id: 8,
        title: "HOUNDSAFETY COLLAR",
        category: "branding",
        concept: "Sophisticated branding and lifestyle layout for HoundSafety reflective dog collars, highlighting style and comfort.",
        image: "assets/AIGI/AIGI8.png",
        tags: "Pets, Fashion, Studio"
    },
    {
        id: 9,
        title: "PAWS & REST ORTHOPEDIC BED",
        category: "branding",
        concept: "Split-screen advertising graphic demonstrating joint relief, orthopedic support, and premium comfort of a dog bed.",
        image: "assets/AIGI/AIGI9.png",
        tags: "Pets, Furniture, Lifestyle"
    },
    {
        id: 10,
        title: "VÉLO AXIS SLIM WALLET",
        category: "product",
        concept: "Premium leather MagSafe wallet showcase, highlighted with warm gold accent lighting and a minimalist, high-end feel.",
        image: "assets/AIGI/AIGI10.png",
        tags: "Accessories, Tech, Leather"
    },
    {
        id: 11,
        title: "TERRAFLEX ECO LEGGINGS",
        category: "advertising",
        concept: "Clean lifestyle poster for Aura Active's sustainable activewear, featuring earth-toned studios and minimalist typography.",
        image: "assets/AIGI/AIGI11.png",
        tags: "Fashion, Eco-Friendly, Campaign"
    },
    {
        id: 12,
        title: "SOLIS POLARIZED AVIATORS",
        category: "product",
        concept: "Sleek product layout showing Solis Horizon aviator sunglasses on a marble tabletop with matching premium accessories.",
        image: "assets/AIGI/AIGI12.png",
        tags: "Eyewear, Fashion, Premium"
    },
    {
        id: 13,
        title: "NOMAD 25L WATERPROOF PACK",
        category: "product",
        concept: "Adventure gear advertisement highlighting the Outbound Gear waterproof backpack with integrated features and bold typography.",
        image: "assets/AIGI/AIGI13.png",
        tags: "Travel, Gear, Adventure"
    },
    {
        id: 14,
        title: "SUNVIBE MANGO BURST",
        category: "advertising",
        concept: "Explosive, high-energy beverage ad showing a yellow mango juice can crashing through rich liquid splashes and ice.",
        image: "assets/AIGI/AIGI14.png",
        tags: "Beverage, Action, Fresh"
    },
    {
        id: 15,
        title: "VANTAGE WIRELESS HEADPHONES",
        category: "product",
        concept: "Studio shot of matte black Vantage headphones resting on raw volcanic rock with gold trim accents, representing premium sound.",
        image: "assets/AIGI/AIGI15.png",
        tags: "Audio, Tech, Premium"
    },
    {
        id: 16,
        title: "TITANIUM PRO IPHONE AD",
        category: "advertising",
        concept: "Minimalist dark-themed layout highlighting the sleek titanium build, A17 chip, and camera capabilities of the iPhone.",
        image: "assets/AIGI/AIGI16.png",
        tags: "Tech, Smartphone, Premium"
    },
    {
        id: 17,
        title: "MOMENTUM TRUE WIRELESS 400",
        category: "product",
        concept: "Flat-lay product photography for Vision Momentum earbuds, showing raw concrete textures and custom tags.",
        image: "assets/AIGI/AIGI17.png",
        tags: "Audio, Minimalist, Tech"
    },
    {
        id: 18,
        title: "LIFTDOCK ADJUSTABLE STAND",
        category: "product",
        concept: "Modern product poster showing the Apex Workspace foldable aluminum phone stand in a warm sunset lighting scenario.",
        image: "assets/AIGI/AIGI18.png",
        tags: "Accessories, Tech, Metal"
    },
    {
        id: 19,
        title: "NEUROBREW CLARITY FLOW",
        category: "branding",
        concept: "Soothing product mockup for NeuroBrew nometropic blend, surrounded by fresh blueberries, lavender, and matcha powder.",
        image: "assets/AIGI/AIGI19.png",
        tags: "Health, Packaging, Minimalist"
    },
    {
        id: 20,
        title: "NOMAD PRO JACKET",
        category: "advertising",
        concept: "AeroTravel's waterproof and windproof outdoor utility jacket catalog design, highlighting technical features and clean aesthetics.",
        image: "assets/AIGI/AIGI20.png",
        tags: "Fashion, Campaign, Outdoors"
    },
    {
        id: 21,
        title: "PUREPOD COMPACT FILTER",
        category: "editorial",
        concept: "Environmental product campaign showcasing the eco-friendly PurePod water filter sitting on a rock in a flowing river.",
        image: "assets/AIGI/AIGI21.png",
        tags: "Water, Eco-Friendly, Sustainability"
    },
    {
        id: 22,
        title: "ELEMENT HOME AIR PURIFIER",
        category: "editorial",
        concept: "Breathe cleaner, live better campaign showing the AuraAir purifier floating amidst swirling fresh water, ice, and lavender sprigs.",
        image: "assets/AIGI/AIGI22.png",
        tags: "Home, Health, Clean"
    },
    {
        id: 23,
        title: "ELEMENT COFFEE PRECISION GRINDER",
        category: "product",
        concept: "Premium matte-black electric coffee grinder advertisement, set on a dark slate counter with premium coffee beans.",
        image: "assets/AIGI/AIGI23.png",
        tags: "Coffee, Kitchen, Luxury"
    },
    {
        id: 24,
        title: "AWS & PULSE SMART COLLAR",
        category: "branding",
        concept: "Interactive GPS tracker dog collar product visual guide, showcasing the device's sleek waterproof build and activity monitoring.",
        image: "assets/AIGI/AIGI24.png",
        tags: "Pets, Tech, IoT"
    },
    {
        id: 25,
        title: "SONICGRID SOUNDPOD GO",
        category: "product",
        concept: "Split design representing SonicGrid's rugged outdoor speaker, divided between a dry environment and splashing lakeside water.",
        image: "assets/AIGI/AIGI25.png",
        tags: "Audio, Waterproof, Adventure"
    },
    {
        id: 26,
        title: "AEONIC X1 EARBUDS",
        category: "product",
        concept: "Cyberpunk/futuristic aesthetic showcase showing the Aeonic X1 earbuds hovering above splashing metallic liquid and speaker coils.",
        image: "assets/AIGI/AIGI26.png",
        tags: "Audio, Futuristic, Tech"
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
