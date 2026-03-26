/**
 * EDITORIAL PORTFOLIO — Scripts
 * Clean, lightweight, vanilla JS. No GSAP, no Lenis.
 */

// ============================================
// LOADING CURTAIN + HERO ENTRANCE ANIMATION
// ============================================
const curtain = document.getElementById('loadingCurtain');
const urlParams = new URLSearchParams(window.location.search);
const isReturning = urlParams.get('from') === 'project';

// Prepare hero entrance (hide elements before animation)
document.body.classList.add('hero-entrance-ready');

/**
 * Triggers staggered entrance animations on all hero elements.
 * Each element gets an incremental delay for a cinematic cascade.
 */
function triggerHeroEntrance(baseDelay = 0) {
  // Stagger config: [selector, delay in ms]
  const entranceElements = [
    ['.site-header', 0],
    ['.hero-eyebrow', 150],
    ['.hero-name-line:first-child', 300],
    ['.hero-name-line.hero-name-indent', 500],
    ['.hero-tagline', 750],
    ['.hero-vertical-text', 600],
    ['.hero-year', 850],
    ['.hero-scroll-cue', 1000],
  ];

  // Apply per-element delay as CSS custom property
  entranceElements.forEach(([selector, delay]) => {
    const el = document.querySelector(selector);
    if (el) {
      el.style.setProperty('--hero-delay', `${baseDelay + delay}ms`);
    }
  });

  // Switch from "ready" (hidden) to "animating" (playing)
  document.body.classList.remove('hero-entrance-ready');
  document.body.classList.add('hero-animating');

  // Clean up classes after animations finish
  const totalDuration = baseDelay + 1000 + 1200; // last delay + longest animation
  setTimeout(() => {
    document.body.classList.remove('hero-animating');
    // Remove inline delay properties
    entranceElements.forEach(([selector]) => {
      const el = document.querySelector(selector);
      if (el) el.style.removeProperty('--hero-delay');
    });
  }, totalDuration);
}

if (isReturning) {
  curtain.classList.add('dismissed');
  document.body.classList.remove('loading-active');
  setTimeout(() => curtain.style.display = 'none', 1400);
  // Faster entrance when returning from project
  triggerHeroEntrance(200);
} else {
  // Mark curtain as interactive while loading
  curtain.classList.add('active-curtain');

  window.addEventListener('load', () => {
    // Phase 1: Let the curtain text sit visible for a moment
    setTimeout(() => {
      // Phase 2: Exit the text — scale, blur, dissolve
      const curtainContent = curtain.querySelector('.curtain-content');
      if (curtainContent) curtainContent.classList.add('curtain-exiting');

      // Phase 3: Flash the splitting seam line
      setTimeout(() => {
        curtain.classList.add('curtain-splitting');
      }, 400);

      // Phase 4: Split the curtain open — top up, bottom down
      setTimeout(() => {
        curtain.classList.add('dismissed');
        curtain.classList.remove('active-curtain');
        document.body.classList.remove('loading-active');

        // Trigger hero entrance as halves start sliding apart
        triggerHeroEntrance(200);

        // Clean up after halves have fully exited
        setTimeout(() => curtain.style.display = 'none', 1400);
      }, 700);
    }, 1200);
  });
}

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

  scrollTo(target, offset = 0) {
    let el;
    if (typeof target === 'string') el = document.querySelector(target);
    else el = target;
    if (!el) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.targetY = Math.max(0, Math.min(
      el.getBoundingClientRect().top + window.scrollY + offset,
      maxScroll
    ));
    this.currentY = window.scrollY;

    if (!this.isRunning) {
      this.isRunning = true;
      this._animate();
    }
  }
}

const smoothScroll = new SmoothScroll({ ease: 0.08, wheelMultiplier: 1 });

// ============================================
// NAVIGATION
// ============================================
const header = document.getElementById('siteHeader');
const navItems = document.querySelectorAll('.nav-item');

// Smooth scroll for nav links
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const target = item.getAttribute('href');
    if (target) {
      smoothScroll.scrollTo(target, -80);
    }
  });
});

// Hide/show header on scroll
let lastScrollY = 0;
let headerTicking = false;

window.addEventListener('scroll', () => {
  if (!headerTicking) {
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 200) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
      lastScrollY = currentY;
      headerTicking = false;
    });
    headerTicking = true;
  }
}, { passive: true });

// ============================================
// REVEAL ON SCROLL (Intersection Observer)
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ============================================
// EXPERIENCE ACCORDION
// ============================================
const expItems = document.querySelectorAll('.exp-item');

expItems.forEach(item => {
  const header = item.querySelector('.exp-header');
  if (!header) return;

  header.addEventListener('click', () => {
    const wasActive = item.classList.contains('active');
    expItems.forEach(r => r.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
  });
});

// ============================================
// WORK TOGGLE (Show More / Show Less)
// ============================================
const workToggle = document.getElementById('workToggle');
const workExtra = document.getElementById('workListExtra');
const toggleText = workToggle ? workToggle.querySelector('.work-toggle-text') : null;

if (workToggle && workExtra) {
  workToggle.addEventListener('click', () => {
    const isOpen = workExtra.classList.toggle('open');
    if (toggleText) toggleText.textContent = isOpen ? 'SHOW LESS' : 'SHOW MORE';

    // When opening, observe new reveal elements
    if (isOpen) {
      workExtra.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
      });
    }
  });
}

// ============================================
// ACTIVE NAV STATE
// ============================================
const sections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === '#' + id) {
          item.style.color = '#C45D3E';
        } else {
          item.style.color = '';
        }
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => navObserver.observe(section));

// ============================================
// PARALLAX NAME on scroll
// ============================================
const heroName = document.querySelector('.hero-name');
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;

      if (heroName && scrollY < maxScroll) {
        const progress = scrollY / maxScroll;
        heroName.style.transform = `translateY(${scrollY * 0.2}px)`;
        heroName.style.opacity = 1 - progress * 1.2;
      }

      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ============================================
// CUSTOM CURSOR (from original design, adapted)
// ============================================
(function () {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouchDevice) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  const ringEase = 0.15;
  let isRunning = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';

    if (!isRunning) {
      isRunning = true;
      animateRing();
    }
  });

  function animateRing() {
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;

    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      ringX = mouseX;
      ringY = mouseY;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      isRunning = false;
      return;
    }

    ringX += dx * ringEase;
    ringY += dy * ringEase;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(animateRing);
  }

  // Hover states for interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .work-item, .gallery-item, .intern-photo, .nav-item, .footer-social-link, .resume-link'
  );

  const textTargets = document.querySelectorAll(
    '.hero-name, .about-heading, .experience-heading, .contact-heading, .intern-heading, .work-item-title'
  );

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  textTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();
