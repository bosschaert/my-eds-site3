extract --prep complete
=======================

Inventory:    2 pages crawled (0 prior, 2 new) — discovery via same-origin nav links from /page1
Provenance:   2/2 live (every page has Playwright evidence)
Page types:   landing 1 (index) · static 1 (page1)   (LLM-inferred)

Per-page evidence:
  slug    live  waitMode  waitMs  status  media(img/bg)
  page1   yes   medium    2500    200     6/0
  index   yes   medium    2500    200     9/0
Wait summary: 2 resolved at medium (avg 2.5s), 0 fallback
Media summary: cssBackgrounds are gradients only (page body, content block); no raster backgrounds on the site — not low-media.
Vision check: 2 ok (thumbnails read; captures match the live composition).

Module candidates: 5
  site-header     2 instances (index, page1)
  site-footer     2 instances (index, page1)
  team-tabs       2 instances (index, page1)
  media-table     2 instances (index ×2)
  content-block   1 instance  (index)

Typed slots: filled per page (current/pages/<slug>.json § slots)
Fonts: declared Poppins / Playfair Display are NOT loaded by / or /page1 — rendered in fallback faces; replicate the stack, load nothing.
Assets: no logo, no favicon on the source.
Flow: replica — the design is kept.
