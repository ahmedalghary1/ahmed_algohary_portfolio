// SVG connections enhance real links and native disclosures; all copy is pre-rendered.
export function initArchitecture(content, signal) {
  const section = document.querySelector('#architecture');
  if (!section) return;
  const map = section.querySelector('.architecture-map');
  const svg = map.querySelector('svg');
  const layer = svg.querySelector('[data-connections]');
  const links = [...map.querySelectorAll('[data-architecture-node]')];
  const panels = [...section.querySelectorAll('.architecture-explanation')];
  const nodes = new Map(links.map(link => [link.dataset.architectureNode, link]));
  let frame = 0;
  function draw() {
    frame = 0;
    if (signal.aborted) return;
    if (matchMedia('(max-width:800px)').matches) return;
    const bounds = map.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const box = id => {
      const r = nodes.get(id).getBoundingClientRect();
      return { x: r.left - bounds.left, y: r.top - bounds.top, w: r.width, h: r.height };
    };
    const paths = [];
    for (const [from, to] of content.profile.architecture.edges) {
      const a = box(from), b = box(to);
      let d;
      if (from === 'workers' && to === 'postgres') {
        const x = Math.max(a.x + a.w, b.x + b.w) + 22;
        d = `M${a.x+a.w},${a.y+a.h/2}H${x}V${b.y+b.h/2}H${b.x+b.w+4}`;
      } else if (Math.abs(a.x - b.x) < 8) {
        const down = b.y > a.y;
        d = `M${a.x+a.w/2},${down?a.y+a.h:a.y}V${down?b.y-4:b.y+b.h+4}`;
      } else {
        const right = b.x > a.x;
        const sx = right ? a.x+a.w : a.x;
        const ex = right ? b.x-4 : b.x+b.w+4;
        const mid = (sx+ex)/2;
        d = `M${sx},${a.y+a.h/2}H${mid}V${b.y+b.h/2}H${ex}`;
      }
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'architecture-link');
      path.setAttribute('pathLength', '1');
      path.setAttribute('marker-end', 'url(#flow-arrow)');
      path.dataset.from = from; path.dataset.to = to;
      paths.push(path);
      const flow = path.cloneNode();
      flow.setAttribute('class', 'architecture-flow');
      flow.removeAttribute('marker-end');
      flow.setAttribute('pathLength', '1');
      paths.push(flow);
    }
    layer.replaceChildren(...paths);
  }
  const queue = () => { if (!frame) frame = requestAnimationFrame(draw); };
  function select(id) {
    links.forEach(link => {
      const selected = link.dataset.architectureNode === id;
      if (selected) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    layer.querySelectorAll('.architecture-link').forEach(path => path.classList.toggle('is-highlighted', path.dataset.from === id || path.dataset.to === id));
  }
  for (const link of links) link.addEventListener('click', event => {
    event.preventDefault();
    const id = link.dataset.architectureNode;
    const panel = document.getElementById(`architecture-${id}`);
    panel.open = true;
    select(id);
    const url = new URL(location.href); url.hash = panel.id;
    history.replaceState(history.state, '', url);
    panel.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
  }, { signal });
  for (const panel of panels) panel.addEventListener('toggle', () => {
    if (panel.open) select(panel.id.replace('architecture-', ''));
  }, { signal });
  const hash = () => {
    const panel = panels.find(p => `#${p.id}` === location.hash);
    if (panel) { panel.open = true; select(panel.id.replace('architecture-', '')); }
  };
  const resize = new ResizeObserver(queue); resize.observe(map);
  const visibility = new IntersectionObserver(([entry]) => section.classList.toggle('is-in-view', entry.isIntersecting), { threshold: .15 });
  visibility.observe(map);
  window.addEventListener('hashchange', hash, { signal });
  document.addEventListener('portfolio:language', () => document.fonts.ready.then(queue), { signal });
  signal.addEventListener('abort', () => { cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); }, { once: true });
  document.fonts.ready.then(() => { if (!signal.aborted) { draw(); hash(); select(panels.find(p => p.open)?.id.replace('architecture-', '') || 'frontend'); } });
}
