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

Test Cloudflare Functions locally (contact form + maintenance middleware):

```bash
npm run build
npx wrangler pages dev dist
```

Set secrets for local function testing in `.dev.vars` (gitignored):

```
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=PackRecommender <onboarding@resend.dev>
MAINTENANCE_MODE=false
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
functions/      # Cloudflare Pages Functions (contact API, maintenance)
lib/            # Shared helpers for functions
```

## Contact Form

The contact form POSTs to `/api/contact` (plain HTML form — no client JS). The Cloudflare Pages Function at `functions/api/contact.ts` sends email via [Resend](https://resend.com) and redirects back to `/#contact` with a success or error message.

Required environment variables (set in Cloudflare Pages → Settings → Environment variables):

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key from Resend dashboard |
| `CONTACT_TO_EMAIL` | Inbox that receives submissions |
| `CONTACT_FROM_EMAIL` | Optional. Verified sender, e.g. `PackRecommender <contact@packrecommender.com>`. Defaults to Resend sandbox address for testing. |

### Resend setup

1. Create a free account at [resend.com](https://resend.com).
2. Add and verify your domain (add DNS records in Cloudflare).
3. Create an API key and add it to Cloudflare Pages env vars.
4. Set `CONTACT_FROM_EMAIL` to an address on your verified domain.

## Deploy to Cloudflare Pages

Hosting is **Cloudflare Pages only** — static `dist/` output plus `functions/` at the repo root. No Netlify or separate backend required.

### 1. Connect Git

1. Push this repository to GitHub or GitLab.
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repository.

### 2. Build settings

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

Add environment variable:

| Variable | Value |
|----------|--------|
| `NODE_VERSION` | `20` |

`wrangler.toml` in the repo root documents the same build settings. Newer Cloudflare Git UI has no **Build output directory** field in the dashboard — it uses `pages_build_output_dir = "./dist"` from `wrangler.toml` instead. Commit and push that file before deploying.

### 3. Environment variables

In **Pages → Settings → Environment variables** (Production):

| Variable | Example | Notes |
|----------|---------|--------|
| `NODE_VERSION` | `20` | Build-time |
| `MAINTENANCE_MODE` | `false` | Set to `false` for live site; any other value enables maintenance gate |
| `RESEND_API_KEY` | `re_...` | Contact form |
| `CONTACT_TO_EMAIL` | `sales@packrecommender.com` | Contact form |
| `CONTACT_FROM_EMAIL` | `PackRecommender <contact@packrecommender.com>` | Optional |

Redeploy after changing variables.

Cloudflare automatically detects `functions/` for `/api/*` routes and `_middleware.ts`.

### 4. Custom domain

1. Add your domain to Cloudflare DNS (update nameservers at your registrar if needed).
2. Pages project → **Custom domains** → add `packrecommender.com` and `www.packrecommender.com`.
3. Update `site` in `astro.config.mjs` if your production URL differs.

### 5. Migrate from Netlify

1. Deploy successfully on Cloudflare Pages first.
2. In Cloudflare DNS, point `@` and `www` to the Pages project (auto-configured when adding custom domain).
3. Disable or delete the Netlify site so DNS does not split traffic.

### Option 2: Wrangler CLI

```bash
npm run build
npx wrangler pages deploy dist
```

## Performance

- Images are optimized at build time with responsive sizes
- Self-hosted Inter font with `font-display: swap`
- CSS animations respect `prefers-reduced-motion`
- Target Lighthouse score: 95–100

## License

Private — PackRecommender
