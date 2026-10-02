// add functionality that requires user consent here (analytics, martech, etc.)
import siteConfig from './site-config.js';

/**
 * Loads the Google tag (gtag.js) for the configured GA4 property — only when the site config
 * enables it AND consent has been granted (this module is imported by consent-check.js on consent).
 */
function loadGoogleTag({ googleTagId, enabled } = {}) {
  if (!enabled || !googleTagId) return;
  window.dataLayer = window.dataLayer || [];
  const gtag = (...args) => { window.dataLayer.push(args); };
  gtag('js', new Date());
  gtag('config', googleTagId);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagId)}`;
  document.head.append(script);
}

loadGoogleTag(siteConfig.analytics);
