# Final QA report

Verified locally on 15 November 2026. Baseline checkout: `b74e9ec`. This report describes the complete enhancement and the owner's subsequent portrait-only hero revision. Production hosting was not changed.

## Delivered behavior

- Original personal photograph in Hero and About. The owner explicitly requested removal of the sculpture; its hero/contact markup, model module, generator and decorative sculpture assets are removed. The hero has no canvas or 3D object.
- Original paper/ink/vermilion identity, editorial headline, typography, five real projects, genuine screenshots and existing project/case anchors preserved.
- Compact 12-technology overview; featured garment system followed by ROCKS EV, Bonyan, Ahmed Gamal and Ahmed Nabil; ten-part native, shareable case studies with original imagery.
- Conceptual architecture diagram with seven coherent directed relationships, real HTML explanations and separate Docker/CI/CD/cloud delivery infrastructure. Mobile uses a vertical diagram.
- Two verified employment entries, clearly distinguished CODE4LEARN training, six expertise categories retaining all 77 unique skills, and six engineering-process stages.
- Verified email, WhatsApp, GitHub, LinkedIn, LeetCode and CV destinations. Original CV preserved byte-for-byte. The contact form prepares a WhatsApp draft or copies text; tests send no real messages.
- Accessible sticky navigation, active section indicators, keyboard menu focus/Escape behavior, native disclosures, visible focus and reduced-motion support.
- Real static English `/` and Arabic `/ar/` documents, continued query-language support, localized metadata, canonical/hreflang, Person/WebSite/ProfilePage/CreativeWork data, portrait-based social image, sitemap and robots.
- Native lightweight mobile motion without GSAP/Three.js downloads; one lazy desktop renderer for brief project-image overlays only. No new production dependencies or framework migration.

## Actual before/after performance

One fresh mobile Lighthouse run per locale before and after, using Lighthouse **13.6.0**, Chrome **158.0.8127.36**, the same machine and local Python server at `127.0.0.1:8017`. Both use simulated mobile throttling: 150ms RTT, 1638.4Kbps throughput, 4× CPU slowdown, 412×823 CSS viewport and 1.75 device scale. Reports include the full settings. Intermediate optimization measurements are retained separately and are not substituted for the final results.

| Measurement | EN before | EN final | AR before | AR final |
| --- | ---: | ---: | ---: | ---: |
| Performance | 90 | 91 | 87 | 86 |
| Accessibility | 100 | 100 | 100 | 100 |
| Best Practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| FCP | 1.8s | 1.9s | 1.8s | 1.9s |
| LCP | 3.4s | 3.3s | 3.9s | 3.2s |
| TBT | 40ms | 50ms | 40ms | 280ms |
| CLS | 0.051 | 0 | 0.012 | 0.013 |
| Total measured transfer | 572KiB | 465KiB | 680KiB | 573KiB |

Measured transfer fell by approximately 107KiB in each locale, and LCP improved in both. English meets the 90 performance target; Arabic does not. Neither locale meets the 2.5s LCP target in this local throttled run. Arabic blocking time is higher in the final sample and remains a performance gap. CLS remains below 0.1 in both languages. These single-run lab comparisons have normal variability; they are not field Core Web Vitals or proof of an INP result. **INP was not measured.**

Implemented optimizations include a single generated/cache-versioned CSS request, preserving already-painted bilingual text, deferred optional scripts, mobile below-fold content visibility, responsive 480/640/896/1122px portrait sources, lazy noncritical images and desktop project-only WebGL initialization. The simple local server does not provide production compression or cache headers; production delivery still needs appropriate compression/caching and a fresh measurement. No production score is claimed.

Raw reports: [EN baseline](reports/transformation/before/lighthouse-en.html), [AR baseline](reports/transformation/before/lighthouse-ar.html), [EN final](reports/transformation/after/lighthouse-en.html), [AR final](reports/transformation/after/lighthouse-ar.html).

The final project-scroll probe recorded **96 frame intervals**, median **16.7ms**, p95 **16.8ms**, and at most **one observed draw call**, at 1440×1000 with a 1440×1000 buffer. This short headless sample is consistent with approximately 60Hz RAF cadence in those conditions; it is not a physical-device FPS guarantee. [Motion evidence](reports/transformation/after/motion-checks.json).

## Automated and browser verification

| Check | Final result | Evidence |
| --- | --- | --- |
| Syntax/content/assets | Pass: JS/Python syntax, aligned locales, copy references, 77 unique skills, icons, assets, contact URL schemes and PDF signature | `node scripts/check.mjs` |
| Original interaction regression suite | 24 checks pass; no uncaught page errors | [interaction results](reports/interaction-tests.json) |
| Enhancement functional suite | 21 groups pass; one explicitly recorded external PDF-download verification limitation; no unexpected browser errors | [functional results](reports/transformation/after/functional-checks.json) |
| Responsive layouts | 22 EN/AR combinations pass; no horizontal overflow or uncaught errors | [layout results](reports/transformation/after/browser-audit.json) |
| Full-page accessibility | Four axe audits pass with zero violations, including WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags | same layout report |
| Contact | Eight layout/axe checks and nine behavior checks pass, including validation, first-error focus, real clipboard, denied-clipboard fallback, preserved drafts and intercepted WhatsApp handoff | [contact results](reports/contact/checks.json) |
| Skills | Ten EN/AR layout/axe checks pass; all 77 skills, six categories, 12 featured technologies, native expansion, no-JS content and motion checks pass | [skills results](reports/skills/checks.json) |
| Motion | Both languages pass native/reverse scrolling, project controls, keyboard links, details, pause/resume, breakpoints, reduced motion, unavailable WebGL, idle stopping, context loss/restoration and disposal | [motion results](reports/transformation/after/motion-checks.json) |
| Stability | Offscreen pointer movement produces zero WebGL frames; readable WhatsApp hover; 18 stop/start cycles retain one renderer without context warnings; simulated GPU failure tears down safely; embedded content works with JSON endpoint blocked | [stability results](reports/stability/checks.json) |
| Static production package | ZIP integrity, original CV checksum, localized document inclusion and exclusion of originals/QA/sculpture assets verified | [package results](reports/transformation/after/package-checks.json) |

No linter or TypeScript checker existed in the original project. Syntax/content checks are provided without claiming to be either. Automated axe and keyboard checks do not establish complete WCAG conformance or replace screen-reader testing.

The layout matrix includes **320, 375, 390, 430, 768, 1024, 1440 and 1920px**, plus 844px landscape, 1280px and 2560px, in both languages. Normal-motion checks additionally cover 390/768/1440px in both locales. Native English and Arabic content/navigation/details work without JavaScript. The 200%-equivalent reflow checks pass. All five original case-study URLs are exercised in both languages.

## Visual evidence

[Before/after comparison](reports/transformation/compare.html) contains the fresh English/Arabic 390px and 1440px baseline and final full-page images. Final normal-motion hero/work/contact screenshots are under `reports/transformation/after/`; the complete width matrix is under `after/screenshots/`.

The final portrait-only hero was visually inspected in English desktop and Arabic mobile, along with the responsive full-page compositions, project showcase, architecture diagram and sharing image. Older phase screenshots containing the abandoned sculpture direction are historical evidence and are not deployed.

## Verification limits and remaining gaps

1. **Native PDF click automation is externally blocked.** Managed Chrome returns HTTP 204/empty content for browser PDF requests and cancels its native download event. Direct HTTP requests return **200**, a valid **78,847-byte** PDF, and the exact source checksum. Standard same-origin download links remain enabled because the real file exists. A temporary blob workaround was removed after checksum testing revealed the interception. An unmanaged browser download should still be checked before production sign-off; no successful managed click-download is claimed.
2. **Performance targets are not all met.** Arabic performance is 86 and final LCP remains above 2.5s. TBT is not INP. Production compression/caching and further Arabic startup profiling require another measurement; field performance, long-duration heap profiling and physical Safari/Firefox testing were not available.
3. **External uptime could not be fully verified.** The owner-supplied GitHub profile was retrieved successfully. The web tool could not retrieve the production portfolio, four original project sites, LinkedIn or LeetCode. This does not establish that those sites are down. Their original/verified destinations are preserved. Local anchors, asset requests and metadata files resolve. [Link evidence](reports/transformation/after/link-checks.json).
4. **Project evidence remains bounded.** Each existing project has one actual screenshot. Project-specific stacks/infrastructure, extra gallery views and client metrics are not inferred. The architecture is explicitly conceptual. The private garment system has redacted imagery and no public live link.
5. **Contact/CV discrepancy is recorded.** The owner confirmed WhatsApp `201156972307` and GitHub `ahmedalghary1` for the website. The supplied PDF lists phone `+201552810113` and GitHub `ahmedalgohary1170`. The website follows the newer explicit instructions; the PDF is unchanged. Email matches. LinkedIn and LeetCode come from actual PDF link annotations.

## Baseline versus implementation issues

The fresh baseline had no application page errors and passed the existing interaction suite. Missing Lighthouse tooling, PowerShell's `npm.ps1` execution restriction and chrome-launcher startup were environment issues; QA-only packages were restored, commands use `npm.cmd`, and measurements use Playwright-launched Chrome.

During implementation, UTF-8 pipeline damage to Arabic copy and a menu event-target issue were caught and corrected; content/keyboard regression checks cover them. Label-in-name findings were corrected. Parallel QA caused local-server connection refusals; the affected checks were rerun serially and passed. Tests were updated to expect a lazy project renderer rather than a removed hero object. No failing application regression remains in the final suites; external limitations above remain explicit.

## Changed source and deliverables

- Content: `data/portfolio.json`, `data/skills.json`.
- Generated documents and SEO: `index.html`, `ar/index.html`, `robots.txt`, `sitemap.xml`.
- Design: `css/tokens.css`, `base.css`, `layout.css`, `components.css`, `responsive.css`, `motion.css`, `skills.css`, new `engineering.css`, generated `site.css`.
- Runtime: `js/main.js`, `i18n.js`, `preference.js`, `navigation.js`, new `architecture.js`, `motion.js` and motion config/showcase/renderer/shader modules. Unused legacy `js/scene.js` and sculpture model/fallback files are removed.
- Assets: original CV copy under `assets/documents/`, responsive 640px portrait derivative, regenerated portrait-based `social-card.png`. Existing actual project screenshots are unchanged.
- Generation/QA: `scripts/render.py`, new `render_sections.py`, `package.py`, `prepare-portrait.py`, `audit.mjs`, `measure.mjs`, `motion-check.mjs`, `skills-check.mjs`, `stability-check.mjs`, `verify.mjs`, new `check.mjs`, `phase-check.mjs`, `render-social.mjs`, `transformation-check.mjs`, and package scripts.
- Documentation: [plan](PORTFOLIO_ENHANCEMENT_PLAN.md), [design system](DESIGN_SYSTEM.md), [motion system](MOTION_SYSTEM.md), [content guide](PORTFOLIO_CONTENT_GUIDE.md), this report, README and asset provenance. Fresh evidence is under `reports/transformation/`.

## Deployment

Run `npm run content`, `npm run check` and `npm run build` (`npm.cmd` in restricted PowerShell). Serve locally with `npm start` at port 8017. Upload the contents of `portfolio-static.zip` to the current static host's document root; include the Arabic directory index and use HTTPS/correct MIME types. Configure production compression and caching, with versioning when replacing cached assets. Keep original screenshots, source CV, QA tools, reports, node_modules and private development files out of the document root.

The ZIP is a local deployment artifact; no Site registration, publication, domain change, external message, or production deployment was performed.
