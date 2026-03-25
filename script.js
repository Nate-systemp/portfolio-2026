/**
 * EDITORIAL PORTFOLIO — Scripts
 * Clean, lightweight, vanilla JS. No GSAP, no Lenis.
 */

// ============================================
// LOADING CURTAIN
// ============================================
const curtain = document.getElementById('loadingCurtain');
const urlParams = new URLSearchParams(window.location.search);
const isReturning = urlParams.get('from') === 'project';

if (isReturning) {
  curtain.classList.add('dismissed');
  document.body.classList.remove('loading-active');
  setTimeout(() => curtain.style.display = 'none', 1200);
} else {
  // Auto-dismiss after content has loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      curtain.classList.add('dismissed');
      document.body.classList.remove('loading-active');
      setTimeout(() => curtain.style.display = 'none', 1200);
    }, 1400);
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
