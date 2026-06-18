// craco.config.js
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  webpack: {
    plugins: {
      add: process.env.NODE_ENV === 'production' ? [
        new WebpackObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          compact: true,
          controlFlowFlattening: false, // Dimatikan sedikit agar tidak konflik dengan minifier Webpack 5
          deadCodeInjection: false,
          debugProtection: true, // 🔒 Tetap mengunci otomatis devtools pembajak!
          disableConsoleOutput: false
        }, [])
      ] : []
    }
  }
};