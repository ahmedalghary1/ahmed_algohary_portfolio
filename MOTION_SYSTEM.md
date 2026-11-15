# Motion system

The portfolio preserves semantic HTML, CSS, native JavaScript modules and the existing pinned GSAP 3.14.2 / ScrollTrigger / Three.js 0.181.2 assets. Native vertical scrolling stays in control. At the owner's latest explicit request, the hero contains only the original personal photograph. The hero/contact sculpture, generated fallback, model factory and sculpture generator were removed.

## Modules and tiers

- `js/main.js` initializes essential content and controls first, then schedules optional motion after load/idle.
- `js/motion.js` owns one GSAP context, reversible text/block reveals, subtle hero text movement, project perspective, timeline progress, pause/reduced-motion behavior and cleanup.
- `js/motion/config.js` centralizes timing, tilt, shader intensity, capability breakpoints and pixel limits.
- `js/motion/project-showcase.js` keeps the five projects in native vertical flow with short image reveals, a small sticky desktop progress toolbar and native previous/next scrolling. There is no horizontal track, long pin or scroll interception.
- `js/motion/scene-manager.js` supports optional project image shader overlays only. It waits until a project image approaches the viewport before importing Three.js. The hero does not initialize a canvas. One shared renderer clips temporary overlays to actual project screenshots; original HTML images always remain underneath.
- `js/motion/shaders.js` implements a short, restrained UV reveal/distortion. Its intensity derives from MotionConfig.
- `js/motion/performance-manager.js` owns the demand-driven RAF, hidden-tab suspension, DPR and pixel budget. No ambient rendering loop remains.
- `js/architecture.js` connects real HTML nodes through accessible SVG linework and native explanatory disclosures. It does not use WebGL. On mobile it skips SVG measurement and uses a vertical diagram with explicit relationship labels.

Mobile widths up to 600px, Save Data and constrained hardware use IntersectionObserver plus 8px CSS block movement. They download neither GSAP nor Three.js. Tablet retains restrained GSAP motion but does not initialize project WebGL. Capable desktops can load the shared project renderer, capped at DPR 1.5 and 2.2 million drawing-buffer pixels. Reduced-motion startup skips animation vendors and hides the optional motion control.

## Typography, portrait and architecture

The original portrait is a normal responsive HTML image in Hero and About, with explicit dimensions and meaningful bilingual alt text. It remains available with JavaScript, animations or WebGL disabled. The hero image has high fetch priority; About is lazy-loaded. No generated replacement or 3D object is used in the hero or contact.

Visible text is painted before enhancement. Localization preserves the already-rendered bilingual spans instead of replacing the hero at startup. Arabic moves as intact blocks; only Latin section headings receive a small mask reveal. All control copy lives in `data/portfolio.json`.

SVG connection reveals and experience-line progress use CSS custom properties driven by ScrollTrigger. Finite data pulses run only while the map is visible and motion is enabled. Mobile uses lightweight CSS and `content-visibility:auto` for below-fold sections, while preserving their HTML and native navigation. The architecture is explicitly conceptual; Docker/CI/CD/cloud delivery sit outside request processing.

## Cleanup and failure behavior

Pause, live reduced motion, relevant breakpoints and full page navigation abort the enhancement controller. Contexts revert; triggers, observers, listeners and RAFs are cleaned up. Project textures/materials/geometry and the renderer are disposed. Pending texture callbacks check the lifetime before allocating further work. After the 0.85-second image reveal, demand rendering stops.

When WebGL is unavailable, loses context or a draw fails, the real project image remains visible. A restored context reuses one renderer. Offscreen pointer movement causes no WebGL frames. BFCache-style retained pagehide preserves the session; full pagehide disposes it. This is lifecycle behavior, not a guarantee that every browser/host will choose BFCache restoration.

## Extending and verification

Use the existing context or lightweight observer list. Keep movements small, reversible and nonessential. Add settings to MotionConfig/CSS tokens. Preserve Arabic shaping and verified project images. Do not reintroduce a hero sculpture or another canvas without the owner's instruction.

Run `npm run content` after changing modular CSS; the existing Python renderer emits cache-versioned `css/site.css`. Run syntax/content checks, functional tests, motion/lifecycle tests and visual audits. Actual results, before/after measurements and verification limits are recorded in `FINAL_QA_REPORT.md` and `reports/transformation/after/`.
