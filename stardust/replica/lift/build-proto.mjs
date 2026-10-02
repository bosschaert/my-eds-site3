// Builds stardust/prototypes/index-proposed.html from the captured content.
// Content: verbatim from stardust/current/pages/index.html (via tiles.json) — never reworded.
import fs from 'node:fs';
const tiles = JSON.parse(fs.readFileSync('stardust/replica/lift/tiles.json', 'utf8'));
const page = JSON.parse(fs.readFileSync('stardust/current/pages/index.json', 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const nav = [
  ['http://store.thebeastisback.com/', 'Shop', 'external-link'],
  ['/about', 'About', 'page-collection'],
  ['/blog', 'Blog', 'blog-collection'],
  ['/', 'Work', 'index-collection active-link'],
  ['/contact', 'Contact', 'page-collection'],
];
const navList = (cls) => `<nav class="main-nav${cls ? ' ' + cls : ''}">
<ul>
${nav.map(([h, l, c]) => `<li class="${c}"><a href="${h}">${l}</a></li>`).join('\n')}
</ul>
</nav>`;
const tileHtml = tiles.map((t) => `<a class="project" href="${esc(t.href)}" data-w="${t.w}" data-h="${t.h}">
<div>
<div class="project-image"><div class="intrinsic"><div class="content-fill"><img src="assets/media/${esc(t.f300)}" srcset="assets/media/${esc(t.f300)} 300w, assets/media/${esc(t.f500)} 500w" sizes="(max-width: 750px) calc(100vw - 40px), 291px" alt="${esc(t.alt)}" width="${t.w}" height="${t.h}" loading="eager"></div></div>
<div class="project-item-count">${esc(t.count)}</div></div>
<div class="project-title">${esc(t.title)}</div>
</div>
</a>`).join('\n');
const symbols = fs.readFileSync('stardust/replica/lift/social-symbols.svg', 'utf8').trim(); // live <symbol> defs (instagram icon + mask), hidden
const icon = '<svg class="svg--social" viewBox="0 0 64 64"><use class="svg-use--icon" href="#instagram-icon"></use><use class="svg-use--mask" href="#instagram-mask"></use></svg>';
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="icon" type="image/x-icon" href="assets/favicon.ico">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/index.css">
</head>
<body class="social-icons-style-regular index-thumb-title-position-overlay thumbnail-layout-autocolumns layout-style-center page-borders-dotted logo-image">
${symbols}
<div id="canvas">
<div id="mobileNav">
<div class="wrapper" id="mobileNavWrapper">
${navList('mobileNav')}
</div>
</div>
<div id="mobileMenuLink"><a href="#mobileNav" role="button" aria-controls="mobileNav" aria-expanded="false">Menu</a></div>
<header id="header">
<div id="logo">
<h1 class="logo"><a href="/"><img src="img/logov2.png" alt="The Beast Is Back Inc" width="400" height="400"></a></h1>
</div>
<div id="topNav">
${navList('')}
</div>
</header>
<div class="page-divider"></div>
<div class="extra-wrapper page-header"></div>
<main id="page">
<div id="projectPages"></div>
<div id="projectThumbs">
<div class="wrapper autocolumns">
${tileHtml}
</div>
</div>
</main>
<footer id="footer">
<div id="footerBlock">
<div class="footer-block footer-spacer"></div>
<div class="footer-block footer-newsletter">
<div class="newsletter-form-wrapper">
<form class="newsletter-form" action="#" method="post">
<header class="newsletter-form-header">
<h2 class="newsletter-form-header-title">Subscribe</h2>
<div class="newsletter-form-header-description"><p>Sign up to receive periodic info about new print releases and projects.</p></div>
</header>
<div class="newsletter-form-body">
<div class="newsletter-form-fields-wrapper">
<div class="newsletter-form-field-wrapper"><label class="newsletter-form-field-label" for="newsletter-email">Email Address</label><input class="newsletter-form-field-element" id="newsletter-email" name="email" type="email" placeholder="Email Address" autocomplete="email"></div>
</div>
<div class="newsletter-form-button-wrapper"><button class="newsletter-form-button" type="submit"><span class="newsletter-form-spinner"></span><span class="newsletter-form-button-label">Sign Up</span><span class="newsletter-form-button-icon"></span></button></div>
</div>
<div class="newsletter-form-footnote"><p>Your privacy will be respected.</p></div>
</form>
</div>
</div>
<div class="footer-block footer-html">
<div class="sqs-html-content"><p>©&nbsp;2020 The Beast Is Back Inc. All rights reserved.</p></div>
</div>
</div>
<div class="social-links" id="socialLinks"><a class="social-icon instagram" href="http://instagram.com/thebeastisback"><div>${icon}</div></a></div>
</footer>
</div>
<script src="js/index.js"></script>
</body>
</html>
`;
fs.writeFileSync('stardust/prototypes/index-proposed.html', html);
console.log('wrote index-proposed.html', html.length, 'chars,', tiles.length, 'tiles');
