// Critical, tiny pre-paint locale selection. The HTML already contains both text variants.
// No content is hidden while fetching JavaScript or JSON; no loading screen is needed.
(() => {
  // Reserve the collapsed mobile header before first paint; recover native links
  // if module loading fails. No-JavaScript browsers keep the expanded navigation.
  document.documentElement.classList.add('has-js');
  setTimeout(() => {
    if (!document.documentElement.classList.contains('js')) document.documentElement.classList.remove('has-js');
  }, 3000);
  let saved;
  try { saved = localStorage.getItem('portfolio-language'); } catch { /* Storage is optional. */ }
  const query = new URL(location.href).searchParams.get('lang');
  const language = ['en', 'ar'].includes(query) ? query : saved === 'ar' ? 'ar' : 'en';
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  const files = language === 'ar' ? ['arabic-arabic-400', 'arabic-arabic-600'] : ['space-grotesk'];
  for (const font of files) {
      const preload = document.createElement('link');
      preload.rel = 'preload'; preload.as = 'font'; preload.type = 'font/woff2'; preload.crossOrigin = '';
      preload.href = `assets/fonts/${font}.woff2`;
      document.head.append(preload);
  }
})();
