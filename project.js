/**
 * PROJECT PAGE — Editorial Portfolio
 * Clean vanilla scripts.
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

const smoothScroll = new SmoothScroll({ ease: 0.08, wheelMultiplier: 1 });

// ============================================
// GLOBAL STATE
// ============================================
let scrollY = 0;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      scrollY = window.scrollY;
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ============================================
// DATA & POPULATION
// ============================================
const projects = [
    {
        id: 1,
        num: "01",
        title: "FRACT ERA",
        category: "GAME DESIGN",
        year: "2025",
        description: "A math game puzzle for the elementary school students designed for a thesis project for the Math Majors.",
        story: "The game is a 2D puzzle game where the player has to solve math problems to progress through the game. The game is designed to be fun and educational, and it is suitable for children aged 6-12.",
        gallery: ["assets/FRACERA1.webp", "assets/FRACERA2.webp", "assets/FRACERA3.webp"],
    },
    {
        id: 2,
        num: "02",
        title: "SWIVEL QUIVER",
        category: "GAME DESIGN",
        year: "2024",
        description: "A 2D one-button archery game where the player has to shoot arrows at targets to progress through the game.",
        story: "Built from scratch using aspire, this project required handling complex database relationships and real-time updates.",
        gallery: ["assets/SQ1.webp", "assets/SQ2.webp", "assets/SQ3.webp"],
    },
    {
        id: 3,
        num: "03",
        title: "OUTFALL",
        category: "GAME DESIGN",
        year: "2025",
        description: "A TTRPG Game Design for the Game Design and Development Class.",
        story: "Outfall is a post-apocalyptic TTRPG where players take on the role of survivors in a world ravaged by a mysterious plague.",
        gallery: ["assets/OF1.webp", "assets/OF2.webp", "assets/OF3.webp"],
    },
    {
        id: 4,
        num: "04",
        title: "MERGE",
        category: "WEB DESIGN / DEVELOPMENT",
        year: "2026",
        description: "Merge is an e-commerce platform for a Street Wear Clothes",
        story: "Merge is a web application that allows users to purchase clothing from various brands. It is a platform that allows users to purchase clothing from various brands.",
        gallery: ["assets/M01.png", "assets/M02.png", "assets/M03.png"],
    },
    {
        id: 5,
        num: "05",
        title: "PROJECT FIVE",
        category: "DIGITAL POSTER",
        year: "2024",
        description: "A detailed description of Project Five.",
        story: "The story behind Project Five.",
        gallery: [],
    },
    {
        id: 6,
        num: "06",
        title: "PROJECT SIX",
        category: "UI/UX DESIGN",
        year: "2025",
        description: "A detailed description of Project Six.",
        story: "The story behind Project Six.",
        gallery: [],
    },
    {
        id: 7,
        num: "07",
        title: "PROJECT SEVEN",
        category: "WEB DEVELOPMENT",
        year: "2024",
        description: "A detailed description of Project Seven.",
        story: "The story behind Project Seven.",
        gallery: [],
    },
    {
        id: 8,
        num: "08",
        title: "PROJECT EIGHT",
        category: "APP DEVELOPMENT",
        year: "2024",
        description: "A detailed description of Project Eight.",
        story: "The story behind Project Eight.",
        gallery: [],
    },
    {
        id: 9,
        num: "09",
        title: "PROJECT NINE",
        category: "GAME DESIGN",
        year: "2025",
        description: "A detailed description of Project Nine.",
        story: "The story behind Project Nine.",
        gallery: [],
    }
];

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id")) || 1;
const currentIndex = projects.findIndex(p => p.id === id);
const project = currentIndex !== -1 ? projects[currentIndex] : projects[0];

// Populate Content
document.getElementById("projectNum").textContent = project.num;
document.getElementById("projectTitle").textContent = project.title;
document.getElementById("projectCat").textContent = project.category;
document.getElementById("projectYear").textContent = project.year;
document.getElementById("projectDesc").textContent = project.description;
document.getElementById("projectStory").textContent = project.story;

// Update page title
document.title = `${project.title} — Nate`;

const galleryGrid = document.getElementById("projectGallery");
if (galleryGrid && project.gallery && project.gallery.length > 0) {
    galleryGrid.innerHTML = "";
    project.gallery.forEach((src, i) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.setAttribute("data-reveal", "scale");
        item.style.backgroundImage = `url('${src}')`;
        item.style.transitionDelay = `${i * 0.1}s`;
        galleryGrid.appendChild(item);
    });
} else if (galleryGrid) {
    const label = document.querySelector(".project-gallery-label");
    if (label) label.style.display = "none";
}

// Populate Footer Navigation
if (currentIndex !== -1) {
    const prevIdx = (currentIndex - 1 + projects.length) % projects.length;
    const nextIdx = (currentIndex + 1) % projects.length;

    const prevProj = projects[prevIdx];
    const nextProj = projects[nextIdx];

    document.getElementById("prevTitle").textContent = prevProj.title;
    document.getElementById("prevProject").href = `project.html?id=${prevProj.id}`;

    document.getElementById("nextTitle").textContent = nextProj.title;
    document.getElementById("nextProject").href = `project.html?id=${nextProj.id}`;
}

const backLink = document.getElementById("backLink");
if (backLink) backLink.href = `index.html?from=project&projectId=${id}`;

// ============================================
// ENTRANCE & REVEALS
// ============================================
window.addEventListener('load', () => {
    const hero = document.querySelector('.project-hero');
    const heroImg = document.querySelector('.project-hero-img');

    if (hero && heroImg) {
        hero.style.clipPath = "inset(0% 0% 0% 0%)";
        hero.style.transition = "clip-path 1.4s cubic-bezier(0.7, 0, 0.3, 1)";
        heroImg.style.transform = "scale(1)";
        heroImg.style.transition = "transform 2.5s cubic-bezier(0.2, 1, 0.3, 1)";
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
});

// ============================================
// PARALLAX (Throttled)
// ============================================
const heroImg = document.querySelector('.project-hero-img');
const heroNum = document.querySelector('.project-num');

function updateParallax() {
    if (heroImg) heroImg.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0)`;
    if (heroNum) heroNum.style.transform = `translate3d(0, ${-scrollY * 0.4}px, 0)`;
}

// ============================================
// LIGHTBOX
// ============================================
(function () {
    const overlay = document.getElementById('lightboxOverlay');
    const image = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const currentEl = document.getElementById('lightboxCurrent');
    const totalEl = document.getElementById('lightboxTotal');

    if (!overlay || !image || !project.gallery || project.gallery.length === 0) return;

    let currentIdx = 0;
    let isTransitioning = false;
    const gallery = project.gallery;

    totalEl.textContent = gallery.length;

    function openLightbox(index) {
        currentIdx = index;
        image.src = gallery[currentIdx];
        currentEl.textContent = currentIdx + 1;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function goTo(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        image.classList.add('transitioning');

        setTimeout(() => {
            currentIdx = (index + gallery.length) % gallery.length;
            image.src = gallery[currentIdx];
            currentEl.textContent = currentIdx + 1;

            image.onload = () => {
                image.classList.remove('transitioning');
                isTransitioning = false;
            };

            setTimeout(() => {
                image.classList.remove('transitioning');
                isTransitioning = false;
            }, 300);
        }, 200);
    }

    // Click on gallery items
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

    // Controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => goTo(currentIdx - 1));
    nextBtn.addEventListener('click', () => goTo(currentIdx + 1));

    // Click backdrop to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                goTo(currentIdx - 1);
                break;
            case 'ArrowRight':
                goTo(currentIdx + 1);
                break;
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    overlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo(currentIdx + 1);
            else goTo(currentIdx - 1);
        }
    }, { passive: true });
})();
