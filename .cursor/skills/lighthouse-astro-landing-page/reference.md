# Reference: PackRecommender patterns

Concrete config and file patterns from a Lighthouse-100 Astro landing page.

## astro.config.mjs essentials

```js
export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  compressHTML: true,
  build: { inlineStylesheets: 'always' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', he: 'he' } } }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: { prefixDefaultLocale: false },
  },
});
```

## Brand tokens (tailwind.config)

```js
colors: {
  brand: {
    DEFAULT: '#151515',
    muted: '#6b7280',
    accent: '#1717e5',
    cta: '#c2410c',        // WCAG-safe orange
    'cta-hover': '#9a3412',
    surface: '#f8f9fa',
    border: '#e5e7eb',
  },
},
fontWeight: { medium: '300' },  // only load 300 + 700 fonts
```

## Hero: dual viewport images

**Desktop** (decorative, right half):

```astro
<picture>
  <source media="(min-width: 1024px)" srcset="400w, 640w" sizes="50vw" />
  <img loading="eager" fetchpriority="high" class="opacity-20" />
</picture>
```

**Mobile** (LCP candidate):

```astro
<Image
  width={400} height={400}
  widths={[400, 600]}
  sizes="(max-width: 1023px) calc(100vw - 2rem), 0px"
  quality={76}
  loading="eager"
  fetchpriority="high"
/>
```

## Preload head slots

```html
<link rel="preload" href="/fonts/inter-v12-latin-700.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" as="image" href="600w.webp"
  imagesrcset="400w.webp 400w, 600w.webp 600w"
  imagesizes="(max-width: 1023px) calc(100vw - 2rem)"
  media="(max-width: 1023px)" fetchpriority="high" />
```

## Logo.astro sizes

| Prop | Display | widths | sizes |
|------|---------|--------|-------|
| md (header) | h-8 (~32px tall) | [78, 156] | 78px |
| sm (footer) | h-7 (~28px tall) | [68, 136] | 68px |

## ScrollAnimations.astro core logic

1. Query `[data-reveal]`
2. If `prefers-reduced-motion` → add `is-visible` to all
3. Else IntersectionObserver (`threshold: 0.12`, `rootMargin: '0px 0px -6% 0px'`)
4. On init, immediately `is-visible` elements already in viewport (prevents hero flash)

## Section components

| Section | Scroll variant | Stagger |
|---------|---------------|---------|
| Hero text | up | — |
| TrustedBy logos | fade | yes |
| HowItWorks steps | up | yes |
| Features cards | scale | yes |
| Benefits KPIs | up | yes |
| Product dashboard | scale | — |
| Testimonials | slide (RTL-aware) | yes |
| FAQ | up | — |
| Contact form | scale | — |

## Cloudflare Pages

```toml
[build]
command = "npm run build"
publish = "dist"
```

Contact placeholder: `functions/api/contact.ts`

## Final Lighthouse scores achieved

| Category | Mobile | Desktop |
|----------|--------|---------|
| Performance | 99–100 | 100 |
| Accessibility | 97→100 | 100 |
| Best Practices | 92+ | 92+ |
| SEO | 100 | 100 |

Common remaining mobile perf gap: hero image byte size — fix by capping mobile `widths` at 600, not 800.
