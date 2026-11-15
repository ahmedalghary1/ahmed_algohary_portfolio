# Portfolio V3 implementation plan

## Audit and baseline — 15 November 2026

Starting commit: ae0569d. Working tree clean. No repository or parent AGENTS.md
found. REFACTOR_PLAN.md exists; REFACTOR_REPORT.md does not. Preserve the static
Python/HTML/CSS/ES-module architecture, paper/ink/vermilion identity, all five
project slugs, Arabic/English pages, contact composer and clean dist/ZIP build.

Existing system: five records in data/portfolio.json, parallel localized copy,
shared project renderer, 13 homepage technologies, four evidenced services.
One approved screenshot per project, responsive WebP variants, no project videos,
no project-specific technology evidence. Factory screenshot is already physically
redacted. Source screenshots must stay private. Case pages repeat prose and lack
feature captions, structured information, previous navigation and lightbox.
Experience is archived; CV mixes training and employment, is dense, and differs
from website contact data. Its ROCKS 'Present' cannot establish current status.

Baseline mobile Lighthouse (single local lab run, current dist): EN 100/100/100/100,
AR 93/100/100/100 (performance/accessibility/best practices/SEO); LCP 1.5s/2.9s,
CLS 0/0. Reports: reports/v3/before. Field INP is unavailable.

## Implementation phases and acceptance

| Phase | Work and acceptance | State |
|---|---|---|
| 1 Audit | Inspect sources, CV and actual approved media; baseline measurements | Complete |
| 2 Data | Backward-compatible project model, publication/order controls, optional fields; hidden records excluded from runtime/routes/output | Complete |
| 3 Showcase | Factory first, 3–4 evidenced feature summaries, responsive static grid; retain anchors | Complete |
| 4 Case studies | Shared visual template, concise facts/features/modules, previous/next and contact; no empty sections | Complete |
| 5 Media | Captioned galleries, accessible keyboard/touch/fullscreen lightbox, optional native deferred video; no fabricated media | Pending |
| 6 Services/drafts | Retain four evidenced services; five planned projects private; document publication requirements | Pending |
| 7 Experience/CV | Concise historical employment, training separate; no assumed current job; original PDF retained, improved review-only CV | Pending |
| 8 Credibility | Feature-specific bilingual copy; external link audit, real-only optional testimonials | Pending |
| 9 UI/UX | Preserve design tokens; improve project scanning, focus, navigation and mobile layouts | Pending |
| 10 Localization/a11y | All eight widths, both directions, language persistence, media focus/keyboard, axe | Pending |
| 11 Performance/SEO | Stable slugs, unique metadata, official domain, sitemap/hreflang, measured Lighthouse | Pending |
| 12 Final QA | Production build, HTTP/ZIP checks, browser/contact tests, visual review, complete maintenance and results docs | Pending |

Run applicable checks after each phase and record results here. Resolve critical
regressions before proceeding. No push, deployment, account edits or invented data.

## Expected files

data/portfolio.json; private draft records; scripts/project_data.py and shared
render helpers; scripts/render.py; scripts/package.py; js media/localization;
css project styling; generated HTML/CSS/sitemap; meaningful schema/media/HTTP
tests; PROJECTS_GUIDE.md, PORTFOLIO_ASSETS_REQUIRED.md, PORTFOLIO_V3_REPORT.md.
An improved CV is a separate review-only artifact, never the live download until
phone/account/current employment discrepancies are confirmed.

## Missing evidence and decisions

- Additional factory module screenshots and sanitized demos are highest priority.
- No basis to assert shopping cart, checkout, admin, stock alerts or permissions
  merely from the brief's suggested lists. Describe visible navigation accurately.
- Project technology lists stay empty until confirmed. Personal skills and the
  employment SaaS stack do not prove the implementation stack of ROCKS EV.
- Five planned software projects remain unpublished in a separate draft file.
- Five current projects do not justify another listing route/filter yet; homepage
  work anchor remains the complete public listing.
- Keep current contact/profile links unchanged. Document CV phone/GitHub mismatch
  and stale GitHub website link; do not update external accounts.
- Native dialog and video avoid production dependencies; optional sections render
  only when real approved data exists. Preserve functional no-JS media links.

## Verification log

- Phase 1: original CV visually inspected and text/annotations extracted; all five
  approved project previews visually inspected. Baseline Lighthouse completed.
  Public-source web fetch could not access project sites; browser audit follows.
- Phase 2: five published records normalize with paired bilingual captions;
  publication/order/media/privacy regression tests added and run. Five future
  projects stored separately as unpublished planning records without feature claims.
- Phases 3–4: renderer and syntax/translation checks pass in both languages.
  Featured operational summaries, conditional information/features/modules and
  previous/next navigation implemented. Detailed browser/visual gates follow the
  media implementation; no fabricated technologies, status or extra screenshots.
