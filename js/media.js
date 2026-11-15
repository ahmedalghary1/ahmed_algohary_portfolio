// Native dialog supplies modal semantics, inert background and keyboard focus trapping.
// Full-size anchors remain useful when JavaScript or dialog support is unavailable.
export function initProjectMedia(content, signal) {
  const dialog = document.querySelector('#project-lightbox');
  if (!dialog?.showModal) return;
  const projectIndex = content.profile.projects.findIndex(record => record.id === document.documentElement.dataset.projectId);
  const record = content.profile.projects[projectIndex];
  if (!record?.screenshots?.length) return;
  const image = dialog.querySelector('#lightbox-image');
  const caption = dialog.querySelector('#lightbox-caption');
  const counter = dialog.querySelector('#lightbox-counter');
  const error = dialog.querySelector('.lightbox-error');
  const original = dialog.querySelector('#lightbox-original');
  const fullscreen = dialog.querySelector('[data-gallery-fullscreen]');
  const panel = dialog.querySelector('.lightbox-panel');
  const previous = dialog.querySelector('[data-gallery-previous]');
  const next = dialog.querySelector('[data-gallery-next]');
  let index = 0;
  let opener;
  let gesture;
  const language = () => document.documentElement.lang;
  function updateCopy() {
    const lang = language();
    const copy = content[lang].projects[projectIndex].media[index];
    image.alt = copy.alt;
    caption.textContent = `${copy.title} — ${copy.caption}`;
    const number = new Intl.NumberFormat(lang);
    counter.textContent = content[lang].projectUI.imageCount
      .replace('{current}', number.format(index + 1)).replace('{total}', number.format(record.screenshots.length));
  }
  function show(at) {
    index = (at + record.screenshots.length) % record.screenshots.length;
    const media = record.screenshots[index];
    error.hidden = true;
    image.hidden = false;
    image.width = media.width || 1600;
    image.height = media.height || 900;
    image.src = new URL(media.src, document.baseURI).href;
    original.href = image.src;
    updateCopy();
  }
  for (const link of document.querySelectorAll('[data-gallery-index]')) {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      opener = link;
      show(Number(link.dataset.galleryIndex));
      dialog.showModal();
      document.documentElement.classList.add('gallery-open');
    }, { signal });
  }
  const close = () => dialog.close();
  dialog.querySelector('[data-gallery-close]').addEventListener('click', close, { signal });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-open');
    if (document.fullscreenElement === panel) {
      document.exitFullscreen().catch(() => {}).finally(() => opener?.focus({ preventScroll: true }));
    } else opener?.focus({ preventScroll: true });
  }, { signal });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  }, { signal });
  previous.hidden = next.hidden = record.screenshots.length < 2;
  previous.addEventListener('click', () => show(index - 1), { signal });
  next.addEventListener('click', () => show(index + 1), { signal });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button:not(:disabled),a[href]')].filter(node => node.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
      return;
    }
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || record.screenshots.length < 2) return;
    event.preventDefault();
    const forward = language() === 'ar' ? 'ArrowLeft' : 'ArrowRight';
    show(index + (event.key === forward ? 1 : -1));
  }, { signal });
  dialog.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') gesture = { x: event.clientX, y: event.clientY };
  }, { signal });
  dialog.addEventListener('pointerup', event => {
    if (!gesture) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && record.screenshots.length > 1) {
      show(index + ((dx < 0) !== (language() === 'ar') ? 1 : -1));
    }
  }, { signal });
  dialog.addEventListener('pointercancel', () => { gesture = null; }, { signal });
  image.addEventListener('error', () => { image.hidden = true; error.hidden = false; }, { signal });
  fullscreen.hidden = !document.fullscreenEnabled || !panel.requestFullscreen;
  fullscreen.addEventListener('click', () => {
    const action = document.fullscreenElement === panel ? document.exitFullscreen() : panel.requestFullscreen();
    action.catch(() => {}); // Browser fullscreen policy can decline without breaking the viewer.
  }, { signal });
  document.addEventListener('portfolio:language', () => { if (dialog.open) updateCopy(); }, { signal });
  signal.addEventListener('abort', () => {
    if (dialog.open) dialog.close();
    document.documentElement.classList.remove('gallery-open');
  }, { once: true });
}
