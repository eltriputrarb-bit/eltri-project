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

  const jsMap = jsFile + '.map';
  if (fs.existsSync(path.join(staticJs, jsMap))) {
    // Fix "file" field di dalam .map
    let jsMapContent = fs.readFileSync(path.join(staticJs, jsMap), 'utf8');
    jsMapContent = jsMapContent.replace(
      /"file"\s*:\s*"[^"]*"/,
      '"file":"module/js/eltrihideen.js"'
    );
    fs.writeFileSync(path.join(staticJs, jsMap), jsMapContent, 'utf8');
    fs.renameSync(path.join(staticJs, jsMap), path.join(moduleJs, 'eltrihideen.js.map'));
  }
  console.log(`✅ JS: ${jsFile} → eltrihideen.js`);
}

// ── CSS ─────────────────────────────────────────────
const cssFile = fs.readdirSync(staticCss)
  .find(f => f.startsWith('main.') && f.endsWith('.css') && !f.endsWith('.map'));

if (cssFile) {
  const cssMap = cssFile + '.map';

  // Fix .map dulu sebelum CSS di-rename
  if (fs.existsSync(path.join(staticCss, cssMap))) {
    let mapContent = fs.readFileSync(path.join(staticCss, cssMap), 'utf8');

    // Fix field "file" di dalam .map
    mapContent = mapContent.replace(
      /"file"\s*:\s*"[^"]*"/,
      '"file":"module/css/eltriKatolik.css"'
    );

    fs.writeFileSync(path.join(staticCss, cssMap), mapContent, 'utf8');
    fs.renameSync(path.join(staticCss, cssMap), path.join(moduleCss, 'eltriKatolik.css.map'));
    console.log(`✅ CSS Map: ${cssMap} → eltriKatolik.css.map`);
  }

  // Fix sourceMappingURL di dalam CSS, lalu rename
  let cssContent = fs.readFileSync(path.join(staticCss, cssFile), 'utf8');
  cssContent = cssContent.replace(
    /\/\*#\s*sourceMappingURL=[^\s*]+\s*\*\//,
    '/*# sourceMappingURL=eltriKatolik.css.map */'
  );

  fs.writeFileSync(path.join(staticCss, cssFile), cssContent, 'utf8');
  fs.renameSync(path.join(staticCss, cssFile), path.join(moduleCss, 'eltriKatolik.css'));

  html = html.replace(
    new RegExp('/static/css/' + cssFile.replace(/\./g, '\\.'), 'g'),
    '/module/css/eltriKatolik.css'
  );
  console.log(`✅ CSS: ${cssFile} → eltriKatolik.css`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done!');