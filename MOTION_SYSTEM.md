# Interaction policy — project-first refactor

The current site uses native page/anchor scrolling and lightweight CSS feedback. Content appears immediately with or without JavaScript. No intro, pinned sequence, carousel, canvas, parallax or scroll-driven transforms gate viewing.

- Image hover: a small scale change on fine-pointer devices only.
- Buttons and links: color/pressed feedback and visible keyboard focus.
- Navigation: disclosure menu, Escape/selection close, destination focus and IntersectionObserver active sections; no section geometry reads on scroll.
- Language: native module, static alternate routes and optional local persistence.
- Reduced motion: animation, transitions, hover transforms and smooth scrolling disabled.

GSAP, ScrollTrigger, Three.js, their vendor files and obsolete scene/architecture modules were removed. No production npm dependencies remain. npm run test:motion now checks current keyboard, reduced-motion, fallback and legacy navigation behavior. Historical reports/transformation measurements apply only to the old design.
