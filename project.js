// ============================================
// LENIS SMOOTH SCROLL
// ============================================
const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

// ============================================
// PROJECT DATA
// ============================================
const projects = [
    {
        id: 1,
        num: "01",
        title: "PROJECT ONE",
        category: "GAME DESIGN",
        year: "2025",
        description: "A math game puzzle for the elementary school students designed for a thesis project for the Math Majors.",
        story: "The game is a 2D puzzle game where the player has to solve math problems to progress through the game. The game is designed to be fun and educational, and it is suitable for children aged 6-12.",
        
        gallery: ["assets/FRACERA1.png", "assets/FRACERA2.png", "assets/FRACERA3.png"],
    },
    {
        id: 2,
        num: "02",
        title: "PROJECT TWO",
        category: "WEB DEVELOPMENT",
        year: "2024",
        description: "A full-stack web platform built to streamline student enrollment and course management for university departments.",
        story: "Built from scratch using modern web technologies, this project required handling complex database relationships and real-time updates. The greatest learning was architecting a system that scales — from 50 students in testing to thousands in production.",
    },
    {
        id: 3,
        num: "03",
        title: "PROJECT THREE",
        category: "GAME DESIGN",
        year: "2025",
        description: "A 2D puzzle platformer featuring hand-drawn environments and physics-based mechanics, designed as a thesis project.",
        story: "The vision was to merge traditional Filipino art motifs with modern game design. Every sprite was hand-illustrated, and the puzzle mechanics were inspired by local folk stories. The project won recognition at the university's annual tech showcase.",
    },
    {
        id: 4,
        num: "04",
        title: "PROJECT FOUR",
        category: "APP DEVELOPMENT",
        year: "2024",
        description: "A cross-platform mobile application for tracking personal fitness goals with AI-powered workout recommendations.",
        story: "This project explored the intersection of health tech and machine learning. I integrated a recommendation engine that adapts to user behavior over time, creating personalized workout plans that evolve with the user's progress.",
    },
    {
        id: 5,
        num: "05",
        title: "PROJECT FIVE",
        category: "DIGITAL POSTER",
        year: "2024",
        description: "A series of experimental digital posters exploring typography, color theory, and visual communication for campus events.",
        story: "Each poster was an experiment in pushing visual boundaries — from brutalist grids to fluid organic shapes. The constraint of each design being event-specific forced creative problem-solving within tight deadlines.",
    },
    {
        id: 6,
        num: "06",
        title: "PROJECT SIX",
        category: "UI/UX DESIGN",
        year: "2025",
        description: "An e-commerce platform redesign for a local streetwear brand, focusing on brand storytelling through interface design.",
        story: "The client wanted their website to feel like walking into their physical store — bold, curated, and immersive. I designed a scroll-driven experience where products are revealed through editorial-style layouts rather than traditional grids.",
    },
    {
        id: 7,
        num: "07",
        title: "PROJECT SEVEN",
        category: "WEB DEVELOPMENT",
        year: "2024",
        description: "A real-time collaborative whiteboard tool built for remote design teams, featuring live cursors and annotation tools.",
        story: "WebSocket technology powered the real-time features, while canvas rendering handled the drawing tools. The most complex challenge was syncing state across multiple clients without latency or conflicts.",
    },
    {
        id: 8,
        num: "08",
        title: "PROJECT EIGHT",
        category: "APP DEVELOPMENT",
        year: "2024",
        description: "A campus navigation app with indoor mapping, event schedules, and room availability tracking for the university.",
        story: "Mapping the entire campus required weeks of on-site documentation. The indoor navigation system uses Bluetooth beacons for positioning, making it one of the most technically ambitious projects I've undertaken.",
    },
    {
        id: 9,
        num: "09",
        title: "PROJECT NINE",
        category: "GAME DESIGN",
        year: "2025",
        description: "An interactive narrative experience blending visual novel mechanics with point-and-click adventure elements.",
        story: "This project was a love letter to storytelling in games. The branching narrative system tracks over 50 decision points that lead to 4 distinct endings, each reflecting different aspects of the protagonist's journey.",
    },
];

// ============================================
// LOAD PROJECT DATA
// ============================================
const params = new URLSearchParams(window.location.search);
const projectId = parseInt(params.get("id")) || 1;
const project = projects.find(p => p.id === projectId) || projects[0];

document.getElementById("projectNum").textContent = project.num;
document.getElementById("projectTitle").textContent = project.title;
document.getElementById("projectCat").textContent = project.category;
document.getElementById("projectYear").textContent = project.year;
document.getElementById("projectDesc").textContent = project.description;
document.getElementById("projectStory").textContent = project.story;
document.title = `${project.title} — Nate`;

// Apply cover image to hero
const heroImg = document.getElementById("heroImg");
if (heroImg && project.cover) {
    heroImg.style.backgroundImage = `url('${project.cover}')`;
    heroImg.style.backgroundSize = "cover";
    heroImg.style.backgroundPosition = "center";
}

// Populate gallery dynamically
const galleryGrid = document.getElementById("projectGallery");
if (galleryGrid && project.gallery && project.gallery.length > 0) {
    galleryGrid.innerHTML = ""; // Clear placeholder items
    project.gallery.forEach((imgSrc, index) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.style.backgroundImage = `url('${imgSrc}')`;
        item.style.backgroundSize = "cover";
        item.style.backgroundPosition = "center";
        item.dataset.index = index;
        galleryGrid.appendChild(item);
    });
}

// Prev / Next Navigation
const currentIndex = projects.findIndex(p => p.id === projectId);
const prevProject = projects[currentIndex - 1];
const nextProject = projects[currentIndex + 1];

const prevLink = document.getElementById("prevProject");
const nextLink = document.getElementById("nextProject");
const prevTitleEl = document.getElementById("prevTitle");
const nextTitleEl = document.getElementById("nextTitle");

if (prevProject) {
    prevLink.href = `project.html?id=${prevProject.id}`;
    prevTitleEl.textContent = prevProject.title;
} else {
    prevLink.style.opacity = "0.3";
    prevLink.style.pointerEvents = "none";
    prevTitleEl.textContent = "—";
}

if (nextProject) {
    nextLink.href = `project.html?id=${nextProject.id}`;
    nextTitleEl.textContent = nextProject.title;
} else {
    nextLink.style.opacity = "0.3";
    nextLink.style.pointerEvents = "none";
    nextTitleEl.textContent = "—";
}

// ============================================
// ENTRANCE TIMELINE — coordinated page load
// ============================================
const entranceTl = gsap.timeline({ defaults: { ease: "power4.out" } });

// Hero image: clip-path reveal + slow zoom
gsap.set(".project-hero", { clipPath: "inset(10% 10% 10% 10%)" });
gsap.set(".project-hero-img", { scale: 1.3 });

entranceTl
    .to(".project-hero", {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.6,
        ease: "power3.inOut"
    })
    .to(".project-hero-img", {
        scale: 1,
        duration: 3,
        ease: "power2.out"
    }, "<0.2")
    // Number fade in from bottom
    .fromTo(".project-num",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "<0.4"
    )
    // Back link slide in
    .fromTo(".back-link",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "<0.2"
    )
    // Title: split-letter stagger or slide up with clip
    .fromTo(".project-title",
        { y: 80, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.2 },
        "-=0.6"
    )
    // Category & Year: stagger in
    .fromTo(".project-category",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
    )
    .fromTo(".project-year",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
    );

// ============================================
// HERO PARALLAX — image moves slower than scroll
// ============================================
gsap.to(".project-hero-img", {
    y: -120,
    ease: "none",
    scrollTrigger: {
        trigger: ".project-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Number parallax — floats up faster
gsap.to(".project-num", {
    y: -200,
    ease: "none",
    scrollTrigger: {
        trigger: ".project-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Hero overlay darkens as you scroll past
gsap.to(".project-hero-overlay", {
    opacity: 0.6,
    ease: "none",
    scrollTrigger: {
        trigger: ".project-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// ============================================
// DIVIDERS — animate width from left to right
// ============================================
gsap.utils.toArray(".project-divider").forEach(div => {
    gsap.fromTo(div,
        { scaleX: 0, transformOrigin: "left center" },
        {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: div,
                start: "top 88%",
            }
        }
    );
});

// ============================================
// DESCRIPTION SECTION — label + text stagger
// ============================================
gsap.fromTo(".project-desc-label",
    { x: -30, opacity: 0 },
    {
        x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
            trigger: ".project-description",
            start: "top 82%",
        }
    }
);

gsap.fromTo(".project-desc-text",
    { y: 40, opacity: 0 },
    {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: {
            trigger: ".project-description",
            start: "top 80%",
        }
    }
);

// ============================================
// STORY SECTION — label + text stagger
// ============================================
gsap.fromTo(".project-story-label",
    { x: -30, opacity: 0 },
    {
        x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
            trigger: ".project-story",
            start: "top 82%",
        }
    }
);

gsap.fromTo(".project-story-text",
    { y: 40, opacity: 0 },
    {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: {
            trigger: ".project-story",
            start: "top 80%",
        }
    }
);

// ============================================
// GALLERY — staggered reveal with scale
// ============================================
gsap.fromTo(".project-gallery-label",
    { x: -30, opacity: 0 },
    {
        x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
            trigger: ".project-gallery",
            start: "top 85%",
        }
    }
);

gsap.utils.toArray(".gallery-item").forEach((item, i) => {
    gsap.fromTo(item,
        { y: 80, opacity: 0, scale: 0.9, rotateX: 5 },
        {
            y: 0, opacity: 1, scale: 1, rotateX: 0,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: {
                trigger: item,
                start: "top 92%",
            }
        }
    );
});

// Gallery items subtle parallax on scroll
gsap.utils.toArray(".gallery-item").forEach((item, i) => {
    gsap.to(item, {
        y: -20 - (i * 10),
        ease: "none",
        scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// ============================================
// FOOTER NAV — slide in from sides
// ============================================
gsap.fromTo(".project-nav-link.prev",
    { x: -60, opacity: 0 },
    {
        x: 0, opacity: prevProject ? 1 : 0.3, duration: 1, ease: "power3.out",
        scrollTrigger: {
            trigger: ".project-footer-nav",
            start: "top 90%",
        }
    }
);

gsap.fromTo(".project-nav-link.next",
    { x: 60, opacity: 0 },
    {
        x: 0, opacity: nextProject ? 1 : 0.3, duration: 1, ease: "power3.out",
        scrollTrigger: {
            trigger: ".project-footer-nav",
            start: "top 90%",
        }
    }
);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.05;
        cursorY += (mouseY - cursorY) * 0.05;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor grow on interactive elements
    const hoverElements = document.querySelectorAll('a, .gallery-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}
