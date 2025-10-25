const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist', 'packrecommender', 'browser');

function findIndexFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(findIndexFiles(full));
    } else if (stat.isFile() && entry.toLowerCase() === 'index.html') {
      results.push(full);
    }
  }
  return results;
}

if (!fs.existsSync(distDir)) {
  console.error('dist browser directory not found. Run build/prerender first.');
  process.exit(0);
}

const indexFiles = findIndexFiles(distDir);
if (!indexFiles.length) {
  console.log('No index.html files found under', distDir);
  process.exit(0);
}

for (const indexFile of indexFiles) {
  try {
    const dir = path.dirname(indexFile);
    const files = fs.readdirSync(dir);
    const main = files.find(f => /^main.*\.js$/.test(f));
    const scripts = files.find(f => /^scripts.*\.js$/.test(f));
    // also look for third-party scripts placed under assets/js
    const assetsJsDir = path.join(dir, 'assets', 'js');
    let assetsScripts = [];
    try {
      if (fs.existsSync(assetsJsDir)) {
        assetsScripts = fs.readdirSync(assetsJsDir).filter(f => f.endsWith('.js'));
      }
    } catch (e) { /* ignore */ }

    let html = fs.readFileSync(indexFile, 'utf8');
    let insert = '';
    if (main) {
      insert += `<link rel="modulepreload" href="./${main}">\n`;
    }

    // prefer scripts*.js if present
    if (scripts) {
      insert += `<link rel="preload" href="./${scripts}" as="script">\n`;
      insert += `<script src="./${scripts}" defer></script>\n`;
    }

    // also add any assets/js/*.js files (preload + defer) so third-party libs load after main
    if (assetsScripts && assetsScripts.length) {
      for (const s of assetsScripts) {
        const relPath = `./assets/js/${s}`;
        insert += `<link rel="preload" href="${relPath}" as="script">\n`;
        insert += `<script src="${relPath}" defer></script>\n`;
      }
    }

    if (insert && !html.includes(insert)) {
      // insert after viewport meta if present, otherwise before closing head
      const marker = '<meta name="viewport" content="width=device-width, initial-scale=1">';
      if (html.includes(marker)) {
        html = html.replace(marker, marker + '\n' + insert);
      } else {
        html = html.replace('</head>', insert + '</head>');
      }
      fs.writeFileSync(indexFile, html, 'utf8');
      console.log('Inserted preload/modulepreload tags into', indexFile);
    } else {
      console.log('No main/scripts files found to preload for', indexFile);
    }
  } catch (e) {
    console.error('Failed processing', indexFile, e && e.message);
  }
}


