# Content maintenance

The source of truth is data/portfolio.json: shared records under profile.projects and copy under en.projects/ar.projects. Keep these three arrays in the same order. Rendering escapes text.

## Add a project

1. Add a shared record with unique id, lowercase hyphenated slug, image, localized images/srcset, preview, url (null when private), private, featured, status, technologies, repositoryUrl and screenshots.
2. Add matching English and Arabic records: title, category, short description, overview, problem, solution, role, highlights, alt, previewLabel, visitLabel for public sites, privacyNote for private work.
3. Each screenshot has src, thumbnail and altKey (e.g. projects.5.alt). Additional images need their own accurate translated alt keys. Put approved redacted assets in assets/images/projects/.
4. Populate technologies only with confirmed names; leave unknown stacks empty. Empty technology sections are omitted rather than guessed. No unsupported metrics or testimonials.
5. Run npm run content, npm run check and npm test with the local server running. Review screenshots, then npm run build. Routes, next-project links and sitemap entries are automatic.

One template, scripts/render_projects.py, generates every card and case page. No duplicate route components are needed. Renaming a public slug requires retaining the old page or adding a host redirect. Reordering records must also update screenshot altKey indices.

## Homepage

Order: hero, work, services, technology, About, process, contact. The hero has two actions and the actual portrait. profile.services links services to evidence or contact; translations live under each locale's services. Desktop/mobile application services were omitted because project evidence is insufficient.

data/skills.json.homepageGroups selects 13 existing IDs in four groups. The full 77-skill source remains available but is not rendered. Do not add skill percentages. Historical architecture and experience records remain in data as reference, not public claims about individual projects.

## Contact and CV

Website uses the user's confirmed email ahmedalgohary1170@gmail.com, WhatsApp 201156972307 and GitHub https://github.com/ahmedalghary1. LinkedIn and LeetCode were extracted from the supplied CV. Its older phone/GitHub differ from the latest website details; the PDF is intentionally unchanged.

The form is a local WhatsApp message composer, not an email delivery service. It validates fields, prepares a draft or copies text, and offers manual copying if clipboard access fails. No server, spam protection or delivery success is invented. Direct contact works without JavaScript. Replace the PDF only with an approved new file and keep profile.cv aligned.

## Translation and assets

Keep en/ar key and array structures aligned. The static pages work independently; JavaScript changes visible language, direction, metadata and links without losing form input. No-JS language links target the equivalent project route.

Edit modular CSS, not css/site.css. Keep interface screenshots legible, with dimensions and responsive WebP variants. Original projects/*.png files must never enter deployment; the packager uses an exact generated-route allowlist. Public factory images must remain redacted.
