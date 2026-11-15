# Motion system

The existing static portfolio retains its portrait, five real projects, original screenshots, private factory redactions and WhatsApp contact 01156972307. No framework change or new production dependency was introduced. Native wheel/touch scrolling remains in control. GSAP 3.14.2, ScrollTrigger and Three.js 0.181.2 are self-hosted.

## Modules and settings

- `js/motion.js`: coordinated GSAP context, whole-line typography masks, section reveals, about parallax, pointer tilt, localized pause control and reduced-motion lifecycle. Arabic text is never split into characters or rendered on canvas.
- `js/motion/config.js`: central breakpoints, quality limits, metal/accent palette, lighting, shader duration and intensity, scrub and finite idle-introduction settings.
- `js/motion/project-showcase.js`: measured horizontal track/pin on screens at least 1100px wide and 800px tall, provided the actual stage fits the viewport. Progress/counter, previous/next controls, arrow/Home/End keys and focus-driven positioning support RTL. Expanded studies and project deep links use the vertical layout; after opening a study the showcase stays vertical for that session. Smaller/shorter windows remain vertical.
- `js/motion/scene-manager.js`: one shared WebGL2 renderer, scissored to decorative hero/contact slots and brief image overlays. A software-inspired lattice uses two instanced material batches, soft directional/hemisphere lighting, scroll-driven camera distance/position and sculpture rotation/scale. A six-second slow introduction then stops drawing at idle. Pointer and scroll input request new frames. The closing contact pose settles as its section enters.
- `js/motion/shaders.js`: UV displacement and a progressive noise-modulated reveal band. Original HTML screenshots remain visible underneath; the shader becomes fully transparent at rest. Existing sanitized screenshot URLs are used, never generated substitutes.
- `js/motion/performance-manager.js`: one demand RAF, hidden-tab suspension and viewport/pixel-budget-dependent DPR. Mobile, Save Data and low-capability tiers skip WebGL; tablets use a lower DPR and native vertical projects. Context loss restores CSS geometry; restoration resumes the same renderer.
- `css/motion.css` and `scripts/render.py`: enhancement styles and semantic markup, CSS geometry fallback, gallery controls and pause button. Baseline layout/content remain available without JavaScript.

## Disabling and cleanup

Use the floating pause button or `?motion=off`. OS reduced-motion preference always takes priority. Pausing/reducing motion aborts scene listeners/observers/RAF, disposes textures/materials/geometries and renderer, removes the canvas, kills the gallery pin/timelines and reverts GSAP styling. Pagehide with a retained BFCache page keeps the session; full pagehide disposes it. Resizing across the mobile breakpoint recreates the appropriate tier. No scroll hijacking or Lenis is used.

## Adding projects

Edit the aligned `profile.projects`, `en.projects` and `ar.projects` arrays in `data/portfolio.json`, then run `python scripts/render.py`. Keep screenshot `images`, responsive `srcset`, `preview`, localized alt/link labels and unique IDs. Keep private projects redacted and without a public URL. The track distance and count derive from actual cards; controls measure content width rather than assuming five projects. Shader textures load only as images approach the viewport.

## Verification evidence

Baseline measurements precede implementation and are retained in `reports/motion/before/`: interaction suite, contact suite, 20 responsive layouts, 4 axe audits; no baseline console errors or overflow.

After implementation:

- `reports/motion/after/smoke.json`: both locales at 390/768/1440px, no page errors or overflow; zero mobile canvases, one tablet/desktop canvas, horizontal gallery only at desktop size. Hero/work screenshots accompany these checks.
- `scripts/motion-check.mjs`: reverse/fast scroll, gallery controls, keyboard-focused offscreen links, expanded details, pause/resume, mobile resizing and live reduced motion; WebGL-disabled fallback, finite idle stopping, context loss/restoration and lifecycle cleanup. Results in `reports/motion/after/interactions.json`.
- Existing contact suite passes eight locale/viewport combinations with zero axe violations; clipboard fallback and local intercepted WhatsApp navigation fixtures pass. No real message is sent.
- Existing responsive audit passes 20 layouts and four accessibility audits, with no overflow, violations or uncaught errors.
- `reports/motion/after/performance.json`: a 1440×1000 headless Chrome scrolling sample recorded 95 frame intervals, median 16.7ms and p95 16.8ms. This short local sample is not a guarantee of 60 FPS on physical devices. Pixel budget is capped at 2.2 million and DPR at 1.5 (tablet 1.1).
- Syntax checks and the static production packager validate the source/archive. No linter was configured in the existing project; syntax checks are used instead of adding a new lint dependency.

No known functional blocker remains. Physical-device Safari/Firefox testing, long-duration heap profiling and field performance data are not available from this session. Shadows rely on material lighting rather than expensive real-time shadow maps; no particles, geometry morphing or scroll-smoothing dependency were necessary.

References: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Three.js documentation](https://threejs.org/docs/).
