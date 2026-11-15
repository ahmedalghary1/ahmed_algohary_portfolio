export function initProjectFilters(content, signal) {
  const controls = document.querySelector('.project-filters');
  if (!controls) return;
  const cards = [...document.querySelectorAll('.project[data-category]')];
  const status = document.querySelector('[data-filter-status]');
  let selected = 'all';
  const update = () => {
    let count = 0;
    for (const card of cards) {
      card.hidden = selected !== 'all' && card.dataset.category !== selected;
      if (!card.hidden) count++;
    }
    controls.querySelectorAll('[data-filter]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === selected));
    });
    status.textContent = `${count} ${content[document.documentElement.lang].work.count}`;
  };
  controls.hidden = false;
  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    selected = button.dataset.filter;
    update();
  }, { signal });
  document.addEventListener('portfolio:language', update, { signal });
}
