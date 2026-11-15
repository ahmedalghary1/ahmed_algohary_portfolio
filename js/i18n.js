import { getCopy } from './content.js';
const supported = ['en', 'ar'];
export function initLocalization(content, signal) {
  let language = 'en';
  try {
    const query = new URL(location.href).searchParams.get('lang');
    const saved = localStorage.getItem('portfolio-language');
    language = supported.includes(query) ? query : supported.includes(saved) ? saved : 'en';
  } catch {
    const query = new URL(location.href).searchParams.get('lang');
    language = supported.includes(query) ? query : 'en';
  }
  function apply(next, persist = false) {
    language = next;
    const html = document.documentElement;
    html.lang = next;
    html.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-copy]').forEach(node => {
      const value = getCopy(content, next, node.dataset.copy);
      if (typeof value === 'string') node.textContent = value;
    });
    document.querySelectorAll('[data-terms]').forEach(node => {
      const terms = getCopy(content, next, node.dataset.terms).split(' / ');
      node.replaceChildren(...terms.flatMap((term, i) => {
        const isolated = document.createElement('bdi');
        isolated.textContent = term;
        if (!/[\u0600-\u06ff]/.test(term)) isolated.translate = false;
        return i ? [document.createTextNode(' / '), isolated] : [isolated];
      }));
    });
    for (const attribute of ['alt', 'aria-label', 'placeholder']) {
      document.querySelectorAll(`[data-copy-${attribute}]`).forEach(node => {
        const value = getCopy(content, next, node.getAttribute(`data-copy-${attribute}`));
        if (typeof value === 'string') node.setAttribute(attribute, value);
      });
    }
    document.querySelectorAll('[data-project-image]').forEach(image => {
      const record = content.profile.projects.find(project => project.image === image.dataset.projectImage);
      if (record) {
        image.src = record.images?.[next] ?? `assets/images/${record.image}-${next}.svg`;
        image.closest('figure').querySelector('[data-project-preview]').href = record.preview ?? image.src;
        if (record.srcset?.[next]) {
          image.srcset = record.srcset[next];
          image.sizes = '(max-width:600px) calc(100vw - 40px), (max-width:1600px) 54vw, 800px';
        } else image.removeAttribute('srcset');
      }
    });
    document.querySelectorAll('[data-profile-image]').forEach(portrait => {
      if (content.profile.portrait) portrait.src = content.profile.portrait;
      if (content.profile.portraitSrcset) portrait.srcset = content.profile.portraitSrcset;
      else portrait.removeAttribute('srcset');
    });
    const switchName = document.querySelector('[data-language-name]');
    switchName.textContent = next === 'en' ? 'العربية' : 'English';
    switchName.lang = next === 'en' ? 'ar' : 'en';
    document.title = content[next].seo.title;
    document.querySelector('meta[name="description"]').content = content[next].seo.description;
    document.querySelector('meta[property="og:title"]').content = content[next].seo.title;
    document.querySelector('meta[property="og:description"]').content = content[next].seo.description;
    document.querySelector('meta[property="og:locale"]').content = next === 'ar' ? 'ar_EG' : 'en_US';
    if (persist) {
      try { localStorage.setItem('portfolio-language', next); } catch { /* Private storage is optional. */ }
      const url = new URL(location.href);
      url.searchParams.set('lang', next);
      history.replaceState(history.state, '', url);
    }
    document.dispatchEvent(new CustomEvent('portfolio:language', { detail: { language: next } }));
  }
  document.querySelectorAll('[data-language]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => apply(language === 'en' ? 'ar' : 'en', true), { signal });
  });
  window.addEventListener('popstate', () => {
    const next = new URL(location.href).searchParams.get('lang');
    if (supported.includes(next)) apply(next);
  }, { signal });
  apply(language);
  return { get language() { return language; } };
}
