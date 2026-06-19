const fs = require('fs');
const path = require('path');

// ✅ Pakai __dirname supaya path relatif ke lokasi script, bukan CWD
const scriptDir = __dirname;
const rootDir   = path.join(scriptDir, '..');

const htmlPath  = path.join(rootDir, 'build/index.html');
const staticJs  = path.join(rootDir, 'build/static/js');
const staticCss = path.join(rootDir, 'build/static/css');
const moduleJs  = path.join(rootDir, 'build/module/js');
const moduleCss = path.join(rootDir, 'build/module/css');
const customCss = path.join(scriptDir, 'eltriKatolik.css'); // ✅ taruh di folder scripts/

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

// ── CSS ─────────────────────────────────────────────
const cssFile = fs.readdirSync(staticCss).find(f => f.startsWith('main.') && f.endsWith('.css') && !f.endsWith('.map'));
if (cssFile) {
  const craCssPath = path.join(staticCss, cssFile);
  const cssMapPath = path.join(staticCss, cssFile + '.map');

  const craCss        = fs.readFileSync(craCssPath, 'utf8');
  const customContent = fs.readFileSync(customCss, 'utf8');
  const merged        = customContent + '\n\n' + craCss;

  fs.writeFileSync(path.join(moduleCss, 'eltriKatolik.css'), merged, 'utf8');

  fs.unlinkSync(craCssPath);
  if (fs.existsSync(cssMapPath)) fs.unlinkSync(cssMapPath);

  html = html.replace(
    new RegExp('/static/css/' + cssFile.replace(/\./g, '\\.'), 'g'),
    '/module/css/eltriKatolik.css'
  );
  console.log(`✅ CSS merged → module/css/eltriKatolik.css`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done!');