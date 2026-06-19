const fs = require('fs');
const path = require('path');

const htmlPath = './build/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const staticJs  = './build/static/js';
const staticCss = './build/static/css';
const moduleJs  = './build/module/js';
const moduleCss = './build/module/css';

fs.mkdirSync(moduleJs,  { recursive: true });
fs.mkdirSync(moduleCss, { recursive: true });

// ── JS ──────────────────────────────────────────────
const jsFile = fs.readdirSync(staticJs).find(f => f.startsWith('main.') && f.endsWith('.js'));
if (jsFile) {
  fs.renameSync(path.join(staticJs, jsFile), path.join(moduleJs, 'eltrihideen.js'));
  html = html.replace(
    new RegExp('/static/js/' + jsFile.replace(/\./g, '\\.'), 'g'),
    '/module/js/eltrihideen.js'
  );

  // Rename .map JS jika ada
  const jsMap = jsFile + '.map';
  if (fs.existsSync(path.join(staticJs, jsMap))) {
    fs.renameSync(path.join(staticJs, jsMap), path.join(moduleJs, 'eltrihideen.js.map'));
  }
  console.log(`✅ JS: ${jsFile} → eltrihideen.js`);
}

// ── CSS ─────────────────────────────────────────────
const cssFile = fs.readdirSync(staticCss).find(f => f.startsWith('main.') && f.endsWith('.css') && !f.endsWith('.map'));
if (cssFile) {
  // Baca CSS dulu untuk fix sourceMappingURL
  const cssFilePath = path.join(staticCss, cssFile);
  let cssContent = fs.readFileSync(cssFilePath, 'utf8');

  // Rename .map CSS jika ada
  const cssMap = cssFile + '.map';
  if (fs.existsSync(path.join(staticCss, cssMap))) {
    fs.renameSync(path.join(staticCss, cssMap), path.join(moduleCss, 'eltriKatolik.css.map'));
    // Fix referensi sourceMappingURL di dalam CSS
    cssContent = cssContent.replace(
      new RegExp(cssMap.replace(/\./g, '\\.'), 'g'),
      'eltriKatolik.css.map'
    );
    console.log(`✅ CSS Map: ${cssMap} → eltriKatolik.css.map`);
  }

  // Tulis CSS yang sudah difix, lalu pindah ke module
  fs.writeFileSync(cssFilePath, cssContent, 'utf8');
  fs.renameSync(cssFilePath, path.join(moduleCss, 'eltriKatolik.css'));

  html = html.replace(
    new RegExp('/static/css/' + cssFile.replace(/\./g, '\\.'), 'g'),
    '/module/css/eltriKatolik.css'
  );
  console.log(`✅ CSS: ${cssFile} → eltriKatolik.css`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done!');