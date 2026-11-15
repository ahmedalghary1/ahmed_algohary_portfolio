# Third-party assets

- The project-first refactor no longer ships Three.js, GSAP or ScrollTrigger. Their unused runtime modules, vendor files and production dependencies were removed.
- Space Grotesk variable Latin, Instrument Serif italic Latin, IBM Plex Mono regular Latin, IBM Plex Sans Arabic regular/semibold Arabic and Latin: Fontsource packages **5.3.0**, SIL OFL 1.1. Each family's license and source record is in `assets/fonts/`.
- Current project screenshots and personal portrait: supplied by the owner. The public garment system screenshots are the existing redacted WebP assets; original screenshots are excluded from deployment. The favicon is derived from the supplied portrait.
- `social-card.png` is rendered from original HTML/CSS, the owner's original portrait and the site's licensed fonts. The requested sculpture and its generated assets/model code were removed at the owner's direction. No generated imagery replaces the portrait or project screenshots.
- Earlier illustrative SVG artwork created by `scripts/artwork.py` is retained as existing source material and is not used to represent the current real projects.
- Playwright, axe and Lighthouse are optional QA tools installed outside the deployed source. They are not browser runtime dependencies.
- Inter variable Latin is self-hosted from Google Fonts (48KB subset), under SIL OFL 1.1. The license was obtained from the official rsms/inter repository (`assets/fonts/inter-LICENSE.txt`). It is the active English UI font.
- `developer-workspace.webp` and its 800px variant are decorative AI-generated imagery created with the built-in imagegen tool for this redesign. They do not depict an actual client project or replace the owner's portrait. The prompt and provenance are recorded in `REDESIGN_REPORT.md`.
# Skill technology icons

The locally hosted SVG brand icons in `assets/icons/` are from [Simple Icons](https://github.com/simple-icons/simple-icons), distributed under CC0-1.0. The Django icon also accompanies Django REST Framework as a framework-family marker; skill names remain explicit. Generic competency marks are locally authored SVG paths. Brand names and marks belong to their respective owners.
