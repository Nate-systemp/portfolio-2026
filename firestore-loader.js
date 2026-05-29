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

const STATIC_PROJECTS = [
    {
        docId: "static-task-dashboard",
        order: 5,
        title: "VANTAGE",
        category: "WEB APP / REACT",
        type: "development",
        year: "2026",
        role: "Fullstack Developer",
        tech: "REACT, SUPABASE, JS",
        description: "A comprehensive task management system featuring real-time data synchronization and a highly responsive React-based interface.",
        liveUrl: "https://vantage-peach-ten.vercel.app/",
        gallery: ["assets/FB1.png", "assets/FB2.png", "assets/FB3.png"],
    },
    {
        docId: "static-gridsense-fst",
        order: 6,
        title: "GRIDSENSE AI",
        category: "UI/UX DESIGN / FIGMA",
        type: "development",
        year: "2026",
        role: "UI/UX Designer",
        tech: "FIGMA",
        description: "Figma Skill Test Assessment for Wellevate — a Junior UI/UX Designer application. Includes a full AI-powered energy analytics Dashboard and a responsive Landing Page for GridSense AI.",
        story: "Submitted as a Figma Skill Test (FST) for a Junior UI/UX Designer role at Wellevate. The brief required designing two core screens for GridSense AI: an analytics dashboard surfacing real-time grid data, and a marketing landing page communicating the product's value proposition. The design system was built from scratch — from color tokens and typography to component libraries — ensuring visual consistency across both deliverables.",
        gallery: ["assets/FST.png", "assets/FST1.png", "assets/FST2.png"],
    },
    {
        docId: "static-bcgi-casestudy",
        order: 7,
        title: "BCGI",
        category: "UX CASE STUDY",
        type: "casestudy",
        year: "2026",
        role: "UX/UI Designer",
        tech: "FIGMA, PHOTOSHOP, CANVA",
        description: "A self-initiated UX/UI redesign of The BlackCoders Group Inc.'s About page — improving visual hierarchy, readability, trust-building, and user experience.",
        casestudyId: "bcgi",
        gallery: ["assets/bcgi_aboutus.png"],
    },
    {
        docId: "static-merge-casestudy",
        order: 8,
        title: "MERGE",
        category: "UI/UX DESIGN",
        type: "casestudy",
        year: "2026",
        role: "UI/UX Designer",
        tech: "FIGMA, AFTER EFFECTS",
        description: "An elegant interactive macOS platform design and high-fidelity video demonstration showcasing refined aesthetic layouts.",
        casestudyId: "merge",
        gallery: ["assets/M01.png"],
    }
];

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
        
        // Merge static projects if they aren't already in the list by docId
        STATIC_PROJECTS.forEach(sp => {
            if (!projects.some(p => p.docId === sp.docId)) {
                projects.push(sp);
            }
        });

        // re-sort after merge
        return projects.sort((a, b) => (a.order || 99) - (b.order || 99));
    } catch (e) {
        console.warn('[Firestore Loader] Could not fetch projects:', e.message);
        return STATIC_PROJECTS; // Fallback to static if firestore fails
    }
}

/**
 * Build a single work card HTML string.
 */
function buildCard(project, index) {
    const sizeClass = CARD_SIZES[index % CARD_SIZES.length];
    const img = project.gallery?.[0] || '';
    const num = String(project.order || index + 1).padStart(2, '0');
    const projectType = project.type || 'development';
    
    // Route case study projects to casestudy.html, others to project.html
    const href = projectType === 'casestudy' 
        ? `casestudy.html?id=${encodeURIComponent(project.casestudyId || project.docId)}`
        : `project.html?docId=${encodeURIComponent(project.docId)}`;

    // Type badge label
    const typeBadge = projectType === 'casestudy' ? 'UX DESIGN' : 'DEVELOPMENT';

    return `
        <div class="work-card ${sizeClass}" data-reveal data-type="${projectType}">
            <a href="${href}" class="work-card-link">
                <div class="work-card-img-wrap">
                    <div class="work-card-img" style="background-image: url('${img}')"></div>
                    <span class="work-card-type-badge ${projectType === 'casestudy' ? 'badge-casestudy' : 'badge-dev'}">${typeBadge}</span>
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
 * Build a single skeleton card HTML string.
 */
function buildSkeletonCard(index) {
    const sizeClass = CARD_SIZES[index % CARD_SIZES.length];
    return `
        <div class="work-card ${sizeClass} is-skeleton">
            <div class="work-card-img-wrap skeleton"></div>
            <div class="work-card-info">
                <div class="work-card-top">
                    <span class="skeleton-text skeleton-num skeleton"></span>
                    <span class="skeleton-text skeleton-cat skeleton"></span>
                </div>
                <h3 class="skeleton-text skeleton-title skeleton"></h3>
            </div>
        </div>`;
}

/**
 * Populate a grid with skeletons.
 */
function populateSkeletons(container, count) {
    if (!container) return;
    let html = '';
    for (let i = 0; i < count; i++) {
        html += buildSkeletonCard(i);
    }
    container.innerHTML = html;
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
    // Show 4 skeletons initially
    populateSkeletons(workGrid, 4);

    fetchProjects().then(projects => {
        if (!projects || projects.length === 0) {
            // Keep skeletons or show error state if needed
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
    const TOTAL_SLOTS = 12;
    // Show 9 skeletons initially
    populateSkeletons(archiveGrid, TOTAL_SLOTS);

    fetchProjects().then(projects => {
        if (!projects) return;

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
