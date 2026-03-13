const lenis = new Lenis();
let canScrollPast = false;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ============================================
// NAVIGATION LOGIC
// ============================================
const navLinks = document.querySelectorAll('.list li span[data-text]');
const targets = ["#desc", ".workintro", "#contact"];

navLinks.forEach((link, i) => {
  link.style.cursor = "pointer";
  link.addEventListener('click', () => {
    // Quick, lightweight click feedback
    gsap.to(link, {
      scale: 0.92,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    // Fast, smooth scroll — reduced from 2.5s to 1.2s for responsiveness
    if (targets[i]) {
      lenis.scrollTo(targets[i], {
        offset: i === 1 ? -100 : 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  });
});

// 1. Magnetic Hover for Menu and Icons (desktop only)
if (!isTouchDevice) {
  const magnets = document.querySelectorAll('.icon, .list li span');

  magnets.forEach((magnet) => {
    magnet.addEventListener("mousemove", (e) => {
      const bounding = magnet.getBoundingClientRect();
      const x = e.clientX - bounding.left - bounding.width / 2;
      const y = e.clientY - bounding.top - bounding.height / 2;

      gsap.to(magnet, {
        x: x * 0.45,
        y: y * 0.45,
        scale: 1.05,
        rotation: x * 0.03,
        duration: 0.6,
        ease: "power3.out"
      });
    });

    magnet.addEventListener("mouseleave", () => {
      gsap.to(magnet, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

  // 2. Hero Title (NATE) Parallax (desktop only)
  const introTitle = document.querySelector(".intro-title");
  if (introTitle) {
    window.addEventListener("mousemove", (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.015;
      gsap.to(introTitle, {
        x: moveX,
        y: moveY,
        duration: 1.5,
        ease: "power2.out"
      });
    });
  }
}

// Stop Lenis scroll until loading is dismissed
lenis.stop();

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

// ============================================
// LOADING SCREEN
// ============================================
const loadingScreen = document.getElementById("loadingScreen");
const loadingBar = document.getElementById("loadingBar");
const loadingPercent = document.getElementById("loadingPercent");
const startBtn = document.getElementById("startBtn");
const loadingLetters = document.querySelectorAll(".loading-logo-letter");

// Check if returning from a project page
const urlParams = new URLSearchParams(window.location.search);
const comingFromProject = urlParams.get("from") === "project";
const returnProjectId = urlParams.get("projectId");

if (comingFromProject) {
  // ── SKIP LOADING — returning from project page ──

  // Immediately hide loading screen
  loadingScreen.classList.add("hidden");
  document.body.classList.remove("loading-active");

  // Set intro elements to their final visible state (no animation)
  gsap.set(".intro-title", { y: 0, opacity: 1 });
  gsap.set(".intro-sub", { y: 0, opacity: 1 });
  gsap.set(".scroll-indicator", { y: 0, opacity: 0.6 });

  // Start smooth scroll
  lenis.start();

  // Clean URL (remove query params)
  window.history.replaceState({}, "", window.location.pathname);

  // Scroll to the work card they came from
  if (returnProjectId) {
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
      // Find the matching work card by its href
      const targetCard = document.querySelector(
        `.work-card[href="project.html?id=${returnProjectId}"]`
      );
      if (targetCard) {
        // Small delay to let layout settle, then scroll
        setTimeout(() => {
          lenis.scrollTo(targetCard, {
            offset: -100,
            duration: 0.01,
            immediate: true
          });
        }, 100);
      }
    });
  }

} else {
  // ── NORMAL LOADING FLOW ──

  // 1) Animate letters in with stagger
  const loadTl = gsap.timeline();

  loadTl.to(loadingLetters, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.12,
    ease: "power4.out",
    delay: 0.3
  });

  // 2) Simulate loading progress
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      // Loading complete — show button
      loadingPercent.textContent = "100%";
      loadingBar.style.width = "100%";

      gsap.to(startBtn, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3
      });

      // Subtle pulse on letters once loaded
      gsap.to(loadingLetters, {
        color: "#FF1919",
        duration: 1.2,
        stagger: 0.08,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.5
      });
    } else {
      loadingPercent.textContent = Math.floor(progress) + "%";
      loadingBar.style.width = progress + "%";
    }
  }, 180);

  // 3) ENTER button click — dismiss loading screen
  startBtn.addEventListener("click", () => {
    // Stop the letter pulse
    gsap.killTweensOf(loadingLetters);

    // Exit animation
    const exitTl = gsap.timeline({
      onComplete: () => {
        loadingScreen.classList.add("hidden");
        document.body.classList.remove("loading-active");
        lenis.start();

        // Start intro animations after loading screen is gone
        introTl.play();
      }
    });

    exitTl
      .to(loadingLetters, {
        y: -60,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power3.in"
      })
      .to([".loading-bar-container", ".loading-percent", startBtn, ".loading-footer-text"], {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.3")
      .to(loadingScreen, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.9,
        ease: "power3.inOut"
      }, "-=0.1");
  });
}

// ============================================
// INTRO ANIMATIONS (paused — plays after loading)
// ============================================
const introTl = gsap.timeline({ paused: true });

introTl.to(".intro-title", {
  y: 0,
  opacity: 1,
  duration: 1.5,
  ease: "power4.out",
  delay: 0.2
})
  .to(".intro-sub", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out"
  }, "-=1")
  .to(".scroll-indicator", {
    y: 0,
    opacity: 0.6,
    duration: 1,
    ease: "power2.out"
  }, "-=0.5");

// Scroll-out animation for Intro
// NOTE: Using scale + opacity instead of filter:blur for much better scroll perf
gsap.to(".intro-container", {
  scale: 0.85,
  opacity: 0,
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "50vh",
    scrub: true
  }
});

// Animate logo fill


// Animate nav items fill
gsap.to(".list span[data-text]", {
  backgroundPosition: "0% 100%",
  ease: "none",
  scrollTrigger: {
    trigger: "#desc",
    start: "top 80%",
    end: "top 20%",
    scrub: true
  }
});

// Animate social icons and overlay removed for performance

// Dim the video as desc section covers it
// NOTE: Removed filter:blur — animating CSS filters on scroll causes severe jank


// Horizontal scroll carousel effect for desc-title elements
document.querySelectorAll(".desc-title").forEach((title) => {
  gsap.fromTo(title,
    { x: "100%" },
    {
      x: "0%",
      ease: "none",
      scrollTrigger: {
        trigger: title,
        start: "top bottom",
        end: "top 70%",
        scrub: true
      }
    }
  );
});

// Parallax effect on work-text
gsap.to(".work-text", {
  y: -100,
  ease: "none",
  scrollTrigger: {
    trigger: ".work-text",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

// Parallax effect on close with fade


// ============================================
// INTERNSHIP SECTION — Lightweight Scroll Reveal
// ============================================
gsap.from(".intern-header", {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".intern-header",
    start: "top 85%",
    toggleActions: "play none none reverse"
  }
});

gsap.from(".intern-body", {
  y: 40,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".intern-body",
    start: "top 85%",
    toggleActions: "play none none reverse"
  }
});

gsap.utils.toArray(".ojt-photo").forEach((photo, i) => {
  gsap.from(photo, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: i * 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: photo,
      start: "top 90%",
      toggleActions: "play none none reverse"
    }
  });
});


// Staggered reveal for work cards
gsap.utils.toArray(".work-card").forEach((card, i) => {
  gsap.fromTo(card,
    { y: 80, opacity: 0, scale: 0.95 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 95%",
        end: "top 60%",
        scrub: true
      }
    }
  );
});

// ============================================
// WORKS GRID — Show More / Less Toggle
// ============================================
const worksToggle = document.getElementById("worksToggle");
const worksGrid = document.querySelector(".works-grid");
const toggleText = worksToggle ? worksToggle.querySelector(".works-toggle-text") : null;

if (worksToggle && worksGrid) {
  worksToggle.addEventListener("click", () => {
    const isExpanded = worksGrid.classList.toggle("expanded");
    worksToggle.classList.toggle("active", isExpanded);

    if (toggleText) {
      toggleText.textContent = isExpanded ? "LESS WORKS" : "MORE WORKS";
    }

    // NEW: If collapsing, scroll to the toggle to avoid jump and unintended reveal of footer
    if (!isExpanded) {
      lenis.scrollTo(worksToggle, {
        offset: -window.innerHeight + 150, // Keep button visible near bottom
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }

    // Refresh ScrollTrigger after layout change
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100); // Shorter timeout for snappier refresh
  });
}


// Typing effect on desc-skills elements
document.querySelectorAll(".desc-skills").forEach((skill) => {
  const text = skill.textContent.trim();
  const prefix = text.substring(0, 2);
  const typingText = text.substring(2);
  skill.textContent = prefix;
  let typingInterval = null;

  ScrollTrigger.create({
    trigger: skill,
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => {
      if (typingInterval) clearInterval(typingInterval);
      skill.textContent = prefix;
      let i = 0;
      typingInterval = setInterval(() => {
        if (i < typingText.length) {
          skill.textContent = prefix + typingText.substring(0, i + 1);
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50);
    },
    onLeaveBack: () => {
      if (typingInterval) clearInterval(typingInterval);
      skill.textContent = prefix;
    }
  });
});

// Circle follows cursor on intro hover (desktop only)
if (!isTouchDevice) {
  const introContainer = document.querySelector(".intro-container");
  const introReveal = document.querySelector(".intro-reveal");

  if (introContainer && introReveal) {
    introContainer.addEventListener("mousemove", (e) => {
      const rect = introContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      introReveal.style.clipPath = `circle(300px at ${x}px ${y}px)`;
      introReveal.style.setProperty('--mouse-x', x + 'px');
      introReveal.style.setProperty('--mouse-y', y + 'px');
    });

    introContainer.addEventListener("mouseleave", () => {
      introReveal.style.clipPath = `circle(20px at 50% 50%)`;
    });
  }


  // Custom cursor — use transform instead of left/top to avoid layout thrashing
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

      cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px)`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover detection for big cursor
    const hoverElements = document.querySelectorAll('a:not(.work-card):not(.icon), button, .desc-title, .logo, .intro-container');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Hover detection for hiding cursor (nav items and icons)
    const hideCursorElements = document.querySelectorAll('.list span[data-text], .social-icons .icon');
    hideCursorElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hide'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hide'));
    });
  }
}

// Contact Section Animations - Standard Scroll Reveal
const contactSection = document.querySelector("#contact");

// 1. (Removed fixed reveal) - Contact section now scrolls naturally

// 2. Parallax/Fade-in for content inside contact section
const contactContentTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#contact",
    start: "top 80%", // start animating content when section is visible
    end: "bottom bottom",
    toggleActions: "play none none reverse"
  }
});

contactContentTl.to(".contact-head", {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power2.out"
})
  .to(".contact-body", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "<0.2") // Start slightly after head
  .to(".contact-footer", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "<0.2");

// Simple fade out for previous sections as we reach contact
gsap.to([".intro-container", "#desc"], {
  opacity: 0,
  scrollTrigger: {
    trigger: "#contact",
    start: "top bottom",
    end: "top 20%",
    scrub: true
  }
});
// ============================================
// CONTACT WAVE — Scroll-Reactive Canvas
// Only animate when the contact section is visible (IntersectionObserver)
// ============================================
(function () {
  const canvas = document.getElementById('contactWave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let scrollVel = 0;
  let targetAmp = 0;
  let currentAmp = 0;
  let waveRunning = false; // Only animate when in viewport
  let waveRAF = null;

  lenis.on('scroll', (e) => {
    scrollVel = e.velocity;
  });

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const layers = [
    { color: '#F9F5F0', alpha: 0.06, freq: 2.2, speed: 0.4, phase: 0, baseY: 0.45 },
    { color: '#FF1919', alpha: 0.55, freq: 1.6, speed: 0.65, phase: 1.2, baseY: 0.58 },
    { color: '#F9F5F0', alpha: 0.08, freq: 3.1, speed: 0.25, phase: 2.5, baseY: 0.40 },
    { color: '#111111', alpha: 1.00, freq: 1.2, speed: 0.50, phase: 0.7, baseY: 0.78 },
  ];

  let time = 0;

  function drawWave(layer, amplitude) {
    const { color, alpha, freq, speed, phase, baseY } = layer;
    const w = canvas.width;
    const h = canvas.height;
    const y0 = h * baseY;

    ctx.beginPath();
    ctx.moveTo(0, h);

    // Step by 15px instead of 2px for MASSIVE performance savings on low-end devices
    for (let x = 0; x <= w; x += 15) {
      const t1 = Math.sin((x / w) * Math.PI * 2 * freq + time * speed + phase);
      const t2 = Math.sin((x / w) * Math.PI * 2 * freq * 0.5 + time * speed * 1.3 + phase + 1);
      const y = y0 + (t1 * 0.65 + t2 * 0.35) * amplitude;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function animate() {
    if (!waveRunning) return; // Stop loop when out of view

    targetAmp = Math.min(Math.abs(scrollVel) * 6, 55) + 12;
    currentAmp += (targetAmp - currentAmp) * 0.06;
    scrollVel *= 0.92;
    time += 0.012;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layers.forEach(layer => drawWave(layer, currentAmp));

    waveRAF = requestAnimationFrame(animate);
  }

  // Only run the wave animation when the contact section is visible
  const contactSection = document.getElementById('contact');
  if (contactSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!waveRunning) {
            waveRunning = true;
            animate();
          }
        } else {
          waveRunning = false;
          if (waveRAF) cancelAnimationFrame(waveRAF);
        }
      });
    }, { threshold: 0 });
    observer.observe(contactSection);
  } else {
    // Fallback: always run if no IntersectionObserver
    waveRunning = true;
    animate();
  }
})();
