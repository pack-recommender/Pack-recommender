import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import fs from 'fs';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser without automatically resolving directory index files.
  // We'll try to serve pre-rendered HTML pages (e.g. /maintenance or /en/maintenance)
  // directly from the file system before falling back to the Angular engine.
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }));

  // Try to serve pre-rendered HTML files for the requested path if they exist.
  server.get('*', (req, res, next) => {
    try {
      const reqPath = decodeURIComponent(req.path);
      const candidates = [
        join(browserDistFolder, reqPath, 'index.html'),
        join(browserDistFolder, reqPath + '.html')
      ];

      for (const p of candidates) {
        if (fs.existsSync(p)) {
          return res.sendFile(p);
        }
      }

      // Try stripping trailing slashes and retry
      const stripped = reqPath.replace(/\/+$|^\/+$/g, '/').replace(/\/+$|\/$/, '');
      if (stripped && stripped !== reqPath) {
        const p = join(browserDistFolder, stripped, 'index.html');
        if (fs.existsSync(p)) {
          return res.sendFile(p);
        }
      }
    } catch (e) {
      // ignore and fall through to SSR
    }
    // Not a pre-rendered file: fall through to server-side rendering
    next();
  });

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
