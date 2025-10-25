const fs = require('fs');
const path = require('path');

const distBrowser = path.join(__dirname, '..', 'dist', 'packrecommender', 'browser');
const targetDir = path.join(distBrowser, 'assets', 'i18n');
const locales = ['en', 'he'];

if (!fs.existsSync(distBrowser)) {
  console.error('dist browser folder not found. Run browser build first.');
  process.exit(1);
}

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

locales.forEach((loc) => {
  const src = path.join(distBrowser, loc, 'assets', 'i18n', `${loc}.json`);
  const dest = path.join(targetDir, `${loc}.json`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied', src, '->', dest);
  } else {
    console.warn('Locale file not found for', loc, src);
  }
});

console.log('prepare-i18n completed');


