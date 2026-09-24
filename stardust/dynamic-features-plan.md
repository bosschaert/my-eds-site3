<!-- stardust:provenance
  writtenBy: stardust:replica
  writtenAt: 2026-09-23T13:28:24Z
  readArtifacts: [stardust/dynamic-features.md]
  synthesizedInputs: []
  stardustVersion: 0.25.0
-->
# Dynamic features plan — static-website.david-bosschaert.workers.dev

## Phase media (self) — rows 1, 3
- Deliverable: YouTube iframe re-authored from the live id (embed-passthrough, an `embed` block on EDS); images referenced by their captured URLs.
- Authoring contract: same src, title, allow attributes; 16/9 aspect, 8px radius (lifted CSS).
- Verification: pixel gate band over the media table; iframe present in content-diff inventory.
- Owner decision: none. Effort: trivial.

## Phase client (self) — row 2
- Deliverable: tabs block — 3 buttons, 3 panels, first active; click swaps `.active` on button and panel; fade-in 0.4s.
- Authoring contract: same button labels and order; panels carry the team cards verbatim; hidden panels stay in the DOM (granularity parity).
- Verification: motion-observe live vs prototype (`--click` on each tab), motion-compare parity; content-diff 0 structural red.
- Owner decision: none. Effort: small.

## Static path
Both pages render fully without JavaScript (first panel visible). Nothing blocks the static recreation.
