# Engineered Editorial portfolio

Latest independent audit and refinement: [scores, prioritized plan, measured results, limits and changed files](reports/refinement/AUDIT.md). [Compare rendered screenshots](reports/refinement/compare.html) in both languages at mobile, tablet, desktop and ultrawide widths. Earlier reports below remain the initial implementation record.

The refined portfolio supports shareable expanded case studies (`?lang=ar#case-inventory`, for example) and localized links to original-size concept artwork. Changing locale keeps preview links and case action labels synchronized. Tablet projects stack at 601–900px to give their interface previews enough room.

For repeated Lighthouse measurements, set `RUNS=3` and `REPORT_DIR=reports/refinement/after` when running `scripts/measure.mjs` with the QA environment described below. The new `scripts/refinement-review.mjs` captures the normal-motion matrix and draw-call/frame probes; `PHASE` selects the evidence folder. These are optional QA scripts, not a production build step.

A complete bilingual English/Arabic developer portfolio using semantic HTML, CSS, native JavaScript modules, GSAP + ScrollTrigger and Three.js. The approved visual source is [DESIGN.md](DESIGN.md). All names, biographies, skills and case studies are illustrative and editable. No client results or testimonials are claimed.

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

Only `gsap@3.14.2` and `three@0.181.2` are runtime dependencies. No framework, component library, remote font request or runtime CDN is used.

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
| `en.projects`, `ar.projects` | Project title, category, description, problem, solution, role and alt text |
| `profile.projects` | Stable project IDs, images and technology lists |
| `profile.portrait` | Local portrait path |
| `profile.email` | Real email address, without `mailto:`; `null` hides the email action |
| `profile.github`, `profile.linkedin`, `profile.cv` | Genuine HTTPS profile URLs or a local CV path; `null` hides each link |
| `en.contact`, `ar.contact` | Contact copy, including the provisional status note |
| `en.footer.copyright`, `ar.footer.copyright` | Footer owner text; the renderer supplies the year |
| `en.seo`, `ar.seo` | Localized page title and description |
| `en.nav`, `ar.nav`, `en.scene`, `ar.scene` | Navigation and accessible control labels |

Keep both locale objects structurally aligned. For added or removed projects, change `profile.projects`, `en.projects` and `ar.projects` in the same order. Preserve unique stable `id` values for existing project links, such as `#project-inventory`. The generated page contains full default English HTML; native navigation and case-study details work without JavaScript.

### Contact and downloads

Set a real email and only the URLs you own. Then regenerate the HTML. An email produces a real `mailto:` action. Social/CV links are absent while their values are `null`. Replace `contact.note` in both languages if partially configuring contact information. There is no contact form, pretend delivery state or backend service to configure.

### Replace the images

The supplied project artwork, silhouette portrait, sculpture fallback and favicon are original local SVG files. They need no raster `srcset` because they scale without loss. They represent concept interfaces, not screenshots of shipped work. `scripts/artwork.py` can recreate them, but running it will overwrite those original illustration files.

1. Put your images in `assets/images/`. Prefer WebP or AVIF for photographs/screenshots.
2. Set `profile.portrait` and update `about.portraitAlt` in both languages. The portrait frame deliberately crops to fit.
3. For each project, add `images` and optionally `srcset` beside `id`, `image` and `technologies`:

```json
{
  "id": "inventory",
  "image": "inventory",
  "images": {
    "en": "assets/images/inventory-en-1200.webp",
    "ar": "assets/images/inventory-ar-1200.webp"
  },
  "srcset": {
    "en": "assets/images/inventory-en-600.webp 600w, assets/images/inventory-en-1200.webp 1200w",
    "ar": "assets/images/inventory-ar-600.webp 600w, assets/images/inventory-ar-1200.webp 1200w"
  },
  "technologies": ["Your actual technologies"]
}
```

4. Update each locale's project `alt`, descriptions and sample labels accurately. Use 3:2 artwork to match the existing project frames. Keep meaningful information available as text in the case study, rather than only inside screenshots.
5. Run `python3 scripts/render.py`. Verify both `?lang=en` and `?lang=ar`.

Without custom `images`, the portfolio uses `assets/images/<image>-en.svg` and `assets/images/<image>-ar.svg`. SVG originals intentionally replace the requested raster preview formats: they are smaller, resolution independent and locally authored. Replace `assets/images/favicon.svg` when adding your own identity.

## Localization and progressive enhancement

- The tiny `js/preference.js` selects the locale before paint. Generated bilingual text spans prevent an English-to-Arabic layout jump; CSS exposes one language at a time.
- The main localization module updates the document language, direction, metadata, accessibility labels, preview artwork and all text in place. It does not reload the page or rebuild listeners.
- Explicit `?lang=ar` / `?lang=en` wins over saved preference. Storage failures are handled. Manual language changes update the shareable URL with `replaceState`.
- Technical terms use bidi isolation; Arabic uses IBM Plex Sans Arabic without Latin tracking or imitation italics.
- If JavaScript is disabled, the default English page remains usable. If only the JSON request fails, the already rendered locale text remains visible and native navigation/details still work.
- This is one HTML entry point. Metadata changes at runtime; separate Arabic search indexing and locale-specific social previews are **not guaranteed**. Add genuinely localized static routes and real canonical/hreflang URLs if separate indexing becomes a requirement. No fictional domain is supplied.

## Motion and 3D

Native scrolling is never intercepted. GSAP adds brief whole-line hero movement and restrained section/image reveals; reduced motion disables them. Language changes and native details refresh ScrollTrigger after fonts settle.

The single hero canvas draws 23 procedural square frames. It renders on demand after pointer/scroll/resize input, then stops when interpolation settles. Rendering suspends offscreen and in hidden tabs. DPR and drawing-buffer dimensions are capped; geometry/materials, observers and listeners are disposed on full navigation. Context loss exposes the original SVG and context restoration redraws the scene. The interaction can be paused.

Small phones (600 CSS pixels or less), reduced-motion users, Save Data users and low-capability devices get the static SVG to avoid the WebGL download/cost. WebGL failure also preserves the fallback. Desktop/tablet scenes initialize lazily after essential content. A mobile-first visit resized to desktop retains its static fallback until refresh.

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
js/scene.js               Deferred demand-rendered Three.js sculpture
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
