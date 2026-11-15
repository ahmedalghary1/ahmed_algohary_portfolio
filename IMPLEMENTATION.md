# Implementation plan

Approved source: DESIGN.md, read in full. Empty project; no existing application or local AGENTS.md. Audience: prospective collaborators reviewing an independent developer's software systems work. Primary task: explore illustrative case studies, then find configured contact details.

## Composition and design foundation
- Preserve paper #EAE8E1, ink #171717, vermilion #C43C28, stone #9C9D95, readable muted #57574F and accent #A62D20.
- Space Grotesk handles English; one Instrument Serif phrase introduces a human counterpoint; IBM Plex Mono for indices; IBM Plex Sans Arabic handles Arabic without tracking.
- Hero: large left-aligned editorial headline, architectural wire sculpture in the adjacent column, concise identity and useful CTAs. No background behind text.
- Work: four alternating image/text spreads with local original application illustrations. Native details expose full sample case studies.
- About: dark ink spread, original abstract portrait and readable biography. Expertise uses aligned rows rather than cards. Process uses a four-step sequence. Contact closes with a large typographic invitation and explicit unconfigured state.
- Mobile reflows content first and sculpture second; projects and process become single-column. RTL mirrors composition while keeping technical terms isolated.

## Phases
1. Discovery and approved design review; inspect specialist skills.
2. Tokens, typography, grid, local SVG artwork and hero/work foundation.
3. Complete semantic English HTML, generated from centralized bilingual data without a frontend build system.
4. In-place localization, safe persistence, URL state and accessible mobile navigation.
5. GSAP/ScrollTrigger enhancement with reduced-motion and cleanup, guided by Emil.
6. Deferred Three.js wire sculpture, demand rendering, capped DPR, context handling and static SVG fallback.
7. Actual screenshot critique with Taste and guarded Impeccable; refine issues.
8. Current Web Design Guidelines audit, browser checks, axe and Lighthouse if available.
9. README and evidence report; regenerate static HTML after final content changes.

## Risks and mitigations
- Arabic expansion: natural wrapping, distinct type scale, logical CSS, both-direction width tests.
- JS/library failure: full default English static HTML; native links/details; SVG fallback; independent enhancement error boundaries.
- WebGL cost: deferred local module, demand rendering, visibility suspension, bounded size/DPR and disposal.
- Placeholder integrity: explicit sample labels; null email/social/CV until real values are supplied.
- SEO: localized runtime metadata and shareable query parameters; static English HTML only, no invented domain/canonical URL.
- Fonts: self-hosted licensed WOFF2 subsets with swap; browser fallback retained.

## Specialist reconciliation
UI/UX Pro Max initial lookup returned off-topic documentation guidance; retry with a narrower portfolio query. Database palette/type suggestions remain advisory; DESIGN.md governs. Taste's optional kit/dealers and full-screen style gates are not adopted because the existing approved direction requires natural-flow editorial sections and explicit sample labels.

## Completion record

All nine implementation phases completed. The approved direction was preserved; no new artistic approval was required. Browser checks found and resolved a desktop menu-toggle bug, overly small labels, initial Arabic layout shift, ambiguous mixed-direction term strings and a live reduced-motion/WebGL fallback edge case. Final evidence: reports/VERIFICATION.md, reports/DESIGN_REVIEW.md, browser-audit.json, interaction-tests.json and both Lighthouse reports. Content editing and static deployment are documented in README.md; portfolio-static.zip packages only runtime files.
