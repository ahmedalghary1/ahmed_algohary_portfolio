// All owner-editable content lives here; layout and animation modules never own copy.
export async function loadContent() {
  // Generated from the same JSON as the HTML; core controls need no extra request.
  const embedded = document.querySelector('#portfolio-content');
  if (embedded) {
    try { return JSON.parse(embedded.textContent); }
    catch { /* Older/partial deployments can still use the external source. */ }
  }
  const response = await fetch(new URL('../data/portfolio.json', import.meta.url), { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error('Portfolio content could not be loaded.');
  return response.json();
}
export function getCopy(content, language, path) {
  return path.split('.').reduce((value, part) => value?.[part], content[language]);
}
