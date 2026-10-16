const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const dialog = document.querySelector('#menu-dialog');
const dialogOpener = document.querySelector('[data-open-menu]');
const dialogCloser = document.querySelector('[data-close-menu]');

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
  dialogOpener.focus();
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

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
