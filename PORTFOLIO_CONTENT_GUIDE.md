# Portfolio content guide

All personal and project copy is owned by `data/portfolio.json`; skills are owned by `data/skills.json`. `scripts/render.py` generates English and Arabic static HTML from these same sources. Run it after every content change:

```sh
npm run content
npm run check
npm run build
```

On Windows PowerShell with script execution disabled, use `npm.cmd` in place of `npm`. No frontend compilation, framework installation or runtime CDN is required.

## Add a project

1. Add a stable, URL-safe ID to `profile.projects`, with original screenshot paths in `images`, responsive `srcset`, full-size `preview`, `url` and `private`.
2. Add the matching record at the same position in `en.projects` and `ar.projects`. Supply title, category, description, problem, solution, role, highlights, meaningful alt text and preview/live-link labels.
3. Supply `caseStudy.architecture`, `caseStudy.challenge` and `caseStudy.results` in both languages. Only publish facts you can support. The existing renderer provides the ten-part case-study structure and the screenshot gallery.
4. Add actual, optimized screenshots under `assets/images/projects/`; retain originals outside the deployed assets directory. Never add client credentials, internal financial data or unredacted private screenshots to a public asset folder.
5. For a confidential project set `private: true`, `url: null`, add a localized `privacyNote`, and publish only a redacted preview.
6. Run content/check/build, then test `#project-ID` and `#case-ID` in both languages. Do not change existing IDs: they are shareable links.

The first project receives the featured layout. Current order is Garment Factory System, ROCKS EV, Bonyan, Ahmed Gamal and Ahmed Nabil. Navigation counts derive from actual cards.

## Case-study evidence

The sections are overview, problem, responsibilities, solution, features, architecture, technology, challenges, results/lessons and gallery. Existing projects do not have verified project-specific infrastructure/stacks in the supplied record; the page says so explicitly. The conceptual architecture demonstration is not evidence of a project’s architecture. A CV employment technology or an unrelated repository must not be assigned to a client project by inference.

When a stack becomes verified, extend the project record and renderer deliberately, replacing the appropriate unknown-stack note with the documented tools. Add a repository link only after confirming that it is public and belongs to that exact project. Add metrics only with a trustworthy source and context. One actual screenshot is currently available per project; do not fabricate additional gallery views.

## Update skills and technology icons

Each `skills.json` skill has a stable ID, name, category IDs, icon key, bilingual description, featured flag, display order and `relatedProjects`. Categories own the ordered list of skill IDs. Every skill appears in exactly one primary category; representative/featured appearances do not create additional skill records.

The six categories cover backend, frontend, databases/data, AI, cloud/DevOps and architecture/software engineering. To move a skill, update both its category ID and the relevant category lists. Preserve all verified skills. `npm run check` detects missing/duplicated IDs and translation mismatches.

The compact stack reads the ordered `featured` ID list. Featured flags should agree with that list. Icons use local SVGs in `assets/icons/`; a competency without a technology logo uses the simple code symbol. Keep SVGs recognizable, include licenses/provenance in `THIRD_PARTY.md` when adding assets, and maintain 24px featured / 16px inline sizing. Newly used site libraries do not automatically become professional skills.

## Add experience

Add a stable record to `profile.experience` with company, start/end dates, type and verified technologies. Set `type` to `employment` or `training`; never present a bootcamp as employment. Add aligned `experience.items` records in English and Arabic with role, location, period and responsibility points. The approximately 30% VIVEM response-time improvement is explicitly attributed to the supplied CV, not independently measured here.

## Translations

Keep the entire `en` and `ar` object shape aligned, including arrays and accessible labels. `data-copy`, `data-copy-alt`, `data-copy-aria-label`, `data-copy-placeholder` and `data-copy-content` references are validated by `npm run check`. Preserve technical names in English when clearer. Do not split Arabic characters for animation. Write files as UTF-8; avoid piping Arabic source through PowerShell’s legacy external-process encoding.

Default document routes are `/` and `/ar/`. Existing query preferences remain valid and explicit queries take precedence. Native Arabic links keep `/ar/` without JavaScript; in-place switching preserves the active query and visitor draft.

## Architecture demonstration

`profile.architecture.nodes` owns IDs/technology examples; `.edges` owns directed relationships. Both locale `architecture.nodes` arrays provide titles, responsibilities and short relationship labels. Add real HTML explanations for every diagram node. Keep Docker, CI/CD and cloud delivery outside the request-processing graph. This is a conceptual illustration unless a separate project-specific architecture is verified.

## Contact details

Current public website choices, confirmed by the owner:

- WhatsApp: `201156972307`, displayed as `01156972307`.
- Email: `ahmedalgohary1170@gmail.com`.
- GitHub: `https://github.com/ahmedalghary1`.
- LinkedIn: `https://www.linkedin.com/in/ahmed-algohary-124396396/`.
- LeetCode: `https://leetcode.com/u/ahmedalgohary/`.

LinkedIn and LeetCode come from the supplied CV’s actual PDF link annotations. The CV lists a different phone (`+201552810113`) and GitHub (`ahmedalgohary1170`). The owner’s newer explicit website choices take precedence; the PDF was preserved unchanged. Reconcile the PDF separately if desired. Do not silently replace either website contact from an older document.

The contact form prepares a WhatsApp draft or copies a message. It does not send messages or store drafts on a backend. Automated handoff tests use a local fixture and never send real messages.

## Replace the CV

Replace `assets/documents/ahmed-algohary-cv.pdf` with the approved PDF and keep `profile.cv` aligned. The source `Ahmed Algohary-CV.pdf` remains unchanged at the project root. The renderer enables download links only when the configured local file exists. Update the public details in the website and CV intentionally; do not assume they must change together.

The current file is 78,847 bytes and is verified against the owner’s source. Native same-origin download links require no JavaScript. The managed QA browser intercepts PDF requests/downloads; its interception is documented in the QA report, separately from successful direct HTTP delivery and checksum checks.

## Share image and publishing

Update `profile.url` only when changing the actual production domain. Re-render HTML, canonical/hreflang, structured data, sitemap and robots together. To refresh the 1200×630 share image, run `node scripts/render-social.mjs` with the local server running and Playwright QA dependencies available. The hero and sharing image use the original portrait; no sculpture asset is used.

`npm run build` creates `portfolio-static.zip` from the generated documents and deployed asset directories. Upload its contents to the current static host’s document root. Include `ar/index.html`; preserve directory-index handling, HTTPS, correct MIME types and caching/compression. Original source screenshots, source CV, node_modules, QA tooling and reports are excluded. The build does not publish or change production hosting.
