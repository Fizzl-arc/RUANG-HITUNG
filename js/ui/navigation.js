import { pauseQuizTimer, resumeQuizTimer } from '../features/quiz.js';

function showTab(name) {
  const gamePanel = document.getElementById('panel-game');
  if (gamePanel.classList.contains('active') && name !== 'game') pauseQuizTimer();

  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `panel-${name}`);
  });
  document.querySelectorAll('.navbar .nav-link').forEach((link) => {
    const isCurrent = link.dataset.tab === name;
    link.classList.toggle('active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const nav = document.getElementById('mainNavigation');
  if (nav.classList.contains('show') && window.bootstrap) {
    window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'game') resumeQuizTimer();
}

function initializeRevealAnimations() {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-item').forEach((item) => item.classList.add('is-visible'));
    return;
  }

  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-item').forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 90}ms`);
    observer.observe(item);
  });
}

export function initializeNavigation() {
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => showTab(button.dataset.tab));
  });
  initializeRevealAnimations();
}
