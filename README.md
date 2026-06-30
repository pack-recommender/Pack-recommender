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

Test the Worker locally (static site + contact API + maintenance):

```bash
npm run build
npx wrangler dev
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
worker/         # Cloudflare Worker (contact API, maintenance gate)
lib/            # Shared helpers for worker
```

## Contact Form

The contact form POSTs to `/api/contact` (plain HTML form — no client JS). The Cloudflare Worker at `worker/index.ts` sends email via [Resend](https://resend.com) and redirects back to `/#contact` with a success or error message.

Required environment variables (set in Cloudflare → your project → **Settings → Variables and secrets**):

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

## Deploy to Cloudflare Workers

Hosting uses **Cloudflare Workers** (static Astro `dist/` + `worker/index.ts` for `/api/contact` and maintenance). Connect the GitHub repo via **Workers & Pages → Create → Import a repository**.

### Build settings (dashboard)

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| **Deploy command** | `npx wrangler deploy` |
| Path | `/` |

There is no **Build output directory** field in this UI — `wrangler.toml` sets `assets.directory = "./dist"`.

Add build environment variable:

| Variable | Value |
|----------|--------|
| `NODE_VERSION` | `20` |

| Variable | Example | Notes |
|----------|---------|--------|
| `NODE_VERSION` | `20` | Build-time |
| `MAINTENANCE_MODE` | `false` | Set to `false` for live site; any other value enables maintenance gate |
| `RESEND_API_KEY` | `re_...` | Contact form |
| `CONTACT_TO_EMAIL` | `sales@packrecommender.com` | Contact form |
| `CONTACT_FROM_EMAIL` | `PackRecommender <contact@packrecommender.com>` | Optional |

Redeploy after changing variables.

### Custom domain

1. Add your domain to Cloudflare DNS (update nameservers at your registrar if needed).
2. Project → **Custom domains** → add `packrecommender.com` and `www.packrecommender.com`.
3. Update `site` in `astro.config.mjs` if your production URL differs.

### Migrate from Netlify

1. Deploy successfully on Cloudflare Pages first.
2. In Cloudflare DNS, point `@` and `www` to the Pages project (auto-configured when adding custom domain).
3. Disable or delete the Netlify site so DNS does not split traffic.

### Wrangler CLI (manual deploy)

```bash
npm run build
npx wrangler deploy
```

## Performance

- Images are optimized at build time with responsive sizes
- Self-hosted Inter font with `font-display: swap`
- CSS animations respect `prefers-reduced-motion`
- Target Lighthouse score: 95–100

## License

Private — PackRecommender
