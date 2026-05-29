import { auth, db } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
    collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// ══════════════════════════════════════════════
// DOM REFS
// ══════════════════════════════════════════════
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const addProjectBtn = document.getElementById('addProjectBtn');
const modalOverlay = document.getElementById('modalOverlay');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const saveProjectBtn = document.getElementById('saveProjectBtn');
const projectGrid = document.getElementById('projectGrid');
const toast = document.getElementById('toast');
const themeToggle = document.getElementById('themeToggle');

// New Modal Form Fields
const fType = document.getElementById('fType');
const fCasestudyId = document.getElementById('fCasestudyId');
const casestudyIdField = document.getElementById('casestudyIdField');

let allProjects = [];

// ══════════════════════════════════════════════
// 1. THEME SUPPORT
// ══════════════════════════════════════════════
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('night-mode');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('night-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ══════════════════════════════════════════════
// 2. AUTH STATE
// ══════════════════════════════════════════════
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        document.getElementById('userEmail').textContent = user.email;
        loadProjects();
    } else {
        loginSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
    }
});

loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
        showError('Please enter email and password.');
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginError.style.display = 'none';
    } catch (e) {
        showError('Login failed: ' + e.message);
    }
});

logoutBtn.addEventListener('click', () => signOut(auth));

function showError(msg) {
    loginError.textContent = msg;
    loginError.style.display = 'block';
}

// ══════════════════════════════════════════════
// 3. LOAD PROJECTS FROM FIRESTORE
// ══════════════════════════════════════════════
async function loadProjects() {
    try {
        const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        allProjects = [];
        snapshot.forEach(d => allProjects.push({ docId: d.id, ...d.data() }));
        renderProjects();
        updateStats();
    } catch (e) {
        projectGrid.innerHTML = `<p style="font-family:monospace;color:#C45D3E;font-size:12px;padding:24px;">Error loading projects: ${e.message}</p>`;
    }
}

// ══════════════════════════════════════════════
// SEED DATA — Existing and missing projects
// ══════════════════════════════════════════════
const SEED_PROJECTS = [
    {
        order: 1,
        title: "FRACT ERA",
        category: "GAME DESIGN",
        type: "development",
        year: "2026",
        role: "Lead Game Design",
        tech: "GameMaker, Figma",
        description: "An ancient-futuristic math puzzle adventure that explores procedural narrative and brutalist aesthetics.",
        story: "Inspired by the architectural geometry of the 80s sci-fi, Fract Era was a challenge in balancing education with atmosphere. We developed a custom shader system to give every level a unique, shifting mood.",
        gallery: ["assets/FRACERA3.webp", "assets/FRACERA1.webp", "assets/FRACERA2.webp"],
    },
    {
        order: 2,
        title: "SWIVEL QUIVER",
        category: "GAME DESIGN",
        type: "development",
        year: "2024",
        role: "Developer",
        tech: "ASENPRITE, LUA",
        description: "A fast-paced, high-precision one-button archery game built for immediate accessibility.",
        story: "The challenge was simplicity. How do we make one button feel like a dozen different actions? Through variable timing and momentum-based physics, we created a game that's easy to learn but hard to master.",
        gallery: ["assets/SQ1.webp", "assets/SQ2.webp", "assets/SQ3.webp"],
    },
    {
        order: 3,
        title: "OUTFALL",
        category: "TTRPG DESIGN",
        type: "development",
        year: "2025",
        role: "Rulebook Author",
        tech: "Adobe InDesign",
        description: "A post-apocalyptic tabletop RPG system focused on resource management and moral ambiguity.",
        story: "Design wasn't just about graphics; it was about systems. We spent months testing the 'Strain' mechanic to ensure that every choice a player makes carries heavy narrative weight.",
        gallery: ["assets/OF1.webp", "assets/OF2.webp", "assets/OF3.webp"],
    },
    {
        order: 8,
        title: "MERGE",
        category: "UI/UX DESIGN",
        type: "casestudy",
        year: "2026",
        role: "UI/UX Designer",
        tech: "FIGMA",
        description: "A personal desktop platform design concept and interactive video demonstration showcase.",
        story: "A self-initiated personal UI/UX design project for MERGE, a high-fidelity desktop platform concept. Designed entirely by me, this project focuses on clean dark mode layouts, structured information displays, and interactive mockups.",
        casestudyId: "merge",
        gallery: ["assets/M01.png"],
    },
    {
        order: 5,
        title: "VANTAGE",
        category: "WEB APP / REACT",
        type: "development",
        year: "2026",
        role: "Fullstack Developer",
        tech: "REACT, SUPABASE, JS",
        description: "A comprehensive task management system featuring real-time data synchronization and a highly responsive React-based interface.",
        story: "This project explores the integration of Supabase as a backend-as-a-service with a React frontend. The goal was to create a seamless, real-time collaboration tool where task updates are reflected instantly across all connected clients without page reloads.",
        liveUrl: "https://vantage-peach-ten.vercel.app/",
        gallery: ["assets/FB1.png", "assets/FB2.png", "assets/FB3.png"],
    },
    {
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
        order: 7,
        title: "BCGI",
        category: "UX CASE STUDY",
        type: "casestudy",
        year: "2026",
        role: "UX/UI Designer",
        tech: "FIGMA, PHOTOSHOP, CANVA",
        description: "A self-initiated UX/UI redesign of The BlackCoders Group Inc.'s About page — improving visual hierarchy, readability, trust-building, and user experience.",
        story: "A self-initiated UX/UI redesign of The BlackCoders Group Inc.'s About page focused on improving visual hierarchy, readability, trust-building, and overall user experience. This conceptual redesign was created to analyze usability issues within the existing interface and propose a cleaner, more modern, and conversion-focused experience for potential clients and visitors.",
        casestudyId: "bcgi",
        gallery: ["assets/bcgi_aboutus.png"],
    }
];

async function seedProjects() {
    const btn = document.getElementById('seedBtn');
    if (btn) { btn.textContent = 'IMPORTING...'; btn.disabled = true; }

    try {
        let count = 0;
        for (const p of SEED_PROJECTS) {
            const exists = allProjects.some(x => x.title === p.title);
            if (!exists) {
                await addDoc(collection(db, 'projects'), {
                    ...p,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                count++;
            }
        }
        showToast(`${count} project(s) imported successfully ✓`);
        loadProjects();
    } catch (e) {
        showToast('Import failed: ' + e.message, true);
    }
}

async function seedVantage() {
    try {
        const vantage = SEED_PROJECTS.find(p => p.title === "VANTAGE");
        if (!vantage) return;

        await addDoc(collection(db, 'projects'), {
            ...vantage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        showToast('Vantage imported successfully ✓');
        loadProjects();
    } catch (e) {
        showToast('Import failed: ' + e.message, true);
    }
}

async function seedGridsense() {
    try {
        const gridsense = SEED_PROJECTS.find(p => p.title === "GRIDSENSE AI");
        if (!gridsense) return;

        await addDoc(collection(db, 'projects'), {
            ...gridsense,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        showToast('GridSense AI imported successfully ✓');
        loadProjects();
    } catch (e) {
        showToast('Import failed: ' + e.message, true);
    }
}

async function seedBcgi() {
    try {
        const bcgi = SEED_PROJECTS.find(p => p.title === "BCGI");
        if (!bcgi) return;

        await addDoc(collection(db, 'projects'), {
            ...bcgi,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        showToast('BCGI imported successfully ✓');
        loadProjects();
    } catch (e) {
        showToast('Import failed: ' + e.message, true);
    }
}

async function seedMerge() {
    try {
        const mergeProj = SEED_PROJECTS.find(p => p.title === "MERGE");
        if (!mergeProj) return;

        await addDoc(collection(db, 'projects'), {
            ...mergeProj,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        showToast('MERGE imported successfully ✓');
        loadProjects();
    } catch (e) {
        showToast('Import failed: ' + e.message, true);
    }
}

window.seedProjects = seedProjects;
window.seedVantage = seedVantage;
window.seedGridsense = seedGridsense;
window.seedBcgi = seedBcgi;
window.seedMerge = seedMerge;

// ══════════════════════════════════════════════
// 4. RENDER PROJECTS
// ══════════════════════════════════════════════
function renderProjects() {
    if (allProjects.length === 0) {
        projectGrid.innerHTML = `
            <div style="padding:60px 40px;border:2px dashed var(--line);text-align:center;border-radius:6px;">
                <p style="font-family:'Space Mono',monospace;font-size:13px;color:var(--muted);margin-bottom:24px;">Your Firestore database is empty.</p>
                <button id="seedBtn" class="btn btn-primary" onclick="seedProjects()">↓ IMPORT INITIAL PROJECTS</button>
            </div>`;
        return;
    }

    // Sync banners for static projects if missing
    const hasVantage = allProjects.some(p => p.title === "VANTAGE");
    const hasGridsense = allProjects.some(p => p.title === "GRIDSENSE AI");
    const hasBcgi = allProjects.some(p => p.title === "BCGI");
    const hasMerge = allProjects.some(p => p.title === "MERGE");
    
    let syncHtml = '';
    if (!hasVantage) {
        syncHtml += `
            <div class="sync-banner">
                <div class="sync-info">
                    <span class="sync-title">NEW PROJECT DETECTED: VANTAGE</span>
                    <span class="sync-desc">Not found in your live Firestore database.</span>
                </div>
                <button class="btn btn-primary" onclick="seedVantage()" style="padding:8px 16px;">IMPORT TO DATABASE</button>
            </div>
        `;
    }
    if (!hasGridsense) {
        syncHtml += `
            <div class="sync-banner">
                <div class="sync-info">
                    <span class="sync-title">NEW PROJECT DETECTED: GRIDSENSE AI</span>
                    <span class="sync-desc">Not found in your live Firestore database.</span>
                </div>
                <button class="btn btn-primary" onclick="seedGridsense()" style="padding:8px 16px;">IMPORT TO DATABASE</button>
            </div>
        `;
    }
    if (!hasBcgi) {
        syncHtml += `
            <div class="sync-banner">
                <div class="sync-info">
                    <span class="sync-title">NEW CASE STUDY DETECTED: BCGI</span>
                    <span class="sync-desc">Not found in your live Firestore database.</span>
                </div>
                <button class="btn btn-primary" onclick="seedBcgi()" style="padding:8px 16px;">IMPORT TO DATABASE</button>
            </div>
        `;
    }
    if (!hasMerge) {
        syncHtml += `
            <div class="sync-banner">
                <div class="sync-info">
                    <span class="sync-title">NEW CASE STUDY DETECTED: MERGE</span>
                    <span class="sync-desc">Not found in your live Firestore database.</span>
                </div>
                <button class="btn btn-primary" onclick="seedMerge()" style="padding:8px 16px;">IMPORT TO DATABASE</button>
            </div>
        `;
    }

    projectGrid.innerHTML = syncHtml + allProjects.map(p => {
        const isCaseStudy = p.type === 'casestudy';
        const typeBadge = isCaseStudy 
            ? `<span class="project-badge badge-casestudy">UX DESIGN</span>`
            : `<span class="project-badge badge-dev">DEV</span>`;
            
        return `
            <div class="project-row">
                <span class="project-row-num">${String(p.order || '—').padStart(2, '0')}</span>
                <img class="project-row-thumb" src="${p.gallery?.[0] || ''}" alt="${p.title}" onerror="this.style.background='var(--line)';this.src='';">
                <div>
                    <div class="project-row-title">${p.title} ${typeBadge}</div>
                    <div class="project-row-cat">${p.category || ''}</div>
                </div>
                <span class="project-row-cat">${p.tech || '—'}</span>
                <span class="project-row-year">${p.year || '—'}</span>
                <div class="project-row-actions">
                    <button class="btn btn-ghost" onclick="openEdit('${p.docId}')">EDIT</button>
                    <button class="btn btn-danger" onclick="deleteProject('${p.docId}', '${p.title}')">DELETE</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const total = allProjects.length;
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statSlots').textContent = 12;
    document.getElementById('statAvail').textContent = Math.max(0, 12 - total);
}

// ══════════════════════════════════════════════
// 5. MODAL — ADD / EDIT
// ══════════════════════════════════════════════
addProjectBtn.addEventListener('click', () => openModal());
cancelModalBtn.addEventListener('click', () => closeModal());

// Toggle Case Study ID visibility dynamically
fType.addEventListener('change', () => {
    if (fType.value === 'casestudy') {
        casestudyIdField.style.display = 'block';
    } else {
        casestudyIdField.style.display = 'none';
        fCasestudyId.value = '';
    }
});

function openModal(docId = null) {
    clearForm();
    document.getElementById('modalTitle').textContent = docId ? 'Edit Project' : 'Add Project';
    document.getElementById('editDocId').value = docId || '';

    if (docId) {
        const p = allProjects.find(x => x.docId === docId);
        if (!p) return;
        document.getElementById('fTitle').value = p.title || '';
        document.getElementById('fCategory').value = p.category || '';
        document.getElementById('fYear').value = p.year || '';
        document.getElementById('fRole').value = p.role || '';
        document.getElementById('fTech').value = p.tech || '';
        document.getElementById('fOrder').value = p.order || '';
        document.getElementById('fDescription').value = p.description || '';
        document.getElementById('fStory').value = p.story || '';
        document.getElementById('fLiveUrl').value = p.liveUrl || '';
        document.getElementById('fSourceUrl').value = p.sourceUrl || '';
        
        // Load custom fields
        fType.value = p.type || 'development';
        fCasestudyId.value = p.casestudyId || '';
        if (fType.value === 'casestudy') {
            casestudyIdField.style.display = 'block';
        } else {
            casestudyIdField.style.display = 'none';
        }

        // Gallery
        const imgs = document.querySelectorAll('.gallery-img');
        (p.gallery || []).forEach((src, i) => {
            if (imgs[i]) imgs[i].value = src;
        });
    }

    modalOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function clearForm() {
    ['fTitle', 'fCategory', 'fYear', 'fRole', 'fTech', 'fOrder', 'fDescription', 'fStory', 'fLiveUrl', 'fSourceUrl', 'fCasestudyId'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    fType.value = 'development';
    casestudyIdField.style.display = 'none';
    document.querySelectorAll('.gallery-img').forEach(i => i.value = '');
    document.getElementById('editDocId').value = '';
}

// expose to onclick attributes
window.openEdit = (docId) => openModal(docId);

// ══════════════════════════════════════════════
// 6. SAVE PROJECT (add or update)
// ══════════════════════════════════════════════
saveProjectBtn.addEventListener('click', async () => {
    const title = document.getElementById('fTitle').value.trim();
    const category = document.getElementById('fCategory').value.trim();
    const description = document.getElementById('fDescription').value.trim();
    const type = fType.value;
    const casestudyId = fCasestudyId.value.trim();

    if (!title || !category || !description) {
        showToast('Title, category, and description are required!', true);
        return;
    }

    if (type === 'casestudy' && !casestudyId) {
        showToast('Case Study ID is required for UX Case Studies!', true);
        return;
    }

    saveProjectBtn.disabled = true;
    saveProjectBtn.textContent = 'SAVING...';

    try {
        const gallery = Array.from(document.querySelectorAll('.gallery-img'))
            .map(i => i.value.trim())
            .filter(v => v !== '');

        const data = {
            title: title.toUpperCase(),
            category: category.toUpperCase(),
            type,
            casestudyId: type === 'casestudy' ? casestudyId : '',
            year: document.getElementById('fYear').value.trim() || new Date().getFullYear().toString(),
            role: document.getElementById('fRole').value.trim(),
            tech: document.getElementById('fTech').value.trim(),
            order: parseInt(document.getElementById('fOrder').value) || allProjects.length + 1,
            description,
            story: document.getElementById('fStory').value.trim(),
            liveUrl: document.getElementById('fLiveUrl').value.trim(),
            sourceUrl: document.getElementById('fSourceUrl').value.trim(),
            gallery,
            updatedAt: new Date().toISOString()
        };

        const docId = document.getElementById('editDocId').value;
        if (docId) {
            await updateDoc(doc(db, 'projects', docId), data);
            showToast('Project updated ✓');
        } else {
            data.createdAt = new Date().toISOString();
            await addDoc(collection(db, 'projects'), data);
            showToast('Project added ✓');
        }

        closeModal();
        loadProjects();
    } catch (e) {
        showToast('Error: ' + e.message, true);
    } finally {
        saveProjectBtn.disabled = false;
        saveProjectBtn.textContent = 'SAVE PROJECT';
    }
});

// ══════════════════════════════════════════════
// 7. DELETE PROJECT
// ══════════════════════════════════════════════
window.deleteProject = async (docId, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
        await deleteDoc(doc(db, 'projects', docId));
        showToast(`"${title}" deleted.`);
        loadProjects();
    } catch (e) {
        showToast('Error: ' + e.message, true);
    }
};

// ══════════════════════════════════════════════
// 8. TOAST NOTIFICATION
// ══════════════════════════════════════════════
function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.className = 'toast show ' + (isError ? 'error' : 'success');
    setTimeout(() => toast.className = 'toast', 3000);
}
