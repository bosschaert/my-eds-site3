# Dynamic features — current-design.jp (home only)

Source: stardust/current/_dynamics.json (detector, 21 findings) → stardust/dynamics/dynamic-features.generated-plan.md (draft). Curated 2026-10-13, hands-off.

## Listings contract
None. The home page's News and Works bands are CMS-fed on STUDIO but are migrated as authored content (document-first, captured text verbatim). No same-site data endpoints, no search, no forms.

## Features

| # | id | class | feature | disposition | reproducibility | status | notes |
|---|---|---|---|---|---|---|---|
| 1 | m-modal-trigger-data-modal / modal-menu__sd-* (rows 5–16) | M | site menu overlay (hamburger at mobile) opened from header triggers | rebuild-native | self | planned | header contract: nav block toggles the menu; behaviour observed in motion-observe |
| 2 | a-cms-app-settings-object-datalayer | A | dataLayer settings object | static-snapshot | self | not-needed | only feeds GTM; no content depends on it |
| 3 | typesquare.com / l.typesquare.com / wf.typesquare.com (rows 1, 2, 19) | A/T | TypeSquare licensed web-font service (秀英角ゴシック金) | embed-passthrough → substitute | needs-business-decision | interim shipped | licence is bound to the source domain; metric-matched open substitute ships with the brand family first in the stack (drop-in when the licence is extended) |
| 4 | analytics.studiodesignapp.com (row 3) | A | STUDIO platform analytics | static-snapshot | self | not-applicable | platform-internal, does not move with the site |
| 5 | storage.googleapis.com (row 17) | T | STUDIO asset host (images) | static-snapshot | self | planned | images rehosted into the delivered content |
| 6 | GTM / Google Analytics / ad pixel (rows 18, 20, 21) | T | tags | embed-passthrough | needs-business-decision | interim: off | owner decision: which tags run on the new host + property ids; scaffolded off |

## Decision batch (owner)
- D1 — Tags on the new host (GTM / GA / ad pixel): which, and their property ids. Interim: none loaded.
- D2 — TypeSquare font licence for the new domain. Interim: open substitute, brand family name first in the stack.

## Register
Every detector row has a disposition above (rows 5–16 grouped under #1; 1, 2, 19 under #3; 18, 20, 21 under #6).
