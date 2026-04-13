/* ═══════════════════════════════════════════════════════
   HENRIQUE TERUYA — PORTFOLIO
   Scroll Animations, Navigation, Micro-interactions
   ═══════════════════════════════════════════════════════ */

'use strict';

(() => {
  // ─── DOM References ──────────────────────────────────

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const floatingCta = document.getElementById('floating-cta');
  const heroSection = document.getElementById('hero');
  const mobileLinks = mobileMenu.querySelectorAll('a');
  const revealElements = document.querySelectorAll('.reveal');

  // ─── Scroll-triggered Reveal (IntersectionObserver) ──

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Optionally unobserve after reveal for performance
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── Navigation: scroll state ────────────────────────

  let lastScrollY = 0;
  let ticking = false;

  const updateNavState = () => {
    const scrollY = window.scrollY;
    const heroBottom = heroSection ? heroSection.offsetHeight : 400;

    // Add scrolled state for subtle border
    if (scrollY > 20) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    // Show/hide floating CTA after hero
    if (scrollY > heroBottom * 0.7) {
      floatingCta.classList.add('is-visible');
    } else {
      floatingCta.classList.remove('is-visible');
    }

    ticking = false;
  };

  const onScroll = () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateNavState);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on load
  updateNavState();

  // ─── Mobile Menu Toggle ──────────────────────────────

  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;

    navToggle.classList.toggle('is-active', isMenuOpen);
    mobileMenu.classList.toggle('is-open', isMenuOpen);
    document.body.classList.toggle('menu-open', isMenuOpen);

    navToggle.setAttribute('aria-expanded', isMenuOpen);
    navToggle.setAttribute(
      'aria-label',
      isMenuOpen ? 'Fechar menu' : 'Abrir menu'
    );
  };

  const closeMenu = () => {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    navToggle.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  };

  navToggle.addEventListener('click', toggleMenu);

  // Close menu on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
      navToggle.focus();
    }
  });

  // ─── Smooth Scroll for Anchor Links ──────────────────

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = nav.offsetHeight;
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  // ─── Active nav link highlighting ────────────────────

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.style.color = isActive
              ? 'var(--text-on-dark)'
              : '';
          });
        }
      });
    },
    {
      threshold: 0,
      rootMargin: `-${nav.offsetHeight + 1}px 0px -60% 0px`,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ─── Skill pills: subtle stagger on reveal ──────────

  const skillCategories = document.querySelectorAll('.skill-category');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.skill-item');
          items.forEach((item, i) => {
            item.style.transition = `
              background var(--duration-fast) var(--ease-out-quart),
              color var(--duration-fast),
              opacity var(--duration-slow) var(--ease-out-expo),
              transform var(--duration-slow) var(--ease-out-expo)
            `;
            item.style.transitionDelay = `${i * 50}ms`;
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              });
            });
          });

          skillObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  skillCategories.forEach((cat) => skillObserver.observe(cat));

  // ─── Project cards: interactive hover glow ───────────

  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ─── Prefers Reduced Motion Check ────────────────────

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (prefersReducedMotion.matches) {
    // Immediately show all reveal elements
    revealElements.forEach((el) => {
      el.classList.add('is-visible');
    });
  }
})();
