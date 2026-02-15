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

// Parallax effect on intern
gsap.fromTo(".int-text",
  { y: 80, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".int-text",
      start: "top 100%",
      end: "top 60%",
      scrub: true
    }
  }
);

gsap.fromTo(".intern",
  { y: 60, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".intern",
      start: "top 100%",
      end: "top 65%",
      scrub: true
    }
  }
);

gsap.utils.toArray([".ojt-one", ".ojt-two", ".ojt-three", ".ojt-four"]).forEach((ojt, i) => {
  gsap.fromTo(ojt,
    { y: 100, opacity: 0, scale: 0.95 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ojt,
        start: "top 110%",
        end: "top 60%",
        scrub: true
      }
    }
  );
});

// Scroll-based horizontal movement for ojt-content
gsap.to(".ojt-content", {
  x: -1200,
  ease: "none",
  scrollTrigger: {
    trigger: ".ojt-wrapper",
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1
  }
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

// Contact Section Animations - Melting/Rising Reveal
const contactSection = document.querySelector("#contact");

// 1. The main reveal animation
gsap.to("#contact", {
  y: "0%",
  borderRadius: "0% 0% 0 0",
  ease: "none",
  scrollTrigger: {
    trigger: ".contact-trigger",
    start: "top bottom", // when top of trigger hits bottom of viewport
    end: "bottom bottom", // when bottom of trigger hits bottom of viewport
    scrub: true,
    onUpdate: (self) => {
      // Optional: Manage pointer events based on visibility
      if (self.progress > 0.1) {
        contactSection.style.pointerEvents = "auto";
      } else {
        contactSection.style.pointerEvents = "none";
      }
    }
  }
});

// 2. Parallax/Fade-in for content inside contact section
// We want this to happen as the section fills the screen
const contactContentTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".contact-trigger",
    start: "top 40%", // start animating content a bit later
    end: "bottom bottom",
    scrub: 1
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

// Dynamic exit for previous content as contact section rises - Scale down and lift up
gsap.to("#new-section", {
  scale: 0.9,
  y: -150,
  filter: "blur(10px)",
  opacity: 0,
  transformOrigin: "center top",
  ease: "none",
  scrollTrigger: {
    trigger: ".contact-trigger",
    start: "top bottom",
    end: "center bottom",
    scrub: true
  }
});

// Also keep fading out the intro/desc elements
gsap.to([".intro-container", "#desc"], {
  opacity: 0,
  scrollTrigger: {
    trigger: ".contact-trigger",
    start: "top bottom",
    end: "center bottom",
    scrub: true
  }
});


