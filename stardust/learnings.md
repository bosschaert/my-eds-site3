
## 2026-11-05 — rollout E/H (static-website.david-bosschaert.workers.dev)
- verify.mjs fetches `<path>/` for pages migrated as `x/index.html`; when the delivered doc is a leaf (`/page1`) the check 404s. The source itself redirected `/page1/ → /page1`, so carrying that redirect into the sheet fixed both the visitor path and the check — compare the source's trailing-slash behaviour before calling a verify 404 a delivery defect.
- coverage/blocks.json rows stayed `pending` through C-deliver (cluster units recorded pages, not blocks); record `--block <id> --status verified --eds-name <name>` at unit end so lastRun.blocks is honest before H-report.
