const fs = require('fs');

const htmlPath = './build/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const oldJsPath = './build/static/js';
const oldCssPath = './build/static/css';
const newJsPath = './build/module/js';
const newCssPath = './build/module/css';

if (!fs.existsSync('./build/module')) fs.mkdirSync('./build/module');
if (!fs.existsSync(newJsPath)) fs.mkdirSync(newJsPath);
if (!fs.existsSync(newCssPath)) fs.mkdirSync(newCssPath);

const jsFile = fs.readdirSync(oldJsPath).find(f => f.startsWith('main.') && f.endsWith('.js'));
if (jsFile) {
  fs.copyFileSync(oldJsPath + '/' + jsFile, newJsPath + '/eltrihideen.js');
  html = html.replace(new RegExp('/static/js/' + jsFile, 'g'), '/module/js/eltrihideen.js');
}

const cssFile = fs.readdirSync(oldCssPath).find(f => f.startsWith('main.') && f.endsWith('.css'));
if (cssFile) {
  fs.copyFileSync(oldCssPath + '/' + cssFile, newCssPath + '/eltriKatolik.css');
  html = html.replace(new RegExp('/static/css/' + cssFile, 'g'), '/module/css/eltriKatolik.css');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ ULTRA FIXED: /module/ folder fully injected!');