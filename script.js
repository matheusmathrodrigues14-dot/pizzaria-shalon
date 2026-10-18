const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const dialog = document.querySelector('#menu-dialog');
const dialogCloser = document.querySelector('[data-close-menu]');
let smoothScroll = null;

// Transcribed from the two original Shalon menu images; prices were not legible there.
const menuCatalog = {
  salgadas: [
    ['Mussarela', 'Mussarela, tomate, azeitonas e orégano.'],
    ['Calabresa', 'Mussarela, calabresa, cebola, azeitonas e orégano.'],
    ['4 Queijos', 'Mussarela, Catupiry, queijo prato e provolone.'],
    ['Atum', 'Mussarela, atum, cebola e azeitonas.'],
    ['Portuguesa', 'Mussarela, calabresa, presunto, ervilha, milho e ovo.'],
    ['Frango com Catupiry', 'Mussarela, frango desfiado, milho, Catupiry e tomate.'],
    ['Frango com Palmito', 'Mussarela, frango desfiado, palmito, Catupiry e tomate.'],
    ['Baiana', 'Mussarela, calabresa apimentada, cebola, ovos e Catupiry.'],
    ['Lombo', 'Mussarela, lombo, Catupiry e tomate.'],
    ['Brasileira', 'Mussarela, frango, presunto, milho e Catupiry.'],
    ['Palmito', 'Mussarela, palmito, Catupiry e tomate.'],
    ['Marguerita', 'Mussarela, manjericão, parmesão, Catupiry e tomate.'],
    ['Bacon', 'Mussarela, bacon, tomate e azeitonas.'],
    ['Bauru', 'Mussarela, presunto, Catupiry e tomate.'],
    ['Milho', 'Mussarela, milho, Catupiry e tomate.'],
    ['Salame', 'Mussarela, salame, Catupiry e tomate.'],
  ],
  especiais: [
    ['Portuguesa Super', 'Mussarela, presunto, palmito, ervilha, milho, ovo e Catupiry.'],
    ['Batata', 'Mussarela, purê de batata, calabresa e Catupiry.'],
    ['Batata Super', 'Mussarela, purê de batata, bacon e Catupiry.'],
    ['Brócolis com Bacon', 'Mussarela, brócolis refogado ao alho, bacon e Catupiry.'],
    ['Alho e Óleo', 'Mussarela, alho gratinado, manjericão, Catupiry e tomate.'],
    ['À Moda da Casa', 'Mussarela, presunto, calabresa, lombo, frango, brócolis, bacon, milho, palmito e Catupiry.'],
    ['Hot Dog', 'Mussarela, salsicha, azeitonas, orégano e Catupiry.'],
    ['Creme de Milho', 'Mussarela, creme de milho, Catupiry e tomate.'],
    ['Strogonoff de Frango'],
    ['Popy Corn', 'Mussarela, Catupiry, bacon, milho e tomate.'],
    ['Mexicana', 'Cebola, bacon, alho, mussarela e tomate.'],
    ['Peruana', 'Mussarela, atum, ovo, cebola e azeitonas.'],
    ['Paulista', 'Mussarela, frango, bacon, Catupiry e tomate.'],
    ['Toscana', 'Mussarela, calabresa, Catupiry e tomate.'],
    ['Vegetariana', 'Mussarela, milho, ervilha, palmito, ovo, brócolis e Catupiry.'],
    ['Aliche', 'Mussarela, aliche, parmesão, Catupiry e tomate.'],
    ['Super Mussarela', 'Mussarela, palmito, bacon, Catupiry e tomate.'],
    ['Peperoni', 'Mussarela, peperoni, Catupiry e tomate.'],
    ['Bolonhesa', 'Mussarela, carne moída refogada ao alho e tomate.'],
    ['Americana', 'Mussarela, presunto, bacon, cebola, tomate e ketchup.'],
    ['Carne Seca', 'Mussarela, Catupiry, carne seca e tomate.'],
    ['Peito de Peru', 'Mussarela, peito de peru, Catupiry e tomate.'],
    ['Rúcula', 'Mussarela, Catupiry, rúcula e tomate seco.'],
    ['Escarola', 'Mussarela, bacon, escarola, cebola e alho frito.'],
  ],
  doces: [
    ['Brigadeiro'], ['Beijinho'], ['Confete'], ['Morango'],
    ['Mesclada (P e B)'], ['Banana'], ['Choquito'],
    ['Romeu e Julieta'], ['Prestígio'], ['Doce de Leite'],
  ],
};

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

const dialogItems = document.querySelector('#dialog-items');
let menuOpener = null;
document.querySelectorAll('[data-menu-category]').forEach((button) => {
  button.addEventListener('click', () => {
    menuOpener = button;
    const category = button.dataset.menuCategory;
    const flavors = menuCatalog[category];
    const card = button.closest('.flavor-card');
    document.querySelector('#dialog-title').textContent = card.querySelector('h3').textContent;
    document.querySelector('#dialog-count').textContent = `${flavors.length} sabores`;
    document.querySelector('#dialog-photo').src = card.querySelector('img').src;
    dialogItems.classList.toggle('menu-items-sweet', category === 'doces');
    dialogItems.replaceChildren(...flavors.map(([name, ingredients]) => {
      const item = document.createElement('li');
      const label = document.createElement('strong');
      label.textContent = name;
      item.append(label);
      if (ingredients) {
        const description = document.createElement('span');
        description.textContent = ingredients;
        item.append(description);
      }
      return item;
    }));
    dialog.querySelector('.menu-dialog-body').scrollTop = 0;
    smoothScroll?.stop();
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
dialogCloser.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  smoothScroll?.start();
  menuOpener?.focus();
});

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

  motion.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    // The Shalon pizza mark travels and grows with the existing scene wipe.
    const pizza = document.querySelector('.brand-mark svg').cloneNode(true);
    pizza.classList.add('scroll-pizza');
    pizza.setAttribute('aria-hidden', 'true');
    pizza.setAttribute('focusable', 'false');
    document.body.append(pizza);
    gsap.set(pizza, { y: -140, rotation: -18, scale: 0.88 });
    gsap.timeline({ scrollTrigger: {
      trigger: '.ticker', start: 'top bottom', end: 'top 22%', scrub: true,
    } })
      .to(pizza, { y: 0, rotation: 24, scale: 1.36, duration: 0.45, ease: 'none' }, 0)
      .to(pizza, { rotation: 60, scale: 7, duration: 0.37, ease: 'none' }, 0.45)
      .to(pizza, { autoAlpha: 0, duration: 0.18, ease: 'none' }, 0.82);

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
      pizza.remove();
      wipe.remove();
    };
  });
}

startCinematicMotion();
