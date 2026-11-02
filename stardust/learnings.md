# Learnings — hydroflask.com single-page replica (2026-10-29)

### Interim newsletter form accepted an empty submission
- failure class: dynamic-gap
- evidence: footer newsletter (owner D4, no backend) showed "Thanks!" on an empty submit; found only at D2 when writing the parity rows — the form had `novalidate` and no `required`, and the interim never told the visitor nothing was sent
- proposed change: `skills/dynamics/reference/forms.md` — the interim tier's contract: required fields enforced, an `aria-live` status line that states no data was sent; foundation briefs carry it so C0 builds it
- status: pending

### Closed drawers kept aria-modal, click-dialog replay saw them as open
- failure class: dynamic-gap
- evidence: header store-switcher/minicart drawers carried `role=dialog aria-modal=true` while hidden by CSS; `dynamics-check` click-dialog reported "Escape closes: false" although Escape closed them visually
- proposed change: `skills/deploy/SKILL.md` header contract — drawer panels set role/aria-modal only while open (or `hidden` when closed)
- status: pending

### Rotation render check sampled once per full cycle
- failure class: silent-render (false negative)
- evidence: a single end sample after 15 s read "stuck" for both the 2-slide hero (6.5 s) and the 3-slide promo (5 s) — both had cycled back to the start index
- proposed change: `skills/rollout/SKILL.md` § Phase E render check — sample each second and assert more than one index seen
- status: pending

### JSON-LD needs a manual head.html placement on EDS
- failure class: platform-migration
- evidence: optimize P2 ai-search/jsonld on index; autofix-aem reports it manual; the source's Organization block went into head.html verbatim
- proposed change: `skills/rollout/scripts/autofix-aem.mjs` — offer the source's Organization JSON-LD (site-wide fact) as an automatic head.html fix when the capture carries it
- status: pending
