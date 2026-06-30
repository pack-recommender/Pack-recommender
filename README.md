# PackRecommender Landing Page

Modern B2B SaaS landing page for PackRecommender — an AI packaging recommendation platform for manufacturers. Built with Astro, TypeScript, and Tailwind CSS.

## Features

- Static site generation (SSG) for maximum performance
- English (`/`) and Hebrew (`/he`) with full RTL support
- SEO optimized: meta tags, OpenGraph, Twitter cards, canonical URLs, sitemap, JSON-LD
- Responsive, mobile-first design
- Optimized images via Astro Image + Sharp
- Minimal client-side JavaScript
- Accessible: semantic HTML, keyboard navigation, focus states, ARIA labels

## Prerequisites

- Node.js 18 or later
- npm 9 or later

## Local Development

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:4321
npm run dev
```

Visit:
- http://localhost:4321/ — English (default)
- http://localhost:4321/he — Hebrew (RTL)
- http://localhost:4321/en — redirects to `/`

## Build

```bash
npm run build
```

Output is written to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
  assets/       # Images and fonts (logo, hero, gallery)
  components/   # Section components (Hero, Features, FAQ, etc.)
  layouts/      # Base HTML layout with SEO
  pages/        # Routes: / (en), /he
  styles/       # Global CSS and Tailwind
  utils/        # i18n content and SEO helpers
public/         # Static files (favicon, robots.txt)
functions/      # Cloudflare Pages Functions (contact API)
```

## Contact Form

The contact form POSTs to `/api/contact`. A placeholder Cloudflare Pages Function is included at `functions/api/contact.ts`. Replace it with your email service or CRM integration.

## Deploy to Cloudflare Pages

### Option 1: Dashboard

1. Push this repository to GitHub or GitLab.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select the repository.
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 18 or later
5. Deploy.

Cloudflare automatically detects `functions/` for serverless API routes.

### Option 2: Wrangler CLI

```bash
npm install -g wrangler
npx wrangler pages deploy dist
```

### Custom Domain

In Cloudflare Pages → your project → **Custom domains**, add `packrecommender.com` and follow DNS instructions.

Update `site` in `astro.config.mjs` if your production URL differs.

## Environment

No environment variables are required for the static site. Add secrets in Cloudflare Pages for contact form integrations (e.g. email API keys).

## Performance

- Images are optimized at build time with responsive sizes
- Self-hosted Inter font with `font-display: swap`
- CSS animations respect `prefers-reduced-motion`
- Target Lighthouse score: 95–100

## License

Private — PackRecommender
