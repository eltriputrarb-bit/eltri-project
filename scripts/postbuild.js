const fs = require('fs');

const htmlPath = './build/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const jsPath = './build/module/js';
const cssPath = './build/module/css';

// Rename JS
const jsFile = fs.readdirSync(jsPath).find(f => f.startsWith('main.') && f.endsWith('.js'));
if (jsFile) {
  fs.renameSync(jsPath + '/' + jsFile, jsPath + '/eltrihideen.js');
  html = html.replace(new RegExp('/module/js/' + jsFile, 'g'), '/module/js/eltrihideen.js');
}

// Rename CSS + hapus source map comment
const cssFile = fs.readdirSync(cssPath).find(f => f.startsWith('main.') && f.endsWith('.css'));
if (cssFile) {
  fs.renameSync(cssPath + '/' + cssFile, cssPath + '/eltriKatolik.css');
  html = html.replace(new RegExp('/module/css/' + cssFile, 'g'), '/module/css/eltriKatolik.css');
  
  // Hapus source map reference
  let css = fs.readFileSync(cssPath + '/eltriKatolik.css', 'utf8');
  css = css.replace(/\/\*#\s*sourceMappingURL=.*?\*\//g, '');
  fs.writeFileSync(cssPath + '/eltriKatolik.css', css, 'utf8');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done! JS & CSS renamed, source map removed!');