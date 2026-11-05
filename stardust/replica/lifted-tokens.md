# Lifted tokens — page1 (source: https://static-website.david-bosschaert.workers.dev/styles.css)

All values verbatim from the source stylesheet (saved at stardust/current/assets/css/styles.css).

| Token | Value | Source rule |
|---|---|---|
| body font | 'Poppins', 'Segoe UI', system-ui, sans-serif (never loaded → fallback) | body |
| heading font | 'Playfair Display', Georgia, serif (never loaded → fallback) | h1, h2 |
| body text | #333, line-height 1.6 | body |
| page background | linear-gradient(135deg, #e0f7fa 0%, #f3e5f5 50%, #fff8e1 100%), min-height 100vh | body |
| page padding | 2rem (1rem ≤768px) | body |
| primary (purple) | #6a1b9a; hover #4a148c on #f3e5f5 | .site-header a, h1 |
| lede colour | #5e35b1, 1.15rem/500, max 800px centred | p |
| h1 | 3rem/700 (1.8rem ≤768px), -0.5px tracking, centred, text-shadow 2px 2px 4px rgba(106,27,154,.15), margin-bottom .5rem | h1 |
| container | max-width 1200px, centred | .site-header, galleries, footer |
| header card | #fff, radius 12px, padding 1rem 1.5rem, gap 1.5rem, shadow 0 4px 20px rgba(106,27,154,.12), margin 0 auto 2rem | .site-header |
| nav link | 600 1.05rem, padding .4rem 1rem, radius 8px | .site-header a |
| galleries | 2-col grid, gap 1.5rem, margin 0 auto 2rem; 1 col ≤768px | .fields-gallery, .video-gallery |
| tabs section | margin 2em 0, padding 1em, radius 12px, bg #f8f8f8 | .tabs-section |
| tab bar | border-bottom 2px #ddd, margin-bottom 1em | .tab-buttons |
| tab button | padding 1em 2em, 1.1em bold, #666; active #2196F3 + 3px bottom border, bg #fff | .tab-buttons button |
| tab panel | flex, space-between, gap 2em; column + gap 1.2em ≤900px; fadeIn .4s | .tab-content.active |
| team card | #fff, radius 10px, shadow 0 2px 8px rgba(0,0,0,.07), width 48% (100% ≤900px), padding 1em | .team-card |
| avatar | 120×120, circle, cover, margin-bottom 1em | .team-card img |
| footer | 0.95rem #777, centred, padding 1.5rem, border-top 2px #e0e0e0, margin 2rem auto 0 | .site-footer |
| breakpoints | max-width 768px, max-width 900px | @media |
