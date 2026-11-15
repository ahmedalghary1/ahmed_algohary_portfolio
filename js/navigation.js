export function initNavigation(signal) {
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#navigation');
  const mobile = matchMedia('(max-width: 1100px)');
  const header = document.querySelector('.site-header');
  let open = false;
  // Content keys are already translated by i18n. Preserve their text without duplicating copy.
  const menuLabel = () => {
    const node = button.querySelector('[data-copy]');
    return node.querySelector(`.locale-${document.documentElement.lang}`)?.textContent || node.textContent;
  };
  let closedLabel = menuLabel();
  function setOpen(value, returnFocus = false) {
    open = value;
    menu.classList.toggle('is-open', value);
    button.setAttribute('aria-expanded', String(value));
    button.querySelector('[aria-hidden]').textContent = value ? '−' : '+';
    button.querySelector('[data-copy]').textContent = value ? button.dataset.closeLabel : closedLabel;
    if (value) menu.querySelector('a')?.focus({ preventScroll: true });
    if (returnFocus) button.focus({ preventScroll: true });
  }
  button.hidden = false;
  button.addEventListener('click', () => setOpen(!open), { signal });
  menu.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !mobile.matches) return;
    const destination = link.hash ? document.querySelector(link.hash) : null;
    setOpen(false);
    // The activated link is now hidden: move focus into its destination.
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
    }
  }, { signal });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) setOpen(false, true);
  }, { signal });
  document.addEventListener('click', event => {
    if (open && !event.composedPath().includes(header)) setOpen(false);
  }, { signal });
  const onResize = () => { if (!mobile.matches) setOpen(false); };
  mobile.addEventListener('change', onResize, { signal });
  document.addEventListener('portfolio:language', () => {
    closedLabel = menuLabel();
    if (open) setOpen(false);
  }, { signal });
  const links = [...menu.querySelectorAll('a')].filter(link => link.pathname === location.pathname && link.hash);
  const targets = new Map(links.map(link => [link.hash === '#top' ? document.querySelector('.hero') : document.querySelector(link.hash), link]).filter(([target]) => target));
  function activate(link) {
    links.forEach(item => {
      if (item === link) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
  }
  // Observe the reading region instead of forcing layout for every section on scroll.
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => activate(targets.get(entry.target)));
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  targets.forEach((link, target) => observer.observe(target));
  let scrolled = false;
  const updateHeader = () => {
    const next = scrollY > 24;
    if (next !== scrolled) { scrolled = next; header.classList.toggle('is-scrolled', next); }
    if (!next) activate(links.find(link => link.hash === '#top'));
  };
  window.addEventListener('scroll', updateHeader, { passive: true, signal });
  signal.addEventListener('abort', () => observer.disconnect(), { once: true });
  updateHeader();
  // A disclosure menu stays in document flow: no overlay, focus trap or scroll lock.
  document.documentElement.classList.add('js');
}
