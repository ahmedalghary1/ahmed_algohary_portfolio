import { MOTION } from './config.js';
// A vertical editorial sequence. Native scrolling, links and disclosures own navigation.
export function projectShowcase(gsap, ScrollTrigger, signal) {
  const section = document.querySelector('#work');
  const cards = [...section.querySelectorAll('.project')];
  const tools = section.querySelector('.showcase-tools');
  const counter = tools.querySelector('[data-project-counter]');
  const progress = tools.querySelector('.showcase-progress');
  const previous = tools.querySelector('[data-project-previous]');
  const next = tools.querySelector('[data-project-next]');
  const desktop = matchMedia('(min-width:1101px)');
  const ratios = new Map();
  let current = 0;
  const update = () => {
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    progress.style.setProperty('--progress', (current + 1) / cards.length);
    previous.disabled = current === 0;
    next.disabled = current === cards.length - 1;
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
    const visible = [...ratios].filter(([, ratio]) => ratio > 0).sort((a, b) => b[1] - a[1]);
    if (visible.length) current = cards.indexOf(visible[0][0]);
    update();
  }, { threshold: [0, .2, .5, .8] });
  cards.forEach(card => {
    observer.observe(card);
    const image = card.querySelector('.project-window');
    gsap.fromTo(image, { y: 24, rotationX: 3, clipPath: 'inset(4% 0 4% 0)' }, {
      y: 0, rotationX: 0, clipPath: 'inset(0% 0 0% 0)', ease: 'none',
      scrollTrigger: { trigger: image, start: 'top 94%', end: 'top 50%', scrub: MOTION.scrub }
    });
  });
  function go(index) {
    current = Math.max(0, Math.min(cards.length - 1, index));
    cards[current].scrollIntoView({ block: 'start', behavior: 'smooth' });
    update();
  }
  previous.addEventListener('click', () => go(current - 1), { signal });
  next.addEventListener('click', () => go(current + 1), { signal });
  const mode = () => { tools.hidden = !desktop.matches; };
  desktop.addEventListener('change', mode, { signal });
  signal.addEventListener('abort', () => { observer.disconnect(); tools.hidden = true; }, { once: true });
  mode(); update();
}
