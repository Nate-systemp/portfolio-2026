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

let allProjects = [];

// ══════════════════════════════════════════════
// 1. AUTH STATE
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
// 2. LOAD PROJECTS FROM FIRESTORE
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
        projectGrid.innerHTML = `<p style="font-family:monospace;color:#C45D3E;">Error: ${e.message}</p>`;
    }
}

// ══════════════════════════════════════════════
// SEED DATA — Existing projects from project.js
// ══════════════════════════════════════════════
const SEED_PROJECTS = [
    {
        order: 1,
        title: "FRACT ERA",
        category: "GAME DESIGN",
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
        year: "2025",
        role: "Rulebook Author",
        tech: "Adobe InDesign",
        description: "A post-apocalyptic tabletop RPG system focused on resource management and moral ambiguity.",
        story: "Design wasn't just about graphics; it was about systems. We spent months testing the 'Strain' mechanic to ensure that every choice a player makes carries heavy narrative weight.",
        gallery: ["assets/OF1.webp", "assets/OF2.webp", "assets/OF3.webp"],
    },
    {
        order: 4,
        title: "MERGE",
        category: "WEB DESIGN / DEV",
        year: "2026",
        role: "Frontend Dev",
        tech: "HTML, CSS, JS",
        description: "A premium streetwear e-commerce platform focusing on minimalist UI and high-impact product photography.",
        story: "For Merge, the goal was to create a digital shopping experience that reflected the brand's aesthetic. We focused on micro-interactions and smooth transitions to keep the customer engaged throughout the journey.",
        gallery: ["assets/M01.png", "assets/M02.png", "assets/M03.png"],
    },
    {
        order: 5,
        title: "VANTAGE",
        category: "WEB APP / REACT",
        year: "2026",
        role: "Fullstack Developer",
        tech: "REACT, SUPABASE, JS",
        description: "A comprehensive task management system featuring real-time data synchronization and a highly responsive React-based interface.",
        story: "This project explores the integration of Supabase as a backend-as-a-service with a React frontend. The goal was to create a seamless, real-time collaboration tool where task updates are reflected instantly across all connected clients without page reloads.",
        liveUrl: "https://vantage-peach-ten.vercel.app/",
        gallery: ["assets/FB1.png", "assets/FB2.png", "assets/FB3.png"],
    }
];

async function seedProjects() {
    const btn = document.getElementById('seedBtn');
    if (btn) { btn.textContent = 'IMPORTING...'; btn.disabled = true; }

    try {
        for (const p of SEED_PROJECTS) {
            await addDoc(collection(db, 'projects'), {
                ...p,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        showToast('4 projects imported successfully ✓');
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

window.seedProjects = seedProjects;
window.seedVantage = seedVantage;

// ══════════════════════════════════════════════
// 3. RENDER PROJECTS
// ══════════════════════════════════════════════
function renderProjects() {
    if (allProjects.length === 0) {
        projectGrid.innerHTML = `
            <div style="padding:40px;border:1px dashed rgba(26,26,26,0.2);text-align:center;">
                <p style="font-family:'Space Mono',monospace;font-size:13px;color:#8A8580;margin-bottom:24px;">Your Firestore database is empty.</p>
                <button id="seedBtn" class="btn btn-primary" onclick="seedProjects()">↓ IMPORT INITIAL PROJECTS (FRACT ERA, SWIVEL QUIVER, OUTFALL, MERGE, VANTAGE)</button>
            </div>`;
        return;
    }

    // If projects exist, offer a way to sync missing static projects
    const hasVantage = allProjects.some(p => p.title === "VANTAGE");
    let syncHtml = '';
    if (!hasVantage) {
        syncHtml = `
            <div style="margin-bottom:24px; padding:16px; background:rgba(196,93,62,0.05); border-left:4px solid var(--terra); display:flex; justify-content:space-between; align-items:center;">
                <p style="font-family:var(--font-mono); font-size:11px;">NEW PROJECT DETECTED: <b>VANTAGE</b></p>
                <button class="btn btn-primary" onclick="seedVantage()" style="padding:8px 16px;">IMPORT TO DATABASE</button>
            </div>
        `;
    }

    projectGrid.innerHTML = syncHtml + allProjects.map(p => `
        <div class="project-row">
            <span class="project-row-num">${String(p.order || '—').padStart(2, '0')}</span>
            <img class="project-row-thumb" src="${p.gallery?.[0] || ''}" alt="${p.title}" onerror="this.style.background='#eee';this.src='';">
            <div>
                <div class="project-row-title">${p.title}</div>
                <div class="project-row-cat">${p.category || ''}</div>
            </div>
            <span class="project-row-cat">${p.tech || '—'}</span>
            <span class="project-row-year">${p.year || '—'}</span>
            <div class="project-row-actions">
                <button class="btn btn-ghost" onclick="openEdit('${p.docId}')">EDIT</button>
                <button class="btn btn-danger" onclick="deleteProject('${p.docId}', '${p.title}')">DELETE</button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const total = allProjects.length;
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statAvail').textContent = Math.max(0, 9 - total);
}

// ══════════════════════════════════════════════
// 4. MODAL — ADD / EDIT
// ══════════════════════════════════════════════
addProjectBtn.addEventListener('click', () => openModal());
cancelModalBtn.addEventListener('click', () => closeModal());

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
    ['fTitle','fCategory','fYear','fRole','fTech','fOrder','fDescription','fStory','fLiveUrl','fSourceUrl'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.querySelectorAll('.gallery-img').forEach(i => i.value = '');
    document.getElementById('editDocId').value = '';
}

// expose to onclick attributes
window.openEdit = (docId) => openModal(docId);

// ══════════════════════════════════════════════
// 5. SAVE PROJECT (add or update)
// ══════════════════════════════════════════════
saveProjectBtn.addEventListener('click', async () => {
    const title = document.getElementById('fTitle').value.trim();
    const category = document.getElementById('fCategory').value.trim();
    const description = document.getElementById('fDescription').value.trim();

    if (!title || !category || !description) {
        showToast('Title, category, and description are required!', true);
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
            year: document.getElementById('fYear').value.trim() || new Date().getFullYear().toString(),
            role: document.getElementById('fRole').value.trim(),
            tech: document.getElementById('fTech').value.trim(),
            order: parseInt(document.getElementById('fOrder').value) || allProjects.length + 1,
            description: document.getElementById('fDescription').value.trim(),
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
// 6. DELETE PROJECT
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
// 7. TOAST NOTIFICATION
// ══════════════════════════════════════════════
function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.className = 'toast show' + (isError ? '' : ' success');
    setTimeout(() => toast.className = 'toast', 3000);
}
