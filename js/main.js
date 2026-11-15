import { loadContent } from './content.js';
import { initLocalization } from './i18n.js';
import { initNavigation } from './navigation.js';
import { initContact } from './contact.js';
import { initProjectMedia } from './media.js';
import { initProjectFilters } from './projects.js';
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
    initContact(content, lifetime.signal);
    initProjectMedia(content, lifetime.signal);
    initProjectFilters(content, lifetime.signal);
  } catch (error) {
    // Generated content, native navigation and the portrait remain usable.
    document.documentElement.classList.remove('has-js');
    console.warn('Using the static portfolio content.', error);
    return;
  }
  // Native scrolling and CSS feedback keep project images immediately usable.
}
// BFCache pages retain their enhancements; full navigation disposes allocated resources.
window.addEventListener('pagehide', event => { if (!event.persisted) lifetime.abort(); });
start();
