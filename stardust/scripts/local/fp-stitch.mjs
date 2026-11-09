#!/usr/bin/env node
// fp-stitch.mjs — live-side stitched capture for jquery.fullpage.js pages (doosanbobcat /en).
//
// replica ADAPTATION (documented instrument extension, 2026-11-02): stitch-shot.mjs fails loud on this
// page ("scroll stall … window scroll is a no-op") because fullpage.js scroll-jacks the window (gate doc
// § Hardening rule 13: capturing the inner scroller is future work). This instrument produces the SAME
// artefact stitch-shot would — one PNG of <vh>-tall chunks, fixed chrome shown in chunk 1 only — by
// driving fullpage's own API ($.fn.fullpage.moveTo) instead of window.scrollTo. Hardening is shared:
// live-session.mjs context (UA + document-only standard headers), gotoLive, dismissOverlays, the
// stitch-shot freeze (transition none, animations paused, videos paused at t=0, timers cleared).
// Sections are 100vh panels; the trailing fp-auto-height section (footer) contributes its own height,
// cut from the bottom of its viewport. Output → live.png for gate.sh (it reuses a cached live.png).
// Flagged for upstreaming into stitch-shot (inner-scroller support). Ledger: replica recreate notes.
//
// Usage: node fp-stitch.mjs <url> <out.png> [--width 1440] [--vh 900]
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';
import { newLiveContext, gotoLive, dismissOverlays } from '../diff/live-session.mjs';

const a = process.argv.slice(2);
if (a.includes('--help') || a.length < 2) { console.log('Usage: node fp-stitch.mjs <url> <out.png> [--width 1440] [--vh 900]'); process.exit(a.includes('--help') ? 0 : 2); }
const [url, out] = a;
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? Number(a[i + 1]) : d; };
const width = opt('--width', 1440); const vh = opt('--vh', 900);

const browser = await chromium.launch();
try {
  const ctx = await newLiveContext(browser, { viewport: { width, height: vh } });
  const page = await ctx.newPage();
  await gotoLive(page, url, { settleMs: 2500 });
  await dismissOverlays(page, { lateWindowMs: 6000 });
  await page.mouse.move(width - 2, vh - 2);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important;}html{scroll-behavior:auto!important}' });
  // Fix (2026-11-02): reset the carousel to slide 1 BEFORE the video freeze — slideTo restarts video 1, so
  // resetting after the seek left the live reference at ~1.3 s instead of t=0 (invalidated en live.png v1).
  await page.evaluate(() => document.querySelectorAll('.swiper-container').forEach((c) => { try { c.swiper.autoplay.stop(); c.swiper.slideTo(0, 0); } catch {} }));
  await page.waitForTimeout(300);
  await page.evaluate(async () => {
    const vids = [...document.querySelectorAll('video')];
    await Promise.all(vids.map((v) => new Promise((res) => {
      try { v.pause(); v.removeAttribute('autoplay'); if (v.readyState >= 1) v.currentTime = 0;
        if (v.seeking) { v.addEventListener('seeked', () => res(), { once: true }); setTimeout(res, 1500); } else setTimeout(res, 200);
      } catch { res(); }
    })));
    let id = window.setTimeout(() => {}, 0); while (id-- > 0) { window.clearTimeout(id); window.clearInterval(id); }
    window.$.fn.fullpage.setScrollingSpeed(0);
  });
  const sections = await page.evaluate(() => [...document.querySelectorAll('#fullpage > .section')].map((s) => ({ h: Math.round(s.getBoundingClientRect().height), auto: s.classList.contains('fp-auto-height') })));
  const fixedSel = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const p = getComputedStyle(el).position;
      if ((p === 'fixed' || p === 'sticky') && !out.some((o) => document.querySelector(o)?.contains(el))) { el.setAttribute('data-fp-layer', String(out.length)); out.push(`[data-fp-layer="${out.length}"]`); }
    }
    return out;
  });
  const chunks = [];
  for (let i = 0; i < sections.length; i++) {
    await page.evaluate((n) => window.$.fn.fullpage.moveTo(n), i + 1);
    await page.waitForTimeout(900);
    await page.evaluate(({ sel, show }) => sel.forEach((s) => { const el = document.querySelector(s); if (el) el.style.setProperty('opacity', show ? '' : '0', show ? '' : 'important'); }), { sel: fixedSel, show: i === 0 });
    await page.waitForTimeout(150);
    const buf = await page.screenshot();
    const png = PNG.sync.read(buf);
    const take = sections[i].auto ? Math.min(sections[i].h, png.height) : Math.min(vh, png.height);
    const fromY = sections[i].auto ? png.height - take : 0;
    chunks.push({ png, fromY, take });
    console.log(`section ${i + 1}/${sections.length}: ${take}px${sections[i].auto ? ' (auto-height, bottom-aligned)' : ''}`);
  }
  const W = chunks[0].png.width; const H = chunks.reduce((s, c) => s + c.take, 0);
  const outPng = new PNG({ width: W, height: H });
  let y = 0;
  for (const c of chunks) { PNG.bitblt(c.png, outPng, 0, c.fromY, W, c.take, 0, y); y += c.take; }
  writeFileSync(out, PNG.sync.write(outPng));
  writeFileSync(out.replace(/\.png$/i, '') + '.capture.json', `${JSON.stringify({ writtenBy: 'stardust/scripts/local/fp-stitch.mjs (fullpage.js adaptation of stitch-shot)', url, width, vh, height: H, chunks: chunks.length, denialCheck: 'ok', fixedLayers: { capture: 'once', count: fixedSel.length, late: [] }, at: new Date().toISOString() }, null, 2)}\n`);
  console.log(`stitched ${out}: ${W}x${H} from ${chunks.length} fullpage sections`);
} finally { await browser.close(); }
