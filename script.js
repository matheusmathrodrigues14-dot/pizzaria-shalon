const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const dialog = document.querySelector('#menu-dialog');
const dialogOpener = document.querySelector('[data-open-menu]');
const dialogCloser = document.querySelector('[data-close-menu]');
let smoothScroll = null;

function closeMobileMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  mobileNav.hidden = true;
}

menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  mobileNav.hidden = !opening;
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
window.addEventListener('resize', () => {
  if (window.innerWidth > 760 && !mobileNav.hidden) closeMobileMenu();
});

dialogOpener.addEventListener('click', () => {
  smoothScroll?.stop();
  dialog.showModal();
  document.body.classList.add('dialog-open');
});
dialogCloser.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('cancel', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  smoothScroll?.start();
  dialogOpener.focus();
});

const imageDialog = document.querySelector('#image-dialog');
const enlargedImage = imageDialog.querySelector('img');
let lastZoomButton = null;
document.querySelectorAll('[data-zoom-menu]').forEach((button) => {
  button.addEventListener('click', () => {
    lastZoomButton = button;
    const previewImage = button.querySelector('img');
    enlargedImage.src = previewImage.src;
    enlargedImage.alt = previewImage.alt;
    imageDialog.showModal();
  });
});
imageDialog.querySelector('[data-close-image]').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', (event) => {
  if (event.target === imageDialog) imageDialog.close();
});
imageDialog.addEventListener('close', () => lastZoomButton?.focus());

document.querySelector('#year').textContent = new Date().getFullYear();

const progress = document.querySelector('.scroll-progress');
let scrollTicking = false;
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0}%`;
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateProgress);
    scrollTicking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

function startBasicReveal() {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach((element) => observer.observe(element));
  document.body.classList.add('motion-ready');
}

function startCinematicMotion() {
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) {
    startBasicReveal();
    return;
  }

  const { gsap, ScrollTrigger, Lenis } = window;
  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    document.body.classList.add('motion-enhanced');

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-line > span', { yPercent: 110, duration: 1.1, stagger: 0.12 })
      .from(['.hero-eyebrow', '.hero-copy', '.hero-actions'], { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 }, 0.15)
      .from('.hero-stamp', { autoAlpha: 0, scale: 0.68, rotation: -16, duration: 1.1, ease: 'back.out(1.4)' }, 0.5);

    const chapters = [
      { section: '#sabores', heading: '#favorites-title', details: '.section-heading .eyebrow, .section-heading > p' },
      { section: '#cardapio', heading: '#menu-title', details: '.menu-intro .eyebrow, .menu-intro > p, .menu-intro .button, .menu-note' },
      { section: '#nossa-casa', heading: '#place-title', details: '.place-heading .eyebrow, .place-heading > p' },
      { section: '#contato', heading: '#contact-title', details: '.contact-inner .eyebrow, .contact-inner p:not(.eyebrow)' },
    ];

    chapters.forEach(({ section, heading, details }) => {
      gsap.fromTo(heading,
        { clipPath: 'inset(0 0 100% 0)', y: 34 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.15, ease: 'power3.out', clearProps: 'clipPath,transform',
          scrollTrigger: { trigger: section, start: 'top 78%', once: true } });
      gsap.from(details, {
        autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      });
    });

    gsap.utils.toArray('.flavor-card').forEach((card, index) => {
      const imageFrame = card.querySelector('.flavor-image-wrap');
      gsap.fromTo(imageFrame,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, delay: index * 0.1, ease: 'power3.inOut', clearProps: 'clipPath',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
      gsap.from(card.querySelectorAll('.flavor-info, .flavor-description'), {
        autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.1, delay: index * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 82%', once: true },
      });
    });

    gsap.utils.toArray('.place-image').forEach((frame, index) => {
      gsap.fromTo(frame,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.25, delay: index * 0.12, ease: 'power3.inOut', clearProps: 'clipPath',
          scrollTrigger: { trigger: frame, start: 'top 85%', once: true } });
    });
    gsap.from('.address-row', {
      autoAlpha: 0, y: 28, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.address-row', start: 'top 88%', once: true },
    });

    document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', ScrollTrigger.refresh, { once: true });
    return () => document.body.classList.remove('motion-enhanced');
  });

  motion.add('(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)', () => {
    const rows = gsap.utils.toArray('.menu-category');
    const story = gsap.timeline({
      scrollTrigger: {
        trigger: '.menu-section', start: 'top top', end: '+=75%',
        pin: true, pinSpacing: true, scrub: 0.8, anticipatePin: 1, refreshPriority: 1,
      },
    });
    rows.forEach((row) => {
      story.to(row, { x: 18, duration: 1, ease: 'none' })
        .to(row, { x: 0, duration: 1, ease: 'none' });
    });
    story.to('.menu-handwriting', { rotation: 2, y: -18, duration: 1, ease: 'none' }, 0);
  });

  motion.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true,
      prevent: (node) => Boolean(node.closest('dialog')) });
    smoothScroll = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    gsap.fromTo('.hero-photo', { scale: 1.02, yPercent: 0 }, {
      scale: 1.14, yPercent: 9, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.hero-content', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.hero-stamp', {
      rotation: 32, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });

    gsap.utils.toArray('.flavor-image-wrap img, .place-image img').forEach((image) => {
      gsap.fromTo(image, { yPercent: -6, scale: 1.09 }, {
        yPercent: 6, scale: 1.09, ease: 'none',
        scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });
    });
    gsap.fromTo('.contact-circle', { scale: 0.88, rotation: -4 }, {
      scale: 1, rotation: 9, ease: 'none',
      scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'center center', scrub: 1 },
    });

    const cleanups = [];
    document.querySelectorAll('.button, .header-order, .contact-circle').forEach((element) => {
      const move = (event) => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
        const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
        gsap.to(element, { x, y, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      };
      const reset = () => gsap.to(element, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.6)' });
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerleave', reset);
      cleanups.push(() => {
        element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerleave', reset);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      gsap.ticker.remove(tick);
      lenis.destroy();
      smoothScroll = null;
    };
  });
}

startCinematicMotion();
