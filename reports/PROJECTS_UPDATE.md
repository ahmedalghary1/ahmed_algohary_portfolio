# Real project integration

The selected-work section now uses the five owner-supplied projects, in screenshot order: Ahmed Gamal, ROCKS EV, the garment factory system, Bonyan and Ahmed Nabil. English and Arabic descriptions, project details, scope labels, image descriptions and link labels are included. Four websites have external links; the company system has a privacy notice and no public access link.

Screenshots use uncropped 16:9 frames, responsive 800px/1600px WebP variants and original-resolution previews. Full-resolution previews total approximately 436 KB, 91.8% smaller than the original PNGs. The factory preview has account identifiers, financial/operational figures and the visible stock entry redacted. The source screenshots remain local in the Git-ignored root `projects/` folder; only public assets are included in `portfolio-static.zip`.

Verification completed:

- Five project records and unique HTML IDs, four expected website destinations, one private system without a URL.
- 380 localized text/attribute references resolve to nonempty English/Arabic content.
- All local resource links and fragment targets resolve; 15 screenshot assets have correct dimensions and return HTTP 200.
- JavaScript syntax checks for the changed localization module and updated existing browser verification scripts pass.
- Static HTML regeneration is deterministic and synchronized with JSON; archive HTML matches the current source.
- The deployment archive includes all public screenshot variants and excludes original screenshots and reports. `git diff --check` passes.

The redacted factory image was visually inspected. Browser rendering, responsive behavior and runtime interactions were not verified in this session: the browser tool reported no available browser. The existing browser verification scripts were updated for the five real projects but were not executed. The four external sites could not be inspected through the web tool; their URLs are preserved exactly as supplied by the owner.
