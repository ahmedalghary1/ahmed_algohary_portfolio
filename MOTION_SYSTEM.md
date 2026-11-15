# Motion system

The portfolio retains the existing semantic HTML/CSS/ES-module architecture and self-hosted GSAP 3.14.2, ScrollTrigger and Three.js 0.181.2. The architectural scene is decorative; all content, links, case studies and architecture explanations are real HTML. Native vertical scrolling is never intercepted.

## Modules

| Module | Responsibility |
| --- | --- |
| `js/main.js` | Initialize content, localization, navigation, cases, contact and architecture first; schedule optional motion after load/idle |
| `js/motion.js` | Coordinate capability tiers, labels, GSAP context, reversible reveals, native mobile motion and cleanup |
| `js/motion/config.js` | Breakpoints, scrub/reveal timing, tilt, shader intensity, light/material values and pixel budgets |
| `js/motion/hero-scene.js` | Six related structural frames, one accent module, two instanced material batches and disposal |
| `js/motion/scene-manager.js` | One shared WebGL2 renderer, hero/contact views, scroll camera state and temporary image shader overlays |
| `js/motion/performance-manager.js` | One demand-driven RAF, DPR/pixel limits, visibility suspension and error teardown |
| `js/motion/project-showcase.js` | Vertical project sequence, restrained image depth/masks, sticky desktop progress and native previous/next scrolling |
| `js/motion/shaders.js` | Small temporary UV distortion/reveal on genuine project screenshots; intensity derives from MotionConfig |
| `js/architecture.js` | Accessible SVG connections, real node links, native disclosures, language/resize updates and observer cleanup |
| `css/motion.css`, `css/engineering.css` | Progressive states, static fallback, lightweight native reveals and finite architecture data flow |
| `scripts/render-sculpture.py` | Generate the matching geometry-based SVG fallback |

The unused legacy `js/scene.js` was removed; it no longer creates a competing renderer.

## Experience tiers

Desktop/tablet use GSAP and the lazily imported renderer when capabilities allow. Desktop DPR is capped at 1.5; tablet at 1.1; the drawing buffer stays within a 2.2 million-pixel budget. The sculpture uses 24 beams in two instanced batches, with matte/metallic materials and hemisphere/key/rim lighting. No external models, HDR maps, real-time shadows or postprocessing are needed.

At widths up to 600px, Save Data, or constrained hardware, `qualityTier()` selects the lightweight path. It downloads neither GSAP nor Three.js. IntersectionObserver and CSS move visible blocks by only 8px; the static sculpture remains. The same pause control can stop this motion. Reduced-motion startup downloads neither animation vendor and keeps all essential content visible; the optional motion control is hidden while the OS preference is active.

## Hero, projects and closing composition

The hero has a dedicated architectural art stage. ScrollTrigger interpolates camera distance/position, sculpture rotation/scale and a restrained text translation/opacity change. Pointer response runs only for fine pointers while a scene slot is visible. A finite three-second introduction supplies ambient movement; drawing then stops until input changes the scene.

Projects remain a natural vertical document. There is no horizontal track, long pin, wheel handler or scroll-smoothing library. A small CSS sticky toolbar supplies progress/previous/next on capable desktops. Images use one coordinated GSAP depth/mask timeline plus a short, subtle shader overlay. Keyboard links and full-width native case studies stay in document flow. The underlying original screenshot is always available.

The contact slot reuses the same renderer/sculpture with a scroll-driven final pose. Its stable composition echoes the hero without creating another canvas. Mobile/reduced-motion contact uses static architectural linework.

## Architecture and timeline

The diagram is SVG plus semantic HTML, not another canvas. Nodes expose technical responsibilities through native disclosures. A CSS custom property drives connection reveal with scroll, so regenerated SVG paths inherit the correct state after resize or locale changes. Finite CSS data pulses run only when the map is visible and motion is enabled. The experience line uses a similar progress property. Both reverse with native scrolling.

The topology deliberately separates the frontend/API request, access checks, PostgreSQL persistence, Redis caching/broker and Celery consumers. Docker, CI/CD and cloud delivery are described outside the request graph. The entire diagram is labelled as conceptual, not a claim that every project uses every tool.

## Typography and localization

Hero text is painted before motion initializes. Existing static English/Arabic spans are preserved instead of rewriting the painted heading during startup. Arabic is animated as intact blocks; only Latin editorial section headings receive a small mask reveal. Labels live in `data/portfolio.json`, including pause/enable and project navigation names.

Language changes abort/recreate the applicable motion context after fonts settle. This preserves one renderer and removes stale triggers/listeners. Query preferences and real `/ar/` HTML both work. The OS preference always takes priority over the manual control and `?motion=off`.

## Lifecycle and failures

Pausing, reducing motion, resizing across the mobile breakpoint or full navigation aborts the enhancement controller. It disconnects observers, cancels RAFs, removes pointer listeners, kills/reverts GSAP timelines and disposes scene geometries, instance buffers, materials, temporary textures and the renderer. Context loss shows the SVG fallback; restoration uses the same renderer. A GPU draw exception tears the scene down without hiding text or links.

Hidden tabs suspend scheduling. Offscreen scene slots do not react to pointer movement. `pagehide` with `persisted: true` retains the BFCache session; full pagehide disposes resources. The actual browser/host may still choose not to restore BFCache, so lifecycle tests are not a claim of universal BFCache eligibility.

## Extending

Use the existing GSAP context or lightweight observer list for new reveals. Keep transform/opacity movement small, reversible and nonessential. Add settings to MotionConfig/CSS tokens, not scattered constants. Keep Arabic shaping intact. Add a shared renderer slot only for justified decoration; avoid another canvas. New image effects must use verified project assets and release their temporary textures.

Run `npm run content` after CSS changes: the existing Python generator emits the cache-versioned `css/site.css` from the modular sources. Run `npm run check`, motion/functional checks and visual audits before delivery. Detailed measured results and limits are in `FINAL_QA_REPORT.md` and `reports/transformation/after/`.
