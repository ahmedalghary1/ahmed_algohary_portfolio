import { projectShowcase } from './motion/project-showcase.js';
import { MOTION, qualityTier } from './motion/config.js';

function loadScript(path) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(path, import.meta.url);
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

export async function initMotion(content, signal) {
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const button = document.querySelector('[data-motion-switch]');
  let paused = new URL(location.href).searchParams.get('motion') === 'off';
  let controller, context, engine, generation = 0;
  const isArabic = () => document.documentElement.lang === 'ar';
  function labels() {
    button.hidden = reduced.matches;
    const copy = content[document.documentElement.lang].motion;
    button.textContent = paused ? copy.enable : copy.pause;
    button.setAttribute('aria-pressed', String(paused || reduced.matches));
    document.querySelector('[data-project-previous]').setAttribute('aria-label', copy.previous);
    document.querySelector('[data-project-next]').setAttribute('aria-label', copy.next);
  }
  function stop() {
    controller?.abort(); context?.revert();
    controller = context = null;
    document.documentElement.dataset.motion = 'off';
  }
  async function getEngine() {
    engine ??= (async () => {
      if (!window.gsap) await loadScript('../assets/vendor/gsap.min.js');
      if (!window.ScrollTrigger) await loadScript('../assets/vendor/ScrollTrigger.min.js');
      window.gsap.registerPlugin(window.ScrollTrigger);
      return { gsap: window.gsap, ScrollTrigger: window.ScrollTrigger };
    })();
    return engine;
  }
  function lightweight() {
    controller = new AbortController();
    const life = controller.signal;
    const elements = [...document.querySelectorAll('.section-heading h2,.featured-technology,.project-window,.skill-category,.process-list li,.experience-entry')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-revealed', entry.isIntersecting)), { threshold: .08 });
    elements.forEach(element => { element.classList.add('motion-enter'); observer.observe(element); });
    document.documentElement.dataset.motion = 'on';
    life.addEventListener('abort', () => { observer.disconnect(); elements.forEach(element => element.classList.remove('motion-enter','is-revealed')); }, { once: true });
  }
  async function start() {
    const version = ++generation;
    stop(); labels();
    if (paused || reduced.matches || signal.aborted) return;
    if (qualityTier() === 'light') { lightweight(); return; }
    let tools;
    try { tools = await getEngine(); await document.fonts.ready; }
    catch { engine = null; return; }
    if (version !== generation || paused || reduced.matches || signal.aborted) return;
    const { gsap, ScrollTrigger } = tools;
    controller = new AbortController();
    const life = controller.signal;
    document.documentElement.dataset.motion = 'on';
    context = gsap.context(() => {
      // Core typography is painted immediately. Movement never gates the content.
      if (scrollY < innerHeight) gsap.from('.hero-line', { y: 12, duration: MOTION.reveal, stagger: .06, ease: 'power3.out', clearProps: 'transform' });
      gsap.fromTo('.hero-content', { y: 0, opacity: 1 }, { y: -18, opacity: .88, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: MOTION.scrub } });
      projectShowcase(gsap, ScrollTrigger, life);
      document.querySelectorAll('.section-heading h2,.about-copy,.contact h2,.contact-channel,.contact-form,.skill-category,.process-list li,.experience-entry').forEach(element => {
        gsap.fromTo(element, { y: 16 }, { y: 0, ease: 'none', scrollTrigger: { trigger: element, start: 'top 96%', end: 'top 72%', scrub: MOTION.scrub } });
      });
      // Word/line blocks preserve Arabic shaping. Only Latin editorial headings use a mask.
      if (!isArabic()) document.querySelectorAll('.section-heading h2').forEach(element => {
        gsap.fromTo(element, { clipPath: 'inset(0 0 10% 0)' }, { clipPath: 'inset(0 0 0% 0)', ease: 'none', scrollTrigger: { trigger: element, start: 'top 96%', end: 'top 65%', scrub: MOTION.scrub } });
      });
      gsap.from('.featured-technology', { y: 10, stagger: .025, duration: .45, scrollTrigger: { trigger: '.featured-stack', start: 'top 95%', toggleActions: 'play none none reverse' }, clearProps: 'transform' });
      gsap.fromTo('#architecture', { '--connection-offset': 1 }, { '--connection-offset': 0, ease: 'none', scrollTrigger: { trigger: '#architecture .architecture-map', start: 'top 90%', end: 'center 55%', scrub: MOTION.scrub } });
      gsap.fromTo('.experience-timeline', { '--timeline-progress': 0 }, { '--timeline-progress': 1, ease: 'none', scrollTrigger: { trigger: '.experience-timeline', start: 'top 70%', end: 'bottom 65%', scrub: MOTION.scrub } });
      if (innerWidth > 1100) gsap.fromTo('.about .portrait', { y: 12 }, { y: -12, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: MOTION.scrub } });
    });
    document.querySelectorAll('.project-visual').forEach(element => {
      let frame = 0, x = 0, y = 0;
      const fine = matchMedia('(hover:hover) and (pointer:fine)');
      element.addEventListener('pointermove', event => {
        if (!fine.matches) return;
        x = event.clientX; y = event.clientY;
        if (!frame) frame = requestAnimationFrame(() => {
          frame = 0;
          if (life.aborted) return;
          const r = element.getBoundingClientRect();
          element.style.transform = `rotateX(${-(y-r.top-r.height/2)/r.height*MOTION.tilt}deg) rotateY(${(x-r.left-r.width/2)/r.width*MOTION.tilt}deg)`;
        });
      }, { signal: life });
      const reset = () => { cancelAnimationFrame(frame); frame = 0; element.style.removeProperty('transform'); };
      element.addEventListener('pointerleave', reset, { signal: life });
      life.addEventListener('abort', reset, { once: true });
    });
    import('./motion/scene-manager.js').then(module => { if (!life.aborted) return module.sceneManager(gsap, ScrollTrigger, life); }).catch(() => {});
    ScrollTrigger.refresh();
  }
  const refresh = () => document.fonts.ready.then(() => { if (!signal.aborted) window.ScrollTrigger?.refresh(); });
  button.addEventListener('click', () => { paused = !paused; start(); }, { signal });
  reduced.addEventListener('change', start, { signal });
  matchMedia('(max-width:600px)').addEventListener('change', start, { signal });
  document.addEventListener('portfolio:language', start, { signal });
  document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', refresh, { signal }));
  signal.addEventListener('abort', () => { ++generation; stop(); }, { once: true });
  await start();
}
