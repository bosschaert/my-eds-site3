---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-28T09:10:43Z
  againstInput: https://www.niravmanubhai.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
    - stardust/replica/lift/cascade.css
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.niravmanubhai.com/,
promoted mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-09-28T09:10:43Z). `current/PRODUCT.md` / `DESIGN.md` / `DESIGN.json`
do not exist on this bounded entry (`extract --single --dynamics`); a later site-scope re-run with
`--prep` replaces the synthesized spec with the verbatim promotion.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Flow: replica (flowSource user-phrase). Scope: one page (`/` → slug `index`), fixed by stardust/.labs/site-plan.json;
the site root of the new site resolves to it. Page type: `home` (one archetype).

## Hands-off activation (2026-09-28T09:10:43Z)
Hands-off mode is active for this run (`state.json.handsOff: true`). Interactive gates auto-resolve per the
master skill § Hands-off mode: prototype approval is recorded `approvedBy: "hands-off"` only after the
source-fidelity gate passes at 1440 and 360; dynamics owner decisions ship the interim tier and are named in
stardust/dynamic-features.md. Named assumptions: fonts stay on their public Google Fonts source (open faces,
self-hostable at deploy); analytics tags (Google tag, Cloudflare Insights) are not activated on the new host
until the owner confirms the property.

## Site assembly decisions (2026-09-28T11:26Z)

- **Redirects: none.** `curl -sI https://www.niravmanubhai.com/` answers 200 (no Location chain): the source root serves its page, so the home page is delivered as the root `index` document and the sheet carries no `/` row. No `stardust/redirects.tsv` exists — one page, no moved paths — so no redirects sheet is created.
- **Publish: preview-only, unchanged.** No owner decision to publish live has been made; the delivered origin remains `https://main--fdc3c10d--aemcoder.aem.page/` (run.json `previewUrl`). The served-sitemap verification therefore runs against the preview origin.
- **Served sitemap: unavailable.** `/sitemap.xml` and `/query-index.json` answer 404 on the preview origin (no index configured for the site); the config service answers 401 to the migration token. Recorded as a P2 out-of-scope finding (`served-sitemap`) for the owner; the assembled expected set is 1 url.
- **Chrome documents** `/nav` and `/footer` carry a `Robots | noindex` metadata row (re-previewed; served `<meta name="robots" content="noindex">` verified on both).

## Link-audit decisions (2026-09-28T11:37Z)

- **Scope extension → repoint (17 targets).** The run's page scope is fixed to the home page (`stardust/.labs/site-plan.json`), so every
  other page of the source site linked from `/`, `/nav` or `/footer` is outside the declared scope and stays an absolute link to the
  source site — none is captured, none is authored from a live read: `/axiom-stories`, `/come-sit-just-ask`, `/contact`, `/follow`,
  `/house-specials`, `/kabir-vaidya`, `/license`, `/my-books`, `/my-study`, `/now`, `/patrons`, `/privacy`, `/quiet-signal`,
  `/sitemap`, `/stills`, `/story-bouquet`, `/story-nursery` (all 200 on www.niravmanubhai.com at audit time). Listed as scope debt:
  they become internal links when those pages are migrated. `localize-links --check`: 0 still localizable.
- **External targets kept verbatim (6 + 1 mailto).** substack, wa.me, whatsapp channel, instagram → 200; facebook → 400 and
  linkedin → 999 to a non-browser fetch (both platforms refuse automated requests; the source page carries the same URLs).
- **Internal hrefs**: `/` only (root-relative, extensionless), verified 200. Chrome documents `/nav` and `/footer` are previewed,
  render on the verified page and carry `noindex`.
