#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Base URL for sitemap entries. Prefer setting SITE_ORIGIN env var in CI.
const BASE_URL = process.env.SITE_ORIGIN || process.env.SITEMAP_BASE_URL || 'https://packrecommender.com';

const distDir = path.join(__dirname, '..', 'dist', 'packrecommender', 'browser');

function walkDirectory(directory, fileList = []) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found:', distDir);
  console.error('Run build/prerender before generating sitemap.');
  process.exit(0);
}

const htmlFiles = walkDirectory(distDir).filter(p => !p.includes('404') && !p.includes('200.html'));

const urls = htmlFiles.map(filePath => {
  let rel = path.relative(distDir, filePath).replace(/\\/g, '/');
  // remove index.html at end
  rel = rel.replace(/index\.html$/, '');
  // ensure leading slash and remove trailing slash
  let urlPath = '/' + rel;
  urlPath = urlPath.replace(/\/+/g, '/');
  urlPath = urlPath.replace(/\/$/, '');
  if (urlPath === '') urlPath = '/';
  return BASE_URL.replace(/\/$/, '') + urlPath;
});

const now = new Date().toISOString();
const urlEntries = urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${urlEntries}\n` +
  `</urlset>\n`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
console.log('Sitemap generated at', path.join(distDir, 'sitemap.xml'));
console.log('Set SITE_ORIGIN env var to your production URL (e.g. https://example.com) to update sitemap links.');


