# Independent portfolio audit and refinement

14 November 2026. Reviewed against DESIGN.md, preserving the approved Engineered Editorial identity. This is a single-reviewer assessment; scores express judgment supported by the evidence below, not a certification. Existing implementation reports were not used as proof of correctness.

The portfolio has a coherent visual identity and sound progressive enhancement. Its main limitation is authenticity: the work is illustrative, About uses a placeholder portrait and biography, and Contact has no configured destination. Code polish cannot supply those missing facts. The desktop hero, paper/ink palette, alternating work spreads, dark About section and plain expertise rows deserve preservation.

## Evidence and method

- Inspected every runtime module, all five stylesheets, generated HTML, bilingual content and original illustration generator. No Git repository exists here; an original source snapshot was retained temporarily and a [reviewable runtime source diff](source-changes.diff) accompanies this report.
- Opened the actual local site in Chromium 149.0.7827.55 using Playwright. Normal-motion captures cover English and Arabic at 390×844 mobile, 768×1024 tablet, 1440×1000 desktop and 2560×1440 ultrawide, before and after. Each combination has a hero, Work, About, Expertise, Process, Contact and full-page capture: 56 captures per phase. Additional reduced-motion captures and layout probes cover 320, 360, 390, 768, 844 landscape, 1024, 1280, 1440, 1920 and 2560 CSS pixels in each language.
- [Interactive screenshot comparison](compare.html), [before browser measurements](before/review.json), [after browser measurements](after/review.json), [pixel differences](pixel-comparison.json), [after responsive/axe results](after/browser-audit.json), [functional tests](../interaction-tests.json).
- Used installed Impeccable through its guarded launcher (`context` once, `detect` before/after), Taste for composition and originality, Emil for interaction/motion, UI/UX Pro Max's verified reduced-motion UX search, and freshly fetched [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Applied narrow refinement and audit guidance. No optional Taste kit, dealer, hooks, live-copy agent, new framework or runtime dependency was introduced. This was not an execution of Impeccable's separate dual-agent critique command.

## Scores, 0–10

Higher is better, including the score for avoidance of generic AI patterns. Unchanged scores are intentional. No category earns 10.

| Category | Before | After | Specific evidence and limits |
|---|---:|---:|---|
| Artistic originality | 7 | 7 | The twisted square-frame sculpture and alternating spreads feel authored. The oversized grotesk/italic-serif hero and neutral palette are familiar; placeholder content prevents a distinctive personal point of view. See both desktop hero captures. |
| Avoidance of generic AI patterns | 7 | 7 | No gradient blobs, badge clouds, glass panels, fabricated metrics or repeated website card grid. Numbered eyebrows, Space Grotesk plus italic serif and generic process language remain recognizable portfolio conventions. Kept because DESIGN.md explicitly approves them. |
| Typography | 8 | 8.5 | Clear display/body/metadata hierarchy; self-hosted faces and controlled line lengths. Fixed inherited Latin tracking on Arabic expressive text, wordmark and About statement. Small 12–14px supporting labels and tight English display tracking remain tradeoffs. |
| Visual hierarchy | 8 | 8.5 | Hero identity and work CTA are immediate. At 768px, previews previously fell below text in visual weight; larger illustrations restore the artifact as the focus. Contact still promises a conversation without an endpoint. |
| Spacing consistency | 8 | 8 | Rules, shared gutters and fluid section spacing form a consistent rhythm. Preview captions now reserve 44px actions. Tablet stacking increases page length considerably; this trades browsing density for inspectable artifacts. |
| Color harmony | 8.5 | 8.5 | Paper, ink and restrained vermilion stay coherent; muted green/stone illustrations sit naturally in the palette. Main paper/ink contrast is approximately 14.6:1, muted/paper 5.9:1 and accent/paper 5.7:1. The sage silhouette is visually harmonious but impersonal. |
| Editorial composition | 8 | 8.5 | Successful asymmetric desktop spreads and dark About interruption remain. At 768px, project art now spans the content width instead of competing in half-width columns. The four similar prose structures still create some monotony. |
| Project presentation | 6 | 7.5 | Preview width rises from 336.2 to 700.4px at 768px; mobile users can open original 900×600 SVGs. Four native case studies gain disambiguated names, open/close labels and shareable expanded states. They remain concepts, without real shipped screens, architectural artifacts or validated outcomes. |
| Arabic typography | 8 | 8.5 | IBM Plex Sans Arabic, generous line-height, intact whole-line GSAP animation and no per-letter splitting. Removed residual Latin tracking. Embedded SVG artwork still uses Arial and needs production Arabic art/screenshots rather than translated concept illustrations. |
| RTL and LTR behavior | 8 | 8 | Site layout, arrows, mixed technical terms, alt text, metadata and URL locale work in both directions; nav underline origin is now direction-aware. Arabic concept images translate text but retain their original internal left-sidebar/table layouts. The live portfolio is RTL; the depicted products are not audited RTL implementations. |
| GSAP animation quality | 8 | 8 | Short whole-line hero rise, 600ms project masks, restrained heading motion, once-only triggers, reduced-motion matchMedia and cleanup are appropriate. Preserved successful choreography. The same heading rise recurs and clip-path incurs paint; no reason to add more effects. |
| Scroll fluidity | 8 | 8.5 | Native scrolling, no hijacking/pinning. Synthetic 4× CPU scroll probes had no frame gaps above 50ms in either phase; p95 intervals improved in this sample. This does not establish physical-device smoothness or field INP. |
| Three.js performance | 8 | 9 | Same 23-frame geometry, now one LineSegments draw per frame rather than 23 LineLoops. Pointer probe draws fell 713→31 EN and 759→33 AR; idle/offscreen draws stayed zero. WebGL is checked before the library download; context restoration, pause, reduced-motion and disposal pass. Full Three.js remains a substantial deferred dependency for one sculpture. |
| Mobile usability | 7.5 | 8.5 | No overflow even at 320px; native case disclosure and large main actions. Fixed menu destination focus, exposed 44px preview links, added case deep links. Full interface details require opening artwork; long scrolling and missing contact destination remain. |
| Accessibility | 8 | 8.5 | Four axe WCAG A/AA audits pass with zero violations before and after. Keyboard tests cover skip link, menu Escape/focus return, destination focus and all case studies. Summary labels now identify the corresponding project. Automated results do not prove screen-reader or WCAG conformance. |
| Loading performance | 8 | 8.5 | Early collapsed-header reservation removes the measured Arabic main-content shift and nearly eliminates the English shift; fallback sculpture gets high fetch priority. See repeated Lighthouse measurements below. Uncompressed local hosting lacks caching and leaves render-blocking CSS; Arabic font transfer is heavier. |
| Code quality | 8 | 8.5 | Semantic HTML, native modules, centralized bilingual JSON, AbortController lifecycle, local dependencies and SVG fallbacks are strengths. Added one scoped case-study module and regression checks. Long generated HTML/f-string templates, broad DOM selectors and swallowed enhancement errors remain maintenance compromises. |

## Weakest sections and prioritized plan

1. **P1 — Contact, still owner-dependent.** Both languages end at “Contact details coming soon.” The primary conversion cannot complete. Configure a real email and optional social/CV records in `data/portfolio.json`, then regenerate HTML. Kept the honest placeholder; inventing a destination would be misleading.
2. **P1 — Work evidence, still owner-dependent.** The four projects show attractive concept interfaces and proposed scopes rather than completed work. Replace concept assets with genuine screenshots and document actual decisions, constraints and responsibilities. Only use verified outcomes. Preserve the alternating desktop presentation.
3. **P2 — Work usability, completed.** Expand tablet artwork, offer original-size previews, add identifiable case actions and stable disclosure links. Verify direct load, refresh, close, locale switching, keyboard use and 320px reflow.
4. **P2 — Navigation/loading, completed.** Transfer focus out of the collapsed mobile menu. Reserve the collapsed header before paint, with a three-second native-navigation recovery if the main module fails. Prioritize the fallback hero image.
5. **P2 — About authenticity, still owner-dependent.** Replace the abstract silhouette and editable starter biography with an owner-approved portrait and story. Its dark section, typography and grid already work; a layout redesign would not solve the missing personal evidence.
6. **P2 — Arabic product art, remaining.** Create genuinely RTL product previews or supply real Arabic screenshots, using the intended Arabic font. Translation inside the current SVGs is not enough to demonstrate RTL product expertise.
7. **P2 — GPU efficiency, completed.** Batch linework without changing the silhouette, retain demand rendering and fallback handling, check capability before importing Three.js.
8. **P2 — Deployment performance, remaining.** Configure Brotli/gzip and cache headers on the eventual static host; immutable caching needs asset versioning. Re-measure there before claiming transfer budgets or field Core Web Vitals. No production host/domain was supplied.
9. **P3 — Motion/typographic polish, completed.** Remove Arabic tracking drift, mirror nav underline origin, retain color feedback under reduced motion, preserve existing successful GSAP timing. Final polish does not add decorative motion.

## Before/after interaction review

| Before | After | Why |
|---|---|---|
| Menu link becomes hidden; focus ends on `body#top` | Focus moves to the destination section, e.g. `#work` | Keyboard users continue from the content they requested. |
| Case actions share the same label and no URL state | Summary names include the project; URL `#case-inventory` opens on load/reload; close updates the label and URL | Readers can identify, share and revisit a specific study. |
| Thumbnail is the only access to concept art | Localized, labelled 44px link opens original artwork | Small-screen readers can inspect it with browser zoom. |
| Global reduced-motion rule kills every transition | Transform movement is removed; color/opacity feedback remains | Respects motion sensitivity without suppressing useful interaction feedback. |
| English-origin underline runs left-to-right in both locales | RTL underline starts from the right | Directional behavior follows reading order. |
| Each square frame is a separate draw call | All edges share one draw call | Less GPU submission work; same visual geometry and demand rendering. |

## Visual comparison

Use [compare.html](compare.html) to select language, viewport and region. The before/after images are separate actual browser captures, not AI-generated comparisons.

- [English tablet Work before](before/en-768-work.png) / [after](after/en-768-work.png): substantially larger interface and clearer reading sequence.
- [Arabic tablet Work before](before/ar-768-work.png) / [after](after/ar-768-work.png): same improvement in RTL page composition.
- [English desktop hero before](before/en-1440-hero.png) / [after](after/en-1440-hero.png): retained composition and sculpture. Only 11 pixels exceed a 10-channel-value difference in this 1.44-million-pixel capture, supporting visual preservation rather than a redesign.
- [Arabic mobile Work before](before/ar-390-work.png) / [after](after/ar-390-work.png): full-size preview affordance added; main project copy and hierarchy preserved.
- [Arabic ultrawide after](after/ar-2560-full.png) / [English ultrawide after](after/en-2560-full.png): content remains capped at 1440px; outer margins intentionally grow instead of stretching text.

Pixel differences are diagnostic, not a quality score: fractional layout, antialiasing, capture timing and region boundaries also produce changes. Desktop project image widths remain 724.1px at 1440 and 793.3px at 2560. At 768px, page height increases from 5540→7541px EN and 5174→7331px AR because projects now stack. This is the primary visual tradeoff.

## Verification and measurements

Twelve Lighthouse 13.0.1 samples: three runs per language per phase, cold-load mobile emulation, 4× simulated CPU slowdown, 150ms RTT / 1638.4Kbps simulated throughput. Baseline was rerun against the frozen original source on port 8018; final source on 8017. Runs were sequential, with one short image-difference calculation overlapping part of the baseline sequence; this is a local lab comparison, not a controlled hardware benchmark. Values below are medians. [Raw samples and ranges](performance-summary.json).

| Locale | Performance /100 | LCP | Total blocking time | CLS | Total transferred |
|---|---|---|---|---|---|
| EN | 99 → 99 | 1.883 → 2.033s | 0 → 64ms | 0.05178 → 0.00036 | 278.6 → 286.0KiB |
| AR | 97 → 97 | 2.480 → 2.489s | 0 → 71ms | 0.05142 → 0.00000 | 371.9 → 379.4KiB |

Final performance ranges: EN 98–99, AR 96–97. All 12 samples scored 100 in automated accessibility, best practices and SEO. That does not override the manual category scores or the missing real contact/content.

The repeated baseline found header shift in **both** languages (the earlier single EN run happened to report zero). Final Arabic CLS is zero; final EN has a very small 0.00036 residual shift. English LCP regressed about 150ms and median TBT increased from 0 to 64ms EN / 71ms AR. Arabic LCP is essentially flat (+8ms). The new functionality adds roughly 7.4KiB per route. These costs are retained and disclosed; this is a stability/usability/GPU improvement, not a universal speedup. LCP medians remain under 2.5s, TBT under 200ms, and CLS under 0.1; TBT is **not** an INP measurement.

The Python static server serves uncompressed assets without production caching. Route totals are actual local lab transferred bytes, not evidence of the compressed critical-resource budget; Arabic route transfer remains above 350KiB. Lighthouse mobile testing intentionally uses the SVG fallback and excludes Three.js. Desktop WebGL measurements are separate.


The final functional suite passes all 23 checks, including unavailable localStorage, blocked main module, blocked enhancement libraries, absent WebGL, WebGL context loss/restoration, live reduced-motion preference, stable trigger/canvas counts after six locale switches, no-JavaScript content and lifecycle disposal. Twenty responsive checks and four axe audits pass; their uncaught JavaScript error arrays are empty. The zoom check emulates a 640px CSS viewport equivalent to a 1280px desktop at 200%; it is not a physical browser-zoom test.

The scroll probe is a 2.4-second scripted scroll at 4× CPU slowdown using requestAnimationFrame. Before p95 frame interval: 33.3ms EN / 33.3ms AR; after: 16.8ms EN / 16.7ms AR. No interval exceeded 50ms in either phase. This single short probe is evidence of no observed long stalls, not proof of sustained 60fps. The browser uses software WebGL; these draw-call counts are valid, but GPU time/energy on real hardware remains unmeasured. Idle observation lasts one second and offscreen observation half a second.

Impeccable's source detector reports 10 findings in each phase: italic serif, two alleged cramped surfaces, two font-popularity warnings, four numbered-label advisories and cream palette. Inspected in context: About/Contact have actual wrapper gutters and section padding, so those cramped-padding findings are false positives. The remaining style warnings describe deliberate DESIGN.md choices; retained, not silently “fixed.” A clean detector score was never the goal. No browser overlay was injected or claimed.

## Remaining limits

- No real project outcomes, real portrait or contact endpoint supplied. The site remains an illustrative portfolio.
- English static SEO is the fallback; localized metadata/query URLs depend on JavaScript. No separate Arabic HTML, real canonical/hreflang URLs, or configured production domain.
- Arabic SVG previews retain LTR product layouts and system fonts. Website language switching is functional; depicted app interfaces remain illustrative.
- Chromium desktop emulation only. Safari, Firefox, physical touch/low-end devices, screen readers, GPU energy/memory profiling and sustained thermal behavior were not verified.
- No field LCP/INP/CLS data. Lighthouse accessibility 100 is an automated score, not an overall accessibility rating.
- Test tools are external under `/tmp/portfolio-qa`; runtime dependencies and stack are unchanged. Optional tools need reinstallation if that temporary directory is removed.

## Changed files

- `css/base.css`: Arabic tracking scope and programmatic destination focus styling.
- `css/components.css`: preview/permalink affordances and direction-aware underline origin.
- `css/responsive.css`: tablet project composition, pre-paint mobile-nav state and scoped reduced-motion rules.
- `js/preference.js`: pre-paint collapsed-header reservation and failure timeout.
- `js/navigation.js`: mobile destination focus transfer.
- `js/case-studies.js` (new): disclosure labels, permalink state and direct-link recovery.
- `js/main.js`: initialize case-study enhancement and release header reservation on initialization failure.
- `js/i18n.js`: keep original-art links aligned with the selected language.
- `js/scene.js`: batch geometry; test WebGL before downloading Three.js.
- `data/portfolio.json`: bilingual close/permalink/preview labels; factual project content unchanged.
- `scripts/render.py` and generated `index.html`: semantic case IDs, summary accessible names, preview/permalink links, high-priority hero fallback.
- `scripts/verify.mjs`: focus, deep-link, localized preview and module-failure regressions.
- `scripts/measure.mjs`: configurable report directory and repeat count for reproducible Lighthouse samples.
- `scripts/refinement-review.mjs` (new): matched screenshot matrix, interaction probes, draw-call and frame measurements.
- `README.md`: point to this audit and explain disclosure/preview behavior and repeatable measurements.
- `portfolio-static.zip`: refreshed deployment artifact containing runtime files only.
- `reports/refinement/`: raw before/after evidence, comparison viewer, score/plan report, measurements and source diff. `reports/interaction-tests.json` and the existing enhanced desktop capture were refreshed by the final functional suite.

DESIGN.md, fonts, palette tokens, project illustration assets, hero copy, biography and process copy remain unchanged.

## Web Interface Guidelines source review

The current remote rules were read as review data; DESIGN.md and the user's refinement scope remained authoritative.

- `js/navigation.js:18` — fixed hidden-menu focus loss by focusing the destination section.
- `scripts/render.py:25` — fixed inspectability of project media with labelled native preview links; image dimensions, lazy loading and alt text retained.
- `scripts/render.py:28` — fixed ambiguous disclosure names and missing shareable state.
- `css/base.css:133` — fixed Arabic tracking inherited by nested expressive text and the wordmark.
- `css/components.css:35` — direction-aware underline origin added; hover behavior remains gated to fine pointers.
- `css/responsive.css:399` — reduced-motion handling now targets movement while retaining color feedback.
- `js/main.js:27` and `js/main.js:34` — remaining maintainability limitation: enhancement errors are swallowed to preserve the usable static fallback; production diagnostics are absent.
- `assets/images/inventory-ar.svg:1` — remaining illustration limitation: translated text inside a left-sidebar product layout. Related Arabic concept illustrations need the same future art review.

No zoom restriction, wheel interception, placeholder-only form, fabricated external link, missing image dimension or required hover-only path was found. No forms exist in this portfolio, so form-validation rules do not apply.
