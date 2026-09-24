# EDS conversion log — replica of https://www.example.com/

## Phase C0 — foundation (2026-09-23)

Source: one page, no header, no footer, no images, no scripts. Entire stylesheet:
`body { background-color: #eee; width: 60vw; margin: 15vh auto; font-family: system-ui, sans-serif }`,
`div { opacity: 0.8 }`, `h1 { font-size: 1.5em }`, `a:link, a:visited { color: #348 }`.

### Runtime contract (`stardust/runtime-contract.json`)
- vanilla-eds; `decorateBlock` wraps in `div.<name>-wrapper`, adds `.block`.
- Buttonization is **formatted-only** (`scripts/scripts.js decorateButtons` requires `<strong>`/`<em>`),
  so the bare `<a>` in the third paragraph stays a plain link. The button look is neutralised in
  `styles/styles.css` anyway (the source has no buttons).
- `emptySectionCollapse: true` — `main .section:empty { display: none }` added.

### Foundation decisions
- `styles/styles.css`: design values replaced with the source's; boilerplate mechanics kept
  (`body { display: none }` / `.appear`, header/footer visibility, `main img`, `.icon`, form
  `font: inherit`). Source `body` box → `main { width: 60vw; margin: 15vh auto }`; source `div`
  → `main > .section { margin: 0; padding: 0; opacity: 0.8 }` with the inner wrapper un-capped.
  No `a:hover` rule, no text-decoration override, no 900px media query, no roboto fallbacks,
  `header { height }` removed.
- `styles/fonts.css`: no `@font-face` — the source uses `system-ui` only.
- `blocks/header/*`, `blocks/footer/*`: there is no `/nav` or `/footer` document. Both blocks
  return after `loadFragment()` yields `null`, leaving an empty block; CSS sets no height,
  padding, border or background so the chrome renders at zero height. The boilerplate nav CSS
  was dropped (it referenced variables the source does not have).
- No blocks added: the page is default content only. Block round-trip is not applicable.

### Content decisions (`content/index.html`)
- DA body fragment; text verbatim from `stardust/migrated/index.html`.
- Metadata block carries **Title: Example Domain** only. **No Description** — the source page has
  no description meta, and a replica must not fabricate one.
- Link `https://iana.org/domains/example` is external to `www.example.com`; `localize-links`
  leaves it absolute.
- Media: 0 images (media-reconcile: nothing to reconcile).

### Publish decision
- Preview **and** live: `deploy-batch.mjs` runs PUT → preview → live for `/` (the site's only page).

### C0 gate results
- delivery-lint 0 P0 / 0 P1; localize-links check PASS (0 localizable); davids-model-lint PASS;
  sanitise: no non-ASCII; media-reconcile: 0 images (nothing to reconcile).
- section-schema on the prototype: 0 sections (the prototype `main` holds h1/p/p directly, no
  `<section>`), so qa-gate has no unit counts to assert — acceptable for a default-content page.
- qa-gate on the local harness: 8 ok, 2 fail — the two FAILs are `block header/footer renders
  non-empty (h=0 kids=0)`. Accepted by design: the source has no chrome, the blocks are required
  to render at zero height. No other block exists, so block-roundtrip is not applicable.
- Deployed `/` to preview and live (deploy-batch: 1 ok, 0 failed). Preview 200, live 200,
  `index.plain.html`: 1 `<h1>`, 0 `about:error`, 0 `/img/`. The pipeline emits an empty
  `<div></div>` for the consumed metadata section (confirms `emptySectionCollapse: true`).
- The pipeline auto-derives `<meta name="description">` from the first paragraph; it was not
  authored (no Description row) — a delivery default, not fabricated content.
- ai-readability `/`: strict 100%, code 100% (gate 98%).
- shell-guard (stardust/.work/rollout/probes/shell-guard.mjs) on the preview URL at 1440 and 360:
  30/30 pass (0 pageerror, header/footer 0px, main 60vw / top 15vh, link inline underlined
  rgb(51, 68, 136), h1 24px/700, body rgb(238, 238, 238), section opacity 0.8, no overflow).
