<!-- stardust provenance: skill=stardust:replica · phase=preserve-direction · 2026-09-28 · from stardust/dynamic-features.md -->
# Dynamic features — plan (balbriggan.ie home page)

Static first, then wire (triage rule 7): the home page recreation ships as a complete static page; the rows below replace one degradation each with the live behaviour.

## Phase D1 — interactive chrome (self, during recreate + gate)
- **Deliverable:** header block with the four dropdown menus (#2) opening on click, matching the live open/close behaviour observed by `motion-observe` (only behaviours that fire on the live site are implemented).
- **Authoring contract:** `blocks/header/header.js` — nav from the header fragment; dropdown toggles keyed on the `aria-haspopup` items; no third-party script.
- **Verification:** `motion-compare` parity lines for the four toggles at 1440 and 360; pixel gate number returns to the gated value.
- **Owner decision:** none. **Effort:** small.

## Phase D2 — hero video (self, during recreate)
- **Deliverable:** hero block renders the same `<video autoplay loop muted playsinline>` with the Vimeo-hosted MP4 (#3), poster-less as captured, overlay colour and blend as lifted.
- **Verification:** element present on the published page; video plays; gate captures freeze it at frame 0 (documented residual in the hero band).
- **Owner decision:** none now; optional later rehost of the MP4. **Effort:** small.

## Phase D3 — newsletter form (needs-backend; interim ships now)
- **Deliverable:** form block rebuilt from the captured fields (#1). Interim: `action="https://balbriggan.ie/#gf_1"`, `method="post"`, same field names and hidden inputs, so the existing Gravity Forms handler receives submissions. Production: swap the action to the owner's endpoint (or an EDS forms service) — one attribute change in the block's content.
- **Verification:** visual parity in the gate; a manual test submission to the interim action after publish.
- **Owner decision:** production endpoint. **Effort:** small interim, small-medium production.

## Phase D4 — tags (needs-business-decision; interim = none loaded)
- **Deliverable:** when the owner confirms the GTM container id (#4, folding in #5–#7), add the snippet to the boilerplate's delayed-load slot; consent-gated per the owner's policy.
- **Verification:** the `/g/collect` beacon and GTM load appear on the published page; nothing loads before consent if the policy requires it.
- **Owner decision:** container/property/pixel ids and consent policy. **Effort:** small.

## Decided-out
- `wp` settings object — WordPress runtime, no consumer (see the register in `stardust/dynamic-features.md`).
