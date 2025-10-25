const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist', 'packrecommender', 'browser');
const locales = ['he','en'];

locales.forEach(locale => {
  try {
    const i18nPath = path.join(DIST, locale, 'assets', 'i18n', `${locale}.json`);
    const targetHtml = path.join(DIST, locale, 'maintenance', 'index.html');
    if (!fs.existsSync(i18nPath) || !fs.existsSync(targetHtml)) {
      console.warn('Missing files for', locale);
      return;
    }
    const translations = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));
    const html = fs.readFileSync(targetHtml, 'utf8');
    // Replace translate marker <!--ngetn--> inside the maintenance <h1>
    const translated = translations['maintenance'] || translations['maintenance.message'] || translations['MAINTENANCE'] || '';
    if (!translated) {
      console.warn('No maintenance translation for', locale);
      return;
    }
    const out = html.replace(/<h1[^>]*>\s*<!--ngetn-->\s*<\/h1>/i, `<h1>${translated}</h1>`);
    fs.writeFileSync(targetHtml, out, 'utf8');
    console.log('Patched maintenance page for', locale);
  } catch (e) {
    console.error('Error patching', locale, e.message);
  }
});


