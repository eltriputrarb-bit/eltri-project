const fs = require('fs');
const path = require('path');

const htmlPath    = './build/index.html';
// CSS variabel kamu yang baru (taruh di src/ atau root project)
const varCssPath  = './src/variables.css'; 

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
  const cssMapPath = path.join(staticCss, cssMap);

  if (fs.existsSync(cssMapPath)) {
    let mapObj = JSON.parse(fs.readFileSync(cssMapPath, 'utf8'));

    // ✅ Fix field "file"
    mapObj.file = 'module/css/eltriKatolik.css';

    // ✅ Inject CSS variabel ke sourcesContent[0]
    // sourcesContent adalah array isi tiap source file
    // index 0 biasanya adalah file CSS utama (index.css / App.css)
    if (fs.existsSync(varCssPath)) {
      const varCssContent = fs.readFileSync(varCssPath, 'utf8');
      if (mapObj.sourcesContent && mapObj.sourcesContent.length > 0) {
        // Prepend variabel ke source pertama supaya DevTools bisa baca
        mapObj.sourcesContent[0] = varCssContent + '\n\n' + mapObj.sourcesContent[0];
        console.log('✅ CSS variables injected into sourcesContent[0]');
      }
    }

    // ✅ Fix nama file di array "sources" jika ada
    if (mapObj.sources) {
      mapObj.sources = mapObj.sources.map(s =>
        s.replace('static/css/', 'module/css/')
      );
    }

    fs.writeFileSync(cssMapPath, JSON.stringify(mapObj), 'utf8');
    fs.renameSync(cssMapPath, path.join(moduleCss, 'eltriKatolik.css.map'));
    console.log(`✅ CSS Map: ${cssMap} → eltriKatolik.css.map`);
  }

  // ✅ Fix sourceMappingURL di CSS lalu rename
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