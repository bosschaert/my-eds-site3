// Site-quirk shim for balbriggan.ie — loaded via NODE_OPTIONS=--import so the shipped
// instruments stay byte-identical. The theme's scripts.js declares a global
// `function scrollTo(target)` (jQuery animate to a selector), shadowing window.scrollTo;
// every in-page `window.scrollTo(0, y)` the instruments issue then throws
// "Cannot read properties of undefined (reading 'top')". This init script keeps the
// browser's native scrollTo for numeric/options calls and forwards selector calls to
// the theme's function, so site behaviour is unchanged and the instruments can scroll.
import { chromium } from 'playwright';

const INIT = () => {
  const native = window.scrollTo;
  const install = () => {
    const cur = window.scrollTo;
    if (cur === native || (cur && cur.__stardustSmart)) return;
    const site = cur;
    const smart = function smartScrollTo(a, b) {
      const isNative = a === undefined || typeof a === 'number'
        || (a !== null && typeof a === 'object' && !(a instanceof Node) && !('jquery' in a) && !('length' in a));
      return isNative ? native.call(window, a, b) : site.call(this, a, b);
    };
    smart.__stardustSmart = true;
    try { window.scrollTo = smart; } catch (e) { /* non-writable: leave as is */ }
  };
  document.addEventListener('DOMContentLoaded', install);
  window.addEventListener('load', install);
  let n = 0;
  const t = setInterval(() => { install(); if (++n > 300) clearInterval(t); }, 50);
};

const origLaunch = chromium.launch.bind(chromium);
chromium.launch = async (...args) => {
  const browser = await origLaunch(...args);
  const origNewContext = browser.newContext.bind(browser);
  browser.newContext = async (...o) => {
    const ctx = await origNewContext(...o);
    await ctx.addInitScript(INIT);
    return ctx;
  };
  return browser;
};
