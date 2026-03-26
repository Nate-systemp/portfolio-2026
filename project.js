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
// GLOBAL STATE & DATA
// ============================================
const projects = [
    {
        id: 1,
        num: "01",
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
        id: 2,
        num: "02",
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
        id: 3,
        num: "03",
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
        id: 4,
        num: "04",
        title: "MERGE",
        category: "WEB DESIGN / DEV",
        year: "2026",
        role: "Frontend Dev",
        tech: "HTML, CSS, JS",
        description: "A premium streetwear e-commerce platform focusing on minimalist UI and high-impact product photography.",
        story: "For Merge, the goal was to create a digital shopping experience that reflected the brand's aesthetic. We focused on micro-interactions and smooth transitions to keep the customer engaged throughout the journey.",
        gallery: ["assets/M01.png", "assets/M02.png", "assets/M03.png"],
    }
];

// Fallback for missing projects
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id")) || 1;
const project = projects.find(p => p.id === id) || projects[0];

// ============================================
// DATA INJECTION (with robustness)
// ============================================
(function populate() {
    try {
        console.log("Populating project:", project);
        // Basic Info - using a helper to avoid script halt
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.textContent = val;
        };

        document.title = `${project.title} — Nathan Portfolio`;
        setVal("projectNum", project.num);
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

        // Next Project
        const nextIdx = (projects.findIndex(p => p.id === project.id) + 1) % projects.length;
        const nextProj = projects[nextIdx];
        const nextLink = document.getElementById("nextProject");
        const nextTitle = document.getElementById("nextTitle");
        const nextImg = document.getElementById("nextImg");

        if (nextLink && nextProj) {
            nextLink.href = `project.html?id=${nextProj.id}`;
            nextTitle.textContent = nextProj.title;
            if (nextProj.gallery && nextProj.gallery[0]) {
                nextImg.style.backgroundImage = `url('${nextProj.gallery[0]}')`;
            }
        }
    } catch (e) {
        console.error("Population error:", e);
    }
})();

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
(function() {
    const overlay = document.getElementById('lightboxOverlay');
    const img = document.getElementById('lightboxImage');
    const close = document.getElementById('lightboxClose');

    if (!overlay || !img || !close) return;

    document.querySelectorAll('.p-gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const bg = item.querySelector('.p-gallery-img').style.backgroundImage;
            const url = bg.replace('url("', '').replace('")', '');
            img.src = url;
            overlay.classList.add('active');
        });
    });

    close.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-backdrop')) {
            overlay.classList.remove('active');
        }
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') overlay.classList.remove('active');
    });
})();
