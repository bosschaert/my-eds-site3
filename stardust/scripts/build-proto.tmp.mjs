import fs from 'fs';
import { header } from './header-tpl.tmp.mjs';
const M = '../current/assets/media/';
const I = n => fs.readFileSync(`stardust/current/assets/icons/${n}.svg`, 'utf8').replace('<svg ', '<svg aria-hidden="true" ');
const P = JSON.parse(fs.readFileSync('stardust/replica/lift/products.json', 'utf8'));
const chev = '<svg class="hf-nav__chevron" viewBox="0 0 8 5" fill="none" aria-hidden="true"><path d="M1 1L4 4L7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const navItems = ['Drinkware', 'Collections', 'Coolers &amp; Lunch', 'Customize'].map(t => `<li><button type="button" class="hf-nav__link" aria-expanded="false">${t} ${chev}</button></li>`).join('\n') +
  `\n<li><a class="hf-nav__link" href="https://www.hydroflask.com/find-your-hydroflask">Hydro Finder</a></li>\n<li><button type="button" class="hf-nav__link" aria-expanded="false">Explore ${chev}</button></li>`;
const carousel = (c, mod) => `
<section class="hf-products${mod ? ' hf-products--' + mod : ''}">
  <div class="hf-products__inner">
    <div class="hf-products__header">
      <h2 class="hf-products__title">${c.title}</h2>
      <a class="hf-products__cta" href="${c.cta.href}" title="${c.cta.title}"><span>${c.cta.text}</span></a>
    </div>
    <div class="hf-products__indicator" hidden><button type="button" class="hf-products__indicator-arrow" aria-label="Prev"><span class="hf-products__indicator-icon"></span></button><button type="button" class="hf-products__indicator-arrow" aria-label="Next"><span class="hf-products__indicator-icon"></span></button></div>
    <div class="hf-products__track-wrap">
      <div class="hf-products__arrows"><button type="button" class="hf-products__arrow" aria-label="Scroll left" disabled>${I('scroll-left')}</button><button type="button" class="hf-products__arrow" aria-label="Scroll right">${I('scroll-right')}</button></div>
      <div class="hf-products__track">
${c.items.map(x => `        <div class="hf-products__item">
          <a href="${x.href}" title="${x.name}"><img src="${M}${x.img}" alt="${x.alt}" width="600" height="600"></a>
          <div class="hf-products__meta">
            <a class="hf-products__name" href="${x.href}" title="${x.name}">${x.name}</a>
            <div class="hf-products__price"><span class="sr-only">Final </span><span class="price">${x.price}</span></div>
          </div>
        </div>`).join('\n')}
      </div>
      <div class="hf-products__bars">
${c.items.map((x, i) => `        <button type="button" class="hf-products__bar${i < (mod ? 2 : 4) ? ' is-current' : ''}"><span class="sr-only">Go to slide ${i + 1}</span></button>`).join('\n')}
      </div>
    </div>
  </div>
</section>`.replace(/&/g, '&amp;').replace(/&amp;(amp|lt|gt|quot);/g, '&$1;');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hydro Flask: Sustainable &amp; Refillable Water Bottles | Hydro Flask</title>
<meta name="description" content="Hydro Flask creates insulated, stainless steel water bottles to keep you hydrated on any adventure. Let's go!">
<link rel="icon" href="../current/assets/favicon.png">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/index.css">
</head>
<body>
${header()}
<div class="hf-promo" role="region" aria-label="Promotions">
  <div class="hf-promo__track">
    <div class="hf-promo__slide"><span class="hf-promo__msg"><span>Just Dropped: Gigi Perez x Hydro Flask.</span><a href="https://www.hydroflask.com/gigi-perez-bottles"><span>Shop Exclusive Designs</span></a></span></div>
    <div class="hf-promo__slide is-active"><span class="hf-promo__msg"><span>Free shipping on orders $49+</span><a href="https://www.hydroflask.com/shop/new-arrivals?visual-filter=Best+Sellers"><span>Shop Now</span></a></span></div>
    <div class="hf-promo__slide"><span class="hf-promo__msg"><span>LIMITED EDITION: Seasonal sips inspired by the night sky.</span><a href="https://www.hydroflask.com/shop/collections/midnight-glimmer-water-bottles"><span>Shop Midnight Glimmer</span></a></span></div>
  </div>
</div>
<main id="maincontent" class="hf-main">
<div class="hf-banner">
  <div class="hf-banner__controls"><button type="button" class="hf-banner__pause" aria-label="Pause automatic slide rotation" aria-controls="banner-carousel"><span class="pause-icon" aria-hidden="true">⏸</span><span class="play-icon" aria-hidden="true">▶</span></button></div>
  <div class="hf-banner__slides" id="banner-carousel" role="region" aria-label="Banner carousel">
    <div class="hf-banner__slide is-active">
      <section class="hf-carle" aria-label="World of Eric Carle x Hydro Flask Hero Banner">
        <div class="hf-carle__featured"><picture>
          <source media="(min-width: 1561px)" srcset="${M}hohfus-5586-featured-1920-2x.png">
          <source media="(min-width: 768px) and (max-width: 1560px)" srcset="${M}hohfus-5586-featured-desktop-2x.jpg">
          <img src="${M}hohfus-5586-featured-mobile-2x.png" alt="Boy and a girl sitting with cardboard cut outs of Eric Carle™ Bears with Kids Hydro Flask bottles and tumblers." fetchpriority="high"></picture></div>
        <div class="hf-carle__product"><picture>
          <source media="(min-width: 1561px)" srcset="${M}hohfus-5586-product-1920-2x.png">
          <img src="${M}hohfus-5586-product-mobile-2x.png" alt="Hydro Flask Eric Carle™ Kids Products sitting on a stack of books"></picture></div>
        <div class="hf-carle__content">
          <h2 class="hf-carle__headline"><span class="hf-carle__title">World of Eric Carle<span class="hf-carle__tm">™</span></span> <span class="hf-carle__subtitle">x Hydro Flask</span></h2>
          <p class="hf-carle__text">Brown Bear and friends, now on your favorite Hydro Flasks.</p>
          <a href="/shop/collections/eric-carle-water-bottles" class="hf-carle__cta" aria-label="Shop Eric Carle Collection">Shop Eric Carle™</a>
        </div>
      </section>
    </div>
    <div class="hf-banner__slide">
      <section class="hf-gift" aria-label="Holiday Gift Guide Hero Banner">
        <div class="hf-gift__container">
          <div class="hf-gift__content">
            <h2 class="hf-gift__heading">Gift &amp;<br>Gather</h2>
            <p class="hf-gift__sub">Hosting essentials <br>that last all season.</p>
            <a href="/water-bottle-gift-ideas" class="hf-gift__cta" aria-label="Shop all Hydro Flask Bottles, Coolers and Accessories for the perfect Holiday Gift">Shop the Gift Guide</a>
          </div>
          <picture class="hf-gift__image">
            <source media="(min-width: 1561px)" data-srcset="${M}hohfus-5585-1920.png">
            <source media="(min-width: 768px)" data-srcset="${M}hohfus-5585-desktop.png">
            <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${M}hohfus-5585-mobile.png" alt="Woman and man sitting in a cabin laughing on a plaid couch. Man holding a Hydro Flask Travel Tumbler." loading="lazy"></picture>
          <picture class="hf-gift__stars">
            <source media="(min-width: 1561px)" data-srcset="${M}hohfus-5585-star-1920.png">
            <source media="(min-width: 768px)" data-srcset="${M}hohfus-5585-star-desktop.png">
            <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${M}hohfus-5585-star-mobile.png" alt=""></picture>
        </div>
      </section>
    </div>
    <span class="sr-only hf-banner__announce" aria-live="polite">Showing slide 1 of 2</span>
    <div class="hf-banner__dots" role="group" aria-label="Slide navigation"><button type="button" class="hf-banner__dot" aria-current="true" aria-label="Go to slide 1 of 2"></button><button type="button" class="hf-banner__dot" aria-label="Go to slide 2 of 2"></button></div>
  </div>
</div>

<section class="hf-tiles" aria-label="Back to School Category Tiles">
  <div class="hf-tiles__container">
    <div class="hf-tiles__grid">
${[['/shop/collections/tailgating', 1, 'Hydro Flask Carryout Cooler and Travel Tumbler', 'Tailgating', 'Shop All Hydro Flask bottles, coolers and accessories perfect for Tailgating'], ['/shop/bottles-drinkware/coffee-tea', 2, 'Hydro Flask Coffee Flip Sip, Mug and Cup products', 'Coffee &amp; Tea', 'Shop All Hydro Flask Coffee and Tea products'], ['/shop/collections/halloween-shop', 3, 'Hydro Flask 32 oz Bottle, Travel Bottle and Micro Hydro', 'Halloween Spirit', 'Shop All Hydro Flask bottles, and tumblers perfect for halloween spirit'], ['/shop/bottles?visual-filter=Bestsellers', 4, 'Hydro Flask 24 oz Bottle, Micro Hydro and Lightweight Chug Cap', 'Everyday Hydration', 'Shop All Hydro Flask bottles, and tumblers perfect for everyday hydration']].map(([h, n, alt, t, al]) => `      <a href="${h}" class="hf-tiles__tile" aria-label="${al}"><div class="hf-tiles__image"><picture><source media="(min-width: 768px)" srcset="${M}hohfus-5461-tile-${n}-desktop.jpg"><img src="${M}hohfus-5461-tile-${n}-mobile.jpg" alt="${alt}" loading="lazy"></picture></div><div class="hf-tiles__title">${t}</div></a>`).join('\n')}
    </div>
    <div class="hf-tiles__hero">
      <a href="/shop/new-arrivals" class="hf-tiles__hero-image" aria-label="Shop New Hydro Flask Bottles, Coolers and Accessories perfect for fall"><picture><source media="(min-width: 768px)" srcset="${M}hohfus-5461-hero-desktop.jpg"><img src="${M}hohfus-5461-hero-mobile.jpg" alt="Friends gathered outside a coffee shop with Hydro Flask bottles and totes" loading="lazy"></picture></a>
      <div class="hf-tiles__hero-content">
        <p class="hf-tiles__tagline">Kickoff cooler weather with Hydro Flask.</p>
        <a href="/shop/new-arrivals" class="hf-tiles__cta" aria-label="Shop New Hydro Flask Bottles, Coolers and Accessories perfect for fall">Shop New</a>
      </div>
    </div>
  </div>
</section>

<section class="hf-gigi" aria-label="Hydro Flask x Gigi Perez Promo">
  <div class="hf-gigi__container">
    <picture><source media="(min-width: 768px)" srcset="${M}hohfus-5640-banner-desktop-2x.jpg"><img class="hf-gigi__bg" src="${M}hohfus-5640-banner-mobile-2x.jpg" alt="Artist Gigi Perez holding her custom Hydro Flask bottle in a music studio" loading="lazy"></picture>
    <div class="hf-gigi__content">
      <p class="hf-gigi__eyebrow">Hydro Flask x</p>
      <div class="hf-gigi__signature"><picture><source media="(min-width: 768px)" srcset="${M}hohfus-5640-signature-desktop-2x.png"><img src="${M}hohfus-5640-signature-mobile-2x.png" alt="Gigi Perez" loading="lazy"></picture><h2 class="sr-only hf-gigi__heading">Gigi Perez</h2></div>
      <p class="hf-gigi__text">Featuring custom doodles hand drawn by Gigi.</p>
      <a href="/gigi-perez-bottles" class="hf-gigi__cta" aria-label="Shop Gigi Perez Hydro Flasks">Shop Now</a>
    </div>
  </div>
</section>
${carousel(P[0], '')}

<section class="hf-sundae" aria-label="Sundae School x Hydro Flask Promo">
  <div class="hf-sundae__container">
    <div class="hf-sundae__content">
      <div class="hf-sundae__image-block">
        <div class="hf-sundae__leading"><span class="hf-sundae__sup">Limited Edition</span><h2 class="hf-sundae__heading">Sundae School x <br>Hydro Flask</h2></div>
        <picture><source media="(min-width: 768px)" srcset="${M}hohfus-5287-background-desktop-2x.jpg"><img class="hf-sundae__bg" src="${M}hohfus-5287-background-mobile-2x.jpg" alt="Sundae School Limited Edition Bottle design" loading="lazy"></picture>
      </div>
      <div class="hf-sundae__text-block"><div class="hf-sundae__text">
        <p class="hf-sundae__desc">An iconic Sundae School <br>fleece transformed into an <br>iconic Hydro Flask bottle.</p>
        <a href="/sundae-school-24-oz-bottle" class="hf-sundae__cta" aria-label="Shop Sundae School exclusive Hydro Flask Bottle">Shop Sundae School</a>
      </div></div>
    </div>
    <div class="hf-sundae__product"><picture><source media="(min-width: 768px)" srcset="${M}hohfus-5287-product-desktop-2x.png"><img src="${M}hohfus-5287-product-mobile-2x.png" alt="" loading="lazy"></picture></div>
  </div>
</section>
${carousel(P[1], 'lunch')}

<section class="hf-trending">
  <div class="hf-trending__container">
    <h3 class="hf-trending__title">Trending Now</h3>
    <ul class="hf-trending__list">
${[['/shop/bottles-drinkware', 'Bottles &amp; Drinkware'], ['/shop/new-arrivals', 'New Colors'], ['/shop/bundles', 'Bundles'], ['/shop/coolers', 'Coolers &amp; Totes'], ['/shop/mini-water-bottles', 'Micro Hydro'], ['/shop/lightweight-water-bottles', 'Lightweight']].map(([h, t]) => `      <li class="hf-trending__item"><a href="${h}" class="hf-trending__link">${t}</a></li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="hf-advocacy" aria-label="Protect Where We Play partnership announcement">
  <div class="hf-advocacy__container">
    <div class="hf-advocacy__image">
      <picture><source media="(min-width: 768px)" srcset="${M}hohfus-4745-beach-desktop-2x.jpg"><img src="${M}hohfus-4745-beach-mobile-2x.jpg" alt="hydro flask insulated cooler backpack and water bottle on beach with people in background" loading="lazy"></picture>
      <div class="hf-advocacy__logo-desktop"><img src="${M}hohfus-4745-pwwp-logo.png" alt="" loading="lazy"></div>
    </div>
    <div class="hf-advocacy__content">
      <div class="hf-advocacy__logo-mobile"><img src="${M}hohfus-4745-pwwp-logo.png" alt="" loading="lazy"></div>
      <h3 class="hf-advocacy__heading">Our commitment to responsible advocacy.</h3>
      <p class="hf-advocacy__text">Hydro Flask is proud to support Ocean Conservancy® as the official hydration partner and Platinum Champion of its Protect Where We Play℠ initiative.</p>
      <a href="/brand-values" class="hf-advocacy__cta" aria-label="Learn more about our commitment to responsible advocacy">Learn More</a>
    </div>
  </div>
</section>
</main>
${fs.readFileSync('stardust/prototypes/partials/footer.html', 'utf8')}
<script src="js/index.js" defer></script>
</body>
</html>
`;
fs.writeFileSync('stardust/prototypes/index-proposed.html', html);
console.log('written', html.length);
