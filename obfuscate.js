const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const buildJsDir = path.join(__dirname, 'build', 'static', 'js');

if (!fs.existsSync(buildJsDir)) {
  console.log('⚠️ Folder build/static/js tidak ditemukan. Jalankan "npm run build" dulu sebelum obfuscate.');
  process.exit(1);
}

fs.readdirSync(buildJsDir).forEach((file) => {
  if (file.endsWith('.js') && !file.endsWith('.map')) {
    const filePath = path.join(buildJsDir, file);
    const code = fs.readFileSync(filePath, 'utf8');

    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      identifierNamesGenerator: 'hexadecimal',
      renameGlobals: false,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      disableConsoleOutput: false,
      stringArray: false,
      selfDefending: false
    });

    fs.writeFileSync(filePath, obfuscated.getObfuscatedCode());
    console.log(`✅ Obfuscated: ${file}`);
  }
});

console.log('🎉 Semua file JS berhasil di-obfuscate!');