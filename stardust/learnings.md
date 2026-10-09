# Learnings — Jamaica Travel Guide (Adobe Express webpage) replica, 2026-10-06

### Virtual-scroll app pages cannot be stitched — capture the page's own static mode
- failure class: capture-gap (app-mode renderer: every `.section` absolute + translated, `document.scrollHeight` = viewport, `window.scrollTo` a no-op)
- evidence: https://new.express.adobe.com/webpage/DYft29Wzo0QLK — app mode measured 900 px; the page's own `?page-mode=static` ("View Screen Reader-Friendly Version") renders the same publication as a 9327 px document with the same theme CSS and fonts; recorded in `stardust/current/pages/<slug>.json#_provenance.captureMode` and `_crawl-log.json#visionCheck`
- proposed change: `skills/extract/SKILL.md` § capture and `skills/replica/reference/source-fidelity-gate.md` § Hardening rule 13 — when `scrollHeight` equals the viewport after settle, probe the page's accessibility/static alternates (`?page-mode=static`, "screen reader version" links) before falling back to headed capture, and pin the gate's live URL to the alternate
- status: pending

### Express loading splash captured as the hero at the default wait
- failure class: capture-gap (hydration placeholder)
- evidence: the medium (2.5 s) wait captured the blurred hero + progress bar; the slow (5 s) wait captured the hero; extract's vision check flagged it and recaptured (`_crawl-log.json#visionCheck`)
- proposed change: `skills/extract/SKILL.md` § wait policy — treat a progress-bar/blur splash as a hydration state that escalates to the slow wait automatically for app-shell hosts (Express, Canva-class publishers)
- status: pending

### Mixed-case source paths need a redirect row and lowercase coverage paths
- failure class: path-safety
- evidence: the source path `/webpage/DYft29Wzo0QLK` is delivered at `/webpage/dyft29wzo0qlk` (DA folds case); the coverage row carried the mixed-case path until D-site corrected it, and `assemble.mjs --verify-origin` only passed after the fix; a third redirect row (mixed-case → lowercase) keeps the source URL working
- proposed change: `skills/rollout/scripts/inventory.mjs` — write the coverage path lowercase from the start; `skills/rollout/SKILL.md` § Phase D — when a source path differs from the delivered path only in case, add the redirect row automatically
- status: pending

### The pipeline wraps blockquote text in `<p>` — quote ramps must target `blockquote p`
- failure class: silent-render (CSS written for the prototype's bare `<blockquote>` text node)
- evidence: the published quote rendered at the body ramp while the prototype matched; `measure.mjs` showed live h 81 vs preview h differing until the foundation request `blockquote p` inherited the ramp (C-final, `stardust/rollout/foundation-requests.md`)
- proposed change: `skills/deploy/SKILL.md` § foundation CSS — list the pipeline's default-content wrappers (`blockquote > p`, `picture` inside `p`, `strong`/`em` CTA wrappers) as selectors the ramp must cover
- status: pending

### External link targets that refuse datacenter egress are an environment limit, not a 404
- failure class: api-dependency (bot-protected third-party target)
- evidence: `adobe.com/go/privacy` and `adobe.com/legal/terms.html` (the source page's verbatim footer links) answer 403 "Access Denied" from this environment in curl and in the installed Chromium; the links are unchanged from the source
- proposed change: `skills/rollout/SKILL.md` § Phase E2 — a 403/challenge from an EXTERNAL host on a verbatim source href is recorded as an environment-limit row (parity-report rule 4) with the owner asked to verify from a regular network; never repointed, never retried with evasion
- status: pending

### Dashboard counts source-parity (out-of-scope) findings as open
- failure class: silent-render (reporting) — `dashboard.mjs` `openByPage` counts every `open` page-scoped finding, including `fixability: out-of-scope` source-parity rows that `optimize.mjs` documents as excluded from the open counts, never gated
- evidence: this run — health 100/100, open P1/P2/P3 0, yet `dashboard/data.json` shows the one verified page at stage `deployed` with `openFindings: 2` (no JSON-LD, 9-char title — both mirrored from the source) and the legend reads optimised 0/1
- proposed change: `skills/rollout/scripts/dashboard.mjs` — skip `fixability === 'out-of-scope'` in `openByPage` (same filter as the optimize report's open counts) so `optimised` = verified & no open IN-SCOPE finding; `skills/rollout/SKILL.md` § Phase I — name the rule
- status: pending
