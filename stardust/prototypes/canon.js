/* Doosan Bobcat canon behaviour — only behaviour observed on the live page
   (stardust/replica/motion/en-management-esg-result.json). Lifted from source
   common.js; no framework. */
(() => {
  const doc = document.documentElement;
  const header = document.getElementById('header');
  const DESKTOP = window.matchMedia('(min-width: 1470px)');

  /* ---------- Header: desktop hover mega-menu / mobile drawer (menuFunc) ---------- */
  if (header) {
    const items = [...header.querySelectorAll('.gnb > li')];
    // desktop: header hover opens the mega-menu, li hover marks the active column
    header.addEventListener('mouseenter', () => { if (DESKTOP.matches) header.classList.add('is_hover'); });
    header.addEventListener('mouseleave', () => {
      if (!DESKTOP.matches) return;
      items.forEach((li) => li.classList.remove('on'));
      header.classList.remove('is_hover');
    });
    items.forEach((li) => {
      li.addEventListener('mouseenter', () => {
        if (!DESKTOP.matches) return;
        items.forEach((x) => x.classList.remove('on'));
        li.classList.add('on');
      });
      // mobile: first-level link toggles its depth2 accordion
      const link = li.querySelector(':scope > a');
      link.addEventListener('click', (e) => {
        if (DESKTOP.matches) return;
        e.preventDefault();
        const wasOpen = li.classList.contains('open');
        items.forEach((x) => x.classList.remove('open'));
        if (!wasOpen) li.classList.add('open');
      });
    });
    // depth3 toggles (Products)
    const d3 = [...header.querySelectorAll('.depth3-btn')];
    d3.forEach((btn) => btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wasActive = btn.classList.contains('active');
      d3.forEach((b) => b.classList.remove('active'));
      if (!wasActive) btn.classList.add('active');
    }));
    // hamburger + dim layer
    const burger = header.querySelector('.hd_allmenu_open');
    if (burger) burger.addEventListener('click', () => header.classList.toggle('menu_open'));
    const dim = header.querySelector('.gnb_wrap h2.hide');
    if (dim) dim.addEventListener('click', () => header.classList.remove('menu_open'));

    // language dropdown
    const lang = header.querySelector('.hd_language');
    const langBtn = lang && lang.querySelector('.btn_hd_language');
    if (langBtn) {
      langBtn.addEventListener('click', () => lang.classList.toggle('on'));
      const list = lang.querySelector('ul');
      list.addEventListener('mouseenter', () => lang.classList.add('hov_on'));
      list.addEventListener('mouseleave', () => lang.classList.remove('hov_on'));
    }

    // search layer
    const wrap = header.querySelector('.search_wrap');
    const openBtn = header.querySelector('.btn_search_open');
    const closeBtn = header.querySelector('.btn_search_close');
    if (wrap && openBtn && closeBtn) {
      openBtn.addEventListener('click', () => wrap.classList.add('on', 'active'));
      closeBtn.addEventListener('click', () => {
        wrap.classList.remove('active');
        setTimeout(() => wrap.classList.remove('on'), 300);
      });
    }
  }

  /* ---------- Footer: related-sites dropdown ---------- */
  const ftSite = document.querySelector('.ft_site');
  if (ftSite) ftSite.addEventListener('click', () => ftSite.classList.toggle('open'));

  // outside click closes the language list and the related-sites list
  document.addEventListener('click', (e) => {
    const langBtn = document.querySelector('.btn_hd_language');
    if (langBtn && !langBtn.contains(e.target)) langBtn.parentElement.classList.remove('on');
    if (ftSite && !ftSite.contains(e.target)) ftSite.classList.remove('open');
  });

  /* ---------- Scroll reveal (.con_ani → .on when its top enters the viewport) ---------- */
  // Trigger on the element's layout top (its resting position, without the
  // 100px fade_up offset) so a block is revealed as soon as its slot enters
  // the viewport — never left mid-transition at a viewport seam.
  const reveal = [...document.querySelectorAll('.con_ani')];
  const layoutTop = (el) => {
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  };
  const hdScroll = () => {
    const bottom = window.scrollY + window.innerHeight;
    reveal.forEach((el) => {
      if (!el.classList.contains('on') && bottom > layoutTop(el)) el.classList.add('on');
    });
  };
  hdScroll();
  window.addEventListener('scroll', hdScroll, { passive: true });

  /* ---------- TOP button: scroll-state classes + scroll-progress ring ----------
     source: scroll_circle_button() — posi_fixed while above the footer,
     fadeout while scrollTop < viewport/2; circle-progress ring
     (thickness 3, start -90deg, fill #005eb8, empty rgba(0,0,0,.1)). */
  const topBtn = document.querySelector('.top_btn');
  if (topBtn) {
    const footer = document.getElementById('footer');
    const holder = topBtn.querySelector('.progress');
    const canvas = holder && holder.querySelector('canvas');
    const ctx = canvas && canvas.getContext('2d');
    const draw = (value) => {
      if (!ctx) return;
      const size = holder.offsetWidth || 65;
      const ratio = window.devicePixelRatio || 1;
      if (canvas.width !== size * ratio) {
        canvas.width = size * ratio;
        canvas.height = size * ratio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
      }
      const r = size / 2;
      const t = 3;
      const start = -Math.PI / 2;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, size, size);
      ctx.lineWidth = t;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 0, 0, .1)';
      ctx.arc(r, r, r - t / 2, start, start + Math.PI * 2);
      ctx.stroke();
      if (value > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#005eb8';
        ctx.arc(r, r, r - t / 2, start, start + Math.PI * 2 * value);
        ctx.stroke();
      }
    };
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = doc.scrollHeight - vh;
      const footH = footer ? footer.offsetHeight : 0;
      topBtn.classList.toggle('posi_fixed', y < doc.scrollHeight - vh - footH);
      topBtn.classList.toggle('fadeout', y < vh / 2);
      draw(max > 0 ? Math.min(1, y / max) : 0);
    };
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- Sub-page visual: auto-scroll past it 1.4s after load ----------
     source: if the page opens above the visual's bottom and has no hash,
     animate scrollTop to the visual's bottom edge (800ms). */
  const visual = document.querySelector('.sub_visual');
  if (visual && !window.location.hash) {
    const bottom = visual.getBoundingClientRect().bottom + window.scrollY;
    if (window.scrollY < bottom) {
      setTimeout(() => {
        if (window.scrollY < bottom) window.scrollTo({ top: bottom, behavior: 'smooth' });
      }, 1400);
    }
  }
})();
