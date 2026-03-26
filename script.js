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
    output.innerHTML = '';
    typeWelcome();
    setTimeout(() => input.focus(), 400);
  }

  function closeTerminal() {
    isOpen = false;
    overlay.classList.remove('active');
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
          '  <span class="term-accent">Frontend</span>  HTML \u00b7 CSS \u00b7 JavaScript \u00b7 React',
          '  <span class="term-accent">Tools</span>     Git \u00b7 VS Code \u00b7 Firebase',
          '  <span class="term-accent">Other</span>     UI/UX \u00b7 Responsive \u00b7 Animation',
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
          '  <span class="term-accent">Email</span>     hello@nathaniel.dev',
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
      if (file === 'easter-egg.txt') {
        addOutput([
          '',
          '  <span class="term-gold">Congratulations!</span>',
          '',
          '  You found the secret! You\'re the kind of',
          '  person who explores every corner of a website.',
          '  <span class="term-accent">That\'s exactly the type of curiosity</span>',
          '  <span class="term-accent">that makes a great designer/developer.</span>',
          '',
          '  <span class="term-muted">\u2014 Nathaniel</span>',
          ''
        ].join('\n'));
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

  if (localStorage.getItem('nightMode') === 'true') {
    document.body.classList.add('night-mode');
  }

  toggle.addEventListener('click', () => {
    const isNight = document.body.classList.toggle('night-mode');
    localStorage.setItem('nightMode', isNight);
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
