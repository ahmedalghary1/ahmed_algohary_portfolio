export function initNavigation(signal) {
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#navigation');
  const mobile = matchMedia('(max-width: 800px)');
  let open = false;
  // Content keys are already translated by i18n. Preserve their text without duplicating copy.
  let closedLabel = button.querySelector('[data-copy]').textContent;
  function setOpen(value, returnFocus = false) {
    open = value;
    menu.classList.toggle('is-open', value);
    button.setAttribute('aria-expanded', String(value));
    button.querySelector('[aria-hidden]').textContent = value ? '−' : '+';
    button.querySelector('[data-copy]').textContent = value ? button.dataset.closeLabel : closedLabel;
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
    if (open && !event.target.closest('.site-header')) setOpen(false);
  }, { signal });
  const onResize = () => { if (!mobile.matches) setOpen(false); };
  mobile.addEventListener('change', onResize, { signal });
  document.addEventListener('portfolio:language', () => {
    closedLabel = button.querySelector('[data-copy]').textContent;
    if (open) setOpen(false);
  }, { signal });
  // A disclosure menu stays in document flow: no overlay, focus trap or scroll lock.
  document.documentElement.classList.add('js');
}
