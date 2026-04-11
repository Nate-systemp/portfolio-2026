/**
 * PROJECT PAGE — Editorial Script
 * Updated for the 'Classy' Redesign
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

import { db } from './firebase-config.js';
import { doc, getDoc, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// ============================================
// THEME INIT 
// ============================================
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('night-mode');
}

// ============================================
// DATA INJECTION (Firestore)
// ============================================
async function populate() {
    try {
        const params = new URLSearchParams(window.location.search);
        let docId = params.get("docId");
        
        // Let's get all projects directly sorted by order to figure out nextProject logic too
        const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
        const snapAll = await getDocs(q);
        let allProjects = [];
        snapAll.forEach(d => allProjects.push({ docId: d.id, ...d.data() }));

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

// ============================================
// CUSTOM CURSOR
// ============================================
(function() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    // Ensure cursor doesn't block interactions
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
    const hoverables = document.querySelectorAll('a, button, .p-gallery-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();

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
            await navigator.clipboard.writeText(window.location.href);
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
