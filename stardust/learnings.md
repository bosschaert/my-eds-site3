# Learnings — niravmanubhai.com replica migration (2026-09-23)

One entry per failure class this run surfaced. Format: `skills/stardust/reference/learnings.md` § Entry shape.

### Google Fonts build fork between capture and gate
- failure class: font-fork (rendered-face metrics differ from the intercepted files)
- evidence: home archetype iter1 at 1440 1.61 % / Δh 33 and at 360 3.45 % / Δh 37; footer "RETURN HOME" measured 100 px live vs 105 px built; the conversation h2 wrapped 3 lines instead of 4. Two causes recorded in `stardust/journal.md` § Recreate: (1) variable faces declared with weight ranges (`300 600`) instead of Google's per-weight single-value faces; (2) Google Fonts serves a different (Windows-hinted) build per UA, so the crawl's intercepted woff2 did not match the files the gate's Chromium downloaded. Fixed by declaring per-weight faces and fetching the Linux-UA build into `stardust/current/assets/fonts/gf/` (19 files); iter3 0.02 % / 0.05 %.
- proposed change: `skills/replica/reference/recreation-procedure.md` § Fonts — for Google-hosted faces, declare `@font-face` per weight exactly as the served CSS does (never collapse into a range) and fetch the font files with the same UA the gate captures with; `skills/extract/SKILL.md` § Fonts (network intercept) — record the UA that produced each intercepted file in the fonts manifest.
- status: pending

### Intercepted font covered only the Latin subset
- failure class: capture-gap (non-Latin glyphs fell back to a system face)
- evidence: the Gujarati blessing paragraph on the home page rendered in a fallback face until the `gujarati` unicode-range subset of Rasa was fetched by hand (`stardust/current/assets/fonts/rasa-gujarati-variable.woff2`); the crawl had intercepted the latin subset only because no Gujarati glyph was painted before capture settled (`stardust/journal.md` § Recreate).
- proposed change: `skills/extract/SKILL.md` § Fonts — after the intercept, scan the captured text for scripts outside Latin and fetch every `unicode-range` subset the served font CSS declares for those scripts; `skills/replica/reference/recreation-procedure.md` § Fonts — a width-probe on any non-Latin string before the first gate round.
- status: pending

### Static JSON-LD not carried by the AEM autofix
- failure class: optimize-gap (a fixable finding routed to manual)
- evidence: F-optimize P2 `ai-search/jsonld` on `/` (source head has one `application/ld+json` `@graph`, replica 0); `autofix-aem.mjs` marked `eds-jsonld` `manual`; applied by hand as a verbatim copy into `head.html`, scorecard 90 → 100 (`stardust/status.jsonl` G-aem end, `stardust/journal.md` § G-aem).
- proposed change: `skills/rollout/SKILL.md` § Phase G + `skills/rollout/scripts/autofix-aem.mjs` — when the source page carries a static `application/ld+json` block and the site has one page (or one block shared by all pages), copy it verbatim into `head.html` as an automatic fix; for per-page graphs emit a `json-ld` metadata row per page instead.
- status: pending

### Hover colour transition invisible to the motion sampler
- failure class: dynamic-gap (a CSS transition that fired live was not reported MISSING)
- evidence: source footer links fade colour over 180 ms on hover; the gated prototype and the published build change instantly; `motion-observe.mjs` live vs published reported 6 parity / 0 missing, and the delta surfaced only through a direct hover probe in D2-dynamic (`stardust/dynamics/parity.json`, `stardust/journal.md` § D2-dynamic). Frozen footer left as is; residual recorded.
- proposed change: `skills/replica/reference/recreation-procedure.md` § Interaction parity + `skills/replica/scripts/motion-observe.mjs` — on every `--hover` poke record `transition-property` / `transition-duration` of the hovered element and its links, so `motion-compare.mjs` prints a timing-delta line for colour transitions, not only for class toggles.
- status: pending

### Runtime-generated title attributes read as content deltas
- failure class: gate-noise (false 🟡 from the EDS runtime, repeated on every page)
- evidence: content-diff on the published origin reported EXTRA TITLE ×7 on `/` — every one added by `scripts/aem.js` `decorateButtons` (title = link text) — plus MISSING ARIA-LABEL on a section because runtime sections are `<div>` (`stardust/journal.md` § C-deliver, `stardust/eds-conversion-log.md`). All accepted by hand as intended; nothing structural.
- proposed change: `skills/diff/SKILL.md` § Reading content-diff output (and `diff/scripts/content-diff.mjs`) — an `--eds` profile flag that ignores a `title` attribute equal to the link's own text and a missing `aria-label` on a section root, so the published-origin pass reports 0 🟡 on those two runtime effects by default.
- status: pending

### Bounded crawl leaves the state machine unwritten
- failure class: capture-gap (state and descriptive spec missing on the `--single` path)
- evidence: `extract --single --dynamics` wrote `stardust/current/pages/index.json`, the screenshot and `_crawl-log.json` but no `stardust/state.json`; replica created the state file and stamped the flow itself, and Phase 2 synthesized `PRODUCT.md` / `DESIGN.md` / `DESIGN.json` (`bounded-single`) — both steps recorded in `stardust/journal.md` § Extract and § Preserve-direction. `DESIGN.json` had to be added to `.hlxignore` by hand so it is not served.
- proposed change: `skills/extract/SKILL.md` § Single / bounded mode — write `stardust/state.json` with the captured slugs in `extracted` at the end of a `--single` / `--pages` run (through `state.mjs`), and list `PRODUCT.md`, `DESIGN.md`, `DESIGN.json` in the `.hlxignore` template of `skills/stardust/SKILL.md` § Setup.
- status: pending
