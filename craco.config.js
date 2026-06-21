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
          identifierNamesGenerator: 'hexadecimal',
          controlFlowFlattening: false,
          deadCodeInjection: false,
          selfDefending: false,
          disableConsoleOutput: false,
          debugProtection: false,
          // Nama kamu tersembunyi di sini 😎
          domainLock: [],
          reservedNames: ['EltriPutnzs', 'EltriAtlas'],
          seed: 0x317 // seed unik: ELTRI
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