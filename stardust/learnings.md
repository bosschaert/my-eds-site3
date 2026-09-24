# Learnings — sorra.jp replica run (2026-09-24, bounded single page)

### Site h1 lives in the header fragment — raw-HTML h1 rules false-fail every page
- failure class: instrument-gap (verify.mjs, delivery-lint page rule, optimize seo/single-h1 all count `<h1>` in the fetched page document; a site whose only h1 is the header logo renders 1 h1 but the document carries 0, and the fragment rule forbids authoring it in /nav)
- evidence: sorra.jp home — live rendered DOM 1 h1 (`h1.l-header__logo > a > img`), preview page document 0; E-full-site `failed`, F-optimize P1 open, until the header block wrapped the brand in an h1 and the finding was `accepted` by hand with a rendered probe
- proposed change: `skills/rollout/scripts/verify.mjs` + `optimize.mjs` single-h1 — when `rollout.json` (or the header block) declares `siteH1: header`, count the h1 in a rendered DOM (or in `/nav.plain.html` + page) instead of the raw document; `skills/deploy/SKILL.md` § 8 — name the "brand as h1" node-slot pattern (h1 wrapper created by header.js, authored `<p>` kept) so replicas of logo-h1 sites do it on C0, not in G
- status: pending

### autofix-aem `eds-fix-h1` promotes the first h2 — a fidelity change in the replica flow
- failure class: silent-render (an autofix that alters heading roles the live site does not have; pixel gates stay green while role parity breaks)
- evidence: `autofix-aem.mjs --dry-run` on this run: "promoted first <h2> to <h1>" for a page whose live DOM keeps that string an h2; rejected by hand
- proposed change: `skills/rollout/scripts/autofix-aem.mjs` — skip `eds-fix-h1` (and any role-changing fix) when `state.json.flow === "replica"`, emit a `manual` row pointing at the header-h1 pattern instead
- status: pending

### localize-links has no repoint mode for scope-extension targets
- failure class: path-safety (E2 says "repoint to the source site, never leave a 404", but the only shipped link tool goes source→root-relative; the reverse needed a one-shot helper)
- evidence: 22 out-of-scope paths (38 hrefs, 15 delivery-lint P1 trailing-slash rows) on index/nav/footer would have 404'd on the new origin; rewritten with `stardust/.work/rollout/probes/repoint-links.mjs`
- proposed change: `skills/deploy/scripts/localize-links.mjs` — add `--repoint-unknown <source-origin>`: root-relative hrefs whose path is not in the content map become `<source-origin><path>` (verbatim captured href when the capture has it), reported per path; run it in E2 before `--check`
- status: pending

### stitch-shot warns FONT LOAD FAILED for the metric-fallback face on every round
- failure class: false-measurement warning (noise: the declared `kulim-park-fallback` face is a `local()` metric-compatible fallback that never loads as a web font, so the warning fires on every gate round while the real face renders)
- evidence: every gate round of this run (iter1…pub6, both widths) printed the F-B2 warning for `kulim-park-fallback`; the pixel numbers (0.98 % / 1.74 %) and the chrome-parity font checks show the brand face rendering
- proposed change: `skills/replica/scripts/stitch-shot.mjs` — exclude `@font-face` declarations whose `src` is only `local()` (or whose family ends in `-fallback`) from the load assertion, or downgrade them to an advisory line
- status: pending
