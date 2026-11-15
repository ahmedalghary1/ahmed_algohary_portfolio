# Ahmed Algohary — Project-first portfolio

Bilingual static portfolio using the existing HTML, CSS, native JavaScript and Python renderer. No production npm dependencies. The original portrait, paper/ink/vermilion identity, five real projects and contact composer are retained.

## Run and build

```sh
npm start
# http://127.0.0.1:8017
npm run content
npm run check
npm run build
```

Python 3 and Node are required; the build uses only Python's standard library. Use `npm.cmd` in PowerShell if npm.ps1 is blocked. `content` generates English/Arabic homepages, ten case pages, combined CSS, sitemap and robots. `build` regenerates content, replaces `dist/` with a clean static document root, and creates `portfolio-static.zip` from exactly those files. Extract the ZIP contents into a static host document root, or serve `dist/` directly.

Vercel reads `vercel.json`: framework Other (`null`), build command `npm run build`, output directory `dist`, and directory routes with trailing slashes. Use the repository root as the Vercel project root. No SPA fallback or Python serverless functions are needed. Only `dist/` is deployed; source scripts, reports, raw screenshots, development configuration and the ZIP are excluded. The runtime JSON fallback contains the same public content as the generated HTML, excluding owner-only history.

After building, run `npm run test:deployment` to check every output file over a temporary local HTTP server, local HTML links/fragments/assets, CSS URLs, JS imports, sitemap routes, and ZIP parity. Run `npm run preview` for manual review at http://127.0.0.1:8017. Removed routes and stale files are excluded on every build; neither `dist/` nor the ZIP should be committed.

Routes: `/`, `/ar/`, `/projects/<slug>/`, `/ar/projects/<slug>/`. Static directory indexes need no SPA router. `?lang=en|ar` and localStorage retain language selection. Every route works without JavaScript. Old project/case hashes remain real homepage anchors.

## Maintain

- [Plan](REFACTOR_PLAN.md) and [actual results](REFACTOR_REPORT.md)
- [Content guide](PORTFOLIO_CONTENT_GUIDE.md)
- [Design system](DESIGN_SYSTEM.md) and [interaction policy](MOTION_SYSTEM.md)
- [Before/after preview](reports/refactor/compare.html)

Edit data/portfolio.json and data/skills.json, then regenerate. Do not edit generated HTML or css/site.css. Old architecture/experience/full skill records remain as owner reference; only 13 selected technologies are rendered. Unknown project frameworks are not inferred.

Original projects/*.png files are private build inputs. The packager allows only generated project HTML from that folder; it never includes raw PNGs. Public screenshots are the approved redacted WebPs. The supplied root CV is unchanged and its deployed copy is byte-identical.

## Verification

Optional QA tools live outside production in .qa-tools:

```sh
npm install --prefix .qa-tools --no-save playwright @axe-core/playwright lighthouse
npm test
npm run test:contact
npm run test:motion
npm run measure
```

Keep the local server running. Refactor tests use installed Chrome. For measurement/contact set CHROME_PATH when needed (this machine: C:/Program Files/Google/Chrome/Application/chrome.exe). Measurement supports REPORT_DIR, RUNS and TEST_URL; refactor checks support REPORT_DIR and TEST_URL.

`check` validates syntax, translation shape, assets, routes and data. This JavaScript project has no TypeScript checker or configured linter. Older QA scripts and reports/transformation describe the superseded design; use the npm commands above for current acceptance. Tests never send real messages or publish the website.
