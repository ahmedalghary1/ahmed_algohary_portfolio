import { loadContent } from './content.js';
import { initLocalization } from './i18n.js';
import { initCaseStudies } from './case-studies.js';
import { initNavigation } from './navigation.js';
import { initContact } from './contact.js';
import { initArchitecture } from './architecture.js';
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
    initArchitecture(content, lifetime.signal);
  } catch (error) {
    // Generated content, native navigation and the portrait remain usable.
    document.documentElement.classList.remove('has-js');
    console.warn('Using the static portfolio content.', error);
    return;
  }
  let idle;
  const enhance = () => {
    if (!lifetime.signal.aborted) import('./motion.js').then(module => module.initMotion(content, lifetime.signal)).catch(() => {});
  };
  const schedule = () => {
    if ('requestIdleCallback' in window) idle = requestIdleCallback(enhance, { timeout: 1500 });
    else idle = setTimeout(enhance, 150);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true, signal: lifetime.signal });
  lifetime.signal.addEventListener('abort', () => {
    if ('cancelIdleCallback' in window) cancelIdleCallback(idle);
    else clearTimeout(idle);
  }, { once: true });
}
// BFCache pages retain their enhancements; full navigation disposes allocated resources.
window.addEventListener('pagehide', event => { if (!event.persisted) lifetime.abort(); });
start();
