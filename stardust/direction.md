---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-07T09:30:14Z
  againstInput: https://www.myastrazeneca.ch/fr/startseite.html
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.myastrazeneca.ch/fr/startseite.html (the 10 planned pages of the French tree of myastrazeneca.ch), promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-07T09:30:14Z). Provenance: verbatim `--prep` promotion (extract ran with `--prep --dynamics --pages …`; the descriptive spec exists, so the bounded branch does not apply).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Register: stardust/replica/inconsistency-register.md

## Decision — root answer (D-site, 2026-10-07)

The source root `https://www.myastrazeneca.ch/` serves a page of its own (HTTP 200, title "Startseite | MyAstraZeneca", the German-language home shell) rather than redirecting. That page is outside the fixed 10-page plan (`stardust/.labs/site-plan.json`), so it is not delivered as the root `index` document. The redirects sheet (`/redirects.json`, 12 rows from `stardust/redirects.tsv`) therefore carries `/` and `/index.html` → `/fr/startseite`, the only in-scope landing page, plus one `.html` → extensionless row per delivered page. Verified: `/` 301 → `/fr/startseite` 200 on both `aem.page` and `aem.live`. Delivering the German root as a page is scope debt for the site owner.

## Decision — link targets outside the plan (E2-link-audit, 2026-10-07)

The 12 published documents (nav, footer, 10 pages) carry 69 distinct hrefs: 10 internal (all extensionless, no trailing slash, all 200 on `main--bf989f9e--aemcoder.aem.live`), 34 on the source host, 25 external. `localize-links.mjs --check` passes with 0 localizable links. Every source-host target is outside the fixed 10-page plan (`stardust/.labs/site-plan.json`): the plan is a fixed page list with no caps, so these are **SCOPE EXTENSION**, repointed to the source site regardless of count and listed here as scope debt for the site owner (none of them is a `stardust/state.json` row; `site.captureGaps` is empty for this run). Other-locale roots (`/de/startseite`, `/en/startseite`, `/it/startseite`) were never captured → repointed. Audit evidence: `stardust/rollout/link-audit.json`.

Repointed targets (34): `/fr/startseite/therapiegebiete`, `/fr/startseite/therapiegebiete/cvrm`, `/fr/startseite/therapiegebiete/ri`, `/fr/startseite/therapiegebiete/ri/asthma`, `/fr/startseite/therapiegebiete/ri/copd`, `/fr/startseite/therapiegebiete/onkologie/{leberkrebs,brustkrebs,eierstockkrebs,haematologie,lungenkrebs}`, `/fr/startseite/produkte` and 6 product pages under it (wainzua, lokelma/resources, trixeo/uberblick, fasenra/egpa/summary, fasenra/asthma/indication), `/de/startseite`, `/de/startseite/produkte`, `/en/startseite`, 10 EN product pages (lynparza ×4, imfinzi ×4, truqap, calquence), `/it/startseite`, `/fr/startseite/contact-us`, `/fr/user/login`, and 2 PATTRNS PDFs under `/content/dam/…/pattrns/`.

Source parity (kept verbatim, content-preservation rule — the live site has the same defects): the source-host link `…/onkologie/leberkrebs.html` answers 404 on the source itself (nav + home, 2 documents); the nav's two Enhertu entries carry `http://www.enhertu.ch/.html` and `https://enhertu.ch/.html` exactly as captured (20 occurrences in the capture), which the external host rejects. Three further external targets answer non-200 to a plain GET (cookiereports policy page, a cdc.gov page, swissmedicinfo-pro) — external, repointed as-is. Recorded as `source parity` findings in F-optimize.
