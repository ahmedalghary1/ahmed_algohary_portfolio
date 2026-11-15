import { MOTION } from './config.js';
export function projectShowcase(gsap, ScrollTrigger, signal) {
  const section = document.querySelector('#work');
  const stage = section.querySelector('.work-stage');
  const track = section.querySelector('.projects');
  const viewport = section.querySelector('.project-viewport');
  const cards = [...track.querySelectorAll('.project')];
  const tools = section.querySelector('.showcase-tools');
  const progress = tools.querySelector('.showcase-progress');
  const counter = tools.querySelector('[data-project-counter]');
  const previous = tools.querySelector('[data-project-previous]');
  const next = tools.querySelector('[data-project-next]');
  let tween, trigger, active = false, current = 0, abandoned = false;
  const eligible = matchMedia(`(min-width:${MOTION.horizontalMin}px) and (min-height:${MOTION.horizontalHeight}px)`);
  function update(p) {
    current = Math.round(p * (cards.length - 1));
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    progress.style.setProperty('--progress', p);
    previous.setAttribute('aria-disabled', String(current === 0));
    next.setAttribute('aria-disabled', String(current === cards.length - 1));
    document.dispatchEvent(new CustomEvent('portfolio:motion-frame'));
  }
  function disable() {
    active = false;
    trigger?.kill(true); tween?.kill(); trigger = tween = null;
    section.classList.remove('is-horizontal'); tools.hidden = true;
    gsap.set(track, { clearProps: 'transform' });
    stage.style.removeProperty('--card-width');
    viewport.removeAttribute('tabindex'); viewport.removeAttribute('role'); viewport.removeAttribute('aria-label');
  }
  function enable() {
    if (!eligible.matches || abandoned || signal.aborted || /^#(?:case|project)-/.test(location.hash) || cards.some(c => c.querySelector('details').open)) return;
    section.classList.add('is-horizontal');
    stage.style.setProperty('--card-width', `${stage.clientWidth}px`);
    tools.hidden = false;
    if (stage.getBoundingClientRect().height > innerHeight - 36) { disable(); return; }
    active = true;
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', document.documentElement.lang === 'ar' ? 'معرض المشاريع، استخدم الأسهم للتنقل' : 'Project gallery, use arrow keys to navigate');
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const direction = document.documentElement.dir === 'rtl' ? 1 : -1;
    tween = gsap.to(track, { x: () => direction * distance(), ease: 'none',
      scrollTrigger: { id: 'project-showcase', trigger: stage, start: 'top 24px', end: () => `+=${distance()}`,
        pin: true, scrub: MOTION.scrub, invalidateOnRefresh: true,
        onRefreshInit: () => stage.style.setProperty('--card-width', `${section.clientWidth}px`),
        onUpdate: self => update(self.progress) } });
    trigger = tween.scrollTrigger;
    update(trigger.progress);
  }
  function refreshMode() { disable(); enable(); ScrollTrigger.refresh(); }
  function go(index) {
    if (!active || !trigger) return;
    index = Math.max(0, Math.min(cards.length - 1, index));
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * index / (cards.length - 1), behavior: 'instant' });
    // Keyboard positioning should settle immediately so focused controls are never offscreen.
    viewport.scrollLeft = 0;
    trigger.update(); trigger.getTween()?.progress(1); tween.progress(index / (cards.length - 1));
  }
  previous.addEventListener('click', () => go(current - 1), { signal });
  next.addEventListener('click', () => go(current + 1), { signal });
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport || !active) return;
    const forward = document.documentElement.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    if (event.key === forward) { event.preventDefault(); go(current + 1); }
    else if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); go(current - 1); }
    else if (event.key === 'Home') { event.preventDefault(); go(0); }
    else if (event.key === 'End') { event.preventDefault(); go(cards.length - 1); }
  }, { signal });
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.project');
    if (active && card) { go(cards.indexOf(card)); requestAnimationFrame(() => { if(active) viewport.scrollLeft=0; }); }
  }, { signal });
  function nativeStudy(study) {
    if (!active) return;
    abandoned = true;
    const card = study?.closest('.project');
    disable(); ScrollTrigger.refresh();
    card?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  cards.forEach(card => card.querySelector('details').addEventListener('toggle', event => {
    if (event.target.open) nativeStudy(event.target);
  }, { signal }));
  window.addEventListener('hashchange', () => {
    if (/^#(?:case|project)-/.test(location.hash)) nativeStudy(document.querySelector(location.hash));
  }, { signal });
  eligible.addEventListener('change', refreshMode, { signal });
  document.addEventListener('portfolio:language', refreshMode, { signal });
  signal.addEventListener('abort', disable, { once: true });
  enable();
  return { dispose: disable, get active() { return active; } };
}
