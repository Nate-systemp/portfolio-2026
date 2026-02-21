const lenis = new Lenis();
let canScrollPast = false;

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

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
  link.style.cursor = "pointer"; // Ensure pointer cursor despite global CSS
  link.addEventListener('click', () => {
    // 1. Creative Click Animation: Quick scale down/up ripple
    gsap.to(link, {
      scale: 0.9,
      letterSpacing: "5px",
      color: "#FF1919",
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(link, { letterSpacing: "2px", color: "transparent", duration: 0.5 }); // Reset
      }
    });

    // 2. Smooth Scroll with "Bold" Easing
    if (targets[i]) {
      lenis.scrollTo(targets[i], {
        offset: i === 1 ? -100 : 0, // Offset for Work section
        duration: 2.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease
      });
    }
  });
});

// 1. Magnetic Hover for Menu and Icons
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

// 2. Hero Title (NATE) Parallax
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
gsap.to(".intro-container", {
  filter: "blur(10px)",
  scale: 0.9,
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
gsap.to(".logo", {
  backgroundPosition: "0% 100%",
  ease: "none",
  scrollTrigger: {
    trigger: "#desc",
    start: "top 80%",
    end: "top 20%",
    scrub: true
  }
});

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

// Animate social icons fill
gsap.to(".social-icons .icon", {
  backgroundPosition: "0% 100%",
  ease: "none",
  scrollTrigger: {
    trigger: "#desc",
    start: "top 80%",
    end: "top 20%",
    scrub: true
  }
});

gsap.to(".overlay", {
  opacity: 1.2,
  ease: "none",
  scrollTrigger: {
    trigger: "#desc",
    start: "top 100%",
    end: "top 20%",
    scrub: true
  }
});

// Blur and dim the video as desc section covers it
gsap.to("#bgVideo", {
  filter: "blur(0px) brightness(7)",
  ease: "none",
  scrollTrigger: {
    trigger: "#desc",
    start: "top 70%",
    end: "top 20%",
    scrub: true
  }
});

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
gsap.fromTo(".close",
  { y: 70, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".close",
      start: "top 105%",
      end: "top 70%",
      scrub: true
    }
  }
);

// ============================================
// INTERNSHIP KINETIC ANIMATION
// ============================================
const ojtSection = document.querySelector("#new-section");
const ojtTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#new-section",
    start: "top top",
    end: "+=200%", // Pin for 2 screens worth of scroll
    pin: true,
    scrub: 1,
    anticipatePin: 1
  }
});

ojtTl
  // 1. Text slides up from below (Formal)
  .fromTo(".int-text",
    { y: "150px", opacity: 0 },
    { y: "0px", opacity: 1, duration: 2, ease: "none" }
  )
  // 2. Subtext fades in
  .to(".intern", { opacity: 1, y: 0, duration: 1, ease: "none" }, "-=0.5")

  // 3. Cards fan out from center stack
  .fromTo(".ojt-1",
    { x: 0, rotation: 0, scale: 0.9 },
    { x: -350, rotation: -15, scale: 1, duration: 2, ease: "none" },
    "-=1"
  )
  .fromTo(".ojt-2",
    { x: 0, rotation: 0, scale: 0.95 },
    { x: -120, rotation: -5, scale: 1, duration: 2, ease: "none" },
    "<"
  )
  .fromTo(".ojt-3",
    { x: 0, rotation: 0, scale: 0.95 },
    { x: 120, rotation: 5, scale: 1, duration: 2, ease: "none" },
    "<"
  )
  .fromTo(".ojt-4",
    { x: 0, rotation: 0, scale: 0.9 },
    { x: 350, rotation: 15, scale: 1, duration: 2, ease: "none" },
    "<"
  )

  // 4. Close text fades in
  .to(".close", { opacity: 1, y: 0, duration: 1, ease: "none" }, "-=0.5");


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

// Circle follows cursor on intro hover
const introContainer = document.querySelector(".intro-container");
const introReveal = document.querySelector(".intro-reveal");

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


// Custom cursor
const cursor = document.querySelector('.custom-cursor');
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

// Hover detection for big cursor
const hoverElements = document.querySelectorAll('a, button, .desc-title, .logo, .intro-container');
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
// ============================================
(function () {
  const canvas = document.getElementById('contactWave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Scroll velocity tracker (shared with Lenis listener below)
  let scrollVel = 0;
  let targetAmp = 0;   // amplitude we're easing toward
  let currentAmp = 0;  // smoothed amplitude

  // Track velocity from Lenis
  lenis.on('scroll', (e) => {
    scrollVel = e.velocity;
  });

  // Resize canvas to match element
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Wave parameters
  const layers = [
    // { color, alpha, frequency, speed, phaseOffset, baseY-ratio }
    { color: '#F9F5F0', alpha: 0.06, freq: 2.2, speed: 0.4, phase: 0, baseY: 0.45 },
    { color: '#FF1919', alpha: 0.55, freq: 1.6, speed: 0.65, phase: 1.2, baseY: 0.58 },
    { color: '#F9F5F0', alpha: 0.08, freq: 3.1, speed: 0.25, phase: 2.5, baseY: 0.40 },
    { color: '#111111', alpha: 1.00, freq: 1.2, speed: 0.50, phase: 0.7, baseY: 0.78 }, // fills bottom
  ];

  let time = 0;

  function drawWave(layer, amplitude) {
    const { color, alpha, freq, speed, phase, baseY } = layer;
    const w = canvas.width;
    const h = canvas.height;
    const y0 = h * baseY;

    ctx.beginPath();
    ctx.moveTo(0, h); // start bottom-left

    for (let x = 0; x <= w; x++) {
      // Two overlapping sine waves = organic shape
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
    // Ease amplitude toward scroll velocity
    targetAmp = Math.min(Math.abs(scrollVel) * 6, 55) + 12; // 12px base, up to ~67px
    currentAmp += (targetAmp - currentAmp) * 0.06; // lazy follow
    scrollVel *= 0.92; // decay velocity

    time += 0.012;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach(layer => drawWave(layer, currentAmp));

    requestAnimationFrame(animate);
  }

  animate();
})();
