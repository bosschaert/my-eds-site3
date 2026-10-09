# EDS conversion log — www.example.com (replica flow)

## Publish decision
**Publish.** Decided for this run before delivery: every delivered page goes live on the aem.live origin (deploy-batch.mjs without --no-publish). Recorded once here (2026-10-08).

## Foundation (C0, 2026-10-08)
- `styles/styles.css` rewritten from the two lifted source rules (html color-scheme/background, body font/measure/padding); no link, heading, button or font styling — the source has none.
- The source has no site chrome: `blocks/header` and `blocks/footer` render nothing when no `/nav` or `/footer` document exists (null-safe fragment load); `header, footer { height: 0 }`. No nav/footer documents are authored for this site.
- `styles/fonts.css` emptied (system-ui only; nothing to self-host). `stardust/runtime-contract.json`: vanilla-eds, formatted-only buttonization (`a.button` in `p.button-wrapper`), empty-section collapse on.
- Lint: `npm run lint` exit 0 (eslint 0 errors, 1 pre-existing warning in a stardust script; stylelint clean).

## Decode tiers
- `notice` (index): template-slotted — one fixed composition (decorative glyph, six language paragraphs, one link). Recorded at the archetype unit.

## Archetype index (C-archetype, 2026-10-08)
- Block `notice` (template-slotted): rows = language code | paragraph; a bare-link row becomes the CTA wrapper; the decorative glyph is a CSS mask on `.notice::before` (no media). Language codes are `@ew-exempt` configuration cells.
- Decision `no-h1`: the source page has no heading; none was added. qa-gate and delivery-lint each report that one expected finding; everything else passes.
- Published-origin gate: gate.sh pub rounds 0.00% / Δh 0 at 1440 and 360; gate-all rows 0.08% (1440) and 0.28% (360), clipped 0, presence 0/0, pass. ai-readability 100/100. Live on https://main--f4c8728b--aemcoder.aem.live/.
- Foundation request queued (link `title` added by the vendored runtime); shipped as a scoped override in the block.
- E-full-site: index `verified` (reachable, no about:error, gate pass); the verify script's one-h1 rule is accepted by decision `no-h1` (source has no heading). Header/footer blocks fetch `/nav` and `/footer` which do not exist (404, tolerated) — candidate for the optimize/autofix pass.
