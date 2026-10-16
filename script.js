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

function splitHeroWords() {
  document.querySelectorAll('.hero-line > span').forEach((line) => {
    if (line.querySelector('.hero-word')) return;
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
        } else {
          const word = document.createElement('span');
          word.className = 'hero-word';
          word.textContent = part;
          fragment.append(word);
        }
      });
      node.replaceWith(fragment);
    });
  });
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
    splitHeroWords();
    const cinematicEase = (progress) => 1 - Math.pow(1 - progress, 3.8);

    gsap.timeline({ defaults: { ease: cinematicEase } })
      .from('.hero-photo', { autoAlpha: 0.48, duration: 1.35 }, 0)
      .from('.hero-eyebrow', { autoAlpha: 0, y: 20, duration: 0.75 }, 0.12)
      .from('.hero-line > span', { yPercent: 110, duration: 1.15, stagger: 0.15 }, 0.22)
      .from('.hero-word', { autoAlpha: 0, y: 12, filter: 'blur(8px)', duration: 0.95,
        stagger: 0.055, clearProps: 'filter' }, 0.31)
      .from('.hero-copy', { autoAlpha: 0, y: 24, duration: 0.82 }, 0.88)
      .from('.hero-actions > *', { autoAlpha: 0, y: 22, duration: 0.78, stagger: 0.12 }, 1.04)
      .from('.hero-stamp', { autoAlpha: 0, scale: 0.68, rotation: -16, duration: 1.05,
        ease: 'back.out(1.4)' }, 1.12)
      .from('.hero-index', { autoAlpha: 0, y: 15, duration: 0.65 }, 1.23);

    const chapters = [
      { section: '#sabores', heading: '#favorites-title', details: '.section-heading .eyebrow, .section-heading > p' },
      { section: '#cardapio', heading: '#menu-title', details: '.menu-intro .eyebrow, .menu-intro > p, .menu-intro .button, .menu-note' },
      { section: '#nossa-casa', heading: '#place-title', details: '.place-heading .eyebrow, .place-heading > p' },
      { section: '#contato', heading: '#contact-title', details: '.contact-inner .eyebrow, .contact-inner p:not(.eyebrow)' },
    ];

    chapters.forEach(({ section, heading, details }) => {
      gsap.fromTo(heading,
        { clipPath: 'inset(0 0 100% 0)', y: 34 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 45%', scrub: true } });
      gsap.fromTo(details,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, stagger: 0.08, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 82%', end: 'top 42%', scrub: true } });
    });

    gsap.utils.toArray('.flavor-card').forEach((card) => {
      const imageFrame = card.querySelector('.flavor-image-wrap');
      gsap.fromTo(card,
        { autoAlpha: 0, y: 42 },
        { autoAlpha: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 70%', scrub: true } });
      gsap.fromTo(imageFrame,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 68%', scrub: true } });
      gsap.fromTo(card.querySelectorAll('.flavor-info, .flavor-description'),
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, stagger: 0.08, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 62%', scrub: true } });
    });

    gsap.utils.toArray('.place-image').forEach((frame) => {
      gsap.fromTo(frame,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top 90%', end: 'top 68%', scrub: true } });
    });
    gsap.fromTo('.address-row',
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '.address-row', start: 'top 88%', end: 'top 62%', scrub: true } });

    document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', ScrollTrigger.refresh, { once: true });
    return () => document.body.classList.remove('motion-enhanced');
  });

  motion.add('(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)', () => {
    const rows = gsap.utils.toArray('.menu-category');
    const story = gsap.timeline({
      scrollTrigger: {
        trigger: '.menu-section', start: 'top top', end: '+=75%',
        pin: true, pinSpacing: true, scrub: true, anticipatePin: 1, refreshPriority: 1,
      },
    });
    rows.forEach((row) => {
      story.to(row, { x: 18, duration: 1, ease: 'none' })
        .to(row, { x: 0, duration: 1, ease: 'none' });
    });
    story.to('.menu-handwriting', { rotation: 2, y: -18, duration: 1, ease: 'none' }, 0);
  });

  motion.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const wipe = document.createElement('div');
    wipe.className = 'scene-wipe';
    wipe.setAttribute('aria-hidden', 'true');
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    star.setAttribute('class', 'scene-wipe-star');
    star.setAttribute('viewBox', '0 0 100 100');
    const rays = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rays.setAttribute('d', 'M43 0H57L59 31 79 9 90 20 68 41 100 43V57L68 59 90 80 80 90 59 69 57 100H43L41 69 20 90 10 80 31 59 0 57V43L31 41 10 20 20 10 41 31Z');
    rays.setAttribute('fill', 'currentColor');
    star.append(rays);
    wipe.append(star);
    document.body.append(wipe);
    gsap.timeline({ scrollTrigger: { trigger: '.ticker', start: 'top 65%', end: 'top 22%',
      scrub: true } })
      .fromTo(wipe, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08, ease: 'none' }, 0)
      .fromTo(star, { scale: 0.15, rotation: -25 }, { scale: 17, rotation: 35,
        duration: 0.72, ease: 'none' }, 0)
      .to(wipe, { autoAlpha: 0, duration: 0.24, ease: 'none' }, 0.76);

    const lenis = new Lenis({ duration: 0.45, smoothWheel: false, anchors: true,
      prevent: (node) => Boolean(node.closest('dialog')) });
    const originalScrollTo = lenis.scrollTo.bind(lenis);
    lenis.scrollTo = (target, options) => {
      if (target === '#cardapio') {
        const pinnedMenu = ScrollTrigger.getAll().find((trigger) => trigger.vars.pin && trigger.trigger?.id === 'cardapio');
        if (pinnedMenu) {
          const headerOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
          return originalScrollTo(pinnedMenu.start - headerOffset, options);
        }
      }
      return originalScrollTo(target, options);
    };
    smoothScroll = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    gsap.fromTo('.hero-photo', { scale: 1.02, yPercent: 0 }, {
      scale: 1.14, yPercent: 9, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-content', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-stamp', {
      rotation: 32, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.utils.toArray('.flavor-image-wrap img, .place-image img').forEach((image) => {
      gsap.fromTo(image, { yPercent: -6, scale: 1.09 }, {
        yPercent: 6, scale: 1.09, ease: 'none',
        scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    gsap.fromTo('.contact-circle', { scale: 0.88, rotation: -4 }, {
      scale: 1, rotation: 9, ease: 'none',
      scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'center center', scrub: true },
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
      wipe.remove();
    };
  });
}

startCinematicMotion();
