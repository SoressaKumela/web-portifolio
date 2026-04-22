/* ══════════════════════════════════════════════════════════════
   Soressa Kumela — Portfolio JavaScript
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM CACHE ─── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ─── 1. TYPING EFFECT ─── */
  const titles = [
    'AI Developer',
    'Machine Learning Engineer',
    'Python Specialist',
    'Data Scientist',
  ];
  const typedEl = $('#typed-text');
  let titleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const TYPING_SPEED = 90;
  const DELETING_SPEED = 50;
  const PAUSE_END = 2000;
  const PAUSE_START = 500;

  function typeLoop() {
    const current = titles[titleIdx];
    if (!isDeleting) {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, PAUSE_END);
        return;
      }
      setTimeout(typeLoop, TYPING_SPEED);
    } else {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        setTimeout(typeLoop, PAUSE_START);
        return;
      }
      setTimeout(typeLoop, DELETING_SPEED);
    }
  }
  setTimeout(typeLoop, 1200);

  /* ─── 2. NEURAL NETWORK CANVAS ─── */
  const canvas = $('#neural-canvas');
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createNodes() {
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxDist = 140;

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
      if (a.y < 0 || a.y > canvas.height) a.vy *= -1;

      // Draw node
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 204, 0.4)';
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.strokeStyle = `rgba(0, 255, 204, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animFrame = requestAnimationFrame(drawNetwork);
  }

  resizeCanvas();
  createNodes();
  drawNetwork();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      createNodes();
    }, 250);
  });

  /* ─── 3. SCROLL REVEAL (IntersectionObserver) ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal-element').forEach((el, i) => {
    el.style.transitionDelay = `${i % 4 * 0.1}s`;
    revealObserver.observe(el);
  });

  /* ─── 4. DYNAMIC NAVBAR ─── */
  const navbar = $('#navbar');
  window.addEventListener(
    'scroll',
    () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    },
    { passive: true }
  );

  /* ─── 5. SMOOTH SCROLL FOR NAV LINKS ─── */
  $$('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // Hero buttons smooth scroll
  $$('.hero__actions .btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ─── 6. MOBILE MENU TOGGLE ─── */
  const hamburger = $('#hamburger-btn');
  const navLinks = $('#nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ─── 7. MOUSE GLOW FOLLOWER ─── */
  const glow = $('#mouse-glow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  /* ─── 8. CONTACT FORM (Prevent default) ─── */
  const contactForm = $('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = $('#form-submit-btn');
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'rgba(0,255,204,0.15)';
      btn.style.color = '#00ffcc';
      btn.style.border = '1.5px solid #00ffcc';
      setTimeout(() => {
        btn.innerHTML = 'Send Message <i class="ph ph-paper-plane-tilt"></i>';
        btn.style.background = '';
        btn.style.color = '';
        btn.style.border = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* ─── 9. FOOTER YEAR ─── */
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── 10. LOGO SMOOTH SCROLL ─── */
  const logo = $('#nav-logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
