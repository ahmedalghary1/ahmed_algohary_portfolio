# Verification report

Verified on **14 November 2026** in Chromium, against the approved `DESIGN.md`. All reported results refer to the local implementation, not a deployed production site.

## Delivered scope

Complete navigation, editorial hero, four illustrative expandable case studies, About, five expertise categories, four-stage process, contact placeholder and footer. English and Arabic cover page text, navigation, control labels, preview artwork, image alternatives and runtime SEO metadata. Language switching preserves the document, uses safe local storage, supports URL preferences and refreshes ScrollTrigger. Actual social/email/CV links remain absent until configured.

Production uses semantic HTML/CSS, native ES modules, **GSAP 3.14.2 + ScrollTrigger** and **Three.js 0.181.2**. Runtime assets are local. Original SVG previews and portrait avoid external image dependencies. There is no framework, frontend bundler, backend, loading gate or wheel/touch interception.

Source and maintenance instructions are in `README.md`. `portfolio-static.zip` contains the 42 deployable files, excluding QA tools, node_modules and reports. ZIP integrity was tested. The complete source remains in the project directory.

## Responsive verification

`scripts/audit.mjs` measured both locales at each of these viewports:

| CSS viewport | English | Arabic |
| --- | --- | --- |
| 320 × 740 | No overflow | No overflow |
| 360 × 800 | No overflow | No overflow |
| 390 × 844 | No overflow | No overflow |
| 768 × 1024 | No overflow | No overflow |
| 844 × 390, landscape | No overflow | No overflow |
| 1024 × 768 | No overflow | No overflow |
| 1280 × 900 | No overflow | No overflow |
| 1440 × 1000 | No overflow | No overflow |
| 1920 × 1080 | No overflow | No overflow |
| 2560 × 1440 | No overflow | No overflow |

All **20 combinations** had `scrollWidth === innerWidth` and no measured elements extending beyond the viewport. Menu visibility matched the 800px breakpoint. Screenshots were saved at 320, 390, 768, 1024, 1440, 1920 and 2560 in both directions. Desktop (1440), tablet (768), and narrow-mobile (390) screenshots were visually reviewed in both languages, together with the normal WebGL-enhanced desktop hero. Below-fold artwork was loaded before final captures.

At a **640 × 450 CSS viewport**, corresponding to a 1280px desktop at 200% browser zoom, both languages remained usable without horizontal overflow, including all expanded case studies. This is a viewport-reflow proxy, not a physical browser-zoom certification.

Raw evidence: `browser-audit.json`; screenshots in `screenshots/`.

## Accessibility verification

Axe (`@axe-core/playwright` 4.11.1) checked WCAG 2 A/AA, WCAG 2.1 AA and WCAG 2.2 AA tags at **390 and 1440px in both languages**: **zero automated violations in all four runs**. Mobile Lighthouse accessibility scored **100/100 in both languages**.

Keyboard checks verified the skip link as first target, focus transfer to main, keyboard menu opening, Escape closure/focus return, all section links, and keyboard operation of all case-study disclosures. CSS supplies visible 2px focus outlines. Native landmarks, heading levels, button names, translated alternative text and reduced-motion behavior were checked. No form or fake submission flow exists.

Computed palette contrast:

| Foreground / background | Ratio |
| --- | --- |
| Ink / paper | 14.62:1 |
| Muted text / paper | 5.94:1 |
| Accessible accent / paper | 5.68:1 |
| Secondary text / ink | 9.55:1 |
| Muted text / contact surface | 5.34:1 |

Stone is decorative, not body text. Labels/captions are at least 12px in the final CSS. Key navigation/button/summary controls have at least 44px target height; the dedicated keyboard/target inspection is recorded in `focus-and-targets.json` and `screenshots/mobile-keyboard-focus.png`.

These automated and keyboard checks do **not** establish full WCAG conformance or substitute for a screen-reader review.

## Interaction and failure-mode regression checks

`scripts/verify.mjs` completed **18 checks**, all passing:

1. Skip navigation and main focus.
2. Mobile keyboard menu, Escape and focus return.
3. All five section navigation destinations and menu closure.
4. Four keyboard-operable, complete case-study disclosures.
5. In-place language, RTL, metadata, image and accessibility-label updates without reload; language control retains focus.
6. Preference persistence and explicit URL precedence.
7. Reduced-motion startup uses the SVG and native immediate scrolling.
8. Anchor integrity and hidden unconfigured contact actions.
9. 200% equivalent viewport reflow in both languages with open details.
10. JavaScript-disabled English content/navigation/details remain usable at 320px.
11. Blocked localStorage still allows query language and switching.
12. Blocked vendor enhancement requests preserve visible content and localization.
13. Unavailable WebGL uses the static sculpture.
14. Real WebGL scene renders; pause/resume and forced context loss/restoration work.
15. Six language switches keep one canvas and a stable ScrollTrigger count.
16. A live reduced-motion change hides the canvas and restores the SVG, including after context restoration.
17. BFCache-style lifecycle retains the scene; full navigation disposes the canvas and all ScrollTriggers.
18. No uncaught application JavaScript errors across the checks.

Raw evidence: `interaction-tests.json`. Normal browser inspection also found no application console errors. Forced context-loss tests deliberately produce Three.js context lifecycle messages and Chromium GPU readback warnings; those are test-induced diagnostics.

## Performance measurements

Lighthouse **13.0.1**, mobile simulation, local Python HTTP server, headless Chromium. Default simulated throttling: 150ms RTT, roughly 1.6Mbps throughput, 4× CPU slowdown. Final runs were sequential. The server provides **no compression or production cache headers**.

| Metric | English | Arabic |
| --- | --- | --- |
| Performance | **99** | **97** |
| Accessibility | **100** | **100** |
| Best practices | **100** | **100** |
| SEO audit | **100** | **100** |
| First contentful paint | 1.6s | 1.7s |
| Largest contentful paint | **1.922s** | **2.480s** |
| Total blocking time | **54.5ms** | **0ms** |
| Cumulative layout shift | **0.052** | **0.051** |
| Total measured transfer | 279KiB | 372KiB |

Viewable evidence: [English Lighthouse report](lighthouse-en.html), [Arabic Lighthouse report](lighthouse-ar.html). Raw JSON is included alongside each HTML report. These are individual final lab runs, not guaranteed production or field results.

The initial Arabic run had CLS 0.375. Pre-rendered bilingual text and pre-paint locale selection reduced it to approximately 0.05. Small-phone SVG fallback removed the unnecessary Three.js download and initialization from mobile. The final hero animation keeps its text visible rather than fading readable text to zero opacity.

The measured **Arabic transfer exceeds the aspirational 350KB critical-route budget** under the uncompressed development server; it includes both Arabic font weights, Latin coverage, content and enhancements. HTML/CSS/application JS/JSON total 96,831 raw bytes and approximately 27,830 bytes compressed independently with gzip. The complete static deployment archive is 470,269 bytes compressed, including all fonts, vector artwork and desktop WebGL modules. ZIP size is an asset-size indicator, not a claim about HTTP transfer.

Production Brotli/gzip and caching remain host configuration. Lighthouse still suggests reducing render-blocking CSS, shortening request chains and adding caching/compression; the modular unbundled architecture is preserved as explicitly requested. No repeated benchmarking was used to claim guaranteed scores.

**INP was not measured:** a real 75th-percentile INP requires field interaction data. TBT is a lab responsiveness signal, not an INP substitute. Physical mid-range-device GPU/thermal performance was not measured.

## Skills actually used

| Registered skill | Applied responsibility |
| --- | --- |
| `web-design-master` | Orchestration, approved-direction reuse, runtime/tool compatibility |
| `frontend-design` | Editorial hero hierarchy, typography and intentional asymmetric composition |
| `ui-ux-pro-max` | Local design-system lookup; verified Swiss-minimalism fit, accessibility/touch/performance priorities |
| `design-taste-frontend` | Composition critique and restraint; optional kit/dealers were not adopted |
| `emil-design-eng` | Short interruptible feedback, whole-line Arabic-safe motion, responsive/reduced-motion handling |
| `impeccable` | Guarded context loading, scoped polish reference, visual refinement and one manual detector scan |
| `web-design-guidelines` | Fresh read-only Vercel guideline retrieval and final interface review |

All requested families were installed under `~/.agents/skills/`; no skills were installed, changed or deleted. The first broad UI/UX lookup was off-topic; the narrower portfolio retry returned Swiss minimalism. DESIGN.md retained authority over advisory palette/type suggestions. Impeccable's style findings and intentional exceptions are documented in [DESIGN_REVIEW.md](DESIGN_REVIEW.md).

## Remaining limitations and deliberate choices

- Browser execution was Chromium-only. Safari, Firefox, real iOS/Android hardware, NVDA and VoiceOver were not available for this run.
- No field Core Web Vitals, production network/caching, cross-device GPU measurements or full screen-reader audit are claimed.
- English metadata is present in the raw HTML; Arabic metadata is applied at runtime. Separate Arabic indexing and social-preview metadata require real localized routes/domain configuration if needed. No canonical/hreflang URLs were invented.
- Phones at or below 600px, reduced-motion users, Save Data and lower-capability devices receive the original SVG sculpture. A phone-first visit resized to desktop retains that lightweight fallback until reload.
- Original SVG imagery intentionally replaces raster WebP/AVIF for the supplied concept graphics. Responsive raster `images`/`srcset` overrides are supported and documented.
- Name, biography, skill lists, project scope, portrait and contact information are editable placeholders. Email/social/CV URLs are intentionally null. Real content and credentials must be supplied by the owner before representing this as a personal professional portfolio.
- The site is ready for static hosting and has not been published or assigned a domain.
