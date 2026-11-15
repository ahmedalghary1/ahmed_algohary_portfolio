# Dark tech portfolio design system

Active as of 15 November 2026. The supplied navy/cyan reference supersedes the
previous paper/vermilion identity. Previous design reports are historical.

## Sources

`css/tokens.css` owns colors, type, spacing, radii and motion durations.
`css/base.css` owns resets, accessibility and bilingual text visibility.
`css/projects.css` preserves the existing case media/lightbox components.
`css/neon.css` owns responsive page and component layouts. The Python renderer
combines only those files into `css/site.css`; generated CSS is not hand-edited.
Other old CSS sources are retained for history and excluded from deployment.

## Tokens

| Purpose | Value |
| --- | --- |
| Background | #080F18 |
| Secondary background | #0D1724 |
| Card | #121E2C |
| Primary accent | #00D9F5 |
| Secondary accent | #168BFF |
| Primary text | #F5F7FA |
| Secondary text | #9DAFC2 |
| Borders | #243649 |
| Success | #22C55E |
| Content width | 1360px |
| Cards | 16px radius |
| Controls | 8–12px radius; generally 44–48px touch target |
| Spacing | 8px grid, 16/24/32/40/48/56/80px |
| Transitions | 180–300ms |

Inter variable Latin (48KB) and IBM Plex Sans Arabic are self-hosted with swap.
IBM Plex Mono is used sparingly for metadata. Arabic has its own line heights
and no Latin letter-spacing. Direction is controlled with logical CSS properties,
`dir`, and isolated English technology names.

## Composition

Sticky glass header: identity, six unique destinations, project CTA, language.
Hero: concise three-line heading, two main actions, decorative workspace photo.
Work appears immediately below, with a featured real case and four project cards.
Desktop skills sit alongside work; on tablet/mobile they follow it. Category
filters only expose populated categories and enhance static content progressively.
Services use four evidenced offerings. About keeps the actual portrait and CV.
Documented employment replaces unsupported achievement/testimonial claims.
Contact preserves direct channels and an honest WhatsApp draft composer.

All ten localized project pages retain overview, problem, solution, features,
approved image gallery, navigation and contact actions. Undocumented project
technology stacks are omitted instead of inferred.

## Accessibility and motion

Visible focus, semantic regions and headings, labeled form errors, menu Escape,
keyboard lightbox, no-JS content, and live filter/contact status. CSS reveal uses
view timelines when supported and never hides content. Reduced motion disables
animation, transitions and smooth scrolling. Images reserve their dimensions.
Automated audits supplement visual inspection; they do not prove full WCAG compliance.
