const fs = require('fs');

const htmlPath = './build/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const jsPath = './build/static/js';

// Rename JS only
const jsFile = fs.readdirSync(jsPath).find(f => f.startsWith('main.') && f.endsWith('.js'));
if (jsFile) {
  fs.renameSync(jsPath + '/' + jsFile, jsPath + '/eltrihideen.js');
  html = html.replace(new RegExp('/static/js/' + jsFile, 'g'), '/static/js/eltrihideen.js');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Done! JS renamed to eltrihideen.js');