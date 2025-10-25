const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Images to convert (relative to project src/assets/img)
const images = [
  'gallery2.jpg',
  'gallery4.jpg',
  'dani-print.png',
  'gallery3.jpg',
  'gallery5.jpg',
  'packages-main.png'
];

const srcDir = path.join(__dirname, '..', 'src', 'assets', 'img');
const outDir = path.join(__dirname, '..', 'src', 'assets', 'img', 'optimized');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sizes = [400, 800, 1200];

async function processImage(name) {
  const input = path.join(srcDir, name);
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  for (const w of sizes) {
    const webpOut = path.join(outDir, `${base}-${w}.webp`);
    const avifOut = path.join(outDir, `${base}-${w}.avif`);
    await sharp(input).resize({ width: w }).webp({ quality: 80 }).toFile(webpOut);
    await sharp(input).resize({ width: w }).avif({ quality: 60 }).toFile(avifOut);
    console.log('wrote', webpOut, avifOut);
  }
}

async function main() {
  for (const img of images) {
    try {
      await processImage(img);
    } catch (e) {
      console.warn('failed', img, e.message);
    }
  }
  console.log('done');
}

main().catch((e) => { console.error(e); process.exit(1); });


