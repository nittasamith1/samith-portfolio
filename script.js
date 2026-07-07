/**
 * Nitta Samith — Portfolio Script
 * Vanilla JS · No dependencies · Production quality
 */

'use strict';

/* ===========================
   TYPING EFFECT
   =========================== */
class TypeWriter {
  constructor(el, words, wait = 2800) {
    this.el = el;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = wait;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    this.txt = this.isDeleting
      ? fullTxt.substring(0, this.txt.length - 1)
      : fullTxt.substring(0, this.txt.length + 1);

    this.el.innerHTML = `<span class="typed-text">${this.txt}</span>`;

    let typeSpeed = 110;
    if (this.isDeleting) typeSpeed = 55;

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

/* ===========================
   SCROLL REVEAL
   =========================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ===========================
   ACTIVE NAV LINK
   =========================== */
function setActiveNav() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.navdomains a');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href === filename ||
      (filename === '' && href === 'index.html') ||
      (filename === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}

/* ===========================
   MOBILE NAV TOGGLE
   =========================== */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ===========================
   COUNTER ANIMATION
   =========================== */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = isDecimal
      ? (ease * target).toFixed(1)
      : Math.floor(ease * target);

    el.textContent = current + (el.dataset.suffix || '');

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.counter);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ===========================
   PROJECT FILTER
   =========================== */
function initProjectFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.animation = 'fade-up 0.4s ease both';
        }
      });
    });
  });
}

/* ===========================
   NAV SCROLL SHADOW
   =========================== */
function initNavScroll() {
  const nav = document.querySelector('.mainnav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20
      ? '0 4px 24px rgba(0,0,0,0.4)'
      : 'none';
  }, { passive: true });
}

/* ===========================
   TOAST NOTIFICATION & COPY EMAIL
   =========================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span class="toast-message"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-message').textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function initCopyEmail() {
  const emailButton = document.getElementById('email-button');
  const emailCtaButton = document.getElementById('email-cta-button');
  const emailVal = 'samithnitta6@gmail.com';

  const copyAction = (e) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText(emailVal).then(() => {
      showToast('Email copied to clipboard!');
      
      // Visual feedback on the button
      const label = document.getElementById('email-label');
      const icon = document.getElementById('email-copy-icon');
      if (label) label.textContent = 'Copied!';
      if (icon) {
        icon.className = 'fa-solid fa-check';
        icon.style.color = 'var(--clr-secondary)';
      }
      
      setTimeout(() => {
        if (label) label.textContent = 'Email (Click to copy)';
        if (icon) {
          icon.className = 'fa-regular fa-copy';
          icon.style.color = 'var(--clr-text-dim)';
        }
      }, 3000);
    }).catch(() => {
      // Fallback
      window.location.href = 'mailto:' + emailVal;
    });
  };

  if (emailButton) {
    emailButton.addEventListener('click', copyAction);
  }
  if (emailCtaButton) {
    emailCtaButton.addEventListener('click', copyAction);
  }
}

/* ===========================
   THEME TOGGLER (DARK / LIGHT)
   =========================== */
function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
    updateToggleIcons('light');
  } else {
    document.documentElement.classList.remove('light-theme');
    updateToggleIcons('dark');
  }

  function updateToggleIcons(theme) {
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }

  const toggleTheme = (e) => {
    if (e) e.preventDefault();
    const isLight = document.documentElement.classList.toggle('light-theme');
    const activeTheme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', activeTheme);
    updateToggleIcons(activeTheme);
  };

  themeToggleBtns.forEach(btn => btn.addEventListener('click', toggleTheme));
}

/* ===========================
   INIT
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle (Initialize BEFORE other layout work to avoid flash)
  initThemeToggle();

  // Typing effect
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    new TypeWriter(typeEl, [
      'AI Engineer',
      'ML Developer',
      'Backend Engineer',
      'Full-Stack Developer',
      'Data Scientist',
    ], 2600);
  }

  setActiveNav();
  initMobileNav();
  initScrollReveal();
  initCounters();
  initProjectFilter();
  initNavScroll();
  initCopyEmail();
});


