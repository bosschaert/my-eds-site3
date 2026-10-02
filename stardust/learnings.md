# Learnings — niravmanubhai.com replica (attempt 1, 2026-09-28)

One entry per failure class this run surfaced. Shape per `skills/stardust/reference/learnings.md`.

### Runtime-emitted JSON-LD re-detected as missing by the static optimize detector
- failure class: detector-gap (a finding whose fix lives in the runtime is invisible to a fetch-only check)
- evidence: G-aem carried the source's schema.org graph through `decorateJsonLd()` (scripts/site-config.js); the preview origin renders 1 `ld+json` script with 3 nodes (Playwright, 1440, 2026-09-28T11:43Z), yet `optimize.mjs --base` re-run at H-report still reported `P2 ai-search/jsonld [index] — no JSON-LD structured data` (finding f-54be5a397f), because `hasJsonLd(html)` runs over the fetched HTML. Resolved by hand with rendered evidence; every later re-run will re-open it.
- proposed change: `skills/rollout/scripts/optimize.mjs` § jsonld detector — when `--base` is set, take the page's rendered DOM (the same Playwright session `dynamics-check` already opens) or accept an `ld+json` marker in the project's scripts as evidence; `skills/rollout/SKILL.md § Phase G` — say that the `eds-jsonld` manual route is closed by `findings.mjs resolve … --status fixed` with the rendered node count, not by a re-run.
- status: pending

### C-deliver opened without a publishing token
- failure class: api-dependency (the delivery credential was probed only when the first PUT was due)
- evidence: ledger `stardust:rollout C-deliver blocked 2026-09-28T10:34Z` — no `.env`, no `DA_TOKEN`, no `~/.aem/da-token.json`; the foundation and home units were authored and locally asserted for 47 minutes before the gap surfaced; the resumed session found the token as `ADOBE_IMS_TOKEN_FILE`.
- proposed change: `skills/rollout/SKILL.md § Phase C — Deliver the site` (and `skills/replica/reference/handoff-contract.md § 3 row C`) — probe the token (env, token file, `.env`) as the first C-deliver step and list `ADOBE_IMS_TOKEN_FILE` among the places the pipeline looks; when absent, record the units `authored` and write the `blocked` line before authoring, so the runner can supply it while the units are built.
- status: pending

### Self-hosted copies of Google Fonts faces wrapped differently from the live page
- failure class: capture-gap (font-fork: same family, different build)
- evidence: published round pub1 at 1440 measured 3.64 %; measure/anchor found the bouquet lede and conversation heading wrapping one word differently; the width probe put one heading string at 802 px (self-hosted @fontsource Inter/Playfair Display) vs 811 px (live). Google Fonts serves browser-specific builds; only the live page's own Google Fonts URL (head link + `fonts.css` import, eager at every width) matched at both breakpoints (pub4 0.00 % / 0.63 %).
- proposed change: `skills/replica/reference/recreation-procedure.md § Fonts` — when the live page loads a face from Google Fonts, reference the same Google Fonts URL rather than self-hosting a repackaged copy; self-host only faces the live page self-hosts. Add the width probe on the longest heading as the acceptance check.
- status: pending

### Lazy images inside the pipeline's `<picture>` measured 0 px tall in the stitched capture
- failure class: silent-render (the loaded page measured right, the capture did not)
- evidence: pub1 at 360 — stitched build 7400 px vs live 7792 px while both loaded pages measured 7792 px; the pipeline's `<picture>` wrapper sizes to its content, so below-the-fold lazy images had a 0-px box at capture time. Fixed by `.visual picture { display:block; width:100% }` in bouquet-feature and conversation-doors.
- proposed change: `skills/deploy/SKILL.md § 3 foundation` (styles.css baseline) — ship `picture { display:block }` + `picture img { width:100%; height:auto }` in the foundation; `skills/replica/reference/source-fidelity-gate.md § The published-origin gate` — name this class in the height-delta reading guide (build shorter than live by whole image heights → picture box, not layout).
- status: pending

### Served sitemap / query index unavailable; the documented first remedy is a retired file
- failure class: index-empty
- evidence: D-site `assemble.mjs --verify-origin` exit 1 — `/sitemap.xml` and `/query-index.json` 404 on the preview origin; the config service answers 401 to the migration token. The contract card (`handoff-contract.md § 3 row D2`) names `helix-query.yaml` in the code branch as the FIRST answer, while the project's `AGENTS.md § Outdated` lists `helix-query.yaml` as retired (config lives at tools.aem.live). Recorded as P2 `served-sitemap` (out-of-scope) for the owner.
- proposed change: `skills/replica/reference/handoff-contract.md § 3 row D2` and `skills/rollout/SKILL.md § Phase D` — replace the `helix-query.yaml` remedy with the config-service path and state that a 401 there is an owner action (an admin-scoped token or a tools.aem.live edit), recorded once, not retried.
- status: pending

### stitch-shot warns FONT LOAD FAILED for synthetic fallback faces
- failure class: false-warning
- evidence: every published round (pub1–pub5, both widths) printed `FONT LOAD FAILED for declared face(s) inter-fallback, playfair-display-fallback, rasa-fallback`; those faces are `size-adjust` fallbacks declared with `src: local()` and never "load"; the rendered type was the real face (pixel 0.00 % at 1440).
- proposed change: `skills/replica/scripts/stitch-shot.mjs` § font-load check — skip `@font-face` rules whose `src` is only `local()` or whose family ends in `-fallback`, and print them as `fallback faces (local): n` instead of a failure.
- status: pending

### Dynamics replay failed on code the checkpoint had not pushed yet
- failure class: sequencing (the code push is the runner's checkpoint, not the skill's step)
- evidence: D2-dynamic `dynamics-check` on the origin: 4 PASS, 1 FAIL — `hreflang dom-count 0`; the alternates were verified with the local scripts intercepted onto the preview page, and passed 5/5 at E-full-site once the push had landed.
- proposed change: `skills/rollout/SKILL.md § Phase D2` — when the code branch is pushed by an external checkpoint, run the interception check (local scripts routed onto the preview page) as the D2 verdict and record the origin replay as `pending push`, then re-run it as the first E step; name the interception command.
- status: pending

### Social hosts refuse bot GETs in the link audit
- failure class: false-finding
- evidence: E2-link-audit — 23 targets, 21 × 200; `facebook.com` 400 and `linkedin.com` 999 on URLs identical to the source page's; both open in a browser.
- proposed change: `skills/rollout/SKILL.md § Phase E2 — Link-audit completeness` — keep a short list of hosts that refuse non-browser clients (linkedin 999, facebook 400/302-to-login) and record them as `unverifiable (bot refusal), source-identical` rather than as failures.
- status: pending
