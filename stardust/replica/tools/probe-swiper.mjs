// probe-swiper.mjs — reads the live carousels' active slide over time (diagnosis of capture state).
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const t0 = Date.now();
await p.goto(process.argv[2] || 'https://www.skerriesmills.ie/', { waitUntil: 'domcontentloaded' });
for (const t of [500, 2000, 4000, 6500, 9000, 12500]) {
  await p.waitForTimeout(Math.max(0, t - (Date.now() - t0)));
  const s = await p.evaluate(() => [...document.querySelectorAll('.swiper')].map((sw) => {
    const act = sw.querySelector('.swiper-slide-active');
    return `${sw.className.split(' ')[1]} active=${act ? (act.textContent.trim().slice(0, 18)) : '-'} idx=${act ? act.dataset.swiperSlideIndex : '-'} order0=${sw.querySelector('.swiper-slide')?.dataset.swiperSlideIndex}`;
  }));
  console.log(Date.now() - t0, s.join(' | '));
}
await b.close();
