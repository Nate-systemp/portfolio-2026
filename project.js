/**
 * PROJECT PAGE — Editorial Script
 * Updated for the 'Classy' Redesign
 */


import { db } from './firebase-config.js';
import { doc, getDoc, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// ============================================
// THEME INIT 
// ============================================
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('night-mode');
}

const STATIC_PROJECTS = [
    {
        docId: "static-task-dashboard",
        order: 5,
        title: "VANTAGE",
        category: "WEB APP / REACT",
        year: "2026",
        role: "Fullstack Developer",
        tech: "REACT, SUPABASE, JS, Figma",
        description: "A full‑stack productivity platform that blends real‑time data sync with a meticulously crafted UI/UX. I designed intuitive navigation, micro‑interactions, and a dark‑mode aesthetic to boost usability while implementing robust backend services.",
        story: "The project showcases seamless integration of Supabase as a BaaS with a React front‑end, focusing on both functional performance and polished user experience. Features include drag‑and‑drop task boards, responsive layouts, and subtle animations that guide users through their workflow.",
        liveUrl: "https://vantage-peach-ten.vercel.app/",
        gallery: ["assets/FB1.png", "assets/FB2.png", "assets/FB3.png"],
    },
    {
        docId: "static-gridsense-fst",
        order: 6,
        title: "GRIDSENSE AI",
        category: "UI/UX DESIGN / FIGMA",
        year: "2026",
        role: "UI/UX Designer",
        tech: "FIGMA",
        description: "Figma Skill Test Assessment for Wellevate — a Junior UI/UX Designer application. Includes a full AI-powered energy analytics Dashboard and a responsive Landing Page for GridSense AI.",
        story: "Submitted as a Figma Skill Test (FST) for a Junior UI/UX Designer role at Wellevate. The brief required designing two core screens for GridSense AI: an analytics dashboard surfacing real-time grid data, and a marketing landing page communicating the product's value proposition. The design system was built from scratch — from color tokens and typography to component libraries — ensuring visual consistency across both deliverables.",
        gallery: ["assets/FST.png", "assets/FST1.png", "assets/FST2.png"],
    }
];


// ============================================
// DATA INJECTION (Firestore)
// ============================================
async function populate() {
    try {
        const params = new URLSearchParams(window.location.search);
        let docId = params.get("docId");
        
        let allProjects = [];
        try {
            // Let's get all projects directly sorted by order to figure out nextProject logic too
            const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
            const snapAll = await getDocs(q);
            snapAll.forEach(d => allProjects.push({ docId: d.id, ...d.data() }));
        } catch (err) {
            console.warn("Firestore fetch failed, using static fallback.");
        }

        // Merge static projects
        STATIC_PROJECTS.forEach(sp => {
            if (!allProjects.some(p => p.title === sp.title)) {
                allProjects.push(sp);
            }
        });
        allProjects.sort((a, b) => (a.order || 99) - (b.order || 99));

        if (allProjects.length === 0) {
            console.error("No projects in database.");
            return;
        }

        // If no docId in URL (or invalid), fallback to the first project in the sorted list
        let project = allProjects.find(p => p.docId === docId);
        if (!project) {
            project = allProjects[0];
            docId = project.docId;
        }

        console.log("Populating project:", project);

        // Basic Info - using a helper to avoid script halt
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.textContent = val;
        };

        const num = String(project.order || allProjects.indexOf(project) + 1).padStart(2, '0');

        document.title = `${project.title || 'Untitled'} — Nathan Portfolio`;
        setVal("projectNum", num);
        setVal("projectTitle", project.title);
        setVal("projectCat", project.category);
        setVal("projectYear", project.year);
        setVal("projectRole", project.role || "Designer");
        setVal("projectTech", project.tech || "Figma");
        setVal("projectDesc", project.description);
        setVal("projectStory", project.story);

        // Hero Image
        const heroImg = document.getElementById("heroImg");
        if (heroImg && project.gallery && project.gallery[0]) {
            heroImg.style.backgroundImage = `url('${project.gallery[0]}')`;
        }

        // Gallery Images
        if (project.gallery) {
            project.gallery.forEach((src, i) => {
                const imgEl = document.getElementById(`galleryImg${i+1}`);
                if (imgEl) imgEl.style.backgroundImage = `url('${src}')`;
            });
        }

        // Populate project links (live demo / source code)
        const liveLink = document.getElementById('projectLiveLink');
        const sourceLink = document.getElementById('projectSourceLink');

        if (liveLink && project.liveUrl) {
            liveLink.href = project.liveUrl;
            liveLink.style.display = 'inline-flex';
        }
        if (sourceLink && project.sourceUrl) {
            sourceLink.href = project.sourceUrl;
            sourceLink.style.display = 'inline-flex';
        }

        // Store liveUrl on share button for the share feature
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn && project.liveUrl) {
            shareBtn.dataset.liveUrl = project.liveUrl;
        }

        // Initialize Lightbox now that images exist
        initLightbox();

        // Next Project Logic
        let currIdx = allProjects.findIndex(p => p.docId === docId);
        let nextProj = allProjects[(currIdx + 1) % allProjects.length];
        
        const nextLink = document.getElementById("nextProject");
        const nextTitle = document.getElementById("nextTitle");
        const nextImg = document.getElementById("nextImg");

        if (nextLink && nextProj) {
            nextLink.href = `project.html?docId=${nextProj.docId}`;
            nextTitle.textContent = nextProj.title;
            if (nextProj.gallery && nextProj.gallery[0]) {
                nextImg.style.backgroundImage = `url('${nextProj.gallery[0]}')`;
            }
        }
    } catch (e) {
        console.error("Population error:", e);
    }
}
populate();

// ============================================
// REVEAL ON SCROLL ENGINE
// ============================================
(function() {
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
  
    // Reveal everything quickly
    setTimeout(() => {
        revealElements.forEach(el => el.classList.add('revealed'));
        const hero = document.getElementById('hero-section');
        if (hero) hero.classList.add('revealed');
    }, 400);
})();

// CUSTOM CURSOR REMOVED

// ============================================
// MAGNETIC EFFECTS
// ============================================
(function() {
    const magnets = document.querySelectorAll('.project-back-link, .next-circle-badge');
    
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
    const overlay = document.getElementById('lightboxOverlay');
    const img = document.getElementById('lightboxImage');
    const close = document.getElementById('lightboxClose');

    if (!overlay || !img || !close) return;

    // Reset old listeners if called multiple times
    const galleryItems = document.querySelectorAll('.p-gallery-item');
    
    galleryItems.forEach(item => {
        item.onclick = () => {
            const bg = item.querySelector('.p-gallery-img').style.backgroundImage;
            const url = bg.replace('url("', '').replace('")', '');
            img.src = url;
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        };
    });

    close.onclick = () => {
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };
    overlay.onclick = (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-backdrop')) {
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    };

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// ============================================
// PROJECT SHARE FEATURE
// ============================================
(function() {
    const btn = document.getElementById('shareBtn');
    if (!btn) return;
    const tooltip = btn.querySelector('.share-tooltip');
    
    btn.addEventListener('click', async () => {
        try {
            // Copy the project's live URL if available, otherwise copy the current page URL
            const urlToCopy = btn.dataset.liveUrl || window.location.href;
            await navigator.clipboard.writeText(urlToCopy);
            btn.classList.add('copied');
            if (tooltip) tooltip.textContent = 'COPIED!';
            
            setTimeout(() => {
                btn.classList.remove('copied');
                if (tooltip) tooltip.textContent = 'COPY LINK';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    });
})();

// ============================================
// LINE REVEAL UTILITY (Local version for project page)
// ============================================
function initLineReveal() {
  const lineRevealElements = document.querySelectorAll('[data-reveal-line]');
  lineRevealElements.forEach(el => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(line => 
      `<span class="line-reveal-wrap"><span class="line-reveal-item">${line.trim()}</span></span>`
    ).join('');
    el.setAttribute('data-reveal', '');
  });
}
initLineReveal();
