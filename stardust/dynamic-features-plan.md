# Dynamic features — plan (garden-eight.com home page)

## Phase A — static recreation (Phase 3, this run)
- Deliverable: the page's settled text and links authored verbatim; the canvas surface as a static CSS paint (capture-state); case/about media slots empty as captured.
- Authoring contract: no `url()` to the source host; fonts self-hosted; no third-party scripts.
- Verification: source-fidelity gate (content-diff 0 🔴, visual-diff flags justified, pixel/height where measurable, clip-probe 0, overflow ≤ 4 px).
- Effort: within the archetype.

## Phase B — interaction parity (Phase 3, after the static gate)
- Deliverable: motion-observe on the live page; implement ONLY behaviours that fire (line reveals, marquee, mail copy, menu toggle); record `motion` in stardust/replica/progress.json.
- Verification: motion-compare live vs build, pixel number back to the gated value.

## Phase C — owner decisions (post-run)
- WebGL scene port (three.js block script, models on the code bus) — needs-business-decision.
- Case / about videos — needs-asset.
- Chat/FAQ widget — decided-out unless the owner asks; then a same-origin JSON snapshot (off-origin-data.md).
