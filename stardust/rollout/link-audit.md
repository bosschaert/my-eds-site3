# E2 — Link audit (2026-10-07T21:35Z)

Origin: https://main--bf989f9e--aemcoder.aem.live · documents: /nav, /footer + 10 pages (all 200).

| Kind | hrefs | non-200 | notes |
|---|---|---|---|
| internal | 10 | 0 | all extensionless, no trailing slash, 200 on the live tree |
| source host | 34 | 1 | out-of-plan targets repointed to www.myastrazeneca.ch (direction.md decision); leberkrebs.html 404 on the source itself |
| external | 25 | 5 | enhertu.ch `/.html` ×2 as captured (source parity), cookiereports 404, cdc.gov 404, swissmedicinfo-pro 404 |

`localize-links.mjs --check`: PASS (0 localizable, 0 to normalize). Chrome documents published (`/nav.plain.html`, `/footer.plain.html` 200 on aem.live). Evidence: link-audit.json.
