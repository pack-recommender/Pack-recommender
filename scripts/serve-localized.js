#!/usr/bin/env node
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4200;
const DIST = path.join(__dirname, '..', 'dist', 'packrecommender', 'browser');

// Serve static files for each locale if they exist
['en', 'he'].forEach((locale) => {
  const localeDir = path.join(DIST, locale);
  if (fs.existsSync(localeDir)) {
    app.use(`/${locale}`, express.static(localeDir, { index: false }));
  }
});

// Serve root static files (assets, scripts, etc.)
app.use(express.static(DIST, { index: false }));

// Fallback handler: try to return localized index.html if path starts with /en or /he,
// otherwise return root index.html
app.get('*', (req, res) => {
  try {
    const p = req.path || '/';
    const m = p.match(/^\/(en|he)(?:\/|$)/);
    if (m) {
      const locale = m[1];
      const localeRootIndex = path.join(DIST, locale, 'index.html');
      if (fs.existsSync(localeRootIndex)) return res.sendFile(localeRootIndex);
    }
  } catch (e) {
    // ignore
  }
  return res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Localized static server listening on http://localhost:${PORT}`);
});


