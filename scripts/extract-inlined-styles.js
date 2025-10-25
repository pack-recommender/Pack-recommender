const fs = require('fs');
const path = require('path');

const distRoot = path.join(__dirname, '..', 'dist', 'packrecommender', 'browser');

function walkLocales() {
  const locales = fs.readdirSync(distRoot).filter(f => fs.statSync(path.join(distRoot, f)).isDirectory());
  // also include top-level browser folder if index.html exists
  if (fs.existsSync(path.join(distRoot, 'index.html'))) locales.push('.');
  return locales;
}

function extractForLocale(localeDir) {
  const dir = localeDir === '.' ? distRoot : path.join(distRoot, localeDir);
  const files = fs.readdirSync(dir);
  const mainFile = files.find(f => /^main.*\.js$/.test(f));
  if (!mainFile) return false;
  const mainPath = path.join(dir, mainFile);
  let content = fs.readFileSync(mainPath, 'utf8');

  const regex = /styles:\s*\[\`([\s\S]*?)\`\]/g;
  let m;
  let cssAcc = '';
  let found = false;
  while ((m = regex.exec(content)) !== null) {
    found = true;
    cssAcc += m[1] + '\n\n';
  }
  if (!found) return false;

  // remove the inlined styles blocks
  content = content.replace(regex, 'styles:[]');
  fs.writeFileSync(mainPath, content, 'utf8');

  const outCss = path.join(dir, 'styles-components.css');
  fs.writeFileSync(outCss, cssAcc, 'utf8');

  // inject link into index.html if not present
  const indexPath = path.join(dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    const linkTag = `<link rel="stylesheet" href="./styles-components.css">`;
    if (!html.includes(linkTag)) {
      // insert after head meta viewport or before first stylesheet
      const marker = '<meta name="viewport" content="width=device-width, initial-scale=1">';
      if (html.includes(marker)) {
        html = html.replace(marker, marker + '\n' + linkTag);
      } else {
        html = html.replace('</head>', linkTag + '\n</head>');
      }
      fs.writeFileSync(indexPath, html, 'utf8');
    }
  }

  // also copy the generated css to src/assets if you want it under version control
  // intentionally skipped because dist is gitignored

  console.log('Extracted inlined styles from', mainFile, 'to', outCss);
  return true;
}

function main() {
  const locales = walkLocales();
  let any = false;
  locales.forEach(loc => {
    try {
      const ok = extractForLocale(loc);
      if (ok) any = true;
    } catch (e) {
      console.warn('failed for', loc, e && e.message);
    }
  });
  if (!any) console.log('No inlined styles found in any main bundles.');
}

if (require.main === module) main();


