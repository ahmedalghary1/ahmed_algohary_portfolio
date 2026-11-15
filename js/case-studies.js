// Native details remain usable without this URL/focus enhancement.
export function initCaseStudies(content, signal) {
  const studies = [...document.querySelectorAll('details[id^="case-"]')];
  function label(study) {
    const node = study.querySelector('summary [data-copy]');
    const key = study.open ? 'closeDetails' : 'details';
    node.dataset.copy = `work.${key}`;
    node.textContent = content[document.documentElement.lang].work[key];
  }
  function readHash() {
    const study = studies.find(node => `#${node.id}` === location.hash);
    if (!study) return;
    study.open = true;
    label(study);
    // The open content and localized fonts must settle before positioning.
    document.fonts.ready.then(() => {
      if (!signal.aborted && location.hash === `#${study.id}`) {
        study.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
  }
  for (const study of studies) {
    study.addEventListener('toggle', () => {
      label(study);
      const url = new URL(location.href);
      if (study.open) url.hash = study.id;
      else if (url.hash === `#${study.id}`) url.hash = study.closest('article').id;
      else return;
      // Share the current disclosure without adding a history entry per toggle.
      history.replaceState(history.state, '', url);
    }, { signal });
  }
  window.addEventListener('hashchange', readHash, { signal });
  document.addEventListener('portfolio:language', () => studies.forEach(label), { signal });
  readHash();
}
