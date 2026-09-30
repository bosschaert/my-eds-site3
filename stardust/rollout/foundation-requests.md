# Foundation change requests (applied once at C-final)

- home | section style `intro-columns` for the default-content intro band: the source's WordPress 20/60/20 columns (`.wp-block-columns`, gap 2em, margin-bottom 1.75em) give the copy a `calc(60% - 56.4px)` column at >= 782px and two 2em vertical gaps below; wanted in styles.css beside `band`/`section-intro` | measured on the gated prototype (index-proposed.css § Intro: flex-basis 20/60/20 with gap 2em -> middle column 807.6px at 1440, 330px at 360; paragraph wraps differ by 1 line per paragraph in a 1110px container) — override lives in blocks/hero/hero.css | index
  - applied at C-final (2026-09-28): rules moved from blocks/hero/hero.css into styles/styles.css beside `band`/`section-intro`; re-gated pub4.
