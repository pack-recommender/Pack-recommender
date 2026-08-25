import { loadEnv } from 'vite';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/** Local dev API — production uses Cloudflare Worker (`worker/index.ts`). */
function devApiPlugin() {
  return {
    name: 'packrecommender-dev-api',
    configureServer(server) {
      const mode = server.config.mode;
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/contact' && req.method === 'POST') {
          void handleContactPost(mode, req, res);
          return;
        }

        next();
      });
    },
  };
}

async function handleContactPost(mode, req, res) {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', async () => {
    try {
      const env = loadEnv(mode, process.cwd(), '');
      const { handleContactPost } = await import('./lib/contact.ts');
      const body = Buffer.concat(chunks);
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === 'string') headers.set(key, value);
      }

      const request = new Request(`http://localhost${req.url}`, {
        method: 'POST',
        headers,
        body,
      });

      const response = await handleContactPost(request, {
        RESEND_API_KEY: env.RESEND_API_KEY,
        CONTACT_TO_EMAIL: env.CONTACT_TO_EMAIL,
        CONTACT_FROM_EMAIL: env.CONTACT_FROM_EMAIL,
        RECAPTCHA_SECRET_KEY: env.RECAPTCHA_SECRET_KEY,
      });

      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      console.error('Dev contact error:', error);
      res.statusCode = 500;
      res.end();
    }
  });
}

export default defineConfig({
  site: 'https://packrecommender.com',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  vite: {
    plugins: [devApiPlugin()],
  },
});
