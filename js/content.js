// All owner-editable content lives here; layout and animation modules never own copy.
export async function loadContent() {
  const response = await fetch(new URL('../data/portfolio.json', import.meta.url));
  if (!response.ok) throw new Error('Portfolio content could not be loaded.');
  return response.json();
}
export function getCopy(content, language, path) {
  return path.split('.').reduce((value, part) => value?.[part], content[language]);
}
