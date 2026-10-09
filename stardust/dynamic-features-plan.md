<!-- stardust provenance: skill=stardust:replica · phase=preserve-direction · plan for stardust/dynamic-features.md -->
# Dynamic features — plan (myastrazeneca.ch FR replica)

The static recreation never waits on this plan (triage rule 7). Phases run inside replica Phase 3 (recreate) and Phase 5 (deliver); each deliverable is verified by the instrument named.

| phase | rows | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|---|
| media (Phase 3 → 5) | 8 | `blocks/video/` — poster image + play icon as captured; click loads the Kaltura iframe (`kaltura.com/p/432521/sp/43252100/embedIframeJs/uiconf_id/30358591/partner_id/432521`, entry `1_7kar7zpp`) | one row: poster picture, one row: Kaltura URL (node-slotted, EW contract) | pixel gate on the poster state; `dynamics-check.mjs` presence of the player element | none | S |
| client tools (Phase 3 → 5) | 10 | HCP self-certification modal on the PATTRNS template: `blocks/self-certification/` or a fragment, shown when the cookie is absent, Yes dismisses and sets the cookie, No leaves to the source's target | content = the captured modal copy verbatim (`current/pages/…about-amylodosis-attr.json`) | `motion-observe.mjs` live vs build (same `--click` pokes); pixel gate runs with the modal dismissed, as captured | none | S |
| client tools — header search (Phase 5) | 3 | search box rebuilt inside `blocks/header/` as captured; submit disabled; no results page in scope | UI only; no fabricated results; `helix-query.yaml` not authored | `chrome-parity.mjs`; `dynamics-check.mjs` form presence | scope of search-result.html | S |
| tags (Phase 5, C-final) | 1, 6, 7 | `scripts/site-config.js` listing Tealium iQ, Cookie Reports, Adobe Target, Mouseflow, LinkedIn Insight — every entry `enabled: false`, `utag_data` keys kept as the data layer shape | no third-party script loads until the owner enables it | `dynamics-check.mjs` — no network to tiqcdn / cookiereports on the build | which tags run on the new host | S |
| off-origin data (Phase 5, register) | 2 | favorite counter on herzinsuffizienz ships as captured (static); the dead `socialFeaturesPost.json` is recorded host-bound | static text in the block, no POST | pixel gate | tier for the counter | XS |
| register (done) | 4, 9 | decided-out rows in `stardust/dynamic-features.md` § Register | links verbatim | content-diff (hrefs verbatim) | locale tree scope; auth | — |
| detect (done) | 5 | nothing — `aem.js` already emits RUM | — | — | none | — |

Interim tiers above are the hands-off resolutions; the decision batch in `stardust/dynamic-features.md` is the owner message.
