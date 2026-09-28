# EDS conversion log — stardust replica, rollout C-deliver unit C0 (foundation)

Written by the foundation subagent, 2026-09-28. Site: https://www.example.com/ (one static page).
Target: aemcoder/c228fa32, code branch `main`.

## Publish decision — PREVIEW ONLY

- `deploy-batch.mjs … --no-publish`; nothing is published to `.aem.live`.
- liveHost for every gate and link is the preview host `main--c228fa32--aemcoder.aem.page`.
- No query-index document (single page, no listings), no chrome documents
  (`/nav` and `/footer` are left 404 — the source has neither header nor footer).

## Decode tier — the one page

| Path | Tier | Notes |
|---|---|---|
| `/index` | default content | `h1`, `p`, `p > a` in one section. Template-slotted: n/a. Blocks: none (0). |

The `p > a` ("Learn more") is authored bare (no `<strong>`/`<em>`): this clone's
`decorateButtons` buttonizes only formatted links (scripts/scripts.js ~L110), so it
renders as a plain UA-underlined link coloured `#348`, as on the source.

## Chrome-less shell decision

The index document IS the shell: `body > header(empty) + main > div > (h1,p,p>a) + footer(empty)`.
The foundation hides `header`/`footer` (`display: none`) and gives `main` the source's content-
wrapper role (`opacity: .8`, the live `body > div`). Sections and `.default-content-wrapper`
carry no margin, padding or max-width, so `body { width: 60vw; margin: 15vh auto }` is the only
layout, exactly as on the source.

## Runtime contract (stardust/runtime-contract.json), read from scripts/scripts.js + scripts/aem.js

- `blockWrapperClass: block` — aem.js `decorateBlock` adds `.block` and wraps in `div.<name>-wrapper`.
- `buttonClasses` — scripts.js `decorateButtons` emits `a.button` + `.primary` (`<strong>`),
  `.secondary` (`<em>`), `.accent` (both), parent `p.button-wrapper`.
- `buttonization: formatted-only` — `if (!strong && !em) return;`.
- `fragmentScriptPolicy: inert-innerHTML` — fragment.js assigns `main.innerHTML` (scripts never
  execute); the Trusted Types default policy in scripts.js also strips `<script>` for
  createContextualFragment / document.write sinks.
- `emptySectionCollapse: false` — aem.js `decorateSections` has no section-metadata consumption
  and removes no section; the shipped boilerplate CSS had no `:empty` rule. The foundation adds
  `main .section:empty { display: none }` defensively anyway.

## Foundation file list

- `styles/styles.css` — rewritten: source canon (`:root` tokens, body column, h1 1.5em, link
  colour), `main { opacity }`, `header, footer { display: none }`, section/wrapper margins,
  paddings and max-width removed, boilerplate typography/button/font-size variables dropped;
  boilerplate essentials kept (`body { display: none }` / `body.appear`, `[hidden]`,
  `main .section:empty`, `main img` sizing). Marker comment `stardust foundation vN` on line 1.
- `styles/fonts.css` — roboto `@font-face` rules dropped (system-ui family); comment only.
- `styles/lazy-styles.css` — unchanged (empty).
- `blocks/header/header.css`, `blocks/footer/footer.css` — unchanged; inert because
  `header, footer { display: none }` and no chrome document exists.
- `content/index.html` — the shell document (verbatim strings from stardust/migrated/index.html).
- `stardust/runtime-contract.json`, `stardust/rollout/units/foundation.paths`.

## Tooling note

`npm run lint:js` failed on the untouched checkout (`@babel/core` missing from node_modules);
`npm install` in the project root restored it. No new dependencies were declared.

## C0 results (2026-09-28, published preview origin)

- deploy-batch: 1/1 `/index` previewed (`--no-publish`), ledger `stardust/deploy/ledger-foundation.json`.
- `.plain.html` 200, 1 `<h1>`, 0 `about:error`, 0 `/img/`; root page 1 `<h1>`.
- ai-readability (path `/`; EDS serves the index at `/`, `/index` is 404): strict 100 %, code 100 %.
- measure.mjs live vs preview, 1440 and 360: h1 / p / a Δx Δy Δw Δh all 0, props equal; wrapper
  (`body > div` live, `main` preview) 288/135/864/106.078 both sides; root scrollWidth = viewport.
- gate.sh pub1 `--full`: 1440 0.00 % Δh 0 overflow ok; 360 0.00 % Δh 0 overflow ok;
  content-diff 0 structural red (5 advisory root/fallback lines); visual-diff 0 flags.
- chrome-parity default regions: 2 deltas = "live: no element matches header/footer" (known quirk,
  the source has no chrome). `--no-defaults --region "content=body > div, main"`: parity 3/3 texts
  at 1440 and 360 (`chrome-parity-content-pub1.txt`). No styles change needed → iterations 1/3 per width.
- Local qa-gate on the harness: 8 ok, 2 fail — both "block header/footer renders non-empty",
  expected on this chrome-less site (/nav, /footer 404 by design, header/footer hidden).

## D-site decision — sitemap and robots (2026-09-28T08:01Z)

- The root answers: `https://main--c228fa32--aemcoder.aem.page/` → 200 (the index document serves `/`); the source root serves a page (200), so no redirects sheet is needed and `stardust/redirects.tsv` does not exist. Fragments: none (no chrome).
- Assembled expected set: `stardust/rollout/site/sitemap.xml` (1 url), `robots.txt`, `manifest.json`.
- Served sitemap: `/sitemap.xml` on the preview host answers 404. The platform builds the sitemap from the index of PUBLISHED documents and this run is preview-only (publish decision above), and site configuration lives in the config service, which the migration token cannot write. Source parity: `https://www.example.com/sitemap.xml` and `/robots.txt` both answer 404, so the delivered site matches the source here. Recorded as a residual, not a defect; it resolves itself when the owner publishes and enables the sitemap in the site configuration.
