const fs = require('fs');
const path = require('path');

const htmlPath = './build/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// CRA default output paths
const jsPath = './build/static/js';
const cssPath = './build/static/css';

// Rename JS
const jsDir = fs.readdirSync(jsPath);
const jsFile = jsDir.find(f => f.startsWith('main.') && f.endsWith('.js'));
if (jsFile) {
  fs.renameSync(
    path.join(jsPath, jsFile),
    path.join(jsPath, 'eltrihideen.js')
  );
  html = html.replace(
    new RegExp('/static/js/' + jsFile.replace('.', '\\.'), 'g'),
    '/static/js/eltrihideen.js'
  );
}

// Rename CSS
const cssDir = fs.readdirSync(cssPath);
const cssFile = cssDir.find(f => f.startsWith('main.') && f.endsWith('.css'));
if (cssFile) {
  fs.renameSync(
    path.join(cssPath, cssFile),
    path.join(cssPath, 'eltriKatolik.css')
  );
  html = html.replace(
    new RegExp('/static/css/' + cssFile.replace('.', '\\.'), 'g'),
    '/static/css/eltriKatolik.css'
  );
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done!');