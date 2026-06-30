---
name: lighthouse-astro-landing-page
description: >-
  Build Astro + TypeScript + Tailwind static landing pages targeting Google
  Lighthouse 100 in Performance, Accessibility, Best Practices, and SEO. Use
  when creating B2B SaaS marketing sites, optimizing Lighthouse scores, fixing
  render-blocking CSS, LCP/image delivery, contrast failures, or i18n/RTL landing
  pages with minimal JavaScript.
---

# Lighthouse 100 Astro Landing Page

## Goal

Ship a production-ready static landing page that scores **100** on all four Lighthouse categories (mobile + desktop), using **Astro SSG**, **TypeScript**, **Tailwind**, and **minimal client JS**.

## Default stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 5, `output: 'static'` |
| Styling | Tailwind + `@astrojs/tailwind` (`applyBaseStyles: false`) |
| Images | `astro:assets` + Sharp |
| SEO | `@astrojs/sitemap`, canonical, hreflang, JSON-LD |
| i18n | Content maps in `src/utils/i18n.ts`, `/` = default locale |
| Deploy | Cloudflare Pages (`dist/`, optional `functions/`) |

## Project structure

```
src/
  assets/images/     # Source images only
  assets/fonts/      # Self-hosted woff2 (2 weights max)
  components/        # Section components + Reveal.astro + Logo.astro
  layouts/BaseLayout.astro
  pages/index.astro, pages/en/, pages/he/
  styles/global.css
  utils/i18n.ts, utils/seo.ts
public/fonts/        # Font files for preload (copy woff2 here)
public/robots.txt
```

## Build workflow

Copy this checklist and complete every item before claiming done:

```
Landing page progress:
- [ ] Scaffold Astro + Tailwind + sitemap
- [ ] Scan existing local images; use Astro Image (never raw <img src="huge.png">)
- [ ] Implement all sections + i18n + RTL
- [ ] Apply performance patterns (below)
- [ ] Apply accessibility patterns (below)
- [ ] Apply SEO patterns (below)
- [ ] npm run build passes
- [ ] Lighthouse mobile + desktop ≥ 95 each category (target 100)
- [ ] README with dev + deploy instructions
```

Run verification:

```bash
npm run build
npm run preview
# Lighthouse in incognito; throttle: mobile + desktop
```

---

## Performance (target 100)

### 1. Eliminate render-blocking CSS

In `astro.config.mjs`:

```js
build: { inlineStylesheets: 'always' }
```

Confirm built HTML has **no** `<link rel="stylesheet" href="/_astro/...">`.

### 2. Fonts — max 2 weights, no critical-chain bloat

- Put woff2 in `public/fonts/`
- Preload only **300** (body) + **700** (headings) in layout `<head>`
- `@font-face` with `font-display: swap`
- **Do not** load weight 500 unless required; map Tailwind `font-medium` → 300
- Remove unused font files from `public/fonts/`

### 3. LCP image rules

Identify the LCP element (usually hero image or H1). Then:

| Rule | Implementation |
|------|----------------|
| No lazy LCP | `loading="eager"` on LCP image |
| High priority | `fetchpriority="high"` on LCP image |
| No lazy decorative | Desktop bg: `loading="lazy"` only if NOT LCP |
| Viewport-specific | `<picture>` + `media="(min-width: 1024px)"` for desktop hero |
| Preload matches srcset | `<link rel="preload" as="image" media="..." imagesrcset="..." imagesizes="...">` |
| Mobile size cap | Serve **400w + 600w** max for ~380px display; avoid 800w on mobile |
| Accurate `sizes` | `calc(100vw - 2rem)` not blind `100vw` |

**Never** wrap the LCP image in `data-reveal` (starts `opacity: 0`).

### 4. Logo component pattern

Logos are wide (~2.5:1). Create `Logo.astro`:

```astro
<!-- md: h-8 → width 78, height 32 intrinsic; widths={[78, 156]} sizes="78px" -->
<Image width={78} height={32} widths={[78, 156]} sizes="78px" class="h-8 w-auto" />
```

Use natural aspect ratio (`w-auto`), never force `h-8 w-8` square.

### 5. General image rules

- Astro `<Image>` with explicit `width`, `height`, `widths[]`, `sizes`
- Retina: include ~1.5× variant (e.g. 600w for 380px display), not 2× oversized file
- Below-fold images: `loading="lazy"`
- Product/gallery images: cap widths to display size

### 6. JavaScript budget

- Prefer CSS (`<details>`, `:hover`, grid accordion) over JS
- One small Intersection Observer for scroll reveal (~40 lines)
- Mobile nav: `<details>` not toggle script
- No animation libraries

### 7. Other

- Remove `backdrop-blur` on fixed header (use `bg-white/95`)
- `compressHTML: true`
- Avoid `content-visibility: auto` on animated sections

---

## Accessibility (target 100)

### Contrast

| Element | Fix |
|---------|-----|
| Orange CTA buttons | Use `#c2410c`+ with white text (~5.8:1), not `#fd7e14` |
| Text on dark bg | `text-neutral-200/300`, not `gray-400/500` |
| Placeholders | `placeholder:text-neutral-500`, not `gray-400` |
| Dark dashboard panels | Solid `bg-neutral-800/900`, not `bg-white/5` only |

### Images

- Correct aspect ratio: intrinsic `width`/`height` match file; CSS `h-* w-auto`
- Meaningful `alt` on content images; `alt=""` only when decorative

### Interaction

- Semantic HTML: `<main>`, `<section aria-labelledby>`, `<dl>` for stats
- Skip link, `:focus-visible` styles, keyboard-friendly `<details>` FAQ
- `lang` + `dir` on `<html>` for RTL locales

---

## SEO (target 100)

In `BaseLayout.astro`:

- `<title>`, meta description, canonical
- `hreflang` alternates + `x-default`
- OpenGraph + Twitter cards
- JSON-LD `Organization` schema
- `public/robots.txt` + `@astrojs/sitemap`

Default locale at `/` with `prefixDefaultLocale: false`.

---

## UX animations (without hurting Lighthouse)

### Scroll reveal

- `Reveal.astro` wrapper with `data-reveal` + variants: `up`, `fade`, `scale`, `slide`
- `ScrollAnimations.astro`: Intersection Observer, `prefers-reduced-motion` → show all
- Stagger: `data-reveal-stagger` parent + CSS `--reveal-delay` nth-child
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`

### FAQ accordion (CSS-only height animation)

```css
.faq-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s ...; }
.faq-item[open] .faq-panel { grid-template-rows: 1fr; }
.faq-panel-inner { overflow: hidden; }
```

Chevron in circle, `rotate(180deg)` when open. Disable transitions under `prefers-reduced-motion`.

---

## Lighthouse issue → fix quick reference

| Audit | Cause | Fix |
|-------|-------|-----|
| Render-blocking CSS | External stylesheet | `inlineStylesheets: 'always'` |
| LCP discovery | `loading="lazy"` on LCP | `eager` + `fetchpriority="high"` + preload |
| Image delivery | File larger than display | Cap `widths[]`, tune `sizes`, drop oversized variant |
| Low resolution | Only 1x image | Add 600w for ~380px @ 1.5x DPR |
| Incorrect aspect ratio | Square CSS on wide logo | `w-auto` + correct intrinsic dimensions |
| Font network chain | Extra font weight | Remove 500, preload only 2 files |
| Contrast | Light orange / gray on dark | Darker CTA, lighter text on dark bg |
| TBT / JS | Heavy scripts | CSS-first, single IO script |

After each fix: `npm run build` → preview → Lighthouse incognito.

---

## i18n pattern

```ts
// src/utils/i18n.ts
export function getLocalePath(locale: Locale) {
  return locale === 'en' ? '/' : `/${locale}`;
}
```

Hebrew page: `dir="rtl"` via layout. All copy in `content.en` / `content.he`.

---

## Reference

For PackRecommender implementation details, see [reference.md](reference.md).
