const fs = require('fs');

const htmlPath = './build/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const jsPath = './build/module/js';
const cssPath = './build/module/css';

// Rename JS
const jsFile = fs.readdirSync(jsPath).find(f => f.startsWith('main.') && f.endsWith('.js'));
if (jsFile) {
  fs.renameSync(jsPath + '/' + jsFile, jsPath + '/eltrihideen.js');
  html = html.replace(new RegExp('/module/js/' + jsFile, 'g'), '/static/js/eltrihideen.js');
}

// Rename CSS
const cssFile = fs.readdirSync(cssPath).find(f => f.startsWith('main.') && f.endsWith('.css'));
if (cssFile) {
  fs.renameSync(cssPath + '/' + cssFile, cssPath + '/eltriKatolik.css');
  html = html.replace(new RegExp('/module/css/' + cssFile, 'g'), '/static/css/eltriKatolik.css');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done!');