const lenis = new Lenis();
let canScrollPast = false;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// GSAP performance defaults (restored to handle CPU spikes gracefully)
gsap.ticker.lagSmoothing(500, 33);

// ============================================
// GLOBAL MOUSE TRACKING (Consolidated)
// ============================================
let mouseX = 0, mouseY = 0;
if (!isTouchDevice) {
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
}

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

    // Fast, smooth scroll
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
    let bounding = null;

    magnet.addEventListener("mouseenter", () => {
      bounding = magnet.getBoundingClientRect();
    });

    magnet.addEventListener("mousemove", (e) => {
      if (!bounding) bounding = magnet.getBoundingClientRect();
      const centerX = bounding.left + bounding.width / 2;
      const centerY = bounding.top + bounding.height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;

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
      bounding = null;
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
  const introContainer = document.querySelector(".intro-container");
  if (introTitle && introContainer) {
    let isHeroVisible = false;

    function updateHeroParallax() {
      if (!isHeroVisible) return;
      const moveX = (mouseX - window.innerWidth / 2) * 0.015;
      const moveY = (mouseY - window.innerHeight / 2) * 0.015;
      gsap.to(introTitle, {
        x: moveX,
        y: moveY,
        duration: 1.5,
        ease: "power2.out"
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroVisible = entry.isIntersecting;
          if (isHeroVisible) {
            gsap.ticker.add(updateHeroParallax);
          } else {
            gsap.ticker.remove(updateHeroParallax);
          }
        });
      }, { threshold: 0 });
      observer.observe(introContainer);
    } else {
      isHeroVisible = true;
      gsap.ticker.add(updateHeroParallax);
    }
  }
}

// Stop Lenis scroll until loading is dismissed
lenis.stop();

gsap.registerPlugin(ScrollTrigger, TextPlugin);

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

const urlParams = new URLSearchParams(window.location.search);
const comingFromProject = urlParams.get("from") === "project";
const returnProjectId = urlParams.get("projectId");

if (comingFromProject) {
  loadingScreen.classList.add("hidden");
  document.body.classList.remove("loading-active");

  gsap.set(".intro-title", { y: 0, opacity: 1 });
  gsap.set(".intro-sub", { y: 0, opacity: 1 });
  gsap.set(".scroll-indicator", { y: 0, opacity: 0.6 });

  lenis.start();

  window.history.replaceState({}, "", window.location.pathname);

  if (returnProjectId) {
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
      const targetCard = document.querySelector(
        `.work-card[href="project.html?id=${returnProjectId}"]`
      );
      if (targetCard) {
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
  const loadTl = gsap.timeline();

  loadTl.to(loadingLetters, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.12,
    ease: "power4.out",
    delay: 0.3
  });

  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      loadingPercent.textContent = "100%";
      loadingBar.style.width = "100%";

      gsap.to(startBtn, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3
      });

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

  startBtn.addEventListener("click", () => {
    gsap.killTweensOf(loadingLetters);

    const exitTl = gsap.timeline({
      onComplete: () => {
        loadingScreen.classList.add("hidden");
        document.body.classList.remove("loading-active");
        lenis.start();
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
// INTRO ANIMATIONS
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

    if (!isExpanded) {
      lenis.scrollTo(worksToggle, {
        offset: -window.innerHeight + 150,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });
}

// Typing effect (Optimized with TextPlugin)
document.querySelectorAll(".desc-skills").forEach((skill) => {
  const text = skill.textContent.trim();
  const prefix = text.substring(0, 2);
  const typingText = text.substring(2);
  skill.textContent = prefix;

  ScrollTrigger.create({
    trigger: skill,
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => {
      gsap.to(skill, {
        duration: typingText.length * 0.05,
        text: prefix + typingText,
        ease: "none"
      });
    },
    onLeaveBack: () => {
      gsap.set(skill, { text: prefix });
    }
  });
});

// Circle follows cursor on intro hover (desktop only)
if (!isTouchDevice) {
  const introContainer = document.querySelector(".intro-container");
  const introReveal = document.querySelector(".intro-reveal");

  if (introContainer && introReveal) {
    let isIntroVisible = false;
    let introRect = null;

    const updateIntroReveal = () => {
      if (!isIntroVisible || !introRect) return;
      const x = mouseX - introRect.left;
      const y = mouseY - introRect.top;
      introReveal.style.clipPath = `circle(300px at \${x}px \${y}px)`;
      introReveal.style.setProperty('--mouse-x', x + 'px');
      introReveal.style.setProperty('--mouse-y', y + 'px');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isIntroVisible = entry.isIntersecting;
          if (isIntroVisible) {
            introRect = introContainer.getBoundingClientRect();
            gsap.ticker.add(updateIntroReveal);
          } else {
            gsap.ticker.remove(updateIntroReveal);
          }
        });
      }, { threshold: 0 });
      observer.observe(introContainer);
    } else {
      isIntroVisible = true;
      introRect = introContainer.getBoundingClientRect();
      gsap.ticker.add(updateIntroReveal);
    }

    introContainer.addEventListener("mouseleave", () => {
      introReveal.style.clipPath = `circle(20px at 50% 50%)`;
    });
  }

  // Custom cursor (Optimized with 3D transform and IntersectionObserver)
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    let cursorX = 0, cursorY = 0;
    let isCursorActive = false;
    let cursorRAF = null;

    function animateCursor() {
      if (!isCursorActive) return;
      cursorX += (mouseX - cursorX) * 0.15; // Snappier response
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate3d(\${cursorX - 15}px, \${cursorY - 15}px, 0)`;
      cursorRAF = requestAnimationFrame(animateCursor);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isCursorActive = true;
            animateCursor();
          } else {
            isCursorActive = false;
            if (cursorRAF) cancelAnimationFrame(cursorRAF);
          }
        });
      }, { threshold: 0 });
      observer.observe(document.body);
    } else {
      isCursorActive = true;
      animateCursor();
    }

    const hoverElements = document.querySelectorAll('a:not(.work-card):not(.icon), button, .desc-title, .logo, .intro-container');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    const hideCursorElements = document.querySelectorAll('.list span[data-text], .social-icons .icon');
    hideCursorElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hide'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hide'));
    });
  }
}

// Contact Section Animations
const contactContentTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#contact",
    start: "top 80%",
    end: "bottom bottom",
    toggleActions: "play none none reverse"
  }
});

contactContentTl.to(".contact-head", { y: 0, opacity: 1, duration: 1, ease: "power2.out" })
  .to(".contact-body", { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "<0.2")
  .to(".contact-footer", { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "<0.2");

gsap.to([".intro-container", "#desc"], {
  opacity: 0,
  scrollTrigger: {
    trigger: "#contact",
    start: "top bottom",
    end: "top 20%",
    scrub: true
  }
});

// CONTACT WAVE (Optimized)
(function () {
  const canvas = document.getElementById('contactWave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let scrollVel = 0;
  let currentAmp = 0;
  let waveRunning = false;
  let waveRAF = null;

  lenis.on('scroll', (e) => {
    scrollVel = e.velocity;
  });

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

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
    for (let x = 0; x <= w; x += 30) { // Increased step to 30 for even better perf
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
  }

  function animate() {
    if (!waveRunning) return;
    const targetAmp = Math.min(Math.abs(scrollVel) * 6, 55) + 12;
    currentAmp += (targetAmp - currentAmp) * 0.06;
    scrollVel *= 0.92;
    time += 0.012;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layers.forEach(layer => drawWave(layer, currentAmp));
    waveRAF = requestAnimationFrame(animate);
  }

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
    waveRunning = true;
    animate();
  }
})();
