# Startup, scrolling and WhatsApp hover fixes

## Confirmed findings

- The shared WebGL canvas redrew for every global pointer movement even when its decorative slots were outside the viewport. Reproduction at the expertise section recorded 15 unnecessary frames for 15 pointer movements. After the fix the same probe records zero.
- WebGL contexts were created before awaiting the Three.js import, and renderer disposal did not explicitly release them. Rapid pause/resume during loading could allocate unused contexts. Context creation now follows import/abort checks, and teardown explicitly releases GPU context resources.
- Core UI initialization depended on a separate JSON fetch with no timeout. Generated HTML now embeds the same canonical JSON, eliminating this critical request. Older HTML can still fall back to a time-limited fetch. Slow optional motion/font/library loading never blocks static content or direct WhatsApp access.
- Scroll/pin measurements could run before translated fonts settled. Initialization and language refresh now wait for fonts, with superseded gallery refreshes ignored.
- The global `button:hover` text color overrode the filled button style, matching the accent background. Filled button hover now explicitly preserves the light foreground.

## Changes

`js/content.js`, `scripts/render.py`: embedded-content boot and bounded external fallback. `js/motion.js`: stable measurements, recoverable partial animation setup, fewer per-token animations, transform-only reveals on large content blocks and RAF-throttled pointer tilt. `js/motion/project-showcase.js`: font-aware refresh. `js/motion/scene-manager.js`: viewport-aware drawing, smaller temporary shader textures, immediate release of completed shader textures/materials, explicit WebGL context cleanup and scene-only fallback on GPU draw failure. `js/motion/performance-manager.js`: contained draw failures. `css/components.css`: readable filled-button hover color.

The portrait, branding, all skills/projects, project links, single WhatsApp number and optional cinematic motion remain available. No production dependency was added.

## Verification

`scripts/stability-check.mjs` and `checks.json` cover offscreen rendering, actual hovered WhatsApp colors, 18 pause/resume cycles, simulated GPU draw failure, and initialization with the external JSON endpoint blocked. Tests do not send a WhatsApp message.

The existing motion suite passes reverse/fast scrolling, keyboard project access, details, mobile resize, live reduced motion, context loss/restoration and lifecycle cleanup. Existing interaction/contact checks pass. Skills checks pass ten bilingual layouts/accessibility audits with no overflow, icon failures or console errors. JavaScript/Python syntax checks and the static production packager pass.

These are controlled Chromium checks; the user's exact device/network behavior has not been measured. No claim is made that every possible source of stutter on every device has been eliminated.
