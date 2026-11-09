<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-02T21:30:00Z mode=prep sources=stardust/current/_computed-styles.json,stardust/current/assets/css/ -->
---
name: Doosan Bobcat (current state)
description: Corporate site of Doosan Bobcat — full-screen photographic/video storytelling, white canvas, near-black ink, corporate blue accent.
colors:
  white: "#ffffff"
  ink: "#232323"
  ink-mid: "#333333"
  text-muted: "#666666"
  text-subtle: "#999999"
  border: "#dddddd"
  brand-blue: "#005eb8"
  blue-tint-1: "#9cc4ec"
  blue-tint-2: "#c6d5e5"
  blue-tint-3: "#dce6f1"
typography:
  display:
    fontFamily: "Pretendard, 'Noto Sans KR', 'Malgun Gothic', dotum, sans-serif"
    fontSize: "6rem"
    fontWeight: 700
    lineHeight: 1.1666
  section-title:
    fontFamily: "Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: "5rem"
    fontWeight: 700
    lineHeight: 1
  lede:
    fontFamily: "Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: "2.4rem"
    fontWeight: 400
    lineHeight: 1.5833
  body:
    fontFamily: "Pretendard, 'Noto Sans KR', sans-serif"
    fontSize: "1.8rem"
    fontWeight: 400
    lineHeight: 1.555
rounded:
  pill: "50%"
  card: "70px"
spacing:
  root: "10px (html 62.5%), scaling to 58% / 55% / 53% at ≤1470 / ≤1240 / ≤767"
components: {}
---

## Overview
Corporate group site. The home page is a jquery.fullpage.js scroller: every section is one full viewport (video hero, company facts, product card carousel, sustainability, media center, footer). Sub pages (ESG results) are long scrolling documents with a full-bleed photo banner, tab bar, and diagram-heavy content sections.

## Colors
White canvas (#ffffff), near-black ink #232323 for headings, #666666 for body/secondary text, hairlines #dddddd, the corporate blue #005eb8 for emphasis, tabs and diagram fills with light blue tints #9cc4ec / #c6d5e5 / #dce6f1.

## Typography
One family: Pretendard (OFL, self-hosted), Noto Sans KR fallback. Sizes are rem-based on a fluid root (10px → 9.28 → 8.8 → 8.48px), hence non-integer computed sizes (e.g. 55.68px = 6rem at 9.28px root). Headings bold 700, line-height 1–1.17.

## Layout
Source breakpoints 1470 (header switches to compact/hamburger mode), 1240, 1180, 767, 600. Content sits in `.inner` containers; the home sections are 100vh panels.

## Elevation & Depth
Soft card shadow rgba(14,23,32,.13) 5px 9px 15px; diffuse rgba(0,0,0,.1) 1px 2px 30px.

## Shapes
Circular diagram nodes (50%), large 70px-radius panels on ESG diagrams; otherwise square edges.

## Components
Transparent-over-hero header turning white on scroll/hover; "btn_more_type01" text+arrow link button; product cards in a swiper carousel; ESG tab bar; numbered metric circles.

## Do's and Don'ts
Do keep the fluid rem root. Don't introduce new colors or radii — this is the descriptive current state.
