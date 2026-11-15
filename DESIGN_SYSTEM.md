# Design system

This is the current implementation guide. The original `DESIGN.md` records the established editorial direction; the owner’s transformation brief and verified personal/project content supersede its early illustrative content examples.

## Identity

An engineering journal expressed through warm paper, dark ink, vermilion annotations and precise architectural alignment. The original headline, typography, portrait and project imagery remain. At the owner's explicit request, the hero uses only the original personal photograph, also retained in About. The sculpture and its fallback/model code were removed. The garment management system is the first, most prominent project.

## Tokens

Source: `css/tokens.css`. Runtime WebGL parameters live in `js/motion/config.js`.

| Token | Value / purpose |
| --- | --- |
| `--paper` | `#eae8e1`, primary page surface |
| `--ink` | `#171717`, text and dark About section |
| `--vermilion` | `#c43c28`, restrained decorative accents |
| `--accent` | `#a62d20`, readable small accent text and links |
| `--muted` | `#57574f`, secondary text |
| `--stone` | `#9c9d95`, decorative geometry only |
| `--rule` / `--rule-dark` | `#b9b9b0` / `#50514b` |
| `--surface` / `--surface-muted` | `#f4f3ee` / `#deddd4` |
| `--text-secondary` | `#bdbeb4`, text on ink |
| `--gutter` | fluid 20–72px; 20px on mobile |
| `--space-1` through `--space-7` | 4, 8, 16, 24, 32, 48, 64px |
| `--space-section` | fluid 64–128px |
| `--max-width` | 1440px |
| `--radius-small` / `--radius-image` | 2px / 4px |
| `--shadow-image` | restrained image elevation |
| `--motion-fast` / `--motion-reveal` / `--motion-mobile` | 180ms / 700ms / 450ms |
| `--ease` | `cubic-bezier(.23,1,.32,1)` |
| `--z-scene`, `--z-controls`, `--z-header`, `--z-skip` | 8, 20, 30, 50 |
| `--header-offset` | 110px desktop, 90px tablet, 82px mobile |

## Typography

- Space Grotesk: English headings and body.
- Instrument Serif Italic: the single expressive hero phrase and selected editorial accents.
- IBM Plex Mono: section indices, technology names and technical annotations.
- IBM Plex Sans Arabic: Arabic headings and body, without Latin tracking or synthetic italics.

Fonts and licenses are self-hosted in `assets/fonts/`. Arabic subsets and relevant English fonts preload through the small preference script. Latin technology names use `bdi`, explicit LTR where needed and `translate="no"`. Arabic letters are never split for animation.

Hero type follows the existing fluid display scale. Section titles use approximately 36–72px; body uses 15–17px; technical labels generally use 11–13px. Mobile wordmark sizing is constrained to keep language/menu controls on one row at 320px. Arabic uses larger line height and natural shaping.

## Layout and sections

The `.wrap` primitive caps width and supplies shared alignment; `.section` supplies fluid vertical spacing. Desktop uses asymmetric 7/5 and 8/4 proportions, followed by single-column mobile compositions. Fine rules establish hierarchy without enclosing every item in a card.

The sequence is Hero, Core Technology Stack, Selected Work, Software Architecture, About, Professional Experience, Technical Expertise, Engineering Process, Contact/Resume and Footer. Existing `#work`, `#about`, `#expertise`, `#process`, `#contact`, `#project-*` and `#case-*` destinations remain intact.

Projects use original responsive screenshots and full-width native case-study disclosures. Each expanded study has ten numbered parts; galleries span the editorial grid. No generated replacement project images or invented stack claims are used.

The architecture demonstration uses HTML links, SVG connections and native explanatory disclosures. Access control branches from the application; Redis connects the API to background workers; delivery tools sit outside request processing. Mobile uses a vertical list with explicit relationship labels.

Experience uses ruled timeline rows and separate employment/training labels. Skills use six categories with initially visible summaries, representative technologies and native expandable complete lists. All 77 unique skills remain in static HTML.

## Shared controls

Buttons use ink/paper and an accessible accent hover. Links retain visible underlines where useful. Focus outlines are 2px with a 6px offset. Touch controls generally have at least 44px height. The sticky header has scroll-aware styling and active section indicators; its mobile disclosure moves focus to the first link and returns focus on Escape.

The desktop work toolbar uses a small CSS sticky region with native previous/next scrolling. It does not pin the document or create horizontal scrolling. Case studies, skills and architecture explanations use native `details`/`summary`; no modal focus trap is needed.

## Responsive and localization rules

At 1100px the navigation becomes a disclosure. At 900px project rows stack; at 800px the architecture diagram becomes vertical and skills become one column. At 600px the portrait has a compact responsive frame, the experience timeline stacks and the process becomes vertical. Mobile skips all animation vendor downloads; project shaders initialize only on capable desktops.

Use logical CSS properties for spacing and alignment. Keep the architecture’s technical topology stable in both languages; localize its text direction independently. Directional arrows mirror; technology logos and the personal photograph do not.

Both `/` and `/ar/` have real static HTML, localized titles/descriptions, canonical URLs and reciprocal hreflang. In-place language switching and existing `?lang=en|ar` URLs remain supported. The Arabic entry uses a root base for shared assets; localization keeps its native anchors on the current document and query.

## Verification

Use `npm run check`, `npm run test:layouts` and the functional scripts described in `FINAL_QA_REPORT.md`. Inspect actual screenshots in both languages. Axe results are automated evidence, not a certification of full WCAG conformance. Never make essential text depend on a canvas or animation.
