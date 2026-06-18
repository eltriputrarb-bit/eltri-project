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
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false, // disarankan false, lihat catatan di bawah
          disableConsoleOutput: false
        }, [])
      ] : []
    }
  },
  style: {
    css: {
      loaderOptions: {
        modules: {
          localIdentName: '[hash:base64:8]'
        }
      }
    }
  }
};