# Builds stardust/prototypes/index-proposed.html from the captured DOM (verbatim strings) + harvested media.
import re,json,html as H
src=open('stardust/current/pages/index.html',encoding='utf-8').read()
mp=json.load(open('stardust/replica/lift/media-map.json'))
def local(u):
    u=u.strip()
    if mp.get(u): return mp[u]
    if mp.get(u+'.webp'): return mp[u+'.webp']
    raise SystemExit('unmapped '+u)
slides=[]
for i,(attrs,li) in enumerate(re.findall(r'<li class="splide__slide[^"]*"([^>]*)>(.*?)</li>',src,re.S),1):
    url=re.search(r'data-url="([^"]+)"',attrs).group(1)
    srcs=re.findall(r'<source srcset="([^"]+)" type="image/webp"(?: media="([^"]+)")?>',li)
    img=re.search(r'<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"',li)
    mob=[s for s,m in srcs if m]; desk=[s for s,m in srcs if not m]
    slides.append(dict(i=i,mobile=local(mob[0]),desktop=local(desk[0]),alt=img.group(2),url=url))
assert len(slides)==9
cards=[]
for chunk in re.split(r'<li class="p-journal__item">',src)[1:]:
    li=chunk[:chunk.find('</a>')]
    g=lambda k: re.search(r'[^"]*'+k+r'[^"]*"[^>]*>\s*([^<]*?)\s*<',li).group(1)
    img=re.search(r'<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"',li)
    cards.append(dict(href=re.search(r'<a href="([^"]+)"',li).group(1),img=local(img.group(1)),alt=img.group(2),cat=g('desc-cat-item'),tag=g('desc-tag-item'),title=g('desc-title'),date=g('desc-date')))
assert len(cards)==3, len(cards)
MENU='''<ul>
{top}<li class="menu-item works-menu__container"><span class="works-menu__title{tcls}">WORKS</span>
<ul class="works-menu__categories{ccls}">
<li><a href="https://sorra.jp/works-category/landscaping/">造園</a></li>
<li><a href="https://sorra.jp/works-category/architecture/">建築</a></li>
<li><a href="https://sorra.jp/works-category/indoor-green/">インドアグリーン</a></li>
</ul></li>
<li class="menu-item"><a href="https://sorra.jp/service_flow">SERVICE/FLOW</a></li>
<li class="menu-item"><a href="https://sorra.jp/qa">Q&amp;A</a></li>
<li class="menu-item"><a href="https://sorra.jp/about">ABOUT</a></li>
<li class="menu-item"><a href="https://sorra.jp/recruit">RECRUIT</a></li>
<li class="menu-item"><a href="https://sorra.jp/journal">JOURNAL</a></li>
</ul>'''
def menu(top=False,toggle=False,journal=True):
    m=MENU if journal else MENU.replace('<li class="menu-item"><a href="https://sorra.jp/journal">JOURNAL</a></li>\n','')
    return m.format(top='<li class="menu-item"><a href="https://sorra.jp/">TOP</a></li>\n' if top else '', tcls=' js-catToggleButton' if toggle else '', ccls=' js-worksCat' if toggle else '')
SNS='''<ul class="c-sns-link__container"><li class="c-sns-link"><a href="https://www.instagram.com/sorra.jp"><img src="assets/img/icon-Instagram.svg" alt="Instagram"><p>Instagram</p><img src="assets/img/arrow-external.svg" alt=""></a></li></ul>'''
slide_html='\n'.join(f'''<li class="splide__slide{' is-active is-visible' if s['i']==1 else ''}" id="front-fv-splide-slide{s['i']:02d}" role="tabpanel" aria-label="{s['i']} of 9" data-ja-title="{H.escape(s['alt'])}" data-url="{s['url']}">
<picture><source srcset="{s['mobile']}" type="image/webp" media="(max-width: 767px)"><source srcset="{s['desktop']}" type="image/webp"><img class="thumbnail-img" src="{s['desktop']}" alt="{H.escape(s['alt'])}" width="1200" height="676" loading="eager" decoding="async"></picture>
</li>''' for s in slides)
dots='\n'.join(f'<li role="presentation"><button class="splide__pagination__page{" is-active" if i==1 else ""}" type="button" role="tab" aria-label="Go to slide {i}"></button></li>' for i in range(1,10))
card_html='\n'.join(f'''<li class="p-journal__item"><a href="{c['href']}">
<div class="p-journal__item-img"><img class="attachment-full size-full" src="{c['img']}" alt="{H.escape(c['alt'])}" loading="lazy" decoding="async"></div>
<div class="p-journal__item-desc">
<div class="p-journal__item-desc-taxonomy">
<ul class="p-journal-category__list p-journal__item-desc-cat"><li class="p-journal-category__item p-journal__item-desc-cat-item">{c['cat']}</li></ul>
<ul class="p-journal-tag__list p-journal__item-desc-tag"><li class="p-journal-tag__item p-journal__item-desc-tag-item">{c['tag']}</li></ul>
</div>
<h2 class="p-journal__item-desc-title">{c['title']}</h2>
<p class="p-journal__item-desc-date">{c['date']}</p>
</div></a></li>''' for c in cards)
page=f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SORRA | 雑木・自然風の庭</title>
<meta name="description" content="東京と埼玉に跨る狭山丘陵を拠点とする造園会社SORRAです。雑木の庭をはじめ、地域の風土や環境に合った季節の移ろいを楽しめる、庭づくり、空間づくりをしています。">
<link rel="icon" href="assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kulim+Park:wght@400;600&amp;family=Noto+Sans+JP:wght@400;500&amp;display=swap">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/index.css">
</head>
<body class="home">
<div class="body-inner">
<header class="l-header js-header">
<div class="l-header__inner">
<h1 class="l-header__logo" id="js-headerLogo"><a href="https://sorra.jp/"><img class="logo-bk" src="assets/img/logo.svg" alt="SORRA"></a></h1>
<div class="l-header__right">
<nav class="l-global-menu">{menu()}</nav>
{SNS}
<a class="button-contact" href="https://sorra.jp/contact">CONTACT</a>
<div class="c-hamburger"><button class="js-toggle-drawer" id="js-toggleDrawer" aria-label="メニューを開く" aria-expanded="false" aria-controls="js-drawer" type="button"><div class="c-hamburger__inner"><span class="inner_line" id="line1"></span><span class="inner_line" id="line2"></span></div></button></div>
</div>
</div>
<div class="l-drawer" id="js-drawer" aria-hidden="true">
<div class="l-drawer__inner">
<div class="l-drawer__inner-nav">
<nav class="l-global-menu">{menu(top=True,toggle=True)}</nav>
{SNS}
</div>
<span class="u-srOnly" id="js-loopTrigger"></span>
</div>
</div>
</header>
<main class="l-main l-main-front" id="front-page">
<section class="p-front-fv">
<div class="p-front-fv__content">
<div class="p-front-fv__slider">
<div class="splide splide--fade is-active is-overflow is-initialized" id="front-fv-splide" role="region" aria-roledescription="carousel">
<div class="splide__track splide__track--fade" id="front-fv-splide-track">
<ul class="splide__list" id="front-fv-splide-list" role="presentation">
{slide_html}
</ul>
</div>
<div class="splide__page-info u-ds-lg">
<div class="splide__page-num" id="page-num">
<div class="circular-progress">
<svg class="progress-ring" viewBox="0 0 54 54"><circle class="progress-ring__circle-bg" cx="27" cy="27" r="25"></circle><circle class="progress-ring__circle" cx="27" cy="27" r="25" style="stroke-dasharray: 157.08; stroke-dashoffset: 157.08;"></circle></svg>
<div class="progress-content"><span class="current">01</span><span class="separator"></span><span class="total">09</span></div>
</div>
</div>
<div class="splide__slide-titles" id="slide-titles">
<h2 class="slide-title-ja">{slides[0]['alt']}</h2>
<a class="slide-title__link c-underline-arrow" href="https://sorra.jp/works/1085/">VIEW THIS WORK</a>
</div>
</div>
<ul class="splide__pagination splide__pagination--ltr" role="tablist" aria-label="Select a slide to show">
{dots}
</ul>
</div>
</div>
</div>
</section>
<section class="p-front-intro">
<p class="p-front-intro__txt">わたしたちSORRA（そら）は、<br class="u-ds-sp">東京と埼玉に跨る狭山丘陵を<br class="u-ds-sp">拠点とする造園会社です。<br>雑木の庭をはじめ、<br class="u-ds-sp">地域の風土や環境に合った<br class="u-ds-sp">季節の移ろいを楽しめる、<br>庭づくり、空間づくりをしています。</p>
</section>
<section class="p-front-nav">
<nav class="l-global-menu">{menu(toggle=True,journal=False)}</nav>
</section>
<section class="p-front-journal">
<h2 class="p-front-journal__ttl">JOURNAL</h2>
<div class="p-front-journal__link"><a class="c-underline-arrow" href="https://sorra.jp/journal">VIEW ALL</a></div>
<ul class="p-journal__list">
{card_html}
</ul>
</section>
</main>
<footer class="l-footer">
<div class="l-footer__contact">
<div class="l-footer__contact-inner">
<div class="l-footer__contact-txt">
<p class="l-footer__contact-txt--ttl">CONTACT</p>
<p class="l-footer__contact-txt--desc">東京・埼玉を中心に全国のご依頼を<br class="u-ds-sp">お受けいたします。<br>ぜひ、お気軽にお問い合わせください。</p>
</div>
<div class="l-footer__contact-cta">
<div class="l-footer__contact-cta-tel">
<p class="l-footer__contact-cta-tel--num">TEL:<a href="tel:042-306-4850">042-306-4850</a></p>
<p class="l-footer__contact-cta-tel--closed">定休日／日曜・祝日</p>
</div>
<a class="l-footer__contact-cta-link" href="https://sorra.jp/contact">お問い合わせフォーム</a>
</div>
</div>
</div>
<div class="l-footer__inner">
<div class="l-footer__left">
<div class="l-footer__logo"><a href="https://sorra.jp/"><img src="assets/img/logo.svg" alt="SORRA"></a></div>
<div class="l-footer__info">
<p>株式会社SORRA</p>
<p> 〒189-0025<br class="u-ds-sp"> 東京都東村山市廻田町<br> TEL:042-306-4850<br> MAIL:iwata@sorra.jp</p>
</div>
<div class="l-footer__sns--sp">{SNS}</div>
</div>
<nav class="l-global-menu">{menu(top=True,toggle=True)}</nav>
<div class="l-footer__right">
<div class="l-footer__sns--pc">{SNS}</div>
<p class="l-footer__copyright">© 2024 SORRA Ltd.</p>
</div>
</div>
</footer>
</div>
<script src="js/index.js" defer></script>
</body>
</html>
'''
open('stardust/prototypes/index-proposed.html','w',encoding='utf-8').write(page)
print('prototype written', len(page), 'chars; cards', [(c['cat'],c['tag'],c['title'][:12],c['date']) for c in cards])
