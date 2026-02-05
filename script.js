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

gsap.registerPlugin(ScrollTrigger);

// Keep intro in the first 100vh: fade + blur out as you scroll past the first screen
gsap.to(".intro", {
  filter: "blur(6px)",
  y: -300,
  scale: 0.8,
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


// Smooth scroll animations for work items
gsap.utils.toArray([".work-one", ".work-two", ".work-three"]).forEach((work, i) => {
  gsap.fromTo(work, 
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: work,
        start: "top 105%",
        end: "top 45%",
        scrub: true
      }
    }
  );
});

gsap.utils.toArray([".work-content-one", ".work-content-two", ".work-content-three"]).forEach((content) => {
  gsap.fromTo(content, 
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: content,
        start: "top 105%",
        end: "top 90%",
        scrub: 1
      }
    }
  );
});

// Work pagination with pinning and smooth animation
let currentPage = 1;
let isAnimating = false;
let lastProgress = 0;
const workPages = document.querySelectorAll('.work-page');
const dots = document.querySelectorAll('.dot');
const worksContainer = document.querySelector('.works-container');

workPages[0].classList.add('active');

function changePage(page) {
  if (page === currentPage || isAnimating) return;
  
  isAnimating = true;
  const oldPage = currentPage;
  currentPage = page;
  
  if (currentPage === 3) {
    canScrollPast = true;
  }
  
  gsap.to(workPages[oldPage - 1], { 
    x: '-100%',
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      workPages[oldPage - 1].classList.remove('active');
    }
  });
  
  gsap.fromTo(workPages[page - 1], 
    { x: '100%' },
    { 
      x: '0%',
      duration: 0.8,
      ease: 'power2.inOut',
      onStart: () => {
        workPages[page - 1].classList.add('active');
      }, 
      onComplete: () => {
        isAnimating = false;
      }
    }
  );
  
  dots.forEach(d => d.classList.remove('active'));
  dots[page - 1].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    changePage(parseInt(dot.dataset.page));
  });
});
ScrollTrigger.create({
  trigger: worksContainer,
  start: 'top top',
  end: '+=200%',
  pin: true,
  onUpdate: (self) => {
    if (isAnimating) return;

    const progress = self.progress;

    let newPage;
    if (progress < 0.33) {
      newPage = 1;
    } else if (progress < 0.66) {
      newPage = 2;
    } else {
      newPage = 3;
    }

    if (newPage !== currentPage) {
      changePage(newPage);
    }

    // Prevent scrolling past until page 3
    if (currentPage < 3 && progress >= 0.99) {
      self.scroll(self.start + (self.end - self.start) * 0.98);
    }
  }
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

// Hover detection
const hoverElements = document.querySelectorAll('a, button, .desc-title, .logo, .list li, .social-icons .icon, .intro-container');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});


