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
    // Generated content, native navigation and the portrait remain usable.
    document.documentElement.classList.remove('has-js');
    console.warn('Using the static portfolio content.', error);
    return;
  }
  import('./motion.js').then(module => module.initMotion(lifetime.signal)).catch(() => {});
}
// BFCache pages retain their enhancements; full navigation disposes allocated resources.
window.addEventListener('pagehide', event => { if (!event.persisted) lifetime.abort(); });
start();
