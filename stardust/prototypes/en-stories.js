/* en-stories — behaviours observed on the live stories page (stardust/replica/motion/en-stories.json):
   1. featured single image: IntersectionObserver (rootMargin -50% 0% -50% 0%, threshold 0) toggles .has-focus
      on [data-article-cluster-focus-image] (CSS: scale 1.05 over 500ms).
   2. constories "More articles": click → button disabled (pulse) → fetch data-constories-xhr → on ok remove the
      button wrapper(s) and append the returned cards to [data-constories-contentcontainer].
      Prototype: the xhr points at a local snapshot of the endpoint (live API sends no CORS headers);
      data-constories-xhr-live keeps the real endpoint for delivery wiring. */
(() => {
  const focusImgs = document.querySelectorAll('[data-article-cluster-focus-image]');
  if (focusImgs.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('has-focus', e.isIntersecting));
    }, { root: null, rootMargin: '-50% 0% -50% 0%', threshold: 0 });
    focusImgs.forEach((img) => io.observe(img));
  }

  document.querySelectorAll('[data-constories-wrapper]').forEach((wrapper) => {
    wrapper.addEventListener('click', async (ev) => {
      const btn = ev.target && ev.target.closest('button[data-constories-loadmore]');
      if (!btn) return;
      const container = btn.closest('[data-constories-contentcontainer]');
      const btnWrappers = container.querySelectorAll('[data-constories-buttonwrapper]');
      btn.disabled = true;
      let res;
      try { res = await fetch(btn.dataset.constoriesXhr); } catch (err) { console.error('Could not fetch', err); }
      btn.disabled = false;
      if (res && res.ok) {
        btnWrappers.forEach((w) => w.remove());
        container.insertAdjacentHTML('beforeend', await res.text());
      }
    });
  });
})();
