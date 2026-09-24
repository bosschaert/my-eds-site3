# Dynamic features — plan (community-development)

## Phase D1 — chrome interactions (self, ships with the archetype)
- Deliverable: header dropdown menus and mobile hamburger in the header block, matching what `motion-observe.mjs` records on the live page (open on click, close on outside click / second click; collapse toggler at < 1200px).
- Authoring contract: no external data; behaviours not observed firing are not implemented (recorded as dead).
- Verification: replica Phase 4 interaction parity (`motion-compare.mjs`), pixel number returns to the gated value.
- Owner decision: none. Effort: small.

## Phase D2 — tags (owner decision, interim tier)
- Deliverable: none until the owner confirms; then the GTM snippet (and consent handling, if any) added once at the foundation.
- Verification: tag fires on the published origin (network probe), no layout change.
- Owner decision: "Tags on the new host" (see dynamic-features.md § Decision batch). Effort: small.

## Decided-out
- `dataLayer` settings object — see register.
