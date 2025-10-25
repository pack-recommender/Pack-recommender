const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repoRoot = path.join(__dirname, '..');
const srcRoot = path.join(repoRoot, 'src');
const i18nDir = path.join(srcRoot, 'assets', 'i18n');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

function loadJson(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function getTranslation(translations, key) {
  const parts = key.split('.');
  let cur = translations;
  for (const p of parts) {
    if (!cur) return '';
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : '';
}

function replaceInHtml(content, translations) {
  // replace interpolation {{ 'key' | translate }}
  content = content.replace(/\{\{\s*'([^']+)'\s*\|\s*translate\s*\}\}/g, (m, key) => {
    return getTranslation(translations, key) || '';
  });

  // replace attribute bindings like [placeholder]="'key' | translate" -> placeholder="value"
  content = content.replace(/\[([^\]]+)\]\s*=\s*"?'([^'\"]+)'?\s*\|\s*translate\s*"?/g, (m, attr, key) => {
    const val = getTranslation(translations, key) || '';
    return ` ${attr}="${val}"`;
  });

  return content;
}

function setHtmlLang(outputDir, locale) {
  try {
    const files = walk(outputDir).filter(f => f.endsWith('.html'));
    const lang = locale === 'he' ? 'he' : 'en';
    const dir = locale === 'he' ? 'rtl' : 'ltr';
    for (const file of files) {
      let html = fs.readFileSync(file, 'utf8');
      // replace existing <html ...> tag
      html = html.replace(/<html[^>]*>/i, `<html lang="${lang}" dir="${dir}">`);
      fs.writeFileSync(file, html, 'utf8');
    }
    console.log(`Set lang=${lang} dir=${dir} on HTML files under ${outputDir}`);
  } catch (e) {
    console.warn('Failed to set html lang/dir for', outputDir, e && e.message);
  }
}

function buildLocale(locale, translations, buildCmd, outputPath) {
  console.log(`\n--- Building locale: ${locale} ---`);
  const htmlFiles = walk(srcRoot).filter(f => f.endsWith('.html'));
  const backups = {};
  try {
    for (const file of htmlFiles) {
      const orig = fs.readFileSync(file, 'utf8');
      backups[file] = orig;
      const modified = replaceInHtml(orig, translations);
      if (modified !== orig) fs.writeFileSync(file, modified, 'utf8');
    }

    console.log('Running build command:', buildCmd);
    cp.execSync(buildCmd, { stdio: 'inherit', cwd: repoRoot });
    console.log(`Build for ${locale} completed.`);
    if (outputPath) {
      // ensure generated HTML has correct lang/dir attributes
      setHtmlLang(outputPath, locale);
    }
    // flatten nested browser directory if present
    try {
      const nested = path.join(outputPath, 'browser');
      if (fs.existsSync(nested)) {
        const files = fs.readdirSync(nested);
        files.forEach(f => {
          const s = path.join(nested, f);
          const d = path.join(outputPath, f);
          try { fs.renameSync(s, d); } catch (e) { /* ignore */ }
        });
        try { fs.rmdirSync(nested); } catch (e) { /* ignore */ }
        console.log('Flattened nested browser folder for', outputPath);
      }
    } catch (e) {}
  } catch (e) {
    console.error('Build failed for', locale, e && e.message);
    throw e;
  } finally {
    // restore files
    for (const file of Object.keys(backups)) {
      try { fs.writeFileSync(file, backups[file], 'utf8'); } catch (e) {}
    }
    console.log('Source files restored.');
  }
}

function main() {
  const en = loadJson(path.join(i18nDir, 'en.json'));
  const he = loadJson(path.join(i18nDir, 'he.json'));

  // Allow passing extra build flags through the BUILD_FLAGS env var (e.g. "--stats-json --source-map")
  const extraFlags = process.env.BUILD_FLAGS ? ` ${process.env.BUILD_FLAGS}` : '';

  // Build English into a self-contained /en folder with base-href /en/
  buildLocale('en', en, `npx ng build --configuration production --output-path=dist/packrecommender/browser/en --base-href /en/${extraFlags}`, path.join(repoRoot, 'dist', 'packrecommender', 'browser', 'en'));

  // Build Hebrew into a self-contained /he folder with base-href /he/
  buildLocale('he', he, `npx ng build --configuration production --output-path=dist/packrecommender/browser/he --base-href /he/${extraFlags}`, path.join(repoRoot, 'dist', 'packrecommender', 'browser', 'he'));
}

if (require.main === module) main();


