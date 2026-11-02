// Header template: renders the nav data (stardust/replica/lift/nav*.json, extracted from the
// captured DOM) into clean hf-* markup. Text, hrefs, aria-labels and titles are verbatim.
import fs from 'fs';
const M = '../current/assets/media/';
const I = (n, cls = '') => fs.readFileSync(`stardust/current/assets/icons/${n}.svg`, 'utf8')
  .replace('<svg ', `<svg aria-hidden="true"${cls ? ` class="${cls}"` : ''} `).replace(/ aria-hidden="true"([^>]*) aria-hidden="true"/, ' aria-hidden="true"$1');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const at = (k, v) => (v ? ` ${k}="${esc(v)}"` : '');
const NAV = JSON.parse(fs.readFileSync('stardust/replica/lift/nav.json', 'utf8'));
const ADS = JSON.parse(fs.readFileSync('stardust/replica/lift/nav-ads.json', 'utf8'));
const SEARCH1 = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.5 2a8.5 8.5 0 0 1 6.68 13.76l3.65 3.65a1 1 0 0 1-1.41 1.42l-3.66-3.65A8.5 8.5 0 1 1 10.5 2Zm0 2a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z"></path></svg>';
const CLEAR1 = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.3 5.3a1 1 0 0 1 1.4 0L12 10.6l5.3-5.3a1 1 0 1 1 1.4 1.4L13.4 12l5.3 5.3a1 1 0 0 1-1.4 1.4L12 13.4l-5.3 5.3a1 1 0 0 1-1.4-1.4l5.3-5.3-5.3-5.3a1 1 0 0 1 0-1.4Z"></path></svg>';
const SEARCH2 = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" stroke-width="2"></circle><path d="M16 16l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
const SPINNER = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="8" stroke-dasharray="180 80"></circle></svg>';
const chev = '<svg class="hf-nav__chevron" viewBox="0 0 8 5" fill="none" aria-hidden="true"><path d="M1 1L4 4L7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const a = (l, cls) => `<a class="${cls}" href="${esc(l.href)}"${at('aria-label', l.aria)}${at('title', l.title)}${l.target ? ` target="${l.target}" rel="noopener"` : ''}><span class="hf-mega__label">${esc(l.label)}</span>${l.flag ? ` <span class="hf-mega__flag">${esc(l.flag)}</span>` : ''}${l.sr ? `<span class="sr-only">${esc(l.sr)}</span>` : ''}</a>`;
const file = u => u.split('/').pop();
const ad = x => `<section class="hf-mega-ad hf-mega-ad--${x.kind} hf-mega-ad--${x.mod}"${at('aria-label', x.label)}><a class="hf-mega-ad__link" href="${esc(x.href)}"${at('aria-label', x.aria)}><picture>${x.srcs.filter(s => /min-width/.test(s.media)).map(s => `<source media="${s.media}" srcset="${M}${file(s.srcset)}">`).join('')}<img class="hf-mega-ad__image" src="${M}${file(x.srcs.find(s => /max-width/.test(s.media)).srcset)}" alt="${esc(x.alt)}" loading="lazy"></picture><span class="hf-mega-ad__content"><strong class="hf-mega-ad__title">${esc(x.title)}</strong><span class="hf-mega-ad__desc">${esc(x.desc)}</span><span class="hf-mega-ad__cta">${esc(x.cta)}</span></span></a></section>`;

const panel = (n, i) => {
  const ads = ADS[n.label] || [];
  return `<div class="hf-mega" id="hf-mega-${i}" role="region"${at('aria-label', n.panelAria)} hidden>
  <div class="hf-mega__drawer-header"><button type="button" class="hf-mega__close"${at('aria-label', n.close)}>${I('drawer-close')}</button></div>
  <div class="hf-mega__title-row"><button type="button" class="hf-mega__back"${at('aria-label', n.back.aria)}>${I('back')}${esc(n.back.text)}</button><h2 class="hf-mega__heading">${esc(n.heading)}</h2>${n.shopAll ? a(n.shopAll, 'hf-mega__shop-all') : ''}</div>
  <div class="hf-mega__panel${n.featured ? ' hf-mega__panel--featured' : ''}${ads.length && ads[0].kind === 'tile' ? ' hf-mega__panel--tiles' : ''}">
${n.featured ? `    <div class="hf-mega__featured"><h2 class="hf-mega__featured-label">${esc(n.featured.heading)}</h2><ul class="hf-mega__featured-list">${n.featured.items.map(l => `<li${l.all ? ' class="hf-mega__desktop-only"' : ''}>${a(l, 'hf-mega__featured-link')}</li>`).join('')}</ul></div>` : ''}
${(n.columns || []).length ? `    <div class="hf-mega__columns">${n.columns.map(c => `<div class="hf-mega__column"><button type="button" class="hf-mega__l2-trigger"${at('aria-label', c.trigger.aria)} aria-expanded="false"><span>${esc(c.trigger.text)}</span>${I('l2-chevron', 'hf-mega__l2-chevron')}</button><h2 class="hf-mega__col-heading">${c.headingHref ? `<a href="${esc(c.headingHref)}"${at('aria-label', c.headingAria)}><span class="hf-mega__label">${esc(c.heading)}</span></a>` : `<span class="hf-mega__label">${esc(c.heading)}</span>`}</h2><ul class="hf-mega__links">${c.links.map(l => `<li>${a(l, 'hf-mega__link')}</li>`).join('')}</ul></div>`).join('')}</div>` : ''}
${ads.length ? `    <div class="hf-mega__ads">${ads.map(ad).join('')}</div>` : ''}
  </div>
</div>`;
};

export const header = () => `<header class="hf-header">
  <div class="hf-header__inner">
    <div class="hf-header__logo"><a href="https://www.hydroflask.com/"><img src="${M}logo.svg" alt="Hydroflask store logo" width="300" height="71"></a></div>
    <div class="hf-header__utility">
      <nav aria-label="Utility navigation"><ul>
        <li><a href="https://www.hydroflask.com/house-of-hydro-rewards" aria-label="Learn more about our rewards program">Rewards</a></li>
        <li><a href="https://www.hydroflask.com/contact-us" aria-label="Contact us">Contact Us</a></li>
        <li><a href="https://www.hydroflask.com/gift-card" aria-label="Shop Gift Cards">Gift Cards</a></li>
      </ul></nav>
      <button type="button" class="hf-locale" aria-label="Store switcher" aria-haspopup="dialog"><span class="hf-locale__image"><span class="hf-locale__flag flag-us" aria-hidden="true"></span></span><span class="hf-locale__title"><span>USA | EN</span></span></button>
    </div>
    <div class="hf-header__row">
      <nav class="hf-nav" aria-label="Main navigation">
        <div class="hf-nav__drawer-header"><button type="button" class="hf-mega__close" aria-label="Close menu">${I('drawer-close')}</button></div>
        <ul class="hf-nav__list">
${NAV.map((n, i) => n.tag === 'a'
    ? `        <li class="hf-nav__item"><a class="hf-nav__link" href="${esc(n.href)}"${at('aria-label', n.aria)}>${esc(n.label)}</a></li>`
    : `        <li class="hf-nav__item"><button type="button" class="hf-nav__link"${at('aria-label', n.aria)} aria-expanded="false" aria-controls="hf-mega-${i}">${esc(n.label)} ${chev}</button>
${panel(n, i)}</li>`).join('\n')}
      </ul></nav>
      <div class="hf-header__spacer"></div>
      <div class="hf-header__actions">
        <button type="button" class="hf-header__search" aria-label="Open Search" aria-controls="hf-search">${I('search')}${I('close', 'hf-icon-close')}</button>
        <div class="hf-header__account-wrap">
          <button type="button" class="hf-header__account" aria-label="My account" aria-expanded="false">${I('account')}${I('close', 'hf-icon-close')}</button>
          <nav class="hf-account" hidden>
            <div class="hf-account__links">
              <a href="https://www.hydroflask.com/customer/account/index/" title="Sign In" class="hf-account__primary">Sign In</a>
              <a href="https://www.hydroflask.com/customer/account/create/" title="Create an Account">Create an Account</a>
              <a href="https://www.hydroflask.com/track/order/status/" title="Track My Order">Track My Order</a>
            </div>
            <div class="hf-account__links" hidden>
              <a href="https://www.hydroflask.com/customer/account/" title="My Account">My Account</a>
              <a href="https://www.hydroflask.com/house-of-hydro-rewards/" title="My Rewards">My Rewards</a>
              <a href="https://www.hydroflask.com/wishlist/" title="My Favorites">My Favorites</a>
              <a href="https://www.hydroflask.com/sales/order/history/" title="My Orders">My Orders</a>
              <a href="https://www.hydroflask.com/customer/account/logout/" title="Sign Out" class="hf-account__primary">Sign Out</a>
            </div>
          </nav>
        </div>
        <button type="button" class="hf-header__cart-btn" title="Cart"><span class="sr-only">My minicart, cart is empty</span><div class="hf-header__cart">${I('cart')}<div class="hf-header__cart-count">0</div></div></button>
        <div class="hf-header__hamburger"><button type="button" aria-label="Open menu">${I('hamburger')}</button></div>
      </div>
    </div>
  </div>
  <div class="hf-search" id="hf-search" hidden>
    <form class="hf-search__form" action="https://www.hydroflask.com/catalogsearch/result/" method="get" role="search">
      <label class="sr-only" for="hf-search-input">I am searching for...</label>
      <span class="hf-search__icons" aria-hidden="true">${SEARCH2}${SPINNER}</span>
      <input id="hf-search-input" type="search" name="q" placeholder="I am searching for..." autocomplete="off">
      
      <button type="submit" class="hf-search__submit" title="Search">${SEARCH1}</button>
      <button type="reset" class="hf-search__clear" title="Clear">${CLEAR1}</button>
    </form>
    <div class="hf-search__notice" hidden>
      <p>Search is currently unavailable. To use search functionality, please accept cookies in your preferences.</p>
      <button type="button" class="hf-search__prefs">Manage Cookie Preferences</button>
    </div>
    <div class="hf-search__error" hidden>Failed to load content. Please try again.</div>
  </div>
</header>`;
