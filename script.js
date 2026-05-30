/**
 * EDITORIAL PORTFOLIO — Scripts
 * Clean, lightweight, vanilla JS. No GSAP, no Lenis.
 */

// ============================================
// THEME INIT (Run immediately to prevent flash)
// ============================================
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('night-mode');
}

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
    ['.hero-marquee', 200],
    ['.hero-description', 500],
    ['.hero-location', 650],
    ['.hero-bottom-right', 800],
    ['.hero-corner-toggle', 1000],
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

/**
 * Dismiss the curtain with the standard cinematic sequence.
 * Called either automatically (skip portal) or after the portal selection.
 */
function dismissCurtain() {
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
  }, 400);
}

if (isReturning) {
  curtain.classList.add('dismissed');
  document.body.classList.remove('loading-active');
  setTimeout(() => curtain.style.display = 'none', 1400);
  // Faster entrance when returning from project
  triggerHeroEntrance(200);
} else if (window.__skipPortal) {
  // Role already known (URL param, localStorage, etc.) — dismiss normally
  curtain.classList.add('active-curtain');
  window.addEventListener('load', () => {
    setTimeout(() => dismissCurtain(), 800);
  });
} else {
  // First-time visitor — show the role portal inside the curtain
  curtain.classList.add('active-curtain');

  window.addEventListener('load', () => {
    // Hide the default "PORTFOLIO" text and show the portal
    setTimeout(() => {
      const curtainContent = curtain.querySelector('.curtain-content');
      if (curtainContent) curtainContent.classList.add('curtain-exiting');

      // After text fades, show the portal
      setTimeout(() => {
        const portal = document.getElementById('rolePortal');
        if (portal) portal.classList.add('portal-visible');
      }, 600);
    }, 1000);
  });

  // Listen for portal selection
  window.addEventListener('portal-selected', () => {
    dismissCurtain();
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
    if (document.body.classList.contains('loading-active') || document.body.classList.contains('no-scroll')) {
      e.preventDefault();
      return;
    }
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
// LINE REVEAL UTILITY
// ============================================
function initLineReveal() {
  const lineRevealElements = document.querySelectorAll('[data-reveal-line]');
  
  lineRevealElements.forEach(el => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(line => 
      `<span class="line-reveal-wrap"><span class="line-reveal-item">${line.trim()}</span></span>`
    ).join('');
    
    // Add to reveal observer
    el.setAttribute('data-reveal', '');
  });
}
initLineReveal();

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

// Expose globally so firestore-loader.js can attach dynamically loaded cards
window.__revealObserver = revealObserver;

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

// Night mode toggle is handled via inline onclick in the HTML button

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
// PARALLAX HERO on scroll
// ============================================
const heroMarquee = document.querySelector('.hero-marquee-inner');
const heroBottom = document.querySelector('.hero-bottom');
const heroCorner = document.querySelector('.hero-corner-toggle');
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / window.innerHeight, 1);

      if (heroMarquee && scrollY < window.innerHeight * 1.5) {
        // Subtle vertical parallax for the marquee
        heroMarquee.parentElement.style.transform = `translateY(${scrollY * 0.1}px)`;
        // Fade the marquee as we scroll past
        heroMarquee.style.opacity = 1 - progress * 1.2;
      }

      if (heroBottom) {
        heroBottom.style.opacity = 1 - progress * 2;
        heroBottom.style.transform = `translateY(${scrollY * 0.05}px)`;
      }

      if (heroCorner) {
        heroCorner.style.opacity = 1 - progress * 1.5;
      }

      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ============================================
// TERMINAL EASTER EGG
// ============================================
(function () {
  const overlay = document.getElementById('terminalOverlay');
  const output = document.getElementById('terminalOutput');
  const input = document.getElementById('terminalInput');
  const closeBtn = document.getElementById('terminalClose');
  const backdrop = overlay ? overlay.querySelector('.terminal-backdrop') : null;
  const logo = document.getElementById('headerLogo');
  if (!overlay || !output || !input) return;

  let isOpen = false;
  let clickCount = 0;
  let clickTimer = null;
  const cmdHistory = [];
  let historyIdx = -1;

  // Trigger: triple-click logo or Ctrl+`
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      clickCount++;
      if (clickCount >= 3) {
        clickCount = 0;
        clearTimeout(clickTimer);
        openTerminal();
      } else {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 500);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '`') {
      e.preventDefault();
      if (isOpen) closeTerminal();
      else openTerminal();
    }
    if (e.key === 'Escape' && isOpen) closeTerminal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  if (backdrop) backdrop.addEventListener('click', closeTerminal);

  function openTerminal() {
    if (isOpen) return;
    isOpen = true;
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    output.innerHTML = '';
    typeWelcome();
    setTimeout(() => input.focus(), 400);
  }

  function closeTerminal() {
    isOpen = false;
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    input.value = '';
  }

  function typeWelcome() {
    const lines = [
      '<span class="term-sage">\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557</span>',
      '<span class="term-sage">\u2551</span>  <span class="term-accent">Welcome to Nate\'s Terminal</span>          <span class="term-sage">\u2551</span>',
      '<span class="term-sage">\u2551</span>  <span class="term-muted">Type</span> <span class="term-cmd">help</span> <span class="term-muted">to see available commands</span>  <span class="term-sage">\u2551</span>',
      '<span class="term-sage">\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d</span>',
      ''
    ];
    addOutput(lines.join('\n'));
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      if (cmd) {
        cmdHistory.unshift(cmd);
        historyIdx = -1;
      }
      addOutput('<span class="term-prompt">visitor@nate ~ $</span> <span class="term-cmd">' + escapeHtml(input.value) + '</span>');
      if (cmd) processCommand(cmd);
      input.value = '';
      scrollToBottom();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        input.value = cmdHistory[historyIdx];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        input.value = cmdHistory[historyIdx];
      } else {
        historyIdx = -1;
        input.value = '';
      }
    }
  });

  const termBody = document.getElementById('terminalBody');
  if (termBody) termBody.addEventListener('click', () => input.focus());

  function addOutput(html) {
    output.innerHTML += '<div class="term-line">' + html + '</div>';
    scrollToBottom();
  }

  function scrollToBottom() {
    const body = document.getElementById('terminalBody');
    if (body) setTimeout(() => { body.scrollTop = body.scrollHeight; }, 10);
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function processCommand(cmd) {
    const commands = {
      help: function () {
        return [
          '',
          '<span class="term-gold">  Available Commands:</span>',
          '',
          '  <span class="term-cmd">whoami</span>      <span class="term-muted">\u2014</span> Learn about me',
          '  <span class="term-cmd">skills</span>      <span class="term-muted">\u2014</span> My tech stack',
          '  <span class="term-cmd">projects</span>    <span class="term-muted">\u2014</span> View my work',
          '  <span class="term-cmd">contact</span>     <span class="term-muted">\u2014</span> Get in touch',
          '  <span class="term-cmd">joke</span>        <span class="term-muted">\u2014</span> Tell a dev joke',
          '  <span class="term-cmd">matrix</span>      <span class="term-muted">\u2014</span> Enter the matrix',
          '  <span class="term-cmd">flip</span>        <span class="term-muted">\u2014</span> Try it ;)',
          '  <span class="term-cmd">ls</span>          <span class="term-muted">\u2014</span> List sections',
          '  <span class="term-cmd">clear</span>       <span class="term-muted">\u2014</span> Clear terminal',
          '  <span class="term-cmd">exit</span>        <span class="term-muted">\u2014</span> Close terminal',
          ''
        ].join('\n');
      },
      whoami: function () {
        return [
          '',
          '  <span class="term-gold">\u250c\u2500 About Nathaniel</span>',
          '  <span class="term-muted">\u2502</span>',
          '  <span class="term-muted">\u2502</span>  UI/UX Designer & Frontend Developer',
          '  <span class="term-muted">\u2502</span>  Based in the Philippines',
          '  <span class="term-muted">\u2502</span>  Crafting digital experiences with',
          '  <span class="term-muted">\u2502</span>  clean code & creative precision.',
          '  <span class="term-muted">\u2502</span>',
          '  <span class="term-muted">\u2502</span>  <span class="term-accent">Status:</span> <span class="term-success">Available for work</span>',
          '  <span class="term-gold">\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</span>',
          ''
        ].join('\n');
      },
      skills: function () {
        return [
          '',
          '  <span class="term-gold">Skills & Technologies</span>',
          '',
          '  <span class="term-accent">Design</span>    Figma \u00b7 Photoshop \u00b7 Illustrator',
          '  <span class="term-accent">Frontend</span>  React \u00b7 Vue.js \u00b7 Tailwind \u00b7 JS (ES6+)',
          '  <span class="term-accent">AI & Dev</span>  Claude \u00b7 Antigravity \u00b7 Git \u00b7 Firebase',
          '  <span class="term-accent">Core</span>      UI/UX \u00b7 Responsive \u00b7 Component Arch',
          ''
        ].join('\n');
      },
      projects: function () {
        return [
          '',
          '  <span class="term-gold">Projects</span>',
          '',
          '  <span class="term-accent">01</span>  FRACT ERA         <span class="term-muted">Game Design</span>',
          '  <span class="term-accent">02</span>  MOSAIC UI         <span class="term-muted">Web Design</span>',
          '  <span class="term-accent">03</span>  VOID ENGINE       <span class="term-muted">Creative Dev</span>',
          '  <span class="term-accent">04</span>  ECHO STUDIO       <span class="term-muted">Branding</span>',
          '',
          '  <span class="term-muted">Scroll down or visit the Work section</span>',
          ''
        ].join('\n');
      },
      contact: function () {
        return [
          '',
          '  <span class="term-gold">Contact</span>',
          '',
          '  <span class="term-accent">Email</span>     natederek99@gmail.com',
          '  <span class="term-accent">Status</span>    <span class="term-success">\u25cf Open to opportunities</span>',
          '',
          '  <span class="term-muted">Scroll to the Contact section</span>',
          ''
        ].join('\n');
      },
      hire: function () { return commands.contact(); },
      joke: function () {
        var jokes = [
          '  Why do programmers prefer dark mode?\n  <span class="term-gold">Because light attracts bugs.</span>',
          '  How do you comfort a CSS bug?\n  <span class="term-gold">You give it some padding.</span>',
          '  Why did the developer go broke?\n  <span class="term-gold">Because he used up all his cache.</span>',
          '  What is a developer\'s favorite tea?\n  <span class="term-gold">URL Grey.</span>',
          '  Why do Java devs wear glasses?\n  <span class="term-gold">Because they don\'t C#.</span>',
          '  What did HTML say to CSS?\n  <span class="term-gold">"You make me look good."</span>',
          '  !false\n  <span class="term-gold">It is funny because it is true.</span>',
        ];
        return '\n' + jokes[Math.floor(Math.random() * jokes.length)] + '\n';
      },
      ls: function () {
        return [
          '',
          '  <span class="term-sage">d</span> <span class="term-accent">hero/</span>',
          '  <span class="term-sage">d</span> <span class="term-accent">about/</span>',
          '  <span class="term-sage">d</span> <span class="term-accent">skills/</span>',
          '  <span class="term-sage">d</span> <span class="term-accent">work/</span>',
          '  <span class="term-sage">d</span> <span class="term-accent">experience/</span>',
          '  <span class="term-sage">d</span> <span class="term-accent">seminars/</span>',
          '  <span class="term-sage">d</span> <span class="term-accent">internship/</span>',
          '  <span class="term-sage">d</span> <span class="term-accent">contact/</span>',
          '  <span class="term-muted">-</span> <span class="term-muted">easter-egg.txt</span>  <span class="term-muted">\u2190 you found it!</span>',
          ''
        ].join('\n');
      },
      clear: function () {
        output.innerHTML = '';
        return null;
      },
      exit: function () { closeTerminal(); return null; },
      close: function () { closeTerminal(); return null; },
      matrix: function () {
        addOutput('\n  <span class="term-success">Entering the Matrix...</span>\n');
        startMatrix();
        return null;
      },
      flip: function () {
        document.body.style.transition = 'transform 1s cubic-bezier(0.45, 0, 0.15, 1)';
        document.body.style.transform = 'rotate(180deg)';
        setTimeout(function () {
          document.body.style.transform = '';
          setTimeout(function () { document.body.style.transition = ''; }, 1000);
        }, 2500);
        return '\n  <span class="term-gold">Wheee!</span>\n';
      },
      snake: function () {
        addOutput('\n  <span class="term-success">Initializing Snake Terminal Edition...</span>\n  <span class="term-muted">Use ARROW KEYS or WASD to move.</span>\n');
        startSnake();
        return null;
      },
      gravity: function () {
        addOutput('\n  <span class="term-error">WARNING: CRITICAL SYSTEM STABILITY FAILURE</span>\n  <span class="term-gold">Enabling experimental gravity physics...</span>\n');
        toggleGravity();
        return null;
      }
    };

    // Handle "sudo hire nate"
    if (cmd.indexOf('sudo') >= 0 && cmd.indexOf('hire') >= 0) {
      addOutput([
        '',
        '  <span class="term-success">\u2713 Permission granted!</span>',
        '  <span class="term-gold">  Sending hire request to Nathaniel...</span>',
        '  <span class="term-accent">  Just kidding \u2014 but let\'s talk!</span>',
        '  <span class="term-muted">  Scroll down to Contact</span>',
        ''
      ].join('\n'));
      return;
    }

    // Handle "cat" command
    if (cmd.indexOf('cat ') === 0) {
      var file = cmd.slice(4).trim();
      if (file === 'easter-egg.txt' || file === 'secrets.txt') {
        const secretContent = file === 'secrets.txt' 
          ? '\n  <span class="term-gold">SECRET UNLOCKED:</span>\n  Every design choice was inspired by the balance between\n  precision and creative chaos. You\'ve gone deep.'
          : '\n  <span class="term-gold">Congratulations!</span>\n\n  You found the secret! You\'re the kind of\n  person who explores every corner of a website.\n  <span class="term-accent">That\'s exactly the type of curiosity</span>\n  <span class="term-accent">that makes a great designer/developer.</span>\n\n  <span class="term-muted">\u2014 Nathaniel</span>';
        
        addOutput(secretContent + '\n');
      } else {
        addOutput('\n  <span class="term-error">cat: ' + escapeHtml(file) + ': No such file</span>\n');
      }
      return;
    }

    var fn = commands[cmd];
    if (fn) {
      var result = fn();
      if (result) addOutput(result);
    } else {
      addOutput('\n  <span class="term-error">command not found:</span> ' + escapeHtml(cmd) + '\n  <span class="term-muted">Type</span> <span class="term-cmd">help</span> <span class="term-muted">for available commands</span>\n');
    }
  }

  // Matrix rain effect
  function startMatrix() {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:999999;pointer-events:none;opacity:0.7;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var chars = 'ABCDEF0123456789NATE'.split('');
    var colW = 16;
    var cols = Math.ceil(canvas.width / colW);
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = 1;

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#C45D3E';
      ctx.font = '14px monospace';
      for (var j = 0; j < drops.length; j++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, j * colW, drops[j] * colW);
        if (drops[j] * colW > canvas.height && Math.random() > 0.975) drops[j] = 0;
        drops[j]++;
      }
    }

    var interval = setInterval(draw, 40);
    setTimeout(function () {
      clearInterval(interval);
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';
      setTimeout(function () { canvas.remove(); }, 600);
      addOutput('  <span class="term-muted">Matrix exited.</span>\n');
    }, 5000);
  }
})();

// ============================================
// NIGHT MODE TOGGLE
// ============================================
(function () {
  const toggle = document.getElementById('nightToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    toggle.style.transform = 'scale(1.2) rotate(360deg)';
    setTimeout(() => { toggle.style.transform = ''; }, 600);
  });
  
  // Add cursor interactivity hint
  toggle.style.cursor = 'none';
})();

// ============================================
// EXPERIENCE ACCORDION (Hover-to-open)
// ============================================
(function() {
  const items = document.querySelectorAll('.exp-item');
  
  items.forEach(item => {
    // Open on Hover
    item.addEventListener('mouseenter', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });

    // Fallback click for mobile
    const header = item.querySelector('.exp-header');
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
})();

// ============================================
// CUSTOM CURSOR (from original design, adapted)
// ============================================
(function () {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouchDevice) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // CRITICAL: Ensure cursor doesn't block clicks
  dot.style.pointerEvents = 'none';
  ring.style.pointerEvents = 'none';

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

  // Project Preview "VIEW" Label
  const projectPreviews = document.querySelectorAll('.work-card, .work-item, .next-project-link, .p-gallery-item');
  projectPreviews.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-view-mode'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-view-mode'));
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

// ============================================
// REVEAL ON SCROLL ENGINE
// ============================================
(function() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to keep observing
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' 
  });

  revealElements.forEach(el => revealObserver.observe(el));
})();

// Hover followed removed for a cleaner 'classy' layout.

// ============================================
// EXPERIENCE ACCORDION (Automatic on Hover)
// ============================================
(function() {
  const items = document.querySelectorAll('.exp-item');
  if (!items.length) return;

  items.forEach(item => {
    // Open on Hover
    item.addEventListener('mouseenter', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });

    // Toggle on Click (for touch)
    const header = item.querySelector('.exp-header');
    if (header) {
      header.addEventListener('click', (e) => {
        const isOpen = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    }
  });
})();

// ============================================
// MAGNETIC INTERACTION ENGINE
// ============================================
(function() {
  const magnets = document.querySelectorAll('.nav-item, .view-all-circle, .resume-link, .header-logo');
  
  magnets.forEach(m => {
    m.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = m.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      m.style.transform = `translate(${distanceX * 0.3}px, ${distanceY * 0.3}px)`;
    });
    
  });
})();

// ============================================
// FOOTER LOCAL TIME
// ============================================
(function() {
  const timeEl = document.getElementById('localTime');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    const options = { 
      timeZone: 'Asia/Manila', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    };
    timeEl.textContent = now.toLocaleTimeString('en-US', options).slice(0, 5) + 
                         (now.getHours() >= 12 ? ' PM' : ' AM') + ' PHT';
  }

  updateTime();
  setInterval(updateTime, 60000);
})();

// ============================================
// EXTEND MAGNETIC SELECTORS
// ============================================
(function() {
  const bigButton = document.querySelector('.big-contact-button');
  if (bigButton) {
    bigButton.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = bigButton.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      bigButton.style.transform = `translate(${distanceX * 0.15}px, ${distanceY * 0.15}px)`;
    });
    bigButton.addEventListener('mouseleave', () => {
      bigButton.style.transform = 'translate(0, 0)';
    });
  }
})();

// ============================================
// UNIQUE: MAGNETIC LABELS & CARD PERSPECTIVE
// ============================================
(function() {
  const label = document.getElementById('magneticLabel');
  const projectCards = document.querySelectorAll('.work-card, .archive-item');

  if (!label) return;

  document.addEventListener('mousemove', (e) => {
    // Label follows cursor smoothly
    const x = e.clientX;
    const y = e.clientY;
    label.style.left = `${x}px`;
    label.style.top = `${y}px`;
  });

  projectCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      label.classList.add('active');
      // Set custom label if needed
      const customTag = card.getAttribute('data-tag');
      label.textContent = customTag || 'VIEW';
    });

    card.addEventListener('mousemove', (e) => {
      // Perspective tilt logic
      const { left, top, width, height } = card.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Sensitivity factor
      const rotateX = (mouseY / (height / 2)) * -5; // Up to 5 degrees
      const rotateY = (mouseX / (width / 2)) * 5;   // Up to 5 degrees

      const img = card.querySelector('.work-card-img, .archive-img');
      if (img) {
        img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      label.classList.remove('active');
      const img = card.querySelector('.work-card-img, .archive-img');
      if (img) {
        img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      }
    });
  });
})();

// ============================================
// EASTER EGG: TERMINAL SNAKE ENGINE
// ============================================
function startSnake() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  // Clear body for game
  body.innerHTML = '<div id="snake-container" style="position:relative;width:100%;height:300px;background:#141414;border:1px solid #333;overflow:hidden;"></div>';
  const container = document.getElementById('snake-container');
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth;
  canvas.height = 300;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const gridSize = 15;
  let snake = [{x: 5, y: 5}];
  let food = {x: 10, y: 10};
  let dx = 1;
  let dy = 0;
  let score = 0;
  let gameRunning = true;

  function draw() {
    if (!gameRunning) return;
    
    // Background
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Snake
    ctx.fillStyle = '#C45D3E'; // var(--terra)
    snake.forEach(part => {
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Food
    ctx.fillStyle = '#D4A853'; // var(--gold)
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Move
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Wall collision
    if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height) {
      gameOver();
      return;
    }

    // Self collision
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    // Food consumption
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
      };
    } else {
      snake.pop();
    }

    setTimeout(() => requestAnimationFrame(draw), 100);
  }

  const originalContent = body.innerHTML;

  function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#F2EDE8';
    ctx.font = 'bold 20px Space Mono';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER - SCORE: ' + score, canvas.width / 2, canvas.height / 2);
    ctx.font = '12px Space Mono';
    ctx.fillText('PRESS SPACE TO RESTART | ESC TO EXIT', canvas.width / 2, canvas.height / 2 + 40);
  }

  function exitGame() {
    gameRunning = false;
    body.innerHTML = originalContent;
    // Highlight input for focus
    const input = document.querySelector('.terminal-input');
    if (input) input.focus();
  }

  window.addEventListener('keydown', e => {
    if (!gameRunning) {
      if (e.key === ' ' || e.key === 'r' || e.key === 'R') startSnake();
      if (e.key === 'Escape') exitGame();
      return;
    }
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; e.preventDefault(); }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; e.preventDefault(); }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; e.preventDefault(); }
    if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; e.preventDefault(); }
    if (e.key === 'Escape') exitGame();
  });

  requestAnimationFrame(draw);
}

// ============================================
// EASTER EGG: GRAVITY TOGGLE
// ============================================
function toggleGravity() {
  const sections = document.querySelectorAll('section, footer');
  document.body.classList.toggle('gravity-active');

  sections.forEach((sec, i) => {
    if (document.body.classList.contains('gravity-active')) {
      const rot = (Math.random() - 0.5) * 15;
      const transY = 50 + (Math.random() * 50);
      sec.style.transition = 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)';
      sec.style.transform = `translateY(${transY}px) rotate(${rot}deg)`;
    } else {
      sec.style.transform = 'translateY(0) rotate(0)';
    }
  });
}

// ============================================
// RESUME VIEWER — PDF Preview Engine
// ============================================
(function() {
  const overlay = document.getElementById('resumeViewerOverlay');
  const peekBtn = document.getElementById('resumePeekBtn');
  if (!overlay || !peekBtn) return;

  const backdrop = document.getElementById('resumeViewerBackdrop');
  const closeBtn = document.getElementById('rvCloseBtn');
  const zoomInBtn = document.getElementById('rvZoomIn');
  const zoomOutBtn = document.getElementById('rvZoomOut');
  const zoomLevelEl = document.getElementById('rvZoomLevel');
  const canvas = document.getElementById('resumeCanvas');
  const prevPageBtn = document.getElementById('rvPrevPage');
  const nextPageBtn = document.getElementById('rvNextPage');
  const currentPageEl = document.getElementById('rvCurrentPage');
  const totalPagesEl = document.getElementById('rvTotalPages');
  const viewerBody = document.getElementById('resumeViewerBody');
  const scrollContainer = document.getElementById('resumeViewerScroll');

  let pdfDoc = null;
  let currentPage = 1;
  let zoomLevel = 1.0;
  let isRendering = false;
  let pdfjsLoaded = false;

  // Dynamic PDF path — set by role-customizer.js, fallback to default
  let PDF_URL = window.currentResumePdf || 'assets/PANGILINAN_FRONT-ENDDEV.pdf';
  const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Lazy-load PDF.js
  function loadPdfJs() {
    return new Promise((resolve, reject) => {
      if (pdfjsLoaded && window.pdfjsLib) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = PDFJS_CDN;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
        pdfjsLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Show loading state
  function showLoading() {
    canvas.style.display = 'none';
    const pageNav = document.getElementById('resumePageNav');
    if (pageNav) pageNav.style.display = 'none';

    let loader = viewerBody.querySelector('.rv-loading');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'rv-loading';
      loader.innerHTML = '<div class="rv-loading-spinner"></div><span class="rv-loading-text">LOADING RÉSUMÉ...</span>';
      viewerBody.appendChild(loader);
    }
    loader.style.display = 'flex';
  }

  function hideLoading() {
    const loader = viewerBody.querySelector('.rv-loading');
    if (loader) loader.style.display = 'none';
    canvas.style.display = 'block';
    const pageNav = document.getElementById('resumePageNav');
    if (pageNav) pageNav.style.display = 'flex';
  }

  // Render a page
  async function renderPage(pageNum) {
    if (!pdfDoc || isRendering) return;
    isRendering = true;

    const page = await pdfDoc.getPage(pageNum);
    const baseViewport = page.getViewport({ scale: 1 });

    // Calculate scale to fit the viewer body nicely
    const bodyRect = viewerBody.getBoundingClientRect();
    const availableHeight = bodyRect.height - 100; // leave room for page nav
    const availableWidth = bodyRect.width - 60;

    const fitScale = Math.min(
      availableWidth / baseViewport.width,
      availableHeight / baseViewport.height
    );

    const viewport = page.getViewport({ scale: fitScale * zoomLevel * (window.devicePixelRatio || 1) });

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.width = `${viewport.width / (window.devicePixelRatio || 1)}px`;
    canvas.style.height = `${viewport.height / (window.devicePixelRatio || 1)}px`;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise;

    currentPageEl.textContent = pageNum;
    prevPageBtn.disabled = pageNum <= 1;
    nextPageBtn.disabled = pageNum >= pdfDoc.numPages;

    isRendering = false;
  }

  // Open viewer
  async function openViewer() {
    // Check if role-customizer changed the PDF path
    const newUrl = window.currentResumePdf || 'assets/PANGILINAN_FRONT-ENDDEV.pdf';
    if (newUrl !== PDF_URL || window.__resetResumePdf) {
      PDF_URL = newUrl;
      pdfDoc = null;           // force reload
      window.__resetResumePdf = false;
    }

    overlay.classList.add('active');
    document.body.classList.add('no-scroll');

    showLoading();

    try {
      await loadPdfJs();

      if (!pdfDoc) {
        pdfDoc = await window.pdfjsLib.getDocument(PDF_URL).promise;
        totalPagesEl.textContent = pdfDoc.numPages;

        // Hide page nav if single page
        const pageNav = document.getElementById('resumePageNav');
        if (pdfDoc.numPages <= 1 && pageNav) {
          pageNav.style.display = 'none';
        }
      }

      hideLoading();
      currentPage = 1;
      zoomLevel = 1.0;
      zoomLevelEl.textContent = '100%';
      await renderPage(currentPage);
    } catch (err) {
      console.error('Failed to load resume PDF:', err);
      hideLoading();
      canvas.style.display = 'none';

      let errorEl = viewerBody.querySelector('.rv-loading');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'rv-loading';
        viewerBody.appendChild(errorEl);
      }
      errorEl.style.display = 'flex';
      errorEl.innerHTML = '<span class="rv-loading-text">COULD NOT LOAD PDF — TRY DOWNLOADING INSTEAD</span>';
    }
  }

  // Close viewer
  function closeViewer() {
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  // Zoom
  function setZoom(newZoom) {
    zoomLevel = Math.max(0.5, Math.min(2.0, newZoom));
    zoomLevelEl.textContent = Math.round(zoomLevel * 100) + '%';
    renderPage(currentPage);
  }

  // Event listeners
  peekBtn.addEventListener('click', openViewer);
  closeBtn.addEventListener('click', closeViewer);
  backdrop.addEventListener('click', closeViewer);

  zoomInBtn.addEventListener('click', () => setZoom(zoomLevel + 0.25));
  zoomOutBtn.addEventListener('click', () => setZoom(zoomLevel - 0.25));

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (pdfDoc && currentPage < pdfDoc.numPages) {
      currentPage++;
      renderPage(currentPage);
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeViewer();
      e.preventDefault();
    }
    if (e.key === '+' || e.key === '=') {
      setZoom(zoomLevel + 0.25);
      e.preventDefault();
    }
    if (e.key === '-' || e.key === '_') {
      setZoom(zoomLevel - 0.25);
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      e.preventDefault();
    }
    if (e.key === 'ArrowRight' && pdfDoc && currentPage < pdfDoc.numPages) {
      currentPage++;
      renderPage(currentPage);
      e.preventDefault();
    }
  });

  // Re-render on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (!overlay.classList.contains('active')) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderPage(currentPage), 200);
  });
})();

// ============================================
// SCROLL PROGRESS BAR
// ============================================
(function() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
// ============================================
// EXPANDED MAGNETIC EFFECTS
// ============================================
(function() {
  const magnets = document.querySelectorAll(
    '.header-logo, .nav-item, .resume-link, .resume-peek-btn, .footer-social-link, .next-circle-badge, .project-back-link'
  );
  
  magnets.forEach(m => {
    m.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = m.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      // Different pull strengths
      const strength = m.classList.contains('header-logo') ? 0.4 : 0.3;
      
      m.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      if (m.querySelector('span')) {
        m.querySelector('span').style.transform = `translate(${dx * 0.1}px, ${dy * 0.1}px)`;
      }
    });
    
    m.addEventListener('mouseleave', () => {
      m.style.transform = '';
      if (m.querySelector('span')) {
        m.querySelector('span').style.transform = '';
      }
    });
  });
})();

// ============================================
// CONTACT FORM HANDLER
// ============================================
(function() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSpan = submitBtn.querySelector('span');
    const originalText = btnSpan.textContent;
    
    // Show sending state
    btnSpan.textContent = 'SENDING...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btnSpan.textContent = 'MESSAGE SENT \u2713';
        submitBtn.style.background = 'var(--sage)';
        form.reset();
        setTimeout(() => {
          btnSpan.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '';
        }, 3000);
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      btnSpan.textContent = 'FAILED — TRY EMAIL';
      submitBtn.style.background = 'var(--terra)';
      setTimeout(() => {
        btnSpan.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '';
      }, 3000);
    }
  });
})();

// ============================================
// PAGE TRANSITIONS
// ============================================
(function() {
  const transition = document.getElementById('pageTransition');
  if (!transition) return;

  // Intercept internal link clicks for page transition
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only apply to internal page links (not anchors, mailto, external)
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || 
        href.startsWith('http') || href.startsWith('javascript:') ||
        link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      transition.classList.add('active');
      
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });
})();
