/* en-investors — o-tabs behaviour observed on live (stardust/replica/motion/en-investors.json):
   clicking a header item [data-tabs-trigger] gives it .is-active and the matching
   content item [data-tabs-target] .is-visible; the siblings lose both.
   Images in initially hidden panels carry the live's unloaded state (placeholder src) and are
   loaded (data-lazy-src/-srcset -> src/srcset, .is-lazy-loaded) when their panel is first shown. */
(() => {
  const load = (panel) => panel.querySelectorAll('[data-lazy-src], [data-lazy-srcset]').forEach((el) => {
    if (el.dataset.lazySrcset) { el.setAttribute('srcset', el.dataset.lazySrcset); delete el.dataset.lazySrcset; }
    if (el.dataset.lazySrc) { el.setAttribute('src', el.dataset.lazySrc); delete el.dataset.lazySrc; el.classList.add('is-lazy-loaded'); }
  });
  document.querySelectorAll('.o-tabs').forEach((tabs) => {
    const triggers = tabs.querySelectorAll('.o-tabs__header-item[data-tabs-trigger]');
    const targets = tabs.querySelectorAll('.o-tabs__content-item[data-tabs-target]');
    triggers.forEach((t) => t.addEventListener('click', () => {
      triggers.forEach((x) => x.classList.toggle('is-active', x === t));
      targets.forEach((c) => {
        const on = c.dataset.tabsTarget === t.dataset.tabsTrigger;
        c.classList.toggle('is-visible', on);
        if (on) load(c);
      });
    }));
  });
})();
