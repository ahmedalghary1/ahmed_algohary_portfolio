# Ahmed Algohary — Cinematic Engineering Portfolio

A bilingual, progressively enhanced portfolio built on the existing semantic HTML, CSS and native JavaScript modules. Paper, ink, vermilion, the original editorial headline, the owner's portrait and all five real project screenshots are preserved. No framework migration or new production dependency was introduced.

The site now includes an architectural Three.js hero, compact technology overview, featured business system and ten-part case studies, an accessible SVG architecture demonstration, employment/training timeline, six expandable skill categories with all 77 unique skills, six-stage process, verified contact links and the owner's CV.

## Run and build

```sh
npm start
# http://127.0.0.1:8017

npm run content
npm run check
npm run build
```

Use `npm.cmd` in Windows PowerShell if `npm.ps1` is blocked. Python 3 and Node are sufficient; production assets are already self-hosted. `npm run content` generates both `index.html` and `ar/index.html`, a cache-versioned CSS bundle, sitemap and robots. Run it after changing content or modular CSS. `npm run build` refreshes generated files and creates `portfolio-static.zip`; it does not publish.

English is served at `/`; Arabic has real static HTML at `/ar/`. Existing `?lang=en|ar`, project IDs and case-study hashes remain supported. Native links/details and both document routes work without JavaScript. Animation and WebGL are always optional. Mobile, Save Data and constrained hardware skip animation vendor downloads; desktop/tablet use a single demand-driven canvas when capable.

## Content and documentation

- [Enhancement plan and phase evidence](PORTFOLIO_ENHANCEMENT_PLAN.md)
- [Current design system](DESIGN_SYSTEM.md)
- [Motion architecture](MOTION_SYSTEM.md)
- [Project, skills, experience, translation, contact and CV guide](PORTFOLIO_CONTENT_GUIDE.md)
- [Final QA results and known limits](FINAL_QA_REPORT.md)
- [Before/after screenshots](reports/transformation/compare.html)

Edit `data/portfolio.json` for bilingual identity/content, project assets, experience, architecture and contacts. Edit `data/skills.json` for skill IDs, icons, descriptions, featured tools and categories. Keep locale structures and project-array ordering aligned. The renderer preserves the existing shareable `#project-ID` and `#case-ID` links.

Only actual redacted project WebPs are used publicly. The original ignored `projects/` screenshots and source portrait are excluded from deployment. The root owner-supplied PDF remains unchanged; its byte-identical deployed copy is `assets/documents/ahmed-algohary-cv.pdf`. The current website follows the owner's latest phone/GitHub choices, which differ from the PDF; the content guide records the discrepancy.

## QA

Browser QA uses optional dependencies in the ignored `.qa-tools/` directory, not production dependencies:

```sh
npm install --prefix .qa-tools --no-save playwright @axe-core/playwright lighthouse
npm test
npm run test:layouts
npm run test:contact
npm run test:motion
node scripts/skills-check.mjs
node scripts/stability-check.mjs
npm run measure
```

The local server must be running. Set `CHROME_PATH` if needed; this Windows session uses `C:/Program Files/Google/Chrome/Application/chrome.exe`. General QA/measurement tools support `TEST_URL`, `QA_ROOT`, `REPORT_DIR` or `RUNS` where documented in their source. Existing focused contact/skill/stability scripts target port 8017. `npm run check` validates syntax, translation shape, copy references, skills, assets, contact URL protocols and PDF bytes. No linter or TypeScript checker was configured in the original project; the check does not claim to be either.

Lighthouse is a mobile lab measurement, not field Core Web Vitals. TBT is not INP. The managed browser intercepts native PDF downloads, so direct HTTP/CV hash verification is reported separately from that automation limit. No real WhatsApp messages are sent by tests.

To restore the pinned runtime files only when needed:

```sh
npm ci
npm run vendor
```

See `THIRD_PARTY.md` and the local font/vendor license files. Existing older reports remain historical records; `FINAL_QA_REPORT.md` and `reports/transformation/` describe this enhancement.
