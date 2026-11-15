# Project-first portfolio refactor

## Audit — 15 November 2026

Baseline: clean working tree at `8252258`; existing static HTML, Python generation,
native JavaScript modules, self-hosted fonts, WebP images, GSAP/Three optional motion.
No AGENTS.md found in the repository or its parent directories. Preserve existing
identity, real assets, bilingual data, contact composer, CV and project anchors.

Findings: stack precedes work; seven navigation items; three hero actions; large
philosophical heading; five full-width sequential projects with embedded ten-part
studies; repeated skills in two sections (77 skills); conceptual architecture and
long experience/process increase homepage reading. All project frameworks remain
undocumented, so do not infer them from employment skills. Desktop/mobile application
services lack documented project evidence and will not be advertised.

## Phases and acceptance

1. Audit: completed. Inspect sources, capture current homepage and measured baseline.
2. Design system: pending. Retain paper/ink/vermilion, shared spacing/type tokens;
   simplify obsolete visual rules. Verify syntax and rendered layout.
3. Navigation/hero: pending. Home/Work/Services/About/Contact, two actions, actual
   portrait and direct bilingual heading. Verify anchors and menu.
4. Showcase: pending. Factory featured, four static grid cards ordered ROCKS EV,
   Bonyan, Ahmed Nabil, Ahmed Gamal. Preserve old anchors, real images/live URLs.
5. Case studies: pending. Generate ten static localized pages through one template,
   central records, unique metadata, galleries, next-project navigation. Check routes.
6. Content: pending. Four evidenced services, 12–15 representative technologies,
   short About and four process steps. Archive detailed experience/skills data;
   remove conceptual architecture from homepage. Measure copy reduction.
7. Contact/trust: pending. Preserve working WhatsApp composer and verified contact
   links; concise invitation. Exercise validation, clipboard and handoff locally.
8. Responsive/localization: pending. All requested widths in both locales, project
   routes, no-JS, locale persistence, keyboard and screenshots. Repair findings.
9. Performance/SEO: pending. Remove unnecessary animation runtime, optimize initial
   payload, update sitemap/hreflang/structured data. Measure Lighthouse and axe.
10. Final QA: pending. Build ZIP, check all internal resources/links, document actual
    results, evidence gaps and external limits in REFACTOR_REPORT.md. No deployment.

## Expected files

`data/portfolio.json`, `data/skills.json`, `scripts/render.py`, shared render helpers,
`scripts/package.py`, CSS modules, `js/main.js`, localization/navigation/motion,
generated `index.html`, `ar/index.html`, `projects/*`, `ar/projects/*`, sitemap,
QA scripts/reports and maintenance documentation. No frontend framework migration.

## Decisions

- Static directory routes are compatible with the current static hosting model.
- Unknown stacks are recorded as missing rather than falsely assigned to projects.
- Preserve legacy project/case hashes as real anchors linking to new detail pages.
- Existing archived QA reports describe the earlier design, not this refactor.
