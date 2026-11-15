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
    const destination = document.querySelector(link.hash);
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
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  let frame = 0;
  function update() {
    frame = 0;
    header.classList.toggle('is-scrolled', scrollY > 24);
    const threshold = header.offsetHeight + 100;
    const current = sections.filter(section => section.getBoundingClientRect().top <= threshold).at(-1);
    links.forEach(link => {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  const queueUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', queueUpdate, { passive: true, signal });
  window.addEventListener('resize', queueUpdate, { signal });
  document.addEventListener('portfolio:language', queueUpdate, { signal });
  signal.addEventListener('abort', () => cancelAnimationFrame(frame), { once: true });
  update();
  // A disclosure menu stays in document flow: no overlay, focus trap or scroll lock.
  document.documentElement.classList.add('js');
}
