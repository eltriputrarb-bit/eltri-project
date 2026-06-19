const fs = require('fs');
const path = require('path');

const htmlPath  = './build/index.html';
const staticJs  = './build/static/js';
const staticCss = './build/static/css';
const moduleJs  = './build/module/js';
const moduleCss = './build/module/css';
const customCss = './eltriKatolik.css';

fs.mkdirSync(moduleJs,  { recursive: true });
fs.mkdirSync(moduleCss, { recursive: true });

let html = fs.readFileSync(htmlPath, 'utf8');

// ── JS ──────────────────────────────────────────────
const jsFile = fs.readdirSync(staticJs).find(f => f.startsWith('main.') && f.endsWith('.js'));
if (jsFile) {
  fs.renameSync(path.join(staticJs, jsFile), path.join(moduleJs, 'eltrihideen.js'));
  html = html.replace(
    new RegExp('/static/js/' + jsFile.replace(/\./g, '\\.'), 'g'),
    '/module/js/eltrihideen.js'
  );
  const jsMap = path.join(staticJs, jsFile + '.map');
  if (fs.existsSync(jsMap)) fs.unlinkSync(jsMap);
  console.log(`✅ JS: ${jsFile} → eltrihideen.js`);
}

// ── CSS: merge → module, hapus static ───────────────
const cssFile = fs.readdirSync(staticCss).find(f => f.startsWith('main.') && f.endsWith('.css') && !f.endsWith('.map'));
if (cssFile) {
  const craCssPath = path.join(staticCss, cssFile);
  const cssMapPath = path.join(staticCss, cssFile + '.map');

  const craCss      = fs.readFileSync(craCssPath, 'utf8');
  const customContent = fs.readFileSync(customCss, 'utf8');
  const merged      = customContent + '\n\n' + craCss;

  // Tulis hasil merge
  fs.writeFileSync(path.join(moduleCss, 'eltriKatolik.css'), merged, 'utf8');

  // ✅ Hapus file static supaya bersih
  fs.unlinkSync(craCssPath);
  if (fs.existsSync(cssMapPath)) fs.unlinkSync(cssMapPath);

  html = html.replace(
    new RegExp('/static/css/' + cssFile.replace(/\./g, '\\.'), 'g'),
    '/module/css/eltriKatolik.css'
  );
  console.log(`✅ CSS merged + static dihapus → module/css/eltriKatolik.css`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done!');