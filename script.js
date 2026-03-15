/**
 * VANILLA HIGH-PERFORMANCE SCRIPTS
 * No external animation libraries — pure native JS + CSS transitions.
 * Lenis removed: it hijacks wheel events and causes lag on weaker devices.
 */

// ============================================
// INITIALIZATION & GLOBAL STATE
// ============================================
let scrollY = 0;
let mouseX = 0, mouseY = 0;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Throttled scroll tracker — only reads scrollY once per frame
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      scrollY = window.scrollY;
      updateScrollEffects();
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
// SMOOTH SCROLL-TO (Native Replacement for Lenis)
// ============================================
function smoothScrollTo(target, offset = 0) {
  let el;
  if (typeof target === 'string') {
    el = document.querySelector(target);
  } else {
    el = target;
  }
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

// ============================================
// NAVIGATION LOGIC
// ============================================
const navLinks = document.querySelectorAll('.list li span[data-text]');
const targets = ["#desc", ".workintro", "#contact"];

navLinks.forEach((link, i) => {
  link.style.cursor = "pointer";
  link.addEventListener('click', () => {
    if (targets[i]) {
      smoothScrollTo(targets[i], i === 1 ? -100 : 0);
    }
  });
});

// Magnetic Hover (Vanilla)
if (!isTouchDevice) {
  const magnets = document.querySelectorAll('.icon, .list li span');
  magnets.forEach(magnet => {
    let rect = null;
    magnet.addEventListener('mouseenter', () => rect = magnet.getBoundingClientRect());
    magnet.addEventListener('mousemove', (e) => {
      if (!rect) rect = magnet.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      magnet.style.transform = `translate3d(${dx * 0.4}px, ${dy * 0.4}px, 0) scale(1.05)`;
    });
    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = `translate3d(0, 0, 0) scale(1)`;
      rect = null;
    });
  });
}

// ============================================
// LOADING SCREEN (Vanilla)
// ============================================
const loadingScreen = document.getElementById("loadingScreen");
const loadingBar = document.getElementById("loadingBar");
const loadingPercent = document.getElementById("loadingPercent");
const startBtn = document.getElementById("startBtn");
const loadingLetters = document.querySelectorAll(".loading-logo-letter");

const urlParams = new URLSearchParams(window.location.search);
const isReturning = urlParams.get("from") === "project";

function dismissLoading() {
  loadingScreen.style.clipPath = "inset(0 0 100% 0)";
  loadingScreen.style.transition = "clip-path 0.9s cubic-bezier(0.7, 0, 0.3, 1)";
  
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    document.body.classList.remove("loading-active");
    startIntroAnimations();
  }, 900);
}

if (isReturning) {
  loadingScreen.classList.add("hidden");
  document.body.classList.remove("loading-active");
  const introEls = document.querySelectorAll('.intro-title, .intro-sub, .scroll-indicator');
  introEls.forEach(el => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
} else {
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 15 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      loadingBar.style.width = "100%";
      loadingPercent.textContent = "100%";
      startBtn.style.opacity = "1";
      startBtn.style.transform = "translateY(0)";
    } else {
      loadingBar.style.width = `${progress}%`;
      loadingPercent.textContent = `${Math.floor(progress)}%`;
    }
  }, 150);

  startBtn.addEventListener('click', dismissLoading);
}

// ============================================
// INTRO ANIMATIONS (Vanilla)
// ============================================
function startIntroAnimations() {
  const title = document.querySelector('.intro-title');
  const sub = document.querySelector('.intro-sub');
  const scrollInd = document.querySelector('.scroll-indicator');

  const show = (el, delay) => {
    setTimeout(() => {
      el.style.transition = "opacity 1.5s ease, transform 1.5s cubic-bezier(0.2, 1, 0.3, 1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, delay);
  };

  show(title, 100);
  show(sub, 400);
  show(scrollInd, 700);
}

// ============================================
// SCROLL EFFECTS (Throttled via rAF)
// ============================================
const introContainer = document.querySelector('.intro-container');
const descTitle = document.querySelector('.desc-title');

function updateScrollEffects() {
  if (introContainer) {
    const progress = Math.min(scrollY / (window.innerHeight * 0.5), 1);
    introContainer.style.opacity = 1 - progress;
    introContainer.style.transform = `translate(-50%, -50%) scale(${1 - progress * 0.15})`;
  }

  if (descTitle) {
    const rect = descTitle.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (rect.top < viewportHeight && rect.bottom > 0) {
      const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const move = (scrollProgress - 0.5) * 200;
      descTitle.style.transform = `translate3d(${move}px, 0, 0)`;
    }
  }
}

// ============================================
// REVEAL ANIMATIONS (Intersection Observer)
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Typewriter Effect (Vanilla)
document.querySelectorAll(".desc-skills").forEach((skill) => {
  const fullText = skill.textContent.trim();
  const prefix = fullText.substring(0, 2);
  const typingPart = fullText.substring(2);
  skill.textContent = prefix;

  const typeObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      let i = 0;
      const interval = setInterval(() => {
        skill.textContent = prefix + typingPart.substring(0, i);
        i++;
        if (i > typingPart.length) clearInterval(interval);
      }, 50);
      typeObserver.unobserve(skill);
    }
  }, { threshold: 0.8 });
  typeObserver.observe(skill);
});

// ============================================
// WORKS GRID TOGGLE
// ============================================
const worksToggle = document.getElementById("worksToggle");
const worksGrid = document.querySelector(".works-grid");
const toggleText = worksToggle ? worksToggle.querySelector(".works-toggle-text") : null;

if (worksToggle && worksGrid) {
  worksToggle.addEventListener("click", () => {
    const isExpanded = worksGrid.classList.toggle("expanded");
    if (toggleText) toggleText.textContent = isExpanded ? "LESS WORKS" : "MORE WORKS";
    if (!isExpanded) {
      smoothScrollTo(worksToggle, -window.innerHeight + 150);
    }
  });
}

// ============================================
// CUSTOM CURSOR (Vanilla RAF)
// ============================================
if (!isTouchDevice) {
  const cursor = document.querySelector('.custom-cursor');
  let curX = 0, curY = 0;
  
  function updateCursor() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    if (cursor) {
      cursor.style.transform = `translate3d(${curX - 15}px, ${curY - 15}px, 0)`;
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  const hovers = document.querySelectorAll('a, button, .desc-title, .intro-container');
  hovers.forEach(h => {
    h.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    h.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ============================================
// CONTACT WAVE (Vanilla Canvas)
// ============================================
(function() {
  const canvas = document.getElementById('contactWave');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let isWaveVisible = false;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const layers = [
    { color: '#F9F5F0', alpha: 0.06, freq: 2.2, speed: 0.015, phase: 0, baseY: 0.45 },
    { color: '#FF1919', alpha: 0.55, freq: 1.6, speed: 0.02, phase: 1.2, baseY: 0.58 },
    { color: '#111111', alpha: 1.00, freq: 1.2, speed: 0.012, phase: 0.7, baseY: 0.78 },
  ];

  let time = 0;
  function animateWave() {
    if (!isWaveVisible) return;
    time += 0.5;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    layers.forEach(l => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 30) {
        const y = canvas.height * l.baseY + Math.sin(x * 0.005 * l.freq + time * l.speed + l.phase) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fillStyle = l.color;
      ctx.globalAlpha = l.alpha;
      ctx.fill();
    });
    requestAnimationFrame(animateWave);
  }

  // Only animate wave when visible
  const waveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isWaveVisible = true;
        animateWave();
      } else {
        isWaveVisible = false;
      }
    });
  }, { threshold: 0 });
  waveObserver.observe(canvas);
})();
