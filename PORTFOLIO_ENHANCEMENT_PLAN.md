# Portfolio enhancement plan

Audit date: 15 November 2026. Source checkout: `b74e9ec`. This is an enhancement of the existing site, with no framework migration or replacement assets.

## Existing architecture and baseline

- Static semantic HTML, native JavaScript modules and CSS; Python `scripts/render.py` generates bilingual HTML from `data/portfolio.json` and `data/skills.json`.
- Five real projects, four public links and one confidential garment factory system. Existing project/case anchor IDs must remain stable.
- Self-hosted Space Grotesk, Instrument Serif, IBM Plex Mono and IBM Plex Sans Arabic. Paper `#eae8e1`, ink `#171717`, vermilion `#c43c28` establish the identity.
- Existing GSAP 3.14.2 / ScrollTrigger and lazily imported Three.js 0.181.2. One shared, demand-driven WebGL renderer supports decorative slots and temporary project image shaders.
- Localization uses embedded data, pre-paint locale selection, `?lang=en|ar`, local storage and logical CSS. Native disclosures work without JavaScript.
- Real portrait and responsive WebP project images are present. Original, unredacted screenshots in ignored `projects/` must never enter a deploy archive.
- Contact is a local WhatsApp message composer, with validation and clipboard fallback. Only `01156972307` is configured. Email, GitHub, LinkedIn and CV are null; no CV exists. LeetCode is unconfigured. Confirmation requested without blocking independent implementation.
- No applicable AGENTS.md was found in the checkout or its ancestor directories. No configured lint/type-check commands exist.

Fresh baseline evidence: `reports/transformation/before/`. Four full-page screenshots (390px/1440px, English/Arabic) show no overflow or uncaught page errors. Existing `scripts/verify.mjs` passes all 23 checks. JavaScript syntax checks and `python scripts/package.py` pass. Lighthouse initially fails because its QA-only package is missing; restoration is being attempted. PowerShell blocks `npm.ps1`, so package commands use `npm.cmd`. These are baseline environment issues, not site regressions. The live domain could not be retrieved by the web tool; the actual checkout and supplied assets remain the primary source of truth.

## Weaknesses and design decisions

1. Retain the established editorial statement and original portrait in Hero and About. The owner subsequently instructed: «ازل المجسم نهائي وضيف صورتي فقط». That explicit revision supersedes the initial sculpture requirement; all hero/contact sculpture markup, models and decorative sculpture assets are removed. Optional WebGL is limited to project image transitions.
2. Selected work starts with a personal portfolio and gives all projects equal weight. Feature garment factory first, followed by ROCKS EV, Bonyan, Ahmed Gamal and Ahmed Nabil.
3. Three-paragraph project details lack case-study structure. Expand native, shareable disclosures to ten stages. Separate documented project behavior from unverified stacks, infrastructure and metrics; do not infer implementations from skills or employers.
4. Eleven skill categories and repeated Redis make the page long. Preserve all 77 unique skills in six native expandable categories; move the compact 12-technology overview below the hero.
5. Add a technically coherent, accessible architecture demonstration. Use SVG connections, semantic HTML nodes and native explanatory disclosures, with separate delivery infrastructure. Clearly identify it as conceptual.
6. Add the owner-supplied employment and training timeline. Attribute the approximately 30% API improvement to the supplied CV information; distinguish training from employment.
7. Extend process to six stages. Refine contact language and expose only confirmed contact destinations and existing CV files.
8. Add canonical/social metadata, structured data, sitemap and robots. Hash case studies remain indexable in the generated HTML, without inventing new routes.
9. Replace long horizontal project pinning with a natural vertical editorial showcase, restrained perspective and short reversible reveals. Keep native scrolling and visible content.

## Implementation phases and status

| Phase | Work | Status / required verification |
| --- | --- | --- |
| 1 | Audit and baseline | Complete: screenshots, existing interaction checks, syntax and packaging passed; fresh mobile Lighthouse EN 90 / AR 87, LCP 3.4s / 3.9s |
| 2 | Design system | Complete: tokens and sticky shared header; `phases/02-design/checks.json` passes desktop/mobile EN/AR and production JS syntax |
| 3 | Content architecture | Complete: `phases/03-content/checks.json` passes desktop/mobile EN/AR; static package succeeds. Verified CV and all six contact channels configured. |
| 4 | Projects | Complete: `phases/04-projects/checks.json` passes; all five original project IDs/assets retained. Ten-stage native studies and featured garment layout; vertical showcase replaces long pinning. |
| 5 | Cinematic hero | Revised and verified: portrait only, per owner instruction. `phases/10-final/checks.json` verifies desktop/mobile EN/AR, real photo and zero hero canvases. Original portrait also remains in About. |
| 6 | Architecture | Complete: native SVG/HTML responsibilities, seven coherent directed connections and separate delivery infrastructure. Bilingual keyboard/deep-link checks pass in the functional suite. |
| 7 | Global motion | Complete: reversible reveals, native lightweight mobile effects, lazy project-only renderer, idle stopping, context loss/restoration and cleanup pass. Latest probe: 16.7ms median, 16.8ms p95, at most one observed draw call. |
| 8 | Responsive/localization | Complete: 22 EN/AR layouts, all requested widths plus landscape/ultrawide; four full-page axe audits have zero violations. Real `/ar/` HTML also works without JavaScript. |
| 9 | Performance/SEO | Measured: final portrait version EN 91 / AR 86, all other Lighthouse categories 100. LCP 3.3s / 3.2s; CLS 0 / 0.013; transfer 465 / 573KiB. Arabic performance and LCP targets remain unmet; no field INP claim. Full results and limits in FINAL_QA_REPORT.md. |
| 10 | Final QA | Verified locally: 24 original interaction checks, 21 functional groups, 22 responsive layouts, four full-page axe audits, contact/skills/motion/stability suites and static packaging pass. Native PDF click verification remains explicitly externally blocked; direct HTTP file/hash checks pass. Final documentation delivered. |

Every phase uses the running local application, console capture, desktop/mobile EN/AR checks, syntax checks and relevant functional checks. Packaging is checked after structural work and at final delivery. A failed required check leaves its phase pending until fixed or explicitly documented as externally blocked.

## Expected files and dependencies

Modify `data/portfolio.json`, `data/skills.json`, `scripts/render.py`, `scripts/package.py`, `package.json`, `index.html`, CSS tokens/layout/motion/skills, navigation/localization/motion modules and regression scripts. Add a render helper, architecture enhancement, static Arabic document, portrait-based social image, sitemap/robots, phase QA script and the five requested documentation files. Sculpture assets/modules introduced during the initial direction were removed following the owner's revision. No new production dependencies. Lighthouse/Playwright/axe are optional, ignored QA dependencies only.

## Risks and safeguards

- Unknown project stacks/results and absent public contact/CV: preserve known facts; record missing facts instead of inventing them or enabling dead links.
- Arabic shaping: animate lines/blocks, never split Arabic letters. Test mirrored reading order and LTR technology names.
- Motion overhead: one renderer, lazy initialization after content, adaptive DPR, offscreen/idle pause, finite intro, context-loss fallback and cleanup.
- Layout shifts: reserve art/image dimensions, avoid pinning and test both locale fonts before captures.
- Confidential screenshots: deploy only existing redacted WebPs; preserve excluded original sources.
- Static hosting: preserve all original anchors and URLs. Deliver a checked archive for the current host; no production domain changes are required for implementation.

## Measurement policy

Contact clarification: the owner supplied `ahmedalgohary1170@gmail.com`, WhatsApp `201156972307` and GitHub `https://github.com/ahmedalghary1`. The subsequently supplied root PDF exists and is copied unchanged to `assets/documents/ahmed-algohary-cv.pdf`. Its annotation links verify LinkedIn and LeetCode. The PDF lists phone `+201552810113` and GitHub `ahmedalgohary1170`; the website follows the owner's newer explicit choices. No private details are inferred from these discrepancies. The CV e-commerce repository is not assumed to be ROCKS EV or the garment system.

Lighthouse restored in ignored QA tooling. The original chrome-launcher failed to keep a debugging endpoint alive in this environment; `scripts/measure.mjs` now uses the same working Playwright-launched Chrome as the browser checks. This changed measurement plumbing only. Both baseline reports are fresh Lighthouse 13.6.0 runs using the same configuration as the upcoming after measurement.

Use the same Chrome, local server, mobile Lighthouse configuration and machine for before/after. Report lab LCP/CLS/TBT and scores honestly. TBT is not INP; field INP and field Core Web Vitals cannot be established here. Automated axe checks do not certify full WCAG compliance. Record unavailable verification explicitly.
