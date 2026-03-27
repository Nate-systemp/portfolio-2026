/**
 * FIRESTORE LOADER
 * Fetches projects from Firebase and populates the work grid on index.html
 * Also used by work.html for the archive grid.
 */
import { db } from './firebase-config.js';
import {
    collection, getDocs, orderBy, query
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Card size pattern: repeat pattern of large/medium/medium for a dynamic grid
const CARD_SIZES = ['card-large', 'card-medium', 'card-medium', 'card-large', 'card-medium', 'card-medium', 'card-large', 'card-medium', 'card-medium'];

/**
 * Fetch all projects sorted by 'order' field.
 * Falls back gracefully if Firestore is unreachable.
 */
async function fetchProjects() {
    try {
        const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const projects = [];
        snapshot.forEach(d => projects.push({ docId: d.id, ...d.data() }));
        return projects;
    } catch (e) {
        console.warn('[Firestore Loader] Could not fetch projects:', e.message);
        return null; // null = fallback to static content
    }
}

/**
 * Build a single work card HTML string.
 */
function buildCard(project, index) {
    const sizeClass = CARD_SIZES[index % CARD_SIZES.length];
    const img = project.gallery?.[0] || '';
    const num = String(project.order || index + 1).padStart(2, '0');

    return `
        <div class="work-card ${sizeClass}" data-reveal>
            <a href="project.html?docId=${encodeURIComponent(project.docId)}" class="work-card-link">
                <div class="work-card-img-wrap">
                    <div class="work-card-img" style="background-image: url('${img}')"></div>
                </div>
                <div class="work-card-info">
                    <div class="work-card-top">
                        <span class="work-card-num">${num}</span>
                        <span class="work-card-cat">${project.category || ''}</span>
                    </div>
                    <h3 class="work-card-title">${project.title || 'UNTITLED'}</h3>
                </div>
            </a>
        </div>`;
}

/**
 * Build a "coming soon" placeholder card.
 */
function buildPlaceholder(num) {
    return `
        <div class="work-card card-medium is-placeholder" data-reveal>
            <div class="work-card-img-wrap">
                <div class="work-card-img" style="background:#e8e3de;"></div>
            </div>
            <div class="work-card-info">
                <div class="work-card-top">
                    <span class="work-card-num">${String(num).padStart(2, '0')}</span>
                    <span class="work-card-cat">COMING SOON</span>
                </div>
                <h3 class="work-card-title" style="color: rgba(26,26,26,0.2);">TBD</h3>
            </div>
        </div>`;
}

// ══════════════════════════════════════════
// POPULATE INDEX.HTML WORK GRID
// ══════════════════════════════════════════
const workGrid = document.getElementById('workGrid');
if (workGrid) {
    fetchProjects().then(projects => {
        if (!projects || projects.length === 0) {
            // Firestore empty or unreachable — keep skeleton visible
            return;
        }

        // Render only up to first 4 on index.html (preview)
        const preview = projects.slice(0, 4);
        workGrid.innerHTML = preview.map((p, i) => buildCard(p, i)).join('');

        // Re-trigger reveal observer on new cards
        if (window.__revealObserver) {
            workGrid.querySelectorAll('[data-reveal]').forEach(el => {
                window.__revealObserver.observe(el);
            });
        }
    });
}

// ══════════════════════════════════════════
// POPULATE WORK.HTML ARCHIVE GRID
// ══════════════════════════════════════════
const archiveGrid = document.getElementById('archiveGrid');
if (archiveGrid) {
    fetchProjects().then(projects => {
        if (!projects) return;

        const TOTAL_SLOTS = 9;
        let html = projects.slice(0, TOTAL_SLOTS).map((p, i) => buildCard(p, i)).join('');

        // Fill remaining slots with placeholders
        for (let i = projects.length; i < TOTAL_SLOTS; i++) {
            html += buildPlaceholder(i + 1);
        }
        archiveGrid.innerHTML = html;

        if (window.__revealObserver) {
            archiveGrid.querySelectorAll('[data-reveal]').forEach(el => {
                window.__revealObserver.observe(el);
            });
        }
    });
}

// Export for use in project.html
export { fetchProjects };
