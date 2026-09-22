# Journal — stardust-replica-20ec2d57 replica (same-design migration)

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-09-22T09:25:00Z — replica Phase 4: source-fidelity gate passed for archetype `index` at 1440 and 360

**Prompt:** Hands-off continuation (session 2) of the replica run for https://www.example.com/. Last completed phase was `stardust:replica:recreate`; run the next phase (source-fidelity gate) to its end, checkpoint, then ask the runner at the boundary.

**Decisions:**
- Reused the already-running prototype server on localhost:8791 (probe returned 200 for `index-proposed.html`); no second listener started.
- Symmetric content root `body > :first-child` on both sides (live `body > div`, prototype `main.notice`), as recorded in progress.json.
- chrome-parity's default header/footer regions are absent on BOTH sides (live page has no chrome). Treated as region absence, not a delta; re-probed with `--no-defaults --region "page=body > :first-child"` — exit 0, 3/3 texts paired. Measurement-policy call, no design change.
- No fix iteration was needed (0.00 % at both widths), so the iter1 `--full` round is also the confirmation round. crop-compare not run: no differing pixels, no hot band.
- Interaction parity: motion observed on live and prototype with the same `--hover a` poke; 0 animations/transitions/class mutations on either side, hover dead on live → not required. Nothing implemented; prototype unchanged after observation.
- Wide-viewport fluid check at 1920 and 1280: all sampled boxes Δ0, props equal.
- Advanced `index` directed → prototyped → approved (approvedBy hands-off).

**Artifacts touched:**
- stardust/replica/gates/index-1440/ — created (live.png, build.png, diff-iter1.png, content-diff/visual-diff/chrome-parity iter1 evidence, chrome-parity-iter1-region.txt, fluid-check-1920-1280.txt)
- stardust/replica/gates/index-360/ — created (same set, minus fluid check)
- stardust/replica/motion/index.json, index-build.json — created
- stardust/replica/progress.json — updated (iterations, gates, fluidCheck, motion, gate status)
- stardust/state.json — updated (index → approved)
- stardust/status.jsonl — source-fidelity-gate start/end
- stardust/journal.md — created (no prior session wrote one)

**Findings worth flagging:**
- chrome-parity exits 2 with a REGION "no element matches" line on both sides when a page has no header/footer; gate.sh --full therefore reports exit 2 on a no-chrome page even when everything else passes. Reading the evidence file distinguishes absence from a real delta.
- `chrome-parity --no-defaults` with no `--region` prints usage and exits 1; a region is required.

**Open questions:**
- none

**Next:** Phase 5 handoff — read `reference/handoff-contract.md` first; one archetype, no siblings; migrate → deploy (`PUT → preview`) → published-origin gate with `--marker "Example Domain"`.

---
## 2026-09-22T09:35:00Z — replica Phase 5: handoff complete — `index` delivered to main--stardust-replica-20ec2d57--of1-labs (preview + live), rollout A–I closed

**Prompt:** Same hands-off continuation; the runner answered `continue` at the Phase 4 boundary, so Phase 5 (migrate → deploy → rollout) ran in this session.

**Decisions:**
- Token source: `ADOBE_IMS_TOKEN_FILE` (env) passed inline as `DA_TOKEN="$(cat …)"`; never read or printed. No `.env` in the repo.
- EDS decode: the page is default content only (h1, two p, one link) → no block; `styles.css` rewritten to the replica canon (60vw column, 15vh margins, #eee, #348, system-ui, h1 1.5em, one 0.8-opacity wrapper; UA default margins). Auto-buttoned `<p><a>` left unstyled so it renders as the source's plain link.
- Chrome: source has none → `scripts.js` no longer calls `loadHeader`/`loadFooter` (their blocks throw on a missing fragment), `header, footer { display: none }`; no `/nav` or `/footer` delivered. `content/` added to `.hlxignore`.
- Publish decision: preview AND live (hands-off, one page, no staging owner). Root `/` → 200 on both hosts, no redirects sheet needed.
- Published-origin gate `--main "body > div, main .default-content-wrapper"` (the empty `<header>` makes `body > :first-child` asymmetric on EDS); chrome-parity re-probed with the content root as sole region (header/footer absent on live).
- optimize P2 "no JSON-LD" accepted: the source carries none, register empty.
- Bookkeeping slip: the D2-dynamic `end` line was written before `dynamics-check.mjs` had run (it needs `parity.json`); the empty parity report was authored afterwards and the check replayed to `stardust/qa/`. Ledger is append-only, so the line stands; the artifact now exists.

**Artifacts touched:**
- content/index.html — created (DA source doc); styles/styles.css, scripts/scripts.js, .hlxignore — updated
- stardust/migrated/{index.html,_meta.json,assets/} — created (migrate render, 6 gates on sidecar)
- stardust/eds-schema/index.json, stardust/eds-conversion-log.md — created
- stardust/deploy/{deploy-ledger.json,deploy.log} — created
- stardust/replica/gates/index-{1440,360}/*pub1* — created (published-origin gate evidence)
- stardust/rollout/{coverage,plan.json,rollout.json,site,optimize,report.md,dashboard} — created
- stardust/dynamics/{generated-plan.*,parity.json}, stardust/qa/dynamics-report.* — created
- stardust/learnings.md — created; stardust/state.json — index → migrated; stardust/status.jsonl — handoff + rollout A–I

**Findings worth flagging:** see stardust/learnings.md (chrome-parity region absence, gzip CSS, deploy log dir, pruned @babel/core, gate-evidence lint target, dynamics-check input).

**Open questions:**
- none

**Next:** The replica run is complete: all phases have `end` lines. A next session should only re-verify `/` on the preview host and stop.

---
