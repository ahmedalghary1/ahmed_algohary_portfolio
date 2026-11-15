import { loadContent } from './content.js';
import { initLocalization } from './i18n.js';
import { initCaseStudies } from './case-studies.js';
import { initNavigation } from './navigation.js';
import { initContact } from './contact.js';
const lifetime = new AbortController();
let started = false;
async function start() {
  if (started) return;
  started = true;
  let content;
  try {
    content = await loadContent();
    initLocalization(content, lifetime.signal);
    const menu = document.querySelector('.menu-toggle');
    menu.dataset.closeLabel = content[document.documentElement.lang].nav.close;
    document.addEventListener('portfolio:language', ({ detail }) => {
      menu.dataset.closeLabel = content[detail.language].nav.close;
    }, { signal: lifetime.signal });
    initNavigation(lifetime.signal);
    initCaseStudies(content, lifetime.signal);
    initContact(content, lifetime.signal);
  } catch (error) {
    // The generated English HTML, native navigation and SVG sculpture remain usable.
    document.documentElement.classList.remove('has-js');
    console.warn('Using the static portfolio content.', error);
    return;
  }
  import('./motion.js').then(module => module.initMotion(lifetime.signal)).catch(() => {});
  const enhanceScene = () => {
    if (lifetime.signal.aborted || matchMedia('(prefers-reduced-motion: reduce), (max-width: 600px)').matches) return;
    const host = document.querySelector('#sculpture');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      import('./scene.js').then(module => module.initScene(content, lifetime.signal)).catch(() => {});
    });
    observer.observe(host);
    lifetime.signal.addEventListener('abort', () => observer.disconnect(), { once: true });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(enhanceScene, { timeout: 2000 });
  else setTimeout(enhanceScene, 500);
}
// BFCache pages retain their enhancements; full navigation disposes allocated resources.
window.addEventListener('pagehide', event => { if (!event.persisted) lifetime.abort(); });
start();
