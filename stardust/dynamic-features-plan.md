# Dynamic features plan — www.niravmanubhai.com

Source: stardust/dynamics/dynamic-features.generated-plan.md (6 rows) curated into stardust/dynamic-features.md.

## Phase: tags (rows 3–5) — interim tier, owner decision pending
- Deliverable: `scripts/site-config.js` entry for the Google tag id `G-00QDEH6N5W`, disabled; no Cloudflare Insights beacon.
- Authoring contract: no tag script in the page markup; the EDS delayed phase reads the site config.
- Verification: the delivered page loads no `googletagmanager.com` or `cloudflareinsights.com` request until enabled.
- Owner decision: enable GA4 on the new host (yes/no, property id). Effort: minutes.

## Phase: detect (row 1) — static-snapshot, self
- `dataLayer` carries only gtag state; nothing to snapshot beyond row 3. No work.

## Phase: locale wave (row 2) — rebuild-native, self
- Emit `hreflang` alternates `en` and `x-default` pointing at the migrated URL via page metadata. Effort: one metadata row.

## Phase: embeds (row 6) — decided-out
- No hidden frame authored. Statement in the register.

## Verification (dynamics Phase 5)
- Parity check on the published page: 0 forms, 0 modals, 0 players expected and found; hreflang alternates present; no third-party tag requests while disabled.
