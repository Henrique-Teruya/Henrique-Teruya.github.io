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
  const heroVideo = document.getElementById('hero-video');
  const videoSrc = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

  // ─── Video Background HLS Init ───────────────────────

  if (heroVideo) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(heroVideo);
    } 
    // Safari has native HLS support
    else if (heroVideo.canPlayType('application/vnd.apple.mpegurl')) {
      heroVideo.src = videoSrc;
    }
  }

  // ─── Vertical Cut Reveal Integration ───────────────────
  
  const cutRevealElements = document.querySelectorAll('.vertical-cut-reveal');

  cutRevealElements.forEach(el => {
    // Check if it has a base delay from reveal-d* classes
    let baseDelay = 0;
    if (el.classList.contains('reveal-d1')) baseDelay = 100;
    else if (el.classList.contains('reveal-d2')) baseDelay = 200;
    else if (el.classList.contains('reveal-d3')) baseDelay = 300;
    else if (el.classList.contains('reveal-d4')) baseDelay = 400;

    const newHtml = [];
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char === ' ') {
            newHtml.push('<span class="v-cut-space">&nbsp;</span>');
          } else if (char === '\n' || char === '\r') {
            // Ignore raw newlines
          } else {
            newHtml.push(`<span class="v-cut-outer"><span class="v-cut-inner">${char}</span></span>`);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        newHtml.push('<br>');
      } else {
        newHtml.push(node.outerHTML || node.textContent);
      }
    });
    
    el.innerHTML = newHtml.join('');

    const innerSpans = el.querySelectorAll('.v-cut-inner');
    innerSpans.forEach((span, i) => {
      // 25ms stagger per character as requested
      span.style.transitionDelay = `${baseDelay + (i * 25)}ms`;
    });
  });

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

  // ─── Stat Count-up Animation ─────────────────────────

  const countElements = document.querySelectorAll('[data-count-target]');

  const animateCount = (el) => {
    let target = parseInt(el.getAttribute('data-count-target'));

    // Handle dynamic date targets
    const dateAttr = el.getAttribute('data-count-date');
    if (dateAttr) {
      const startDate = new Date(dateAttr + 'T00:00:00');
      const today = new Date();
      if (!isNaN(startDate.getTime())) {
        const timeDiff = today - startDate;
        target = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
      }
    }

    if (isNaN(target)) return;

    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = Math.floor(easeProgress * (target - start) + start);
      el.textContent = currentCount;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target; // Ensure it ends exactly at target
      }
    };

    requestAnimationFrame(update);
  };

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  countElements.forEach((el) => countObserver.observe(el));

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

  // ─── Lightbox Logic ──────────────────────────────────

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  const projectImages = document.querySelectorAll('.project-mosaic img');

  let currentGallery = [];
  let currentIndex = 0;

  const openLightbox = (imgEl) => {
    const parentMosaic = imgEl.closest('.project-mosaic');
    currentGallery = Array.from(parentMosaic.querySelectorAll('img'));
    currentIndex = currentGallery.indexOf(imgEl);

    updateLightbox();
    
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  };

  const updateLightbox = () => {
    const targetImg = currentGallery[currentIndex];
    lightboxImg.src = targetImg.src;
    lightboxImg.alt = targetImg.alt;

    // Show/hide arrows based on gallery size
    if (currentGallery.length > 1) {
      lightboxPrev.style.display = 'flex';
      lightboxNext.style.display = 'flex';
    } else {
      lightboxPrev.style.display = 'none';
      lightboxNext.style.display = 'none';
    }
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  };

  const navigateLightbox = (direction) => {
    currentIndex = (currentIndex + direction + currentGallery.length) % currentGallery.length;
    updateLightbox();
  };

  projectImages.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.closest('.lightbox-content')) {
      if (e.target !== lightboxImg) closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentGallery.length > 1) navigateLightbox(-1);
    if (e.key === 'ArrowRight' && currentGallery.length > 1) navigateLightbox(1);
  });

  // ─── Language Dropdown Toggle ──────────────────────
  const langDropdown = document.getElementById('lang-dropdown');
  if (langDropdown) {
    const btn = langDropdown.querySelector('.lang-dropdown-btn');
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = langDropdown.classList.toggle('is-active');
      btn.setAttribute('aria-expanded', isActive);
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!langDropdown.contains(e.target)) {
        langDropdown.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langDropdown.classList.contains('is-active')) {
        langDropdown.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  // ─── Language Toast ──────────────────────────────────
  const langToast = document.getElementById('lang-toast');
  if (langToast) {
    const closeBtn = document.getElementById('lang-toast-close');
    const heroSection = document.getElementById('hero');
    
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('langToastDismissed');
    
    if (!isDismissed) {
      // Show it after a small delay
      setTimeout(() => {
        // Only show if we are still at the top
        if (window.scrollY < (heroSection ? heroSection.offsetHeight * 0.5 : 300)) {
          langToast.classList.add('is-visible');
        }
      }, 1500);
      
      const dismissToast = () => {
        langToast.classList.remove('is-visible');
        sessionStorage.setItem('langToastDismissed', 'true');
      };

      if (closeBtn) {
        closeBtn.addEventListener('click', dismissToast);
      }
      
      // Dismiss toast if the user clicks the dropdown
      if (langDropdown) {
        const dropBtn = langDropdown.querySelector('.lang-dropdown-btn');
        if (dropBtn) {
          dropBtn.addEventListener('click', dismissToast);
        }
      }

      // Hide on scroll past hero
      const handleToastScroll = () => {
        if (sessionStorage.getItem('langToastDismissed')) return;
        
        const heroBottom = heroSection ? heroSection.offsetHeight : 400;
        if (window.scrollY > heroBottom * 0.5) {
          dismissToast();
          window.removeEventListener('scroll', handleToastScroll);
        }
      };

      window.addEventListener('scroll', handleToastScroll, { passive: true });
    }
  }
})();
