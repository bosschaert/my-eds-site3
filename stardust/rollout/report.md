# Rollout report — www.continental.com → main--d9ddbc54--aemcoder (2026-10-10)

Flow: replica (same design). Publish decision: publish (aem.live).

| | |
|---|---|
| **Pages** | 101 verified live = 99 in-scope source pages (site plan, 100 selected; `/index` ≡ `/`) + 2 dynamics-built search endpoints (`/en/general/search`, `/de/meta/suche`, noindex) |
| **Templates** | 5 replica templates — home (3), hub (18), content (65), legal (11), stories (2) — plus search-results (2) |
| **Blocks** | 15 distinct module blocks in the plan, 15 delivered; 36 block folders in `blocks/` |
| **Fidelity** | published-origin gate, both widths: 99/99 pass (78 raw, 21 with documented symmetric-evidence overrides) — `stardust/rollout/gate-merged.json` |
| **Quality** | optimize health 100, open P1 0; 125 findings mirror the source (informational); 7 residual P2/P3 accepted with evidence |
| **Links** | 0 broken internal links; 607 out-of-scope menu/footer targets point at www.continental.com (`e2-repointed-targets.txt`) |
| **Site** | sitemap served 99; redirects sheet 98 rows live; `/` 200; 20 chrome docs noindex |
| **Dynamics** | `stardust/dynamics/parity.json`: 25 checks, 22 pass |

## To deliver / owner decisions
- AdmiralCloud video embeds answer 403 for the aem.live host — the vendor allowlist needs the new host (video falls back to its poster until then).
- hreflang `<link>` alternates are not emitted (source has them) — to add in `head`/`scripts` when the locale set is final.
- Download cart: the header cart is inert; per-file download links work. A zip endpoint is the owner's call.
- Site search covers the 99 migrated pages only (source search also returns pages outside this scope).
- Pages outside the 100-page plan stay on www.continental.com; menus and footers link there.
