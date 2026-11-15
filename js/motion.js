function loadScript(path) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(path, import.meta.url).href;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}
export async function initMotion(signal) {
  await loadScript('../assets/vendor/gsap.min.js');
  await loadScript('../assets/vendor/ScrollTrigger.min.js');
  if (signal.aborted) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  let heroPlayed = false;
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 801px)' }, context => {
    if (!context.conditions.motion) return;
    const desktop = context.conditions.desktop;
    // Whole lines preserve Arabic shaping and the accessible name of the heading.
    if (!heroPlayed) gsap.from('.hero-line', { y: 18, duration: .65, stagger: .075, ease: 'power3.out', clearProps: 'all' });
    heroPlayed = true;
    document.querySelectorAll('.project-visual').forEach(visual => {
      gsap.fromTo(visual.querySelector('img'), { clipPath: 'inset(0 0 10% 0)', y: desktop ? 16 : 8 }, {
        clipPath: 'inset(0 0 0% 0)', y: 0, duration: .6, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: visual, start: 'top 91%', once: true }, clearProps: 'clipPath,transform',
      });
    });
    document.querySelectorAll('.section-heading h2, .contact h2').forEach(heading => {
      gsap.from(heading, { y: 14, duration: .5, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: heading, start: 'top 93%', once: true }, clearProps: 'transform' });
    });
    gsap.from('.process-list li', { y: 12, duration: .45, stagger: .065, immediateRender: false,
      scrollTrigger: { trigger: '.process-list', start: 'top 90%', once: true }, clearProps: 'transform' });
  });
  const refresh = async () => {
    await document.fonts.ready;
    if (!signal.aborted) requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  document.addEventListener('portfolio:language', refresh, { signal });
  document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', refresh, { signal }));
  signal.addEventListener('abort', () => mm.revert(), { once: true });
  refresh();
}
