- archetype-landing | footer strong links (Suppliers, Jobs, Privacy) render 700 #a0a0a0, live 400 #fff | chrome-parity 1440/360 PAIR deltas; footer crop 99.76%/98.57% | en
- archetype-landing | copyright year is static authored text; live writes #copyYear by script (home widget patches it) | chrome-parity MISSING "2026" span | en
- archetype-landing | header region box 0px/static vs live 93px fixed (overlay chrome #108, nav-height 0) | chrome-parity REGION BOX/STYLE 1440+360 | en
- archetype-landing | localize-links --check fails on 2 links in /footer and /footer-home (normalizable) | localize-links.mjs --check over content/ | en
- archetype-static | header depth links unpaired | chrome-parity MISSING 4| en-management-esg-result

## Applied at C-final (2026-11-02)
- footer strong links: `.ft-info li strong` now 400 #fff (EDS wraps `<strong>` around the link) — applied, verified on preview.
- copyright year: footer block splits the year into `span#copyYear` = current year — applied.
- logo href `/en/` → `/en` in /footer, /footer-home (localize-links) — applied, republished.
- header region box 0px vs 93px fixed: kept — documented overlay-chrome decision (#108); header crop 100%/100%. No change.
- header depth links unpaired (4): hidden depth-3 menu links; header crop 100%. No change.
