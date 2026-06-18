const fs = require('fs');
const path = require('path');

const htmlPath = './build/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const jsPath  = './build/module/js';
const cssPath = './build/module/css';

// Rename JS
if (fs.existsSync(jsPath)) {
  const jsFile = fs.readdirSync(jsPath).find(f => f.startsWith('main.') && f.endsWith('.js'));
  if (jsFile) {
    fs.renameSync(
      path.join(jsPath, jsFile),
      path.join(jsPath, 'eltrihideen.js')
    );
    html = html.replace(
      new RegExp('/module/js/' + jsFile.replace(/\./g, '\\.'), 'g'),
      '/module/js/eltrihideen.js'
    );
  }
} else {
  console.warn('⚠️  folder module/js tidak ditemukan, skip JS rename');
}

// Rename CSS
if (fs.existsSync(cssPath)) {
  const cssFile = fs.readdirSync(cssPath).find(f => f.startsWith('main.') && f.endsWith('.css'));
  if (cssFile) {
    fs.renameSync(
      path.join(cssPath, cssFile),
      path.join(cssPath, 'eltriKatolik.css')
    );
    html = html.replace(
      new RegExp('/module/css/' + cssFile.replace(/\./g, '\\.'), 'g'),
      '/module/css/eltriKatolik.css'
    );
  }
} else {
  console.warn('⚠️  folder module/css tidak ditemukan, skip CSS rename');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done!');