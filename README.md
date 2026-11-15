# Engineered Editorial portfolio

Latest independent audit and refinement: [scores, prioritized plan, measured results, limits and changed files](reports/refinement/AUDIT.md). [Compare rendered screenshots](reports/refinement/compare.html) in both languages at mobile, tablet, desktop and ultrawide widths. Earlier reports below remain the initial implementation record.

The portfolio now presents five owner-supplied projects: Ahmed Gamal’s portfolio, ROCKS EV, a private garment factory management system, Bonyan and Ahmed Nabil’s portfolio. It supports shareable project details (`?lang=ar#case-ahmed-gamal`, for example), original-resolution screenshot previews and four external website links. The private factory project has no live link, and its public screenshot has account, financial and product data redacted. Changing locale keeps preview links and project labels synchronized. Tablet projects stack at 601–900px.

For repeated Lighthouse measurements, set `RUNS=3` and `REPORT_DIR=reports/refinement/after` when running `scripts/measure.mjs` with the QA environment described below. The new `scripts/refinement-review.mjs` captures the normal-motion matrix and draw-call/frame probes; `PHASE` selects the evidence folder. These are optional QA scripts, not a production build step.

A bilingual English/Arabic developer portfolio using semantic HTML, CSS, native JavaScript modules and GSAP + ScrollTrigger. The hero features the owner's real portrait in a restrained frame that follows the paper, ink and vermilion palette. The previous 3D scene is no longer initialized or downloaded. Projects use the owner’s screenshots and project descriptions; technology stacks and measured client results are not inferred.

## Run locally

Python 3 is enough. All production dependencies and fonts are already self-hosted.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000. If that port is occupied, use `8017` instead. Use an HTTP server rather than opening `index.html` directly: ES modules and the content request require HTTP. `npm start` runs the same server. There is no frontend build step or backend.

To restore the pinned vendor files after a fresh dependency install:

```sh
npm ci
npm run vendor
```

Only the self-hosted GSAP/ScrollTrigger assets are loaded for animation. The older Three.js source/vendor files are retained as legacy assets and are not loaded by the page. No framework, component library, remote font request or runtime CDN is used.

## Update your content

Edit **`data/portfolio.json`**, then run:

```sh
python3 scripts/render.py
# equivalent: npm run content
```

This maintenance command refreshes the static HTML from the same data used by live localization. It also refreshes the pre-rendered Arabic text, contact links and project structure. No animation or layout changes are needed. Run it after **every** content edit so the static page and JSON remain synchronized.

| JSON location | What to change |
| --- | --- |
| `en.name`, `ar.name`, `en.wordmark`, `ar.wordmark` | Your name and header identity |
| `en.title`, `ar.title` | Professional specialization |
| `en.hero`, `ar.hero` | Headline, introduction and calls to action |
| `en.about`, `ar.about` | Biography, philosophy, interests and portrait alt text |
| `en.expertise.groups`, `ar.expertise.groups` | Skill category titles and items; separate items with ` / ` |
| `en.process.steps`, `ar.process.steps` | Four process stages |
| `en.projects`, `ar.projects` | Project title, category, description, problem, solution, role, highlights, alt text and accessible link labels |
| `profile.projects` | Stable project IDs, responsive images, full-size preview paths, public URLs and privacy status |
| `profile.portrait`, `profile.portraitSrcset` | Real portrait path and responsive image variants for hero and about |
| `profile.email` | Real email address, without `mailto:`; `null` hides the email action |
| `profile.whatsapp` | Contact numbers: digits-only international `number` for links and local `display` for visible text |
| `profile.github`, `profile.linkedin`, `profile.cv` | Genuine HTTPS profile URLs or a local CV path; `null` hides each link |
| `en.contact`, `ar.contact` | Contact copy, form labels, validation messages and WhatsApp handoff text |
| `en.footer.copyright`, `ar.footer.copyright` | Footer owner text; the renderer supplies the year |
| `en.seo`, `ar.seo` | Localized page title and description |
| `en.nav`, `ar.nav` | Navigation and accessible control labels |

Keep both locale objects structurally aligned. For added or removed projects, change `profile.projects`, `en.projects` and `ar.projects` in the same order. Preserve unique stable `id` values for existing project links, such as `#project-ahmed-gamal`. A public project needs a valid `url` and localized `visitLabel`; a private project uses `private: true`, `url: null` and a localized `privacyNote`. The generated page contains full default English HTML; native navigation and project details work without JavaScript.

### Contact and downloads

The contact section shows only WhatsApp number 01156972307 as a direct chat link, using international form 201156972307. The form asks for a name and project message and opens WhatsApp with an encoded draft addressed to that number, without a recipient selector. The visitor reviews and sends it in WhatsApp; no message is sent automatically. Copying remains available with a manual fallback if clipboard permission is denied. The direct chat link works without JavaScript. Links follow [WhatsApp's documented click-to-chat format](https://faq.whatsapp.com/5913398998672934).

To update numbers, edit `profile.whatsapp` and regenerate the HTML. Optional email/social/CV links remain absent while their values are `null`; only configure genuine contact details. No backend service is required.

### Replace the images

Current project screenshots are optimized WebP files in `assets/images/projects/`, with 800px and 1600px responsive variants and original-resolution previews. The source images in `projects/` are local-only and ignored by Git; the deployment archive includes only the public assets. To regenerate them, install Pillow and run `python scripts/prepare-project-images.py`. This script applies fixed redactions to the current factory screenshot before resizing; if replacing that screenshot, update the redaction coordinates and inspect the public result before deployment. The real portrait uses 480px, 896px and 1122px WebP variants. Its original `image.png` is local-only; run `python scripts/prepare-portrait.py` to regenerate the variants without retouching. The SVG favicon remains in use; legacy concept artwork is retained but is no longer displayed.

1. Put your images in `assets/images/`. Prefer WebP or AVIF for photographs/screenshots.
2. Set `profile.portrait` and `profile.portraitSrcset`, and update `hero.portraitAlt`, `about.portraitAlt` and `about.caption` in both languages. The hero portrait is prioritized for loading; the about portrait loads lazily.
3. For each project, configure `images`, `srcset`, `preview` and `url`:

```json
{
  "id": "ahmed-gamal",
  "image": "ahmed-gamal",
  "images": {
    "en": "assets/images/projects/ahmed-gamal-1600.webp",
    "ar": "assets/images/projects/ahmed-gamal-1600.webp"
  },
  "srcset": {
    "en": "assets/images/projects/ahmed-gamal-800.webp 800w, assets/images/projects/ahmed-gamal-1600.webp 1600w",
    "ar": "assets/images/projects/ahmed-gamal-800.webp 800w, assets/images/projects/ahmed-gamal-1600.webp 1600w"
  },
  "preview": "assets/images/projects/ahmed-gamal-1920.webp",
  "url": "https://ahmed-gamal-seven.vercel.app/",
  "private": false
}
```

4. Update each locale's project `alt`, descriptions, `highlights` and link labels accurately. Screenshots use uncropped 16:9 frames. Keep meaningful information available in the project text, rather than only inside screenshots.
5. Run `python3 scripts/render.py`. Verify both `?lang=en` and `?lang=ar`.

Keep the `images`, `srcset` and `preview` paths synchronized with the public assets. Both languages share each project's original screenshot while the surrounding text and accessible labels are translated. Replace `assets/images/favicon.svg` when adding your own identity.

## Localization and progressive enhancement

- The tiny `js/preference.js` selects the locale before paint. Generated bilingual text spans prevent an English-to-Arabic layout jump; CSS exposes one language at a time.
- The main localization module updates the document language, direction, metadata, accessibility labels, preview artwork and all text in place. It does not reload the page or rebuild listeners.
- Explicit `?lang=ar` / `?lang=en` wins over saved preference. Storage failures are handled. Manual language changes update the shareable URL with `replaceState`.
- Technical terms use bidi isolation; Arabic uses IBM Plex Sans Arabic without Latin tracking or imitation italics.
- If JavaScript is disabled, the default English page remains usable. If only the JSON request fails, the already rendered locale text remains visible and native navigation/details still work.
- This is one HTML entry point. Metadata changes at runtime; separate Arabic search indexing and locale-specific social previews are **not guaranteed**. Add genuinely localized static routes and real canonical/hreflang URLs if separate indexing becomes a requirement. No fictional domain is supplied.

## Motion and portrait

Native scrolling is never intercepted. GSAP adds brief whole-line hero movement and restrained section/image reveals; reduced motion disables them. Language changes and native details refresh ScrollTrigger after fonts settle.

The hero uses a semantic, accessible portrait image, a fine frame and a vermilion edge detail. The frame follows the page's text direction. Portraits remain visible without JavaScript and with reduced motion. At 600px and below, the hero image is centered beneath the introduction with a maximum width of 320px; larger screens place it beside the introduction. There is no scene loader, WebGL canvas or sculpture control in the current page.

## Files

```text
index.html                Complete generated static page
DESIGN.md                 Approved visual specification
IMPLEMENTATION.md         Decisions, phased plan and risk handling
data/portfolio.json       All editable bilingual content
css/tokens.css            Palette, font faces and design tokens
css/base.css              Semantics, typography, locale foundations
css/layout.css            Editorial grids and spacing
css/components.css        Components and interaction states
css/responsive.css        Reflow and reduced-motion overrides
js/preference.js          Critical pre-paint locale selection
js/main.js                Independent enhancement initialization
js/content.js             Content loading and lookup
js/i18n.js                In-place localization and persistence
js/navigation.js          Accessible mobile disclosure navigation
js/motion.js              GSAP and ScrollTrigger lifecycle
assets/                   Local fonts, artwork and vendor modules
scripts/render.py         Refresh static HTML after content edits
scripts/vendor.mjs        Restore local pinned runtime assets
scripts/artwork.py        Recreate original SVG illustrations
scripts/verify.mjs         Interaction and failure-mode regression checks
scripts/audit.mjs          Responsive screenshots and axe checks
scripts/measure.mjs        Lighthouse mobile measurements
scripts/package.py        Package deployable files into a ZIP archive
reports/                  Verification evidence and screenshots
```

## Verification

See [reports/VERIFICATION.md](reports/VERIFICATION.md) for measured scores, responsive results, accessibility checks, skill usage and limitations. Raw results and viewable Lighthouse HTML reports are included.

QA dependencies are optional and **not deployed**. Install them in an isolated tools directory:

```sh
npm install --prefix .qa-tools --no-save playwright@1.58.2 @axe-core/playwright@4.11.1 lighthouse@13.0.1
npx --prefix .qa-tools playwright install chromium
```

With a server running on port 8017:

```sh
node scripts/verify.mjs
node scripts/audit.mjs
node scripts/measure.mjs
```

`TEST_URL` overrides the URL. `QA_ROOT` overrides `.qa-tools` and accepts an absolute path. `CHROME_PATH` can point to an installed Chromium binary. Run browser/performance commands sequentially for useful measurements. Lighthouse results are laboratory measurements, not field guarantees or an INP measurement. The zoom check emulates the CSS viewport at 200%; physical-device, Firefox, Safari and assistive-technology testing remain separate checks.

## Static deployment

Run `python3 scripts/package.py` to create `portfolio-static.zip`, containing only deployable files. Extract that archive on your host, or upload **`index.html`, `css/`, `js/`, `data/` and `assets/`** together to any static host. Do not upload `node_modules`, `.qa-tools`, screenshots or QA reports. No install/build command is required by the host. Keep all relative paths intact; subdirectory hosting is supported. The root needs no SPA rewrite rule. Test direct `?lang=ar` URLs and asset MIME types after upload.

Enable HTTPS, Brotli/gzip and sensible asset caching on the host. Keep HTML/JSON revalidated so edited content stays synchronized. Use versioned filenames before applying long immutable caching to assets. The Python development server deliberately supplies neither compression nor production caching. This task does not publish the website or configure a domain.

Fonts use the SIL Open Font License; license files and source package versions are under `assets/fonts`. Three.js's MIT notice is included. Preserve vendor license headers; GSAP's package identifies its standard no-charge license at https://gsap.com/standard-license. See [THIRD_PARTY.md](THIRD_PARTY.md).
