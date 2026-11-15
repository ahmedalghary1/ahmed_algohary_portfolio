# Engineered Editorial — Portfolio Design Specification

## 1. Intent and authority
Build a bilingual independent software developer portfolio that feels like a carefully typeset engineering journal: precise, expressive, calm and human-directed. This document is the project-specific visual source of truth. Do not let generic skill recommendations override it. All personal content is illustrative until replaced by the owner; never invent real client endorsements, achievements or metrics.

## 2. Technology and architecture
- Semantic HTML5, CSS, native JavaScript ES modules, Three.js and GSAP with ScrollTrigger (and ScrollToPlugin only if needed). No React, Vue, Angular, Tailwind, Bootstrap, jQuery, Lenis or other frontend libraries. No backend required. Use native browser APIs for everything else.
- Pin compatible dependency versions; prefer locally hosted production assets. No runtime dependency on third-party CDNs. Use a simple local HTTP server for testing ES modules. No build system required; if proposing one, obtain permission first.
- Separate structure, tokens, layout, components, responsive styles, localization, content, scene, motion and main initialization. Suggested files: `index.html`, `css/{tokens,base,layout,components,responsive}.css`, `js/{main,content,i18n,motion,scene}.js`, `data/portfolio.json`, `assets/{fonts,images,vendor}/`, `README.md`. Adapt filenames if justified; avoid needless abstraction.
- Use real HTML links and landmarks. All primary content remains accessible without WebGL or animation; provide meaningful static fallback and a usable default-language experience without JavaScript.

## 3. Visual identity
| Token | Value | Role |
|---|---|---|
| paper | #EAE8E1 | Main background |
| ink | #171717 | Main text, dark editorial section |
| vermilion | #C43C28 | Decorative accents, geometry, large type |
| stone | #9C9D95 | Decorative rules, nonessential details |
| muted-ink | #57574F | Readable secondary text |
| accessible-accent | #A62D20 | Small accent text and links on paper |

Use roughly 75% paper, 20% ink, 5% accent as a flexible art direction, not a quota. Verify contrast in actual combinations (WCAG AA); stone is not body text. Prefer fine rules, square corners, restrained surfaces, visible alignment, no decorative gradients, random blobs, glass panels or default SaaS card grids. Optional subtle paper grain must be inexpensive and not reduce readability. Avoid decorative trademark symbols or fabricated availability claims.

## 4. Typography and composition
- English: Space Grotesk (headings/body), Instrument Serif (one occasional expressive phrase), IBM Plex Mono (indices and technical metadata). Arabic: IBM Plex Sans Arabic (headings/body); avoid applying Latin letter spacing, italic imitation or uppercase rules to Arabic. Use licensed, self-hosted WOFF2 subsets and `font-display: swap`; load only necessary weights (400/500/600/700 as needed). Keep fallback font stacks.
- Hero English display: clamp(3rem, 7.5vw, 8rem), line-height 0.98–1.08. Arabic display: clamp(2.5rem, 6.5vw, 6.5rem), line-height 1.25–1.4. Section headings 32–72px fluid; body 16–19px, line-height 1.6–1.8 (Arabic 1.8–1.9); metadata 12–14px. Avoid wrapping/clipping long translations. Target readable text lines (roughly 45–75 Latin characters).
- Use a 12-column desktop grid; 8 tablet; 4 mobile. Max content width 1440px; gutters clamp(16px,4vw,64px); consistent spacing scale 4/8/12/16/24/32/48/64/96/128px. Section spacing fluid 56–128px; intentional asymmetry aligned to the underlying grid. Avoid excessive empty space or fixed viewport-height sections that crop content.
- Use genuine project screenshots when supplied; for now use clearly labelled original mock project graphics and a licensed or generated illustrative portrait, or a locally authored SVG placeholder. Never hotlink random imagery. Include meaningful bilingual alt text for informative images.

## 5. Information architecture
1. Header: wordmark `AHMED.` (editable), navigation Work / About / Process / Contact, AR/EN language switch, skip link. Compact sticky header only if it does not obscure content. Accessible mobile menu.
2. Hero: immediate identity and value proposition, e.g. “Engineering the digital. With intention.” / “أبني تجارب رقمية بدقة ورؤية.” Supporting line explaining web applications and software systems, primary Selected work CTA and secondary Contact CTA. One signature vermilion wireframe sculpture (Three.js), placed beside text, never behind readable content. Optional short scroll cue.
3. Selected work: four numbered, alternating editorial case-study rows, not equal cards. Each includes project image, category, summary, role, technologies and accessible details. Illustrative projects: Inventory Management, Industrial Commerce, Factory Maintenance, Hospitality Platform. Label all as sample projects, not proven achievements. Details may be expandable inline or dedicated static sections with deep links. No dead links or fabricated GitHub URLs.
4. About: illustrative portrait, concise bilingual biography, clear skill categories (backend, frontend, systems, deployment). No percentage bars or invented experience years.
5. Process: Discover / Design / Engineer / Verify, shown as an editorial sequence with clear copy. No invented metrics.
6. Contact: clear email action only after real email is configured; otherwise show explicit placeholder status. Optional contact form may be a labelled demo only, never claim delivery without backend. Social/CV links hidden until configured.
7. Footer: simple navigation, return to top, language option, editable copyright. No unnecessary sections.

## 6. Bilingual UX
- Complete independent Arabic and English copy, not word-for-word mechanical translation. Default English unless locale choice or explicit URL preference indicates Arabic. Persist preference locally with safe fallback. Update document `lang`, `dir`, title, description, navigation, labels, alt text and case-study content on switch. Support `?lang=ar` / `?lang=en` shareable state; do not duplicate history unnecessarily.
- Use CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline`), appropriate bidirectional isolation for code/technology names, and mirrored directional icons only. Preserve art direction in RTL with intentional composition, not blind flips. Avoid horizontal overflow.
- Keep reading order logical for both languages. Language changes preserve section/focus where possible, refresh ScrollTrigger after fonts/layout settle and don't duplicate listeners. Controls keyboard-accessible with clear labels.
- If static SEO for both languages is required, generate genuinely separate localized HTML entry pages and accurate hreflang/canonical URLs when real domain is known; do not invent canonical URLs. Document the chosen tradeoff.

## 7. Motion direction
Motion should communicate hierarchy and continuity, not showcase every available effect. Native vertical scrolling is the foundation; no wheel interception, scroll hijacking, forced snapping, custom scrollbar, compulsory preload or long pinned sections. Use CSS smooth behavior for anchor navigation or GSAP ScrollToPlugin, not both on the same action. Disable smooth scrolling with reduced motion. ScrollTrigger for entrance reveals and restrained progress-linked effects.

| Region | Motion | Guidance |
|---|---|---|
| Header | compact transition, link underline | 150–250ms |
| Hero | short text reveal and sculpture fade | 550–850ms; stagger 60–90ms; text must never remain hidden |
| Work | image mask/clip reveal, heading rise | 400–650ms; displacement 12–24px; once per entry |
| About | portrait reveal, subtle line movement | 450–650ms |
| Process | sequential index/rule reveal | short stagger; no pinning required |
| Contact/footer | simple reveal, link microinteraction | 150–450ms |

Prefer transform and opacity, moderate easing (`power2.out`, `power3.out`), no elastic/bounce by default. Use GSAP matchMedia for breakpoints and prefers-reduced-motion, clean up contexts/triggers/listeners. Avoid expensive per-letter splitting on Arabic and preserve accessible text. Do not hide content until animation libraries are initialized. No competing simultaneous motion. Touch screens get reduced motion complexity; hover effects must not be required for access. No continuous motion without a pause mechanism if it lasts over five seconds alongside content; respect user preferences and pause when offscreen or tab hidden.

## 8. Three.js signature sculpture
Create one original engineered wireframe/orbital sculpture using procedural geometry, using vermilion linework and transparent or paper-matched background. It represents interconnected systems, not a generic glowing sphere. Prefer lightweight geometry/materials (no postprocessing, HDRI, huge textures or expensive shadows). One canvas in hero; additional visual echoes are SVG/CSS, not additional WebGL scenes. Small pointer response on fine pointers only, subtle scroll-dependent rotation, no pointer capture or camera controls interfering with navigation. Decorative canvas is aria-hidden and pointer-events none.
- Render when dirty / in-view; continuous animation only while necessary, with pause and visibility handling. Cap DPR around 1.5 desktop and 1–1.25 mobile; adapt quality on weak hardware. Limit drawing-buffer size and avoid excessive allocations. Resize using ResizeObserver; dispose geometry/materials/renderer; handle context loss gracefully.
- Lazy initialize after essential content, use CSS/SVG static fallback on low capability, no WebGL or reduced motion. The fallback must preserve the editorial composition. Never block the main page on 3D initialization.

## 9. Responsiveness and accessibility
Mobile-first. Verify 320, 360, 390, 768, 1024, 1440, 1920 and a wide desktop; portrait and landscape where practical, both languages. Use fluid grids, responsive images, `min-width:0`, natural document flow. On mobile place hero visual after text or omit it if space/performance demands; stack case studies and avoid oversized headings. Test 200% zoom, keyboard-only nav, focus visibility, skip link, menu escape and focus return, screen reader names, touch targets at least 44px where practical, and WCAG 2.2 AA contrast. Distinguish links without color alone. Verify no horizontal scroll or layout shifts. Never make animation essential for understanding.

## 10. Performance budgets and verification
Targets (not guarantees): LCP <=2.5s, INP <=200ms, CLS <=0.1 at 75th percentile in real usage; laboratory tests are only proxies. Aim for mobile Lighthouse performance >=90 and accessibility >=95, report actual measured values and test conditions. Initial critical HTML/CSS/JS/fonts/hero media target <=350KB transferred excluding deferred WebGL; total initial route including deferred 3D target <=1MB compressed where feasible. Document measured exceptions. Use AVIF/WebP, srcset/sizes, explicit dimensions, lazy below-fold imagery, minimal font weights, deferred modules, no unnecessary requests. Keep hero readable immediately; no loading gate. Inspect network, CPU/GPU usage, errors, motion smoothness on throttled mobile, and memory/listener cleanup.

## 11. Content configuration
Keep all editable bilingual identity, bio, project records, links, images and SEO strings in a documented content module or JSON file with stable IDs. Provide illustrative content and mark it clearly; use null for real URLs not supplied and hide unavailable actions. Do not ask user for personal data during implementation. Document exactly how to replace portrait, text, projects, CV and contact details. Keep default visible page copy accessible if scripts fail.

## 12. Skill coordination and acceptance
Discover actual installed skill names and SKILL.md files under `~/.agents/skills/`. Read instructions only when relevant; inspect supporting references as needed. Frontend Design drives composition; UI/UX Pro Max supports tokens and UX; Taste critiques originality without changing approved identity; Emil guides motion; Impeccable critiques rendered pages; Web Design Guidelines audits accessibility/responsiveness. No skill may add prohibited frameworks or override project constraints. Report unavailable/incompatible skills and use available alternatives without claiming execution.

Completion requires: both languages functional; complete content and navigation; verified layout screenshots in both directions; working progressive enhancement; reduced motion and WebGL fallback; no console errors, dead links, fabricated personal claims or horizontal overflow; measured performance where tools allow; README with startup, dependencies, content editing and test results. Report all unverified items explicitly. Do not claim perfection or successful tests without evidence.
