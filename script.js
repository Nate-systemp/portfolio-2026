/**
 * VANILLA HIGH-PERFORMANCE SCRIPTS
 * Custom lightweight smooth scroll — no Lenis, no GSAP.
 */

// ============================================
// LIGHTWEIGHT SMOOTH SCROLL ENGINE
// ============================================
// Unlike Lenis, this doesn't fight the browser. It accumulates
// wheel delta and smoothly interpolates toward the target, clearing
// the target when the user stops scrolling. No stacking, no lag.
class SmoothScroll {
  constructor(opts = {}) {
    this.ease = opts.ease || 0.08;
    this.targetY = window.scrollY;
    this.currentY = window.scrollY;
    this.isRunning = false;
    this.wheelMultiplier = opts.wheelMultiplier || 1;

    // Only apply on non-touch devices
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
      window.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
    }

    // Sync on native scroll (keyboard, scrollbar drag, middle-click)
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

    // Stop looping when close enough — prevents idle CPU usage
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

  scrollTo(target, offset = 0) {
    let el;
    if (typeof target === 'string') el = document.querySelector(target);
    else el = target;
    if (!el) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.targetY = Math.max(0, Math.min(el.getBoundingClientRect().top + window.scrollY + offset, maxScroll));
    this.currentY = window.scrollY;

    if (!this.isRunning) {
      this.isRunning = true;
      this._animate();
    }
  }
}

const smoothScroll = new SmoothScroll({ ease: 0.08, wheelMultiplier: 1 });

// ============================================
// GLOBAL STATE
// ============================================
let scrollY = 0;
let mouseX = 0, mouseY = 0;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Throttled scroll tracker
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
// NAVIGATION LOGIC
// ============================================
const navLinks = document.querySelectorAll('.list li span[data-text]');
const targets = ["#desc", ".workintro", "#contact"];

navLinks.forEach((link, i) => {
  link.style.cursor = "pointer";
  link.addEventListener('click', () => {
    if (targets[i]) {
      smoothScroll.scrollTo(targets[i], i === 1 ? -100 : 0);
    }
  });
});

// Magnetic Hover
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
// LOADING SCREEN
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
// INTRO ANIMATIONS
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
const descTitles = document.querySelectorAll('.desc-title');

// Color-fill elements
const descSection = document.getElementById('desc');
const logo = document.querySelector('.logo');
const navSpans = document.querySelectorAll('.list span[data-text]');
const socialIcons = document.querySelectorAll('.social-icons .icon');
const fillTargets = [...(logo ? [logo] : []), ...navSpans, ...socialIcons];

function updateScrollEffects() {
  if (introContainer) {
    const progress = Math.min(scrollY / (window.innerHeight * 0.5), 1);
    introContainer.style.opacity = 1 - progress;
    introContainer.style.transform = `translate(-50%, -50%) scale(${1 - progress * 0.15})`;
  }

  // Desc-title parallax (desktop only — on smaller screens the pan animation takes over)
  if (window.innerWidth > 1024) {
    const viewportHeight = window.innerHeight;
    descTitles.forEach((title, i) => {
      const rect = title.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const direction = i % 2 === 0 ? 1 : -1;
        const move = (scrollProgress - 0.5) * 200 * direction;
        title.style.transform = `translate3d(${move}px, 0, 0)`;
      }
    });
  }

  // Nav / icon color fill
  // The white background spans from the top of #desc to the top of #contact
  if (descSection) {
    const descTop = descSection.getBoundingClientRect().top;
    const contactSection = document.getElementById('contact');
    const contactTop = contactSection ? contactSection.getBoundingClientRect().top : Infinity;
    
    fillTargets.forEach(el => {
      // Find the vertical center of the element
      const rect = el.getBoundingClientRect();
      const elCenterY = rect.top + (rect.height / 2);
      
      // Is this specific element over the white background area?
      const isOverWhite = elCenterY >= descTop && elCenterY <= contactTop;
      
      if (isOverWhite) {
        el.classList.add('fill-active');
      } else {
        el.classList.remove('fill-active');
      }
    });
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

// Typewriter Effect
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
// DESC-TITLE PAN ON TAP (tablet/phone)
// ============================================
// On screens ≤1024px, clicking a desc-title triggers a horizontal pan
// animation so the user can read the full clipped text.
descTitles.forEach(title => {
  title.addEventListener('click', () => {
    if (window.innerWidth > 1024) return;          // desktop: use hover instead
    if (title.classList.contains('panning')) return; // already animating

    // Calculate how much text overflows
    const overflow = title.scrollWidth - title.clientWidth;
    if (overflow <= 0) return; // nothing to pan

    // Set custom properties for the keyframes
    const panPx = -(overflow + 20);                         // 20px extra breathing room
    const duration = Math.max(2, Math.min(overflow / 80, 5)); // 2s–5s adaptive
    title.style.setProperty('--pan-offset', `${panPx}px`);
    title.style.setProperty('--pan-duration', `${duration}s`);

    title.classList.add('panning');

    title.addEventListener('animationend', function handler() {
      title.classList.remove('panning');
      title.removeEventListener('animationend', handler);
    });
  });
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
      smoothScroll.scrollTo(worksToggle, -window.innerHeight + 150);
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
