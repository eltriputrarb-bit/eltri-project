const fs = require('fs');
const path = require('path');

const htmlPath = './build/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const staticJs  = './build/static/js';
const staticCss = './build/static/css';
const moduleJs  = './build/module/js';
const moduleCss = './build/module/css';

// Buat folder module
fs.mkdirSync(moduleJs,  { recursive: true });
fs.mkdirSync(moduleCss, { recursive: true });

// Pindah + rename JS: static → module
const jsFile = fs.readdirSync(staticJs).find(f => f.startsWith('main.') && f.endsWith('.js'));
if (jsFile) {
  fs.renameSync(
    path.join(staticJs, jsFile),
    path.join(moduleJs, 'eltrihideen.js')
  );
  html = html.replace(
    new RegExp('/static/js/' + jsFile.replace(/\./g, '\\.'), 'g'),
    '/module/js/eltrihideen.js'
  );
  console.log(`✅ JS: ${jsFile} → eltrihideen.js`);
}

// Pindah + rename CSS: static → module
const cssFile = fs.readdirSync(staticCss).find(f => f.startsWith('main.') && f.endsWith('.css'));
if (cssFile) {
  fs.renameSync(
    path.join(staticCss, cssFile),
    path.join(moduleCss, 'eltriKatolik.css')
  );
  html = html.replace(
    new RegExp('/static/css/' + cssFile.replace(/\./g, '\\.'), 'g'),
    '/module/css/eltriKatolik.css'
  );
  console.log(`✅ CSS: ${cssFile} → eltriKatolik.css`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done!');