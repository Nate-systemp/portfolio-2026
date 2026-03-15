/**
 * PROJECT PAGE — VANILLA SCRIPTS
 * No Lenis. No GSAP. Pure native performance.
 */

// ============================================
// GLOBAL STATE
// ============================================
let scrollY = 0;
let mouseX = 0, mouseY = 0;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Throttled scroll — one read per frame
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

if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });
}

// ============================================
// DATA & POPULATION
// ============================================
const projects = [
    {
        id: 1,
        num: "01",
        title: "FRACERA",
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
    }
];

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id")) || 1;
const project = projects.find(p => p.id === id) || projects[0];

// Populate DOM
document.getElementById("projectNum").textContent = project.num;
document.getElementById("projectTitle").textContent = project.title;
document.getElementById("projectCat").textContent = project.category;
document.getElementById("projectYear").textContent = project.year;
document.getElementById("projectDesc").textContent = project.description;
document.getElementById("projectStory").textContent = project.story;

const galleryGrid = document.getElementById("projectGallery");
if (galleryGrid && project.gallery) {
    galleryGrid.innerHTML = "";
    project.gallery.forEach((src, i) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.setAttribute("data-reveal", "scale");
        item.style.backgroundImage = `url('${src}')`;
        item.style.transitionDelay = `${i * 0.1}s`;
        galleryGrid.appendChild(item);
    });
}

// Nav Links
const backLink = document.querySelector(".back-link");
if (backLink) backLink.href = `index.html?from=project&projectId=${id}`;

// ============================================
// ENTRANCE & REVEALS
// ============================================
window.addEventListener('load', () => {
    const hero = document.querySelector('.project-hero');
    const heroImg = document.querySelector('.project-hero-img');
    
    if (hero && heroImg) {
        hero.style.clipPath = "inset(0% 0% 0% 0%)";
        hero.style.transition = "clip-path 1.6s cubic-bezier(0.7, 0, 0.3, 1)";
        heroImg.style.transform = "scale(1)";
        heroImg.style.transition = "transform 3s cubic-bezier(0.2, 1, 0.3, 1)";
    }

    // Scroll Reveal Observer
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
// PARALLAX (Throttled via scroll handler)
// ============================================
const heroImg = document.querySelector('.project-hero-img');
const heroNum = document.querySelector('.project-num');

function updateParallax() {
    if (heroImg) heroImg.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
    if (heroNum) heroNum.style.transform = `translate3d(0, ${-scrollY * 0.5}px, 0)`;
}

// ============================================
// CUSTOM CURSOR
// ============================================
if (!isTouchDevice) {
    const cursor = document.querySelector('.custom-cursor');
    let curX = 0, curY = 0;

    function moveCursor() {
        curX += (mouseX - curX) * 0.15;
        curY += (mouseY - curY) * 0.15;
        if (cursor) cursor.style.transform = `translate3d(${curX - 15}px, ${curY - 15}px, 0)`;
        requestAnimationFrame(moveCursor);
    }
    moveCursor();

    document.querySelectorAll('a, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}
